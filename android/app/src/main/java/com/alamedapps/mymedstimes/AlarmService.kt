package com.alamedapps.mymedstimes

import android.R
import android.app.*
import android.content.Context
import android.content.Intent
import android.media.*
import android.net.Uri
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import java.io.IOException

class AlarmService : Service() {

    companion object {
        private const val CHANNEL_ID = "alarm_channel"
        private const val NOTIF_ID = 1
        private const val RAW_RES = "alarm"          // file name without extension
    }

    private lateinit var audioManager: AudioManager
    private var originalVolume = 0
    private var player: MediaPlayer? = null
    private var focusRequest: AudioFocusRequest? = null

    override fun onStartCommand(intent: Intent, flags: Int, startId: Int): Int {
        if (intent == null) {
            stopSelf()
            return START_NOT_STICKY
        }

        val title = intent.getStringExtra("title") ?: "Alarm"
        val body = intent.getStringExtra("body") ?: ""

        createNotificationChannel()
        val notification = buildForegroundNotification(title, body)
        startForeground(NOTIF_ID, notification)

        playAlarmLoud()
        return START_STICKY
    }

    private fun playAlarmLoud() {
        audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager

        // Save original volume
        originalVolume = audioManager.getStreamVolume(AudioManager.STREAM_ALARM)

        // Max volume for alarm
        val max = audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM)
        audioManager.setStreamVolume(AudioManager.STREAM_ALARM, max, 0)

        // Setup MediaPlayer
        requestAudioFocus()

        player = MediaPlayer().apply {
            try {
                // Safer than raw FD – works on all API levels
                val uri = Uri.parse("android.resource://${packageName}/raw/$RAW_RES")
                setDataSource(this@AlarmService, uri)

                val attrs = AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setLegacyStreamType(AudioManager.STREAM_ALARM) // still respected
                    .build()
                setAudioAttributes(attrs)

                isLooping = true

                setOnPreparedListener { it.start() }
                setOnErrorListener { mp, what, extra ->
                    mp.release()
                    player = null
                    true
                }

                prepareAsync()               // non-blocking
            } catch (e: IOException) {
                e.printStackTrace()
                stopSelf()
            }
        }
    }

    private fun requestAudioFocus() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val req = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .build()
                )
                .setOnAudioFocusChangeListener { /* no-op */ }
                .build()
            focusRequest = req
            audioManager.requestAudioFocus(req)
        } else {
            @Suppress("DEPRECATION")
            audioManager.requestAudioFocus(
                null,
                AudioManager.STREAM_ALARM,
                AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK
            )
        }
    }

    private fun abandonAudioFocus() {
        focusRequest?.let {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                audioManager.abandonAudioFocusRequest(it)
            }
        }
        @Suppress("DEPRECATION")
        audioManager.abandonAudioFocus(null)
    }

    private fun buildForegroundNotification(title: String, body: String): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(body)
            .setSmallIcon(R.drawable.ic_lock_idle_alarm)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOngoing(true)
            .setSound(null)                 // we play via MediaPlayer
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Alarms",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Alarm sound channel"
                setBypassDnd(true)          // works on < Android 12
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                setSound(null, null)
            }

            val nm = getSystemService(NotificationManager::class.java)
            nm.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        player?.apply {
            stop()
            release()
        }
        player = null

        // Restore original volume
        try {
            audioManager.setStreamVolume(AudioManager.STREAM_ALARM, originalVolume, 0)
        } catch (ignore: SecurityException) {
        }

        abandonAudioFocus()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
