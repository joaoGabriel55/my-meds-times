package com.alamedapps.mymedstimes

import com.facebook.react.bridge.*
import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import java.text.SimpleDateFormat
import java.util.*
import android.util.Log
import android.os.SystemClock

class AlarmModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "AlarmModule"

    @ReactMethod
    fun requestPermissions(promise: Promise) {
        // Permissões de notification são solicitadas no JS (ou via Activity).
        // Apenas resolve true aqui para simplicidade (você pode delegar para Activity).
        promise.resolve(Arguments.createMap().apply { putBoolean("granted", true) })
    }

    @ReactMethod
    fun scheduleAlarm(alarm: ReadableMap, promise: Promise) {
        try {
            val id = alarm.getString("id") ?: UUID.randomUUID().toString()
            val datetimeISO = alarm.getString("datetimeISO")!!
            val title = alarm.getString("title") ?: "Alarm"
            val body = alarm.getString("body") ?: ""

            val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
            val date = sdf.parse(datetimeISO) ?: throw Exception("Invalid date format")
            val triggerAt = date.time

            Log.d("AlarmModule", "Scheduling alarm for $datetimeISO")

            val alarmManager = reactApplicationContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val alarmIntent = Intent(reactApplicationContext, AlarmReceiver::class.java)
            alarmIntent.putExtra("id", id)
            alarmIntent.putExtra("title", title)
            alarmIntent.putExtra("body", body)

            val pendingIntent = PendingIntent.getBroadcast(
                reactApplicationContext,
                id.hashCode(),
                alarmIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // Use setExactAndAllowWhileIdle para precisão mesmo em Doze
            // alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)

            // Aqui você deve persistir o alarme (ex: SharedPreferences) para listagem/cancelamento.
            saveAlarmToPrefs(id, datetimeISO, title, body)

            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERR", e)
        }
    }

    @ReactMethod
    fun cancelAlarm(id: String, promise: Promise) {
        try {
            val intent = Intent(reactApplicationContext, AlarmReceiver::class.java)
            val pi = PendingIntent.getBroadcast(
                reactApplicationContext,
                id.hashCode(),
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            val am = reactApplicationContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            am.cancel(pi)
            removeAlarmFromPrefs(id)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERR", e)
        }
    }

    @ReactMethod
    fun listAlarms(promise: Promise) {
        val arr = Arguments.createArray()
        val prefs = reactApplicationContext.getSharedPreferences("alarms", Context.MODE_PRIVATE)
        val all = prefs.all
        for ((k, v) in all) {
            val map = Arguments.createMap()
            map.putString("id", k)
            map.putString("datetimeISO", v as String)
            arr.pushMap(map)
        }
        promise.resolve(arr)
    }

    @ReactMethod
    fun snoozeAlarm(message: String, snoozeMinutes: Int, promise: Promise) {
        try {
            val alarmIntent = Intent(reactApplicationContext, AlarmReceiver::class.java)
            val pendingIntent = PendingIntent.getBroadcast(
                reactApplicationContext,
                0,
                alarmIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val alarmManager = reactApplicationContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val calendar = Calendar.getInstance()
            calendar.timeInMillis = System.currentTimeMillis() + 3000 // Set alarm to trigger after 10 seconds

            alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.timeInMillis, pendingIntent)
        } catch (e: Exception) {
            promise.reject("SNOOZE_ERROR", e)
        }
    }

    private fun saveAlarmToPrefs(id: String, datetimeISO: String, title: String, body: String) {
        val prefs = reactApplicationContext.getSharedPreferences("alarms", Context.MODE_PRIVATE)
        prefs.edit().putString(id, datetimeISO).apply()
    }

    private fun removeAlarmFromPrefs(id: String) {
        val prefs = reactApplicationContext.getSharedPreferences("alarms", Context.MODE_PRIVATE)
        prefs.edit().remove(id).apply()
    }
}
