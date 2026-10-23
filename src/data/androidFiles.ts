export interface ProjectFile {
  path: string;
  name: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'markdown' | 'properties';
  description: string;
  content: string;
}

export const ADMOB_CONFIG = {
  appName: 'SRD R370 Status Guide (Unofficial) v1.2.0',
  packageName: 'com.srd.guide.helper',
  appId: 'ca-app-pub-2538513652201921~6937554190',
  testAppId: 'ca-app-pub-39402544~3347511713',
  appOpenId: 'ca-app-pub-2538513652201921/3873969774',
  interstitialId: 'ca-app-pub-2538513652201921/6746022504',
  bannerId: 'ca-app-pub-2538513652201921/6746022504',
  nativeAdId: 'ca-app-pub-2538513652201921/6746022504',
  primaryColor: '#0A4D1F',
  officialUrl: 'https://srd.sassa.gov.za/scid/',
  version: 'v1.2.0',
  disclaimerText: 'NOT affiliated with SASSA. Official website is srd.sassa.gov.za. This app is a free guide to help you. We do not store ID numbers. Official verification happens on srd.sassa.gov.za.',
  leaveAppDisclaimer: 'You will leave this helper app and go to official South African Government Portal (srd.sassa.gov.za) for real OTP verification. This app does not collect IDs.',
  complianceBadge: 'Unofficial helper Zero ID storage',
  footerNotice: 'Ads support this free guide. We do not store ID numbers.',
  logoUrl: '/assets/aistudio/IMG-20261023-WA8277_49502a60.jpg'
};

export const ANDROID_FILES: ProjectFile[] = [
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'xml',
    description: 'Manifest declaring shortEdges cutout mode, NoActionBar immersive theme, and AdMob IDs.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.srd.guide.helper">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="com.google.android.gms.permission.AD_ID" />

    <application
        android:name=".SrdGuideApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SrdGuideHelper.FullScreen"
        tools:targetApi="34">

        <!-- Google AdMob Application ID -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-2538513652201921~6937554190" />

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:theme="@style/Theme.SrdGuideHelper.FullScreen"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`
  },
  {
    path: 'app/src/main/java/com/srd/guide/helper/MainActivity.kt',
    name: 'MainActivity.kt',
    language: 'kotlin',
    description: '100% immersive full-screen activity with shortEdges cutout, clipboard helper, auto-clearing inputs, and Zero ID storage.',
    content: `package com.srd.guide.helper

import android.Manifest
import android.app.DatePickerDialog
import android.app.Dialog
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.Window
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.google.android.gms.ads.*
import com.google.android.gms.ads.appopen.AppOpenAd
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.nativead.NativeAd
import com.google.android.gms.ads.nativead.NativeAdOptions
import com.google.android.gms.ads.nativead.NativeAdView
import com.google.android.material.bottomnavigation.BottomNavigationView
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit

class MainActivity : AppCompatActivity() {

    private val TAG = "SRD_HELPER"

    // Real AdMob AppOpen ID & Test Interstitial
    private val APP_OPEN_AD_ID = "ca-app-pub-2538513652201921/6746022504"
    private val TEST_INTERSTITIAL_AD_ID = "ca-app-pub-39402544/1033173712"
    private val NATIVE_AD_ID = "ca-app-pub-2538513652201921/NATIVE_ID"
    private val TEST_NATIVE_AD_ID = "ca-app-pub-39402544/2247696110"

    private val OFFICIAL_SASSA_SCID_URL = "https://srd.sassa.gov.za/scid/"

    // Views
    private lateinit var etIdNumber: EditText
    private lateinit var etPhoneNumber: EditText
    private lateinit var btnOpenOfficialSite: Button
    private lateinit var bottomNav: BottomNavigationView

    // Containers
    private lateinit var layoutCheckToday: View
    private lateinit var layoutMyNotes: View
    private lateinit var layoutCalculator: View

    // Notes
    private lateinit var spinnerMonth: Spinner
    private lateinit var spinnerStatus: Spinner
    private lateinit var btnSaveNote: Button
    private lateinit var linearNotesList: LinearLayout
    private lateinit var tvEmptyNotes: TextView

    // Calculator
    private lateinit var btnPickLastPayday: Button
    private lateinit var tvCalculatorResult: TextView
    private lateinit var switchReminder: Switch

    // Ads
    private var appOpenAd: AppOpenAd? = null
    private var interstitialAd: InterstitialAd? = null
    private var loadedNativeAd: NativeAd? = null

    // Preferences: ONLY FOR NOTES AND REMINDER TOGGLE - NEVER FOR ID OR PHONE!
    private lateinit var sharedPrefs: SharedPreferences
    private val KEY_NOTES_LIST = "saved_status_notes"
    private val KEY_DAILY_REMINDER = "daily_reminder_enabled"

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            scheduleDailyReminderWork()
            Toast.makeText(this, "Daily Reminder scheduled! You will receive notification tomorrow.", Toast.LENGTH_SHORT).show()
        } else {
            switchReminder.isChecked = false
            Toast.makeText(this, "Notification permission required for reminders.", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 100% Immersive Full-Screen
        applyImmersiveEdgeToEdge()

        setContentView(R.layout.activity_main)

        sharedPrefs = getSharedPreferences("srd_notes_only_prefs", Context.MODE_PRIVATE)

        MobileAds.initialize(this) {}

        // Bind root layout sections
        layoutCheckToday = findViewById(R.id.layoutCheckToday)
        layoutMyNotes = findViewById(R.id.layoutMyNotes)
        layoutCalculator = findViewById(R.id.layoutCalculator)
        bottomNav = findViewById(R.id.bottomNavigationView)

        // Input Fields (Never saved)
        etIdNumber = findViewById(R.id.etIdNumber)
        etPhoneNumber = findViewById(R.id.etPhoneNumber)
        btnOpenOfficialSite = findViewById(R.id.btnOpenOfficialSite)

        btnOpenOfficialSite.setOnClickListener {
            handleOpenOfficialCheckClick()
        }

        // Setup notes
        spinnerMonth = findViewById(R.id.spinnerMonth)
        spinnerStatus = findViewById(R.id.spinnerStatus)
        btnSaveNote = findViewById(R.id.btnSaveNote)
        linearNotesList = findViewById(R.id.linearNotesList)
        tvEmptyNotes = findViewById(R.id.tvEmptyNotes)
        setupMonthAndStatusDropdowns()
        btnSaveNote.setOnClickListener { saveManualStatusNote() }

        // Setup calculator & reminder
        btnPickLastPayday = findViewById(R.id.btnPickLastPayday)
        tvCalculatorResult = findViewById(R.id.tvCalculatorResult)
        switchReminder = findViewById(R.id.switchReminder)
        setupCalculatorAndReminder()

        // Setup bottom nav
        setupBottomNavigation()

        // Load Ads
        loadAppOpenAd()
        loadInterstitialAd()
        loadNativeAd()

        renderNotesWithNativeAds()
    }

    override fun onResume() {
        super.onResume()
        applyImmersiveEdgeToEdge()
    }

    /**
     * Requirement 2:
     * WindowCompat.setDecorFitsSystemWindows(window, false)
     * WindowInsetsControllerCompat(window, decorView).hide(statusBars() or navigationBars())
     * Behavior SHOW_TRANSIENT_BARS_BY_SWIPE
     */
    private fun applyImmersiveEdgeToEdge() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.hide(WindowInsetsCompat.Type.statusBars() or WindowInsetsCompat.Type.navigationBars())
        controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    }

    /**
     * Requirement 4:
     * DO NOT SAVE to SharedPrefs.
     * Clear fields after button click.
     * Only use to copy to clipboard helper, then open official site intent.
     */
    private fun handleOpenOfficialCheckClick() {
        val id = etIdNumber.text.toString().trim()
        val phone = etPhoneNumber.text.toString().trim()

        if (id.isNotEmpty()) {
            val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip = ClipData.newPlainText("SASSA_ID_HELPER", id)
            clipboard.setPrimaryClip(clip)
            Toast.makeText(this, "ID copied to clipboard helper for easy paste on official portal.", Toast.LENGTH_SHORT).show()
        }

        // IMMEDIATELY CLEAR FIELDS: ZERO RETENTION / ZERO STORAGE
        etIdNumber.text?.clear()
        etPhoneNumber.text?.clear()

        // Show transparent departure dialog before launching browser
        AlertDialog.Builder(this)
            .setTitle("Official Government Portal")
            .setMessage("You will leave this helper app and go to official South African Government Portal (srd.sassa.gov.za) for real OTP verification. This app does not collect IDs.")
            .setPositiveButton("PROCEED TO OFFICIAL SITE") { _, _ ->
                val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(OFFICIAL_SASSA_SCID_URL))
                startActivity(browserIntent)
            }
            .setNegativeButton("CANCEL", null)
            .show()
    }

    private fun setupBottomNavigation() {
        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_check -> {
                    layoutCheckToday.visibility = View.VISIBLE
                    layoutMyNotes.visibility = View.GONE
                    layoutCalculator.visibility = View.GONE
                    true
                }
                R.id.nav_notes -> {
                    layoutCheckToday.visibility = View.GONE
                    layoutMyNotes.visibility = View.VISIBLE
                    layoutCalculator.visibility = View.GONE
                    renderNotesWithNativeAds()
                    true
                }
                R.id.nav_calc -> {
                    layoutCheckToday.visibility = View.GONE
                    layoutMyNotes.visibility = View.GONE
                    layoutCalculator.visibility = View.VISIBLE
                    true
                }
                R.id.nav_support -> {
                    showSupportAdPromptDialog()
                    false
                }
                else -> false
            }
        }
    }

    private fun setupCalculatorAndReminder() {
        val calendar = Calendar.getInstance()
        btnPickLastPayday.setOnClickListener {
            DatePickerDialog(
                this,
                { _, year, month, dayOfMonth ->
                    val selectedCal = Calendar.getInstance().apply {
                        set(year, month, dayOfMonth)
                    }
                    val inputFormat = SimpleDateFormat("dd MMM yyyy", Locale.getDefault())
                    val lastSeenStr = inputFormat.format(selectedCal.time)
                    btnPickLastPayday.text = "Last seen: $lastSeenStr"

                    // +30 days manual calculation
                    selectedCal.add(Calendar.DAY_OF_YEAR, 30)
                    val outputFormat = SimpleDateFormat("d MMMM yyyy", Locale.getDefault())
                    val nextEstDate = outputFormat.format(selectedCal.time)

                    tvCalculatorResult.visibility = View.VISIBLE
                    tvCalculatorResult.text = "Estimated next: ~$nextEstDate (check official site to confirm)"
                },
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH)
            ).show()
        }

        switchReminder.isChecked = sharedPrefs.getBoolean(KEY_DAILY_REMINDER, false)
        switchReminder.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                showReminderPermissionDialog()
            } else {
                sharedPrefs.edit().putBoolean(KEY_DAILY_REMINDER, false).apply()
                WorkManager.getInstance(this).cancelUniqueWork("srd_daily_reminder_work")
                Toast.makeText(this, "Daily reminders turned off.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showReminderPermissionDialog() {
        AlertDialog.Builder(this)
            .setTitle("Daily Check Reminder")
            .setMessage("Remind me to check SASSA site tomorrow?\\n\\nSchedules a daily notification via WorkManager.")
            .setPositiveButton("YES, REMIND ME") { _, _ ->
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED) {
                        scheduleDailyReminderWork()
                        Toast.makeText(this, "Daily Reminder scheduled!", Toast.LENGTH_SHORT).show()
                    } else {
                        requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                    }
                } else {
                    scheduleDailyReminderWork()
                    Toast.makeText(this, "Daily Reminder scheduled!", Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton("CANCEL") { _, _ ->
                switchReminder.isChecked = false
            }
            .show()
    }

    private fun scheduleDailyReminderWork() {
        sharedPrefs.edit().putBoolean(KEY_DAILY_REMINDER, true).apply()
        val dailyWork = PeriodicWorkRequestBuilder<DailyReminderWorker>(24, TimeUnit.HOURS)
            .setInitialDelay(24, TimeUnit.HOURS)
            .build()

        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "srd_daily_reminder_work",
            ExistingPeriodicWorkPolicy.UPDATE,
            dailyWork
        )
    }

    private fun loadNativeAd() {
        val adLoader = AdLoader.Builder(this, TEST_NATIVE_AD_ID)
            .forNativeAd { ad: NativeAd -> loadedNativeAd = ad }
            .withNativeAdOptions(NativeAdOptions.Builder().build())
            .build()
        adLoader.loadAd(AdRequest.Builder().build())
    }

    private fun renderNotesWithNativeAds() {
        linearNotesList.removeAllViews()
        val jsonArray = JSONArray(sharedPrefs.getString(KEY_NOTES_LIST, "[]"))

        if (jsonArray.length() == 0) {
            tvEmptyNotes.visibility = View.VISIBLE
            return
        }
        tvEmptyNotes.visibility = View.GONE

        for (i in 0 until jsonArray.length()) {
            val item = jsonArray.getJSONObject(i)
            val month = item.getString("month")
            val status = item.getString("status")

            val noteCard = LayoutInflater.from(this).inflate(R.layout.item_status_note, linearNotesList, false)
            val tvMonth = noteCard.findViewById<TextView>(R.id.tvNoteMonth)
            val tvStatus = noteCard.findViewById<TextView>(R.id.tvNoteStatus)
            val btnDel = noteCard.findViewById<ImageButton>(R.id.btnDeleteNote)

            tvMonth.text = month
            tvStatus.text = status
            btnDel.setOnClickListener { deleteManualNote(month) }

            linearNotesList.addView(noteCard)

            // One native per 3 notes max
            if ((i + 1) % 3 == 0 && loadedNativeAd != null) {
                val adView = LayoutInflater.from(this).inflate(R.layout.native_ad_layout, linearNotesList, false) as NativeAdView
                populateNativeAdView(loadedNativeAd!!, adView)
                linearNotesList.addView(adView)
            }
        }
    }

    private fun populateNativeAdView(nativeAd: NativeAd, adView: NativeAdView) {
        val headlineView = adView.findViewById<TextView>(R.id.ad_headline)
        val bodyView = adView.findViewById<TextView>(R.id.ad_body)
        val callToActionView = adView.findViewById<Button>(R.id.ad_call_to_action)
        val iconView = adView.findViewById<ImageView>(R.id.ad_app_icon)

        headlineView.text = nativeAd.headline
        adView.headlineView = headlineView

        if (nativeAd.body != null) {
            bodyView.visibility = View.VISIBLE
            bodyView.text = nativeAd.body
            adView.bodyView = bodyView
        } else {
            bodyView.visibility = View.INVISIBLE
        }

        if (nativeAd.callToAction != null) {
            callToActionView.visibility = View.VISIBLE
            callToActionView.text = nativeAd.callToAction
            adView.callToActionView = callToActionView
        } else {
            callToActionView.visibility = View.INVISIBLE
        }

        if (nativeAd.icon != null) {
            iconView.visibility = View.VISIBLE
            iconView.setImageDrawable(nativeAd.icon?.drawable)
            adView.iconView = iconView
        }

        adView.setNativeAd(nativeAd)
    }

    private fun setupMonthAndStatusDropdowns() {
        val months = mutableListOf<String>()
        val monthNames = listOf("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
        for (year in 2024..2026) {
            for (m in monthNames) months.add("$m $year")
        }
        spinnerMonth.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, months)
        spinnerStatus.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, listOf("Approved", "Paid", "Pending", "Declined"))
    }

    private fun saveManualStatusNote() {
        val m = spinnerMonth.selectedItem.toString()
        val s = spinnerStatus.selectedItem.toString()
        val jsonArray = JSONArray(sharedPrefs.getString(KEY_NOTES_LIST, "[]"))
        val newArray = JSONArray()
        var found = false
        for (i in 0 until jsonArray.length()) {
            val item = jsonArray.getJSONObject(i)
            if (item.getString("month") == m) {
                item.put("status", s)
                found = true
            }
            newArray.put(item)
        }
        if (!found) newArray.put(JSONObject().apply { put("month", m); put("status", s) })
        sharedPrefs.edit().putString(KEY_NOTES_LIST, newArray.toString()).apply()
        Toast.makeText(this, "Saved $m note: $s (Personal Note)", Toast.LENGTH_SHORT).show()
        renderNotesWithNativeAds()
    }

    private fun deleteManualNote(monthToDelete: String) {
        val jsonArray = JSONArray(sharedPrefs.getString(KEY_NOTES_LIST, "[]"))
        val newArray = JSONArray()
        for (i in 0 until jsonArray.length()) {
            val item = jsonArray.getJSONObject(i)
            if (item.getString("month") != monthToDelete) newArray.put(item)
        }
        sharedPrefs.edit().putString(KEY_NOTES_LIST, newArray.toString()).apply()
        renderNotesWithNativeAds()
    }

    private fun showSupportAdPromptDialog() {
        val dialog = Dialog(this)
        dialog.setContentView(R.layout.dialog_support_ad)
        dialog.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        val btnWatchAd: Button = dialog.findViewById(R.id.btnSupportWatchAd)
        val btnContinueFree: Button = dialog.findViewById(R.id.btnContinueFree)

        btnWatchAd.setOnClickListener {
            dialog.dismiss()
            interstitialAd?.show(this)
            loadInterstitialAd()
        }
        btnContinueFree.setOnClickListener {
            dialog.dismiss()
        }
        dialog.show()
    }

    private fun loadAppOpenAd() {
        AppOpenAd.load(
            this,
            APP_OPEN_AD_ID,
            AdRequest.Builder().build(),
            object : AppOpenAd.AppOpenAdLoadCallback() {
                override fun onAdLoaded(ad: AppOpenAd) {
                    appOpenAd = ad
                    appOpenAd?.show(this@MainActivity)
                }
            }
        )
    }

    private fun loadInterstitialAd() {
        InterstitialAd.load(
            this,
            TEST_INTERSTITIAL_AD_ID,
            AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialAd = ad
                }
            }
        )
    }
}`
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    name: 'themes.xml',
    language: 'xml',
    description: 'Immersive cutout theme: Theme.Material3.DayNight.NoActionBar with windowFullscreen, windowLayoutInDisplayCutoutMode shortEdges, and transparent system bars.',
    content: `<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.SrdGuideHelper.FullScreen" parent="Theme.Material3.DayNight.NoActionBar">
        <!-- Brand Colors -->
        <item name="colorPrimary">#0B5C1A</item>
        <item name="colorPrimaryVariant">#084213</item>
        <item name="colorOnPrimary">#FFFFFF</item>

        <!-- 100% Immersive Full-Screen Window Flags -->
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
        <item name="android:windowDrawsSystemBarBackgrounds">true</item>
        <item name="android:windowBackground">#0B5C1A</item>
    </style>
</resources>`
  },
  {
    path: 'app/src/main/res/layout/activity_main.xml',
    name: 'activity_main.xml',
    language: 'xml',
    description: 'Root ConstraintLayout match_parent background #0B5C1A with edge-to-edge scrollable content and no outer padding frame.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#0B5C1A"
    tools:context=".MainActivity">

    <!-- Scrollable Edge-to-Edge Content Container -->
    <ScrollView
        android:id="@+id/scrollViewContent"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:fillViewport="true"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toTopOf="@id/bottomNavigationView">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:background="#F3F6F4">

            <!-- Top Header (#0B5C1A) with v1.2.0 badge -->
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:background="#0B5C1A"
                android:orientation="vertical"
                android:paddingStart="16dp"
                android:paddingTop="36dp"
                android:paddingEnd="16dp"
                android:paddingBottom="16dp">

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:orientation="horizontal"
                    android:gravity="center_vertical">

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:background="#073B11"
                        android:paddingStart="8dp"
                        android:paddingTop="3dp"
                        android:paddingEnd="8dp"
                        android:paddingBottom="3dp"
                        android:text="Unofficial helper, Zero ID storage"
                        android:textColor="#D3E3FD"
                        android:textSize="10sp"
                        android:textStyle="bold" />

                    <View
                        android:layout_width="0dp"
                        android:layout_height="1dp"
                        android:layout_weight="1" />

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:background="#157A27"
                        android:paddingStart="8dp"
                        android:paddingTop="2dp"
                        android:paddingEnd="8dp"
                        android:paddingBottom="2dp"
                        android:text="v1.2.0"
                        android:textColor="#FFFFFF"
                        android:textSize="11sp"
                        android:textStyle="bold" />
                </LinearLayout>

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="8dp"
                    android:text="SRD R370 Status Guide"
                    android:textColor="#FFFFFF"
                    android:textSize="22sp"
                    android:textStyle="bold" />

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="2dp"
                    android:text="(Unofficial) Retention Helper &amp; Offline Notes"
                    android:textColor="#E8F5E9"
                    android:textSize="12sp" />
            </LinearLayout>

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="12dp">

                <!-- Yellow IMPORTANT NOTICE -->
                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:background="@drawable/disclaimer_yellow_background"
                    android:orientation="vertical"
                    android:padding="14dp">

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="IMPORTANT NOTICE"
                        android:textColor="#92400E"
                        android:textSize="11sp"
                        android:textStyle="bold" />

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:layout_marginTop="4dp"
                        android:text="NOT affiliated with SASSA. Official website is srd.sassa.gov.za. This app is a free guide to help you."
                        android:textColor="#78350F"
                        android:textSize="12sp"
                        android:textStyle="bold"
                        android:lineSpacingExtra="2dp" />

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:layout_marginTop="4dp"
                        android:text="We never ask for passwords, banking PINs, or OTPs. All official decisions remain on government servers."
                        android:textColor="#92400E"
                        android:textSize="10sp" />
                </LinearLayout>

                <!-- TAB CONTAINER 1: Check Today -->
                <LinearLayout
                    android:id="@+id/layoutCheckToday"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:orientation="vertical"
                    android:layout_marginTop="12dp">

                    <LinearLayout
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:background="@drawable/card_white_background"
                        android:orientation="vertical"
                        android:padding="16dp">

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="Official Portal Check"
                            android:textColor="#111827"
                            android:textSize="16sp"
                            android:textStyle="bold" />

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:layout_marginTop="2dp"
                            android:text="Opens srd.sassa.gov.za/scid/ in external browser tab"
                            android:textColor="#6B7280"
                            android:textSize="12sp" />

                        <!-- ID Input (inputType number, hint e.g. 9408155234087) -->
                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:layout_marginTop="12dp"
                            android:text="South African ID Number (Optional helper)"
                            android:textColor="#374151"
                            android:textSize="11sp"
                            android:textStyle="bold" />

                        <EditText
                            android:id="@+id/etIdNumber"
                            android:layout_width="match_parent"
                            android:layout_height="44dp"
                            android:layout_marginTop="4dp"
                            android:background="@drawable/input_border"
                            android:hint="e.g. 9408155234087"
                            android:inputType="number"
                            android:maxLength="13"
                            android:paddingStart="12dp"
                            android:paddingEnd="12dp"
                            android:textSize="14sp" />

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:layout_marginTop="2dp"
                            android:text="Used only to open official site, not stored"
                            android:textColor="#9CA3AF"
                            android:textSize="10sp" />

                        <!-- Phone Input (inputType number, hint e.g. 082 123 4567) -->
                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:layout_marginTop="10dp"
                            android:text="Cellular Phone Number (Optional helper)"
                            android:textColor="#374151"
                            android:textSize="11sp"
                            android:textStyle="bold" />

                        <EditText
                            android:id="@+id/etPhoneNumber"
                            android:layout_width="match_parent"
                            android:layout_height="44dp"
                            android:layout_marginTop="4dp"
                            android:background="@drawable/input_border"
                            android:hint="e.g. 082 123 4567"
                            android:inputType="number"
                            android:maxLength="12"
                            android:paddingStart="12dp"
                            android:paddingEnd="12dp"
                            android:textSize="14sp" />

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:layout_marginTop="2dp"
                            android:text="Used only to open official site, not stored"
                            android:textColor="#9CA3AF"
                            android:textSize="10sp" />

                        <!-- Action Button: OPEN OFFICIAL SASSA CHECK -->
                        <Button
                            android:id="@+id/btnOpenOfficialSite"
                            android:layout_width="match_parent"
                            android:layout_height="52dp"
                            android:layout_marginTop="16dp"
                            android:backgroundTint="#0B5C1A"
                            android:text="OPEN OFFICIAL SASSA CHECK"
                            android:textColor="#FFFFFF"
                            android:textSize="13sp"
                            android:textStyle="bold"
                            app:cornerRadius="8dp" />

                    </LinearLayout>
                </LinearLayout>

                <!-- TAB CONTAINER 2: My Notes -->
                <LinearLayout
                    android:id="@+id/layoutMyNotes"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:orientation="vertical"
                    android:layout_marginTop="12dp"
                    android:visibility="gone">

                    <LinearLayout
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:background="@drawable/card_white_background"
                        android:orientation="vertical"
                        android:padding="16dp">

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="My Status History - Personal Notes"
                            android:textColor="#111827"
                            android:textSize="15sp"
                            android:textStyle="bold" />

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:layout_marginTop="2dp"
                            android:text="Your manual notes. (Not from SASSA). Stored in local storage."
                            android:textColor="#6B7280"
                            android:textSize="11sp" />

                        <LinearLayout
                            android:layout_width="match_parent"
                            android:layout_height="wrap_content"
                            android:layout_marginTop="12dp"
                            android:orientation="horizontal">

                            <LinearLayout
                                android:layout_width="0dp"
                                android:layout_height="wrap_content"
                                android:layout_weight="1"
                                android:layout_marginEnd="4dp"
                                android:orientation="vertical">
                                <TextView
                                    android:layout_width="wrap_content"
                                    android:layout_height="wrap_content"
                                    android:text="Month (2024 - 2026)"
                                    android:textColor="#374151"
                                    android:textSize="11sp" />
                                <Spinner
                                    android:id="@+id/spinnerMonth"
                                    android:layout_width="match_parent"
                                    android:layout_height="42dp"
                                    android:background="@drawable/input_border" />
                            </LinearLayout>

                            <LinearLayout
                                android:layout_width="0dp"
                                android:layout_height="wrap_content"
                                android:layout_weight="1"
                                android:layout_marginStart="4dp"
                                android:orientation="vertical">
                                <TextView
                                    android:layout_width="wrap_content"
                                    android:layout_height="wrap_content"
                                    android:text="Status"
                                    android:textColor="#374151"
                                    android:textSize="11sp" />
                                <Spinner
                                    android:id="@+id/spinnerStatus"
                                    android:layout_width="match_parent"
                                    android:layout_height="42dp"
                                    android:background="@drawable/input_border" />
                            </LinearLayout>
                        </LinearLayout>

                        <Button
                            android:id="@+id/btnSaveNote"
                            android:layout_width="match_parent"
                            android:layout_height="46dp"
                            android:layout_marginTop="10dp"
                            android:backgroundTint="#0B5C1A"
                            android:text="SAVE TO MY NOTES"
                            android:textColor="#FFFFFF"
                            android:textSize="12sp"
                            android:textStyle="bold"
                            app:cornerRadius="8dp" />
                    </LinearLayout>

                    <TextView
                        android:id="@+id/tvEmptyNotes"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:layout_marginTop="16dp"
                        android:gravity="center"
                        android:text="No personal notes saved yet."
                        android:textColor="#9CA3AF"
                        android:textSize="12sp" />

                    <!-- Notes List (with Native Ads dynamically added) -->
                    <LinearLayout
                        android:id="@+id/linearNotesList"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:orientation="vertical"
                        android:layout_marginTop="10dp" />

                </LinearLayout>

                <!-- TAB CONTAINER 3: Calculator & Reminder -->
                <LinearLayout
                    android:id="@+id/layoutCalculator"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:orientation="vertical"
                    android:layout_marginTop="12dp"
                    android:visibility="gone">

                    <!-- Calculator Card -->
                    <LinearLayout
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:background="@drawable/card_white_background"
                        android:orientation="vertical"
                        android:padding="16dp">

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="Payment Date Calculator (Manual +30 Days)"
                            android:textColor="#111827"
                            android:textSize="15sp"
                            android:textStyle="bold" />

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:layout_marginTop="2dp"
                            android:text="Select last payday seen on official site. We add 30 days estimate."
                            android:textColor="#6B7280"
                            android:textSize="11sp" />

                        <Button
                            android:id="@+id/btnPickLastPayday"
                            android:layout_width="match_parent"
                            android:layout_height="44dp"
                            android:layout_marginTop="10dp"
                            android:backgroundTint="#F3F4F6"
                            android:text="Select Last Payday"
                            android:textColor="#1F2937"
                            android:textSize="12sp"
                            android:textStyle="bold"
                            style="@style/Widget.MaterialComponents.Button.UnelevatedButton"
                            app:cornerRadius="8dp" />

                        <TextView
                            android:id="@+id/tvCalculatorResult"
                            android:layout_width="match_parent"
                            android:layout_height="wrap_content"
                            android:layout_marginTop="10dp"
                            android:background="#E8F5E9"
                            android:padding="12dp"
                            android:textColor="#0B5C1A"
                            android:textSize="12sp"
                            android:textStyle="bold"
                            android:visibility="gone" />
                    </LinearLayout>

                    <!-- Daily Reminder Card -->
                    <LinearLayout
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:layout_marginTop="12dp"
                        android:background="@drawable/card_white_background"
                        android:orientation="vertical"
                        android:padding="16dp">

                        <LinearLayout
                            android:layout_width="match_parent"
                            android:layout_height="wrap_content"
                            android:orientation="horizontal"
                            android:gravity="center_vertical">

                            <LinearLayout
                                android:layout_width="0dp"
                                android:layout_height="wrap_content"
                                android:layout_weight="1"
                                android:orientation="vertical">
                                <TextView
                                    android:layout_width="wrap_content"
                                    android:layout_height="wrap_content"
                                    android:text="Daily Check Reminder"
                                    android:textColor="#111827"
                                    android:textSize="14sp"
                                    android:textStyle="bold" />
                                <TextView
                                    android:layout_width="wrap_content"
                                    android:layout_height="wrap_content"
                                    android:text="WorkManager notification scheduler"
                                    android:textColor="#6B7280"
                                    android:textSize="11sp" />
                            </LinearLayout>

                            <Switch
                                android:id="@+id/switchReminder"
                                android:layout_width="wrap_content"
                                android:layout_height="wrap_content" />
                        </LinearLayout>

                    </LinearLayout>
                </LinearLayout>

                <!-- Mandatory Footer Notice -->
                <TextView
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="18dp"
                    android:layout_marginBottom="16dp"
                    android:gravity="center"
                    android:text="Ads support this free guide. We do not store ID numbers."
                    android:textColor="#6B7280"
                    android:textSize="11sp" />

            </LinearLayout>
        </LinearLayout>
    </ScrollView>

    <!-- Bottom Navigation Bar (No border gap) -->
    <com.google.android.material.bottomnavigation.BottomNavigationView
        android:id="@+id/bottomNavigationView"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:background="#FFFFFF"
        app:itemIconTint="#0B5C1A"
        app:itemTextColor="#0B5C1A"
        app:menu="@menu/bottom_nav_menu"
        app:layout_constraintBottom_toBottomOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>`
  },
  {
    path: 'app/src/main/res/drawable/input_border.xml',
    name: 'input_border.xml',
    language: 'xml',
    description: 'Rounded border background for EditText and Spinner.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#F9FAFB" />
    <stroke android:width="1dp" android:color="#D1D5DB" />
    <corners android:radius="8dp" />
</shape>`
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    name: 'colors.xml',
    language: 'xml',
    description: 'Colors defining primary #0B5C1A.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primaryColor">#0B5C1A</color>
    <color name="primaryDark">#084213</color>
    <color name="primaryLight">#157A27</color>
    <color name="yellowDisclaimerBg">#FEF3C7</color>
    <color name="yellowDisclaimerBorder">#FCD34D</color>
    <color name="white">#FFFFFFFF</color>
</resources>`
  }
];
