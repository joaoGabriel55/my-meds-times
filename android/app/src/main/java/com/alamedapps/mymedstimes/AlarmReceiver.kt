package com.alamedapps.mymedstimes

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.app.NotificationManager
import android.app.NotificationChannel
import android.app.PendingIntent
import androidx.core.app.NotificationCompat
import android.media.AudioManager
import android.media.MediaPlayer
import android.widget.Toast

class AlarmReceiver : BroadcastReceiver() {
    // override fun onReceive(context: Context, intent: Intent) {
    //     val id = intent.getStringExtra("id") ?: "alarm"
    //     val title = intent.getStringExtra("title") ?: "Alarm"
    //     val body = intent.getStringExtra("body") ?: ""

    //     val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    //     val channelId = "alarm_channel"
    //     if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
    //         val ch = NotificationChannel(channelId, "Alarms", NotificationManager.IMPORTANCE_HIGH)
    //         nm.createNotificationChannel(ch)
    //     }

    //     val message = intent.getStringExtra("title") ?: "Alarm!"
    //     Toast.makeText(context, message, Toast.LENGTH_LONG).show()

    //     audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
    //     originalVolume = audioManager.getStreamVolume(AudioManager.STREAM_ALARM)


    //     val maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM)
    //     audioManager.setStreamVolume(AudioManager.STREAM_ALARM, maxVolume, 0)

    //     val player = MediaPlayer.create(context, R.raw.alarm)
    //     player.start()

    //     // Optional: stop sound after some seconds
    //     Thread {
    //         Thread.sleep(10000)
    //         player.stop()
    //         player.release()
    //     }.start()

    //     val notification = NotificationCompat.Builder(context, channelId)
    //         .setContentTitle(title)
    //         .setContentText(body)
    //         .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
    //         .setAutoCancel(true)
    //         .build()

    //     nm.notify(id.hashCode(), notification)
    // }

    override fun onReceive(context: Context, intent: Intent) {
        val serviceIntent = Intent(context, AlarmService::class.java).apply {
            putExtra("id", intent.getStringExtra("id"))
            putExtra("title", intent.getStringExtra("title"))
            putExtra("body", intent.getStringExtra("body"))
        }

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            context.startForegroundService(serviceIntent)
        } else {
            context.startService(serviceIntent)
        }
    }
}
