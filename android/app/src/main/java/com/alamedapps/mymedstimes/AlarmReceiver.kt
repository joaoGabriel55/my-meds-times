package com.alamedapps.mymedstimes

import android.app.*
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.*
import android.os.Build
import android.widget.Toast
import androidx.core.app.NotificationCompat
import java.util.Calendar

class AlarmReceiver : BroadcastReceiver() {

    companion object {
        private const val CHANNEL_ID = "alarm_channel"
        private const val RAW_RES = "alarm"
        private const val ACTION_STOP = "com.alamedapps.mymedstimes.ACTION_STOP_ALARM"
        private const val ACTION_SNOOZE = "com.alamedapps.mymedstimes.ACTION_SNOOZE_ALARM"
        private const val SNOOZE_MINUTES = 5
    }

    private var player: MediaPlayer? = null
    private var audioManager: AudioManager? = null
    private var originalVolume = 0
    private var currentAlarmId: String? = null

    override fun onReceive(context: Context, intent: Intent?) {
        intent ?: return

        val action = intent.action
        currentAlarmId = intent.getStringExtra("id") ?: "alarm"

        when (action) {
            ACTION_STOP -> {
                stopAlarm(context)
                return
            }

            ACTION_SNOOZE -> {
                stopAlarm(context)
                scheduleSnooze(context, intent)
                return
            }
        }

        // Normal alarm trigger
        val id = currentAlarmId!!
        val title = intent.getStringExtra("title") ?: "Alarm"
        val body = intent.getStringExtra("body") ?: ""

        setupAudio(context)
        playAlarm(context)
        showNotificationWithActions(context, id, title, body)
        Toast.makeText(context, title, Toast.LENGTH_LONG).show()
    }

    private fun setupAudio(context: Context) {
        audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        originalVolume = audioManager!!.getStreamVolume(AudioManager.STREAM_ALARM)
        val maxVolume = audioManager!!.getStreamMaxVolume(AudioManager.STREAM_ALARM)
        audioManager!!.setStreamVolume(
            AudioManager.STREAM_ALARM,
            maxVolume,
            AudioManager.FLAG_SHOW_UI or AudioManager.FLAG_PLAY_SOUND
        )

        // Request audio focus
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
            audioManager!!.requestAudioFocus(focusRequest!!)
        } else {
            audioManager!!.requestAudioFocus(
                null,
                AudioManager.STREAM_ALARM,
                AudioManager.AUDIOFOCUS_GAIN_TRANSIENT
            )
        }
    }

    private fun playAlarm(context: Context) {
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

        // Auto-stop after 2 minutes if not dismissed
        Thread {
            try {
                Thread.sleep(120_000)
            } catch (ignored: InterruptedException) {
            } finally {
                stopAlarm(context)
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
            .setContentTitle(title)
            .setContentText(body)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setAutoCancel(true)
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Stop", stopPendingIntent)
            .addAction(android.R.drawable.ic_menu_recent_history, "Snooze", snoozePendingIntent)
            .setOngoing(true) // prevents swipe-dismiss
            .build()

        nm.notify(id.hashCode(), notification)
    }

    private fun stopAlarm(context: Context) {
        player?.apply {
            if (isPlaying) stop()
            release()
        }
        player = null

        audioManager?.setStreamVolume(AudioManager.STREAM_ALARM, originalVolume, 0)

        val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        currentAlarmId?.let { nm.cancel(it.hashCode()) }

        // Abandon audio focus
        @Suppress("DEPRECATION")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            audioManager?.abandonAudioFocusRequest(
                AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT).build()
            )
        } else {
            audioManager?.abandonAudioFocus(null)
        }
    }

    private fun scheduleSnooze(context: Context, originalIntent: Intent) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val id = originalIntent.getStringExtra("id") ?: return
        val title = originalIntent.getStringExtra("title") ?: "Alarm"
        val body = originalIntent.getStringExtra("body") ?: ""

        val snoozeIntent = Intent(context, AlarmReceiver::class.java).apply {
            putExtra("id", id)
            putExtra("title", title)
            putExtra("body", "$body (Snoozed)")
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context, id.hashCode(), snoozeIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val triggerTime = System.currentTimeMillis() + SNOOZE_MINUTES * 60 * 1000

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
        } else {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
        }

        Toast.makeText(context, "Snoozed for $SNOOZE_MINUTES minutes", Toast.LENGTH_SHORT).show()
    }
}
