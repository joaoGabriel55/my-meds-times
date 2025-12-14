package com.alamedapps.mymedstimes

import com.facebook.react.bridge.*
import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import java.text.SimpleDateFormat
import java.util.*
import android.util.Log
import org.json.JSONObject
import android.content.pm.PackageManager

class AlarmModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val PREFS = "alarms"
        private const val DATE_PATTERN = "yyyy-MM-dd'T'HH:mm:ss"
    }

    override fun getName(): String = "AlarmModule"

    @ReactMethod
    fun getCurrentAlarmPlaying(promise: Promise) {
      if (AlarmReceiver.activeAlarmId != null) {
        val map = Arguments.createMap()
        map.putString("activeAlarmId", AlarmReceiver.activeAlarmId)
        promise.resolve(map)
      } else {
        promise.resolve(null)
      }
    }

    // Add this: Stop the current ringing alarm by broadcasting ACTION_STOP
    @ReactMethod
    fun stopCurrentAlarm(id: String, promise: Promise) {
      try {
        val intent = Intent(reactApplicationContext, AlarmReceiver::class.java).apply {
          action = AlarmReceiver.ACTION_STOP
          putExtra("id", id)
        }
        reactApplicationContext.sendBroadcast(intent)
        promise.resolve(null)
      } catch (e: Exception) {
          promise.reject("STOP_ERROR", e)
      }
    }

    @ReactMethod
    fun snoozeCurrentAlarm(id: String, minutes: Int, promise: Promise) {
      try {
        val alarm = getAlarm(id) ?: throw Exception("Alarm not found")
        val title = alarm.optString("title", "Alarm")
        val body = alarm.optString("body", "")

        val intent = Intent(reactApplicationContext, AlarmReceiver::class.java).apply {
          action = AlarmReceiver.ACTION_SNOOZE
          putExtra("id", id)
          putExtra("title", title)
          putExtra("body", "$body (Snoozed)")
          putExtra("snoozeMinutes", minutes)
        }
        reactApplicationContext.sendBroadcast(intent)
        promise.resolve(null)
      } catch (e: Exception) {
          promise.reject("SNOOZE_ERROR", e)
      }
    }

    @ReactMethod
    fun requestPermissions(promise: Promise) {
        val granted = if (Build.VERSION.SDK_INT >= 33) {
            reactApplicationContext.checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
        } else true
        val map = Arguments.createMap()
        map.putBoolean("granted", granted)
        promise.resolve(map)
    }

    @ReactMethod
    fun scheduleAlarm(alarm: ReadableMap, promise: Promise) {
        try {
            val id = alarm.getString("id") ?: UUID.randomUUID().toString()
            val datetimeISO = alarm.getString("datetimeISO") ?: throw Exception("datetimeISO required")
            val title = alarm.getString("title") ?: "Alarm"
            val body = alarm.getString("body") ?: ""

            val sdf = SimpleDateFormat(DATE_PATTERN, Locale.getDefault())
            val date = sdf.parse(datetimeISO) ?: throw Exception("Invalid date format")
            val triggerAt = date.time

            val now = System.currentTimeMillis()
            if (triggerAt < now) {
                Log.w("AlarmModule", "scheduleAlarm: trigger time in past ($datetimeISO); scheduling anyway.")
            }

            val alarmManager = reactApplicationContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val alarmIntent = Intent(reactApplicationContext, AlarmReceiver::class.java).apply {
                putExtra("id", id)
                putExtra("title", title)
                putExtra("body", body)
            }

            val pendingIntent = PendingIntent.getBroadcast(
                reactApplicationContext,
                id.hashCode(),
                alarmIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // Single call – avoid duplicate scheduling
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
            } else {
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
            }

            saveAlarm(id, datetimeISO, title, body)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("SCHEDULE_ERROR", e)
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
            removeAlarm(id)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("CANCEL_ERROR", e)
        }
    }

    @ReactMethod
    fun listAlarms(promise: Promise) {
        val arr = Arguments.createArray()
        val prefs = reactApplicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val all = prefs.all
        for ((id, rawJson) in all) {
            val jsonStr = rawJson as? String ?: continue
            val obj = try {
                JSONObject(jsonStr)
            } catch (_: Exception) {
                continue
            }
            val map = Arguments.createMap()
            map.putString("id", id)
            map.putString("datetimeISO", obj.optString("datetimeISO"))
            map.putString("title", obj.optString("title"))
            map.putString("body", obj.optString("body"))
            arr.pushMap(map)
        }
        promise.resolve(arr)
    }

    @ReactMethod
    fun snoozeAlarm(message: String, snoozeMinutes: Int, promise: Promise) {
        try {
            val alarmIntent = Intent(reactApplicationContext, AlarmReceiver::class.java).apply {
                putExtra("id", UUID.randomUUID().toString())
                putExtra("title", "Snoozed Alarm")
                putExtra("body", message)
            }
            val pendingIntent = PendingIntent.getBroadcast(
                reactApplicationContext,
                alarmIntent.getStringExtra("id")!!.hashCode(),
                alarmIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val alarmManager = reactApplicationContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val triggerAt = System.currentTimeMillis() + snoozeMinutes * 60_000L
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
            } else {
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
            }
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("SNOOZE_ERROR", e)
        }
    }

    private fun saveAlarm(id: String, datetimeISO: String, title: String, body: String) {
        val obj = JSONObject()
            .put("id", id)
            .put("datetimeISO", datetimeISO)
            .put("title", title)
            .put("body", body)
        val prefs = reactApplicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        prefs.edit().putString(id, obj.toString()).apply()
    }

    private fun removeAlarm(id: String) {
        val prefs = reactApplicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        prefs.edit().remove(id).apply()
    }

    // Helper to fetch alarm details from prefs (used for snooze)
    private fun getAlarm(id: String): JSONObject? {
      val prefs = reactApplicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      val jsonStr = prefs.getString(id, null) ?: return null
      return try {
        JSONObject(jsonStr)
      } catch (_: Exception) {
        null
      }
    }
}
