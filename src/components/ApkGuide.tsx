import React from 'react';
import { 
  Terminal, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  FolderOpen,
  ShieldCheck,
  Lock,
  ExternalLink,
  Bell,
  Calculator,
  LayoutTemplate
} from 'lucide-react';
import { ADMOB_CONFIG } from '../data/androidFiles';

interface ApkGuideProps {
  onDownloadZip: () => void;
}

export function ApkGuide({ onDownloadZip }: ApkGuideProps) {
  return (
    <div className="space-y-6 text-slate-200">
      
      {/* Hero Quick Start Card */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                Retention &amp; Compliance Certified
              </span>
              <span className="text-xs text-slate-400">Theme #065700 • WorkManager • Native Ads</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Build Standalone APK: SRD Guide - R370 Status Helper
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Equipped with <strong>Daily Check Reminders (WorkManager)</strong>, <strong>+30 Days Payment Date Calculator</strong>, <strong>Bottom Bar Navigation</strong>, and <strong>Compliant Native Ads (1/3 max)</strong>.
            </p>
          </div>

          <button
            onClick={onDownloadZip}
            className="shrink-0 flex items-center gap-2 px-5 py-3 bg-[#065700] hover:bg-[#043A00] text-white font-bold text-sm rounded-xl shadow-lg transition active:scale-95 border border-emerald-400/30"
          >
            <Download className="w-4 h-4" />
            <span>Download Project (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* 4 Step Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Step 1 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-800/50">
              1
            </div>
            <h3 className="font-bold text-white text-sm">Download &amp; Open Project</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extract <code className="text-emerald-300">SrdGuideHelper-AndroidStudio.zip</code>. In Android Studio, click <strong className="text-white">File &gt; Open...</strong> and choose the <code className="text-emerald-300">SrdGuideHelper</code> folder.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Open &gt; SrdGuideHelper/</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-800/50">
              2
            </div>
            <h3 className="font-bold text-white text-sm">Gradle Dependencies Sync</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Android Studio will auto-download <code className="text-emerald-300">androidx.work:work-runtime-ktx:2.9.1</code>, <code className="text-emerald-300">play-services-ads:23.6.0</code>, and AndroidX Material.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Gradle sync resolved successfully</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-800/50">
              3
            </div>
            <h3 className="font-bold text-white text-sm">Generate APK in 1 Click</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            From the top menu, go to:
            <br />
            <strong className="text-white">Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>
          </p>
          <p className="text-xs text-slate-400">
            Output APK location:
            <br />
            <code className="text-emerald-300 text-[11px] font-mono">
              app/build/outputs/apk/debug/app-debug.apk
            </code>
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-800/50">
              4
            </div>
            <h3 className="font-bold text-white text-sm">Command Line Build Option</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Build directly from your terminal or command prompt:
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>./gradlew assembleDebug</span>
            </div>
            <div className="text-slate-500 text-[10px]"># For release signing: ./gradlew assembleRelease</div>
          </div>
        </div>

      </div>

      {/* Retention Architecture Highlights */}
      <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>High Retention &amp; Monetization Compliance Breakdown</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <Bell className="w-3.5 h-3.5" />
              <span>Daily Check Reminder</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Uses AndroidX WorkManager to deliver offline daily notifications asking &ldquo;Remind me to check SASSA site tomorrow?&rdquo; without running battery-draining services.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <Calculator className="w-3.5 h-3.5" />
              <span>+30 Days Calculator</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Manual date calculation adding 30 days to user&apos;s last seen payday with the explicit disclaimer &ldquo;check official site to confirm&rdquo;. Zero scraping.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Native Ads (1/3 Max)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              AdMob Native Ad View rendered inside the My Notes list with maximum frequency capping of one native ad per 3 notes to ensure Google policy compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Checklist */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          App Verification Checklist
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Package name: <code className="text-emerald-300">{ADMOB_CONFIG.packageName}</code></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Theme: Deep Green <code className="text-emerald-300">{ADMOB_CONFIG.primaryColor}</code></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Daily Reminder via AndroidX WorkManager</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Payment Date Calculator (+30 days manual)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Bottom Bar: Check Today | Notes | Calc | Support</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Native Ad in Notes (1 per 3 notes max)</span>
          </div>
        </div>
      </div>

    </div>
  );
}
