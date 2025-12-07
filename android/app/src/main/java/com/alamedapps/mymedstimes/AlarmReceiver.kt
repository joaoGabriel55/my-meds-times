package com.alamedapps.mymedstimes

import android.app.*
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.*
import android.os.Build
import android.os.PowerManager
import android.widget.Toast
import androidx.core.app.NotificationCompat
import android.util.Log

class AlarmReceiver : BroadcastReceiver() {

    companion object {
        private const val CHANNEL_ID = "alarm_channel"
        private const val RAW_RES = "alarm"
        private const val ACTION_STOP = "com.alamedapps.mymedstimes.ACTION_STOP_ALARM"
        private const val ACTION_SNOOZE = "com.alamedapps.mymedstimes.ACTION_SNOOZE_ALARM"
        private const val SNOOZE_MINUTES = 5

        @Volatile
        private var player: MediaPlayer? = null

        @Volatile
        private var audioManager: AudioManager? = null

        @Volatile
        private var originalVolume: Int = 0

        @Volatile
        private var activeAlarmId: String? = null

        @Volatile
        private var wakeLock: PowerManager.WakeLock? = null
    }

    override fun onReceive(context: Context, intent: Intent?) {
        intent ?: return
        val action = intent.action
        val id = intent.getStringExtra("id") ?: return

        when (action) {
            ACTION_STOP -> {
                stopAlarm(context, id)
                return
            }

            ACTION_SNOOZE -> {
                stopAlarm(context, id)
                scheduleSnooze(context, intent)
                return
            }
        }

        val title = intent.getStringExtra("title") ?: "Alarm"
        val body = intent.getStringExtra("body") ?: ""
        activeAlarmId = id

        acquireWakeLock(context)
        setupAudio(context)
        playAlarm(context, id)
        showNotificationWithActions(context, id, title, body)
    }

    private fun acquireWakeLock(context: Context) {
        if (wakeLock?.isHeld == true) return
        val pm = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "mymedstimes:AlarmWakeLock").apply {
            setReferenceCounted(false)
            // Acquire for a bounded time (65s) – alarm auto-stops at 60s.
            acquire(65_000)
        }
    }

    private fun releaseWakeLock() {
        try {
            if (wakeLock?.isHeld == true) wakeLock?.release()
        } catch (_: Exception) {
        }
        wakeLock = null
    }

    private fun setupAudio(context: Context) {
        if (audioManager == null) {
            audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        }
        audioManager?.let { am ->
            originalVolume = am.getStreamVolume(AudioManager.STREAM_ALARM)
            val maxVolume = am.getStreamMaxVolume(AudioManager.STREAM_ALARM)
            am.setStreamVolume(
                AudioManager.STREAM_ALARM,
                maxVolume,
                AudioManager.FLAG_SHOW_UI or AudioManager.FLAG_PLAY_SOUND
            )

            val attributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()

            val focusRequest = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
                    .setAudioAttributes(attributes)
                    .setOnAudioFocusChangeListener {}
                    .build()
            } else null

            @Suppress("DEPRECATION")
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                am.requestAudioFocus(focusRequest!!)
            } else {
                am.requestAudioFocus(null, AudioManager.STREAM_ALARM, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
            }
        }
    }

    private fun playAlarm(context: Context, id: String) {
        player?.let {
            try {
                if (it.isPlaying) it.stop()
            } catch (_: Exception) {
            }
            it.release()
        }

        player = MediaPlayer().apply {
            try {
                setDataSource(
                    context,
                    android.net.Uri.parse("android.resource://${context.packageName}/raw/$RAW_RES")
                )
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                setAudioStreamType(AudioManager.STREAM_ALARM)
                isLooping = true
                prepare()
                start()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        Thread {
            try {
                Thread.sleep(60_000)
            } catch (_: InterruptedException) {
            } finally {
                if (activeAlarmId == id) {
                    stopAlarm(context, id)
                }
            }
        }.start()
    }

    private fun showNotificationWithActions(context: Context, id: String, title: String, body: String) {
        val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID, "Alarms", NotificationManager.IMPORTANCE_HIGH
            ).apply { setSound(null, null) }
            nm.createNotificationChannel(channel)
        }

        val stopIntent = Intent(context, AlarmReceiver::class.java).apply {
            action = ACTION_STOP
            putExtra("id", id)
        }
        val stopPendingIntent = PendingIntent.getBroadcast(
            context, id.hashCode() + 1, stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val snoozeIntent = Intent(context, AlarmReceiver::class.java).apply {
            action = ACTION_SNOOZE
            putExtra("id", id)
            putExtra("title", title)
            putExtra("body", "$body (Snoozed)")
            putExtra("snoozeMinutes", SNOOZE_MINUTES)
        }
        val snoozePendingIntent = PendingIntent.getBroadcast(
            context, id.hashCode() + 2, snoozeIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val fullScreenIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            putExtra("alarm_id", id)
        }
        val fullScreenPendingIntent = PendingIntent.getActivity(
            context, 0, fullScreenIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Stop", stopPendingIntent)
            .addAction(android.R.drawable.ic_menu_recent_history, "Snooze", snoozePendingIntent)
            .setOngoing(true)
            .setSound(null)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .build()
            .apply { flags = flags or Notification.FLAG_NO_CLEAR }

        nm.notify(id.hashCode(), notification)
    }

    private fun stopAlarm(context: Context, id: String?) {
        player?.apply {
            try {
                if (isPlaying) stop()
            } catch (_: Exception) {
            }
            release()
        }
        player = null

        audioManager?.let { am ->
            try {
                am.setStreamVolume(AudioManager.STREAM_ALARM, originalVolume, 0)
            } catch (_: Exception) {
            }
            @Suppress("DEPRECATION")
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                am.abandonAudioFocusRequest(
                    AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT).build()
                )
            } else {
                am.abandonAudioFocus(null)
            }
        }

        releaseWakeLock()

        val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        id?.let { nm.cancel(it.hashCode()) }

        if (activeAlarmId == id) activeAlarmId = null
    }

    private fun scheduleSnooze(context: Context, originalIntent: Intent) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val id = originalIntent.getStringExtra("id") ?: return
        val title = originalIntent.getStringExtra("title") ?: "Alarm"
        val body = originalIntent.getStringExtra("body") ?: ""
        val minutes = originalIntent.getIntExtra("snoozeMinutes", SNOOZE_MINUTES)

        val snoozeIntent = Intent(context, AlarmReceiver::class.java).apply {
            putExtra("id", id)
            putExtra("title", title)
            putExtra("body", body)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context, id.hashCode(), snoozeIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val triggerTime = System.currentTimeMillis() + minutes * 60 * 1000

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
        } else {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
        }

        Toast.makeText(context, "Snoozed for $minutes minutes", Toast.LENGTH_SHORT).show()
    }
}
