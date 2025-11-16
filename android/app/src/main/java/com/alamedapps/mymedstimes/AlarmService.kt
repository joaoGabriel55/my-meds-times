package com.alamedapps.mymedstimes

import android.app.*
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.os.IBinder
import androidx.core.app.NotificationCompat

class AlarmService : Service() {

    private lateinit var audioManager: AudioManager
    private var originalVolume = 0
    private var player: MediaPlayer? = null

    override fun onStartCommand(intent: Intent, flags: Int, startId: Int): Int {
        val title = intent.getStringExtra("title") ?: "Alarm"
        val body = intent.getStringExtra("body") ?: ""

        createNotificationChannel()

        // Foreground notification (required to keep service alive)
        val notification = NotificationCompat.Builder(this, "alarm_channel")
            .setContentTitle(title)
            .setContentText(body)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setOngoing(true)
            .build()

        startForeground(1, notification)

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
        val afd = resources.openRawResourceFd(R.raw.alarm)

        player = MediaPlayer().apply {
            setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
            setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()
            )
            isLooping = true
            prepare()
            start()
        }
    }

    override fun onDestroy() {
        super.onDestroy()

        // Stop sound + restore volume
        player?.stop()
        player?.release()

        audioManager.setStreamVolume(AudioManager.STREAM_ALARM, originalVolume, 0)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotificationChannel() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "alarm_channel",
                "Alarms",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                setBypassDnd(true) // VERY IMPORTANT
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
            }

            val nm = getSystemService(NotificationManager::class.java)
            nm.createNotificationChannel(channel)
        }
    }
}
