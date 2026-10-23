import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  ShieldCheck, 
  LayoutTemplate, 
  Layers, 
  Smartphone,
  ExternalLink,
  Sparkles,
  Lock
} from 'lucide-react';
import { ADMOB_CONFIG } from '../data/androidFiles';

export function AdMobInspector() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const adUnits = [
    {
      key: 'appId',
      title: 'Google AdMob App ID',
      unitId: ADMOB_CONFIG.appId,
      format: 'App Metadata Configuration',
      placement: 'AndroidManifest.xml (<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" />)',
      trigger: 'Application initialization in SrdGuideApp.kt & MainActivity.kt',
      icon: <Layers className="w-5 h-5 text-blue-400" />,
      badge: 'Test App ID'
    },
    {
      key: 'appOpenId',
      title: 'App Open Ad Unit',
      unitId: ADMOB_CONFIG.appOpenId,
      format: 'Fullscreen AppOpenAd (Google Test ID)',
      placement: 'MainActivity.kt (loadAppOpenAd())',
      trigger: 'OnCreate on app start (Test ID ca-app-pub-39402544/9257395921)',
      icon: <Smartphone className="w-5 h-5 text-indigo-400" />,
      badge: 'On App Start'
    },
    {
      key: 'interstitialId',
      title: 'Opt-In Interstitial Ad Unit',
      unitId: ADMOB_CONFIG.interstitialId,
      format: 'Support Interstitial (Google Test ID)',
      placement: 'dialog_support_ad.xml ("Support Us (Watch Ad)")',
      trigger: 'Only shown if user taps "Support Us (Watch Ad)" (Test ID ca-app-pub-39402544/1033173712)',
      icon: <LayoutTemplate className="w-5 h-5 text-purple-400" />,
      badge: 'Return to App Prompt'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Google AdMob Test IDs &amp; Compliance Configuration
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-bold text-[11px] border border-blue-700/50">
            {ADMOB_CONFIG.complianceBadge}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Configured with Google official test ad unit IDs to guarantee zero invalid traffic or policy violations during verification.
        </p>
      </div>

      {/* Ad Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {adUnits.map((ad) => (
          <div
            key={ad.key}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                  {ad.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60">
                  {ad.badge}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">{ad.title}</h4>
              <p className="text-[11px] text-slate-400 mb-3">{ad.format}</p>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                <div className="text-[10px] text-slate-500 font-medium mb-1">Ad Unit ID:</div>
                <div className="text-xs font-mono text-amber-300 break-all select-all font-semibold">
                  {ad.unitId}
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-400">
                <div>
                  <span className="text-slate-500 font-semibold">Location: </span>
                  <span className="font-mono text-[10px] text-slate-300">{ad.placement}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Trigger: </span>
                  <span className="text-slate-300">{ad.trigger}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(ad.unitId, ad.key)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
            >
              {copiedKey === ad.key ? (
                <>
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-blue-400">Copied ID!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Support Dialog Specification */}
      <div className="bg-blue-950/20 border border-blue-800/40 rounded-2xl p-5">
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          Support Dialog &amp; Transparency Specification
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-blue-300 font-bold block mb-1">Dialog Buttons</span>
            <code>Continue Free</code> &amp; <code>Support Us (Watch Ad)</code> in <code>dialog_support_ad.xml</code>.
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">Compliance Badge</span>
            &ldquo;{ADMOB_CONFIG.complianceBadge}&rdquo; displayed on header and dialogs.
          </div>
        </div>
      </div>

    </div>
  );
}
