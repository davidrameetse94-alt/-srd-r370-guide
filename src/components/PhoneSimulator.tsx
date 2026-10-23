import React, { useState, useEffect, useRef } from 'react';
import { 
  ExternalLink, 
  RotateCcw, 
  X, 
  AlertTriangle, 
  HeartHandshake, 
  Trash2, 
  PlusCircle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sparkles, 
  Bell, 
  Calculator, 
  Compass, 
  FileEdit, 
  Download,
  Info
} from 'lucide-react';
import { ADMOB_CONFIG } from '../data/androidFiles';
import { downloadAndroidStudioZip } from '../utils/zipExport';

interface StatusNote {
  id: string;
  month: string;
  status: 'Approved' | 'Paid' | 'Pending' | 'Declined';
  savedAt: string;
}

const MONTHS_LIST: string[] = [];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
for (let year = 2024; year <= 2026; year++) {
  for (const m of MONTH_NAMES) {
    MONTHS_LIST.push(`${m} ${year}`);
  }
}

// Reusable AdMob Unit component with safe push to adsbygoogle
function AdMobUnit({ 
  slot, 
  label = 'Ads support this free guide', 
  isNative = false,
  className = ''
}: { 
  slot: string; 
  label?: string; 
  isNative?: boolean;
  className?: string;
}) {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch {
      // Handled gracefully when ad-blocker or iframe restriction active
    }
  }, []);

  const slotClean = slot.includes('/') ? slot.split('/')[1] : slot;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="text-[10px] text-slate-500 font-semibold mb-1 text-center tracking-wide">
          {label}
        </div>
      )}
      <div className={`w-full bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 text-center shadow-2xs flex flex-col items-center justify-center ${isNative ? 'min-h-[85px]' : 'min-h-[55px]'}`}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: isNative ? '65px' : '50px' }}
          data-ad-client="ca-app-pub-2538513652201921"
          data-ad-slot={slotClean}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <div className="flex items-center justify-center gap-1.5 mt-1 text-[9.5px] text-slate-400 font-mono">
          <span className="bg-amber-100 text-amber-900 text-[8.5px] font-bold px-1.5 py-0.5 rounded">
            {isNative ? 'Ad - supports free guide' : 'Ad'}
          </span>
          <span>Google AdMob • {slot}</span>
        </div>
      </div>
    </div>
  );
}

interface PhoneSimulatorProps {
  onDownloadZip?: () => void;
}

export function PhoneSimulator({ onDownloadZip }: PhoneSimulatorProps = {}) {
  // Navigation: 0 = Check Today, 1 = My Notes, 2 = Calculator, 3 = Support Us
  const [activeTab, setActiveTab] = useState<number>(0);

  // Input Fields: NEVER STORED IN LOCALSTORAGE OR DATABASE
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Personal Notes (Manual tracking only)
  const [selectedMonth, setSelectedMonth] = useState<string>('Oct 2026');
  const [selectedStatus, setSelectedStatus] = useState<'Approved' | 'Paid' | 'Pending' | 'Declined'>('Approved');
  const [notes, setNotes] = useState<StatusNote[]>([
    { id: '1', month: 'Aug 2026', status: 'Paid', savedAt: '2026-08-28' },
    { id: '2', month: 'Sep 2026', status: 'Paid', savedAt: '2026-09-29' },
    { id: '3', month: 'Oct 2026', status: 'Approved', savedAt: '2026-10-18' },
    { id: '4', month: 'Nov 2026', status: 'Pending', savedAt: '2026-10-23' },
  ]);

  // Payment Date Calculator (+30 Days manual calculation)
  const [lastPayDateInput, setLastPayDateInput] = useState<string>('2026-10-25');
  const [calculatedEstimate, setCalculatedEstimate] = useState<string>('24 November 2026');

  // Daily Reminder (WorkManager)
  const [isReminderEnabled, setIsReminderEnabled] = useState<boolean>(false);
  const [showReminderDialog, setShowReminderDialog] = useState<boolean>(false);

  // AdMob State
  const [showAppOpenAd, setShowAppOpenAd] = useState<boolean>(false);
  const [appOpenCountdown, setAppOpenCountdown] = useState<number>(3);
  const [showInterstitialAd, setShowInterstitialAd] = useState<boolean>(false);
  const [interstitialCountdown, setInterstitialCountdown] = useState<number>(3);
  const [checkClickCount, setCheckClickCount] = useState<number>(0);
  const [showLeaveDisclaimerDialog, setShowLeaveDisclaimerDialog] = useState<boolean>(false);
  const [showSupportAdDialog, setShowSupportAdDialog] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AppOpen Ad on start: show after 2 sec non-blocking, close button allowed
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAppOpenAd(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // AppOpen countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showAppOpenAd && appOpenCountdown > 0) {
      interval = setInterval(() => setAppOpenCountdown((p) => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showAppOpenAd, appOpenCountdown]);

  // Interstitial countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showInterstitialAd && interstitialCountdown > 0) {
      interval = setInterval(() => setInterstitialCountdown((p) => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showInterstitialAd, interstitialCountdown]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTriggerDownload = () => {
    if (onDownloadZip) {
      onDownloadZip();
    } else {
      downloadAndroidStudioZip();
    }
  };

  // Payment Date Calculator: Adds 30 days estimate
  const handleCalculateDate = (dateVal: string) => {
    setLastPayDateInput(dateVal);
    if (!dateVal) {
      setCalculatedEstimate('');
      return;
    }
    try {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        d.setDate(d.getDate() + 30);
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        setCalculatedEstimate(d.toLocaleDateString('en-GB', options));
      }
    } catch {}
  };

  // OPEN OFFICIAL SASSA CHECK Click Handler
  const handleOpenCheckButtonClick = () => {
    // Copy ID helper to clipboard if provided
    if (idNumber.trim()) {
      try {
        navigator.clipboard.writeText(idNumber.trim());
        showToast('ID copied to clipboard helper. Cleared from app memory.');
      } catch {}
    }

    // IMMEDIATELY CLEAR INPUTS: ZERO STORAGE
    setIdNumber('');
    setPhoneNumber('');

    const newClickCount = checkClickCount + 1;
    setCheckClickCount(newClickCount);

    // Interstitial: max 1 per 3 clicks
    if (newClickCount % 3 === 0) {
      setInterstitialCountdown(3);
      setShowInterstitialAd(true);
    } else {
      setShowLeaveDisclaimerDialog(true);
    }
  };

  const handleProceedToOfficialSite = () => {
    setShowLeaveDisclaimerDialog(false);
    setShowInterstitialAd(false);
    try {
      window.open(ADMOB_CONFIG.officialUrl, '_blank', 'noopener,noreferrer');
    } catch {}
  };

  // Toggle Daily Reminder
  const handleToggleReminder = () => {
    if (!isReminderEnabled) {
      setShowReminderDialog(true);
    } else {
      setIsReminderEnabled(false);
      showToast('Daily check reminders turned off.');
    }
  };

  const handleConfirmReminder = () => {
    setShowReminderDialog(false);
    setIsReminderEnabled(true);
    showToast('✓ Daily Reminder scheduled via WorkManager (09:00 AM daily)');
  };

  // Save Manual Status Note
  const handleSaveNote = () => {
    const existingIndex = notes.findIndex((n) => n.month === selectedMonth);
    const newNote: StatusNote = {
      id: Date.now().toString(),
      month: selectedMonth,
      status: selectedStatus,
      savedAt: new Date().toISOString().split('T')[0]
    };

    if (existingIndex >= 0) {
      const updated = [...notes];
      updated[existingIndex] = newNote;
      setNotes(updated);
      showToast(`Updated note: ${selectedMonth} -> ${selectedStatus}`);
    } else {
      setNotes([newNote, ...notes]);
      showToast(`Saved note: ${selectedMonth} -> ${selectedStatus}`);
    }
  };

  const handleDeleteNote = (id: string, month: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    showToast(`Removed note for ${month}`);
  };

  const getStatusBadge = (status: StatusNote['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-[#0A4D1F] border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        );
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
            <CheckCircle2 className="w-3 h-3 text-teal-600" />
            Paid
          </span>
        );
      case 'Declined':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3 h-3 text-red-600" />
            Declined
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="w-[100vw] max-w-[100vw] min-h-screen bg-white flex flex-col p-0 m-0 overflow-x-hidden text-slate-900 select-none relative">
      
      {/* Scrollable Container with padding for bottom nav & banner ad */}
      <div className="flex-1 w-full pb-36 overflow-y-auto no-scrollbar">

        {/* 1. Header #0A4D1F width: 100% */}
        <header className="w-full bg-[#0A4D1F] text-white px-4 sm:px-6 py-4 shadow-sm">
          <div className="w-full flex items-center justify-between mb-2 flex-wrap gap-2">
            
            {/* Compliance Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#063515] px-2.5 py-1 rounded-md text-[10.5px] font-bold text-emerald-200 tracking-wide border border-emerald-600/40">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{ADMOB_CONFIG.complianceBadge}</span>
            </div>

            {/* Action Badges */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerDownload}
                className="inline-flex items-center gap-1 bg-[#12682C] hover:bg-[#167d35] active:scale-95 text-white text-[10.5px] font-bold px-2.5 py-1 rounded-md border border-emerald-400/40 transition shadow-xs"
                title="Download complete Android Studio Kotlin project ZIP"
              >
                <Download className="w-3 h-3" />
                <span>Download ZIP</span>
              </button>

              <span className="text-[10.5px] bg-[#12682C] text-white font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/40 font-mono">
                v1.2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-1.5">
            <img
              src={ADMOB_CONFIG.logoUrl}
              alt="SRD Status Guide Logo"
              className="w-12 h-12 rounded-xl object-cover shadow-md border border-emerald-400/50 shrink-0 bg-[#063515]"
            />
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                SRD R370 Status Guide <span className="text-sm font-normal text-emerald-200">(Unofficial)</span>
              </h1>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Retention Helper &amp; Offline Notes
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Area: Width 100% edge-to-edge */}
        <div className="w-full p-4 sm:p-6 space-y-4">
          
          {/* 2. Yellow IMPORTANT NOTICE width: 100% */}
          <div className="w-full bg-[#FEF3C7] border-2 border-[#FCD34D] rounded-2xl p-4 text-slate-800 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h2 className="text-[11px] font-black text-[#92400E] uppercase tracking-wider">
                  IMPORTANT NOTICE
                </h2>
                <p className="text-xs font-bold text-[#78350F] leading-snug">
                  {ADMOB_CONFIG.disclaimerText}
                </p>
                <p className="text-[10.5px] text-[#92400E]">
                  We do not store ID numbers. Official verification happens on srd.sassa.gov.za.
                </p>
              </div>
            </div>
          </div>

          {/* TAB 0: CHECK TODAY */}
          {activeTab === 0 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* 3. White Card Official Portal Check width: 100% with 16px padding */}
              <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Official Portal Check
                  </h3>
                  <span className="text-[10.5px] bg-emerald-50 text-[#0A4D1F] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    srd.sassa.gov.za/scid/
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Opens srd.sassa.gov.za/scid/ in external browser tab
                </p>

                {/* ID Input */}
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      South African ID Number (Optional helper)
                    </label>
                    <input
                      type="number"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value.slice(0, 13))}
                      placeholder="e.g. 9408155234087"
                      className="w-full h-11 px-3 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0A4D1F] text-slate-900 font-mono tracking-wider placeholder:font-sans placeholder:tracking-normal"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Used only to open official site, not stored
                    </span>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Cellular Phone Number (Optional helper)
                    </label>
                    <input
                      type="number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.slice(0, 12))}
                      placeholder="e.g. 082 123 4567"
                      className="w-full h-11 px-3 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0A4D1F] text-slate-900 font-mono tracking-wider placeholder:font-sans placeholder:tracking-normal"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Used only to open official site, not stored
                    </span>
                  </div>
                </div>

                {/* Button: OPEN OFFICIAL SASSA CHECK #0A4D1F */}
                <button
                  type="button"
                  onClick={handleOpenCheckButtonClick}
                  className="w-full h-12 bg-[#0A4D1F] hover:bg-[#073615] active:scale-[0.99] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>OPEN OFFICIAL SASSA CHECK</span>
                </button>
              </div>

              {/* 4. Light Green Card: Never Miss a Status Update */}
              <div className="w-full bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0A4D1F] text-white flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      Never Miss a Status Update
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Daily check reminders via WorkManager
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowReminderDialog(true)}
                  className="px-3.5 py-2 bg-[#0A4D1F] hover:bg-[#073615] text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Set Reminder
                </button>
              </div>

            </div>
          )}

          {/* TAB 1: MY NOTES (with Native Ad after every 3 notes) */}
          {activeTab === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    My Status History - Personal Notes
                  </h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
                    Manual Tracking
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  <strong>Your manual notes.</strong> (Not from SASSA). Stored in local storage.
                </p>

                {/* Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Select Month
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0A4D1F]"
                    >
                      {MONTHS_LIST.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Select Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as any)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0A4D1F]"
                    >
                      <option value="Approved">Approved</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="w-full h-11 bg-[#0A4D1F] hover:bg-[#073615] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>SAVE TO MY NOTES</span>
                </button>
              </div>

              {/* Notes List with Native Ad after every 3 notes */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                  <span>Saved Notes ({notes.length})</span>
                  <span className="text-[10px] text-slate-400 font-normal">Stored locally</span>
                </div>

                {notes.map((note, index) => (
                  <React.Fragment key={note.id}>
                    <div className="w-full bg-white rounded-xl p-3 sm:p-4 shadow-xs border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 font-mono">{note.month}</div>
                        <div className="mt-1">{getStatusBadge(note.status)}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id, note.month)}
                        className="p-2 text-slate-400 hover:text-red-600 transition"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Native Ad after every 3 notes */}
                    {(index + 1) % 3 === 0 && (
                      <AdMobUnit
                        slot="ca-app-pub-2538513652201921/6746022504"
                        label="Ads support this free guide"
                        isNative={true}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CALCULATOR */}
          {activeTab === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0A4D1F] flex items-center justify-center font-bold">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Payment Date Calculator
                    </h3>
                    <p className="text-[11px] text-slate-500">Manual +30 days estimate text</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  Type the last payday you saw on the official SASSA site. This calculates an approximate regular 30-day interval projection.
                </p>

                <div className="mb-3">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Last Verified Payment Date
                  </label>
                  <input
                    type="date"
                    value={lastPayDateInput}
                    onChange={(e) => handleCalculateDate(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#0A4D1F]"
                  />
                </div>

                {calculatedEstimate && (
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3.5 text-center mb-2">
                    <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                      Next Cycle Projection
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-[#0A4D1F] mt-1">
                      Estimated next: ~{calculatedEstimate} (check official site to confirm)
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      *Estimate based on regular 30-day interval. Check srd.sassa.gov.za to confirm.
                    </div>
                  </div>
                )}
              </div>

              {/* WorkManager Daily Reminder Card */}
              <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0A4D1F] flex items-center justify-center font-bold">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">Daily Check Reminder</div>
                      <div className="text-[10px] text-slate-500">Android WorkManager Scheduler</div>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleReminder}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      isReminderEnabled ? 'bg-[#0A4D1F]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        isReminderEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  &ldquo;Remind me to check SASSA site tomorrow?&rdquo;
                  <br />
                  <span className="text-[11px] text-slate-500">
                    Schedules an offline notification every 24 hours directing you to srd.sassa.gov.za/scid/.
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: SUPPORT US */}
          {activeTab === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="w-full bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-center">
                <img
                  src={ADMOB_CONFIG.logoUrl}
                  alt="SRD Status Guide Logo"
                  className="w-16 h-16 mx-auto rounded-2xl object-cover mb-3 shadow-md border-2 border-emerald-400/50 bg-[#063515]"
                />
                <h3 className="text-base font-bold text-slate-900">
                  Support This Free Guide
                </h3>
                <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed max-w-md mx-auto">
                  Watching a short sponsored ad helps us keep this educational tool 100% free. You can continue free anytime.
                </p>

                <button
                  type="button"
                  onClick={() => setShowSupportAdDialog(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#0A4D1F] hover:bg-[#073615] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
                >
                  Watch Support Ad (Opt-in)
                </button>
              </div>
            </div>
          )}

          {/* 5. Banner Ad at bottom above nav: slot ca-app-pub-2538513652201921/6746022504 */}
          <div className="w-full pt-2">
            <AdMobUnit
              slot="ca-app-pub-2538513652201921/6746022504"
              label="Ads support this free guide"
              className="w-full"
            />
          </div>

          {/* Small Footer Notice */}
          <div className="text-center pt-1 pb-2">
            <p className="text-[11px] text-slate-500 font-medium">
              Ads support this free guide. We do not store ID numbers.
            </p>
          </div>

        </div>
      </div>

      {/* 6. Bottom Nav: fixed bottom 0 width 100vw */}
      <nav className="fixed bottom-0 left-0 right-0 w-[100vw] h-14 bg-white border-t border-slate-200 flex items-center justify-around z-40 shadow-lg">
        <button
          onClick={() => setActiveTab(0)}
          className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition ${
            activeTab === 0 ? 'text-[#0A4D1F] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[10px]">Check Today</span>
        </button>

        <button
          onClick={() => setActiveTab(1)}
          className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition ${
            activeTab === 1 ? 'text-[#0A4D1F] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileEdit className="w-4 h-4" />
          <span className="text-[10px]">My Notes</span>
        </button>

        <button
          onClick={() => setActiveTab(2)}
          className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition ${
            activeTab === 2 ? 'text-[#0A4D1F] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span className="text-[10px]">Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab(3)}
          className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition ${
            activeTab === 3 ? 'text-[#0A4D1F] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span className="text-[10px]">Support Us</span>
        </button>
      </nav>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 left-4 right-4 max-w-md mx-auto bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl z-50 text-center animate-in fade-in slide-in-from-bottom duration-150">
          {toastMessage}
        </div>
      )}

      {/* 7. App Open Ad on start (slot ca-app-pub-2538513652201921/3873969774) */}
      {showAppOpenAd && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 text-white flex flex-col justify-between p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-amber-400 text-black font-extrabold px-1.5 py-0.5 rounded">
                Ad
              </span>
              <span className="text-[10.5px] text-slate-400 font-mono">
                ca-app-pub-2538513652201921/3873969774
              </span>
            </div>
            <button
              onClick={() => setShowAppOpenAd(false)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-medium transition"
            >
              {appOpenCountdown > 0 ? `Skip in ${appOpenCountdown}s` : 'Close ✕'}
            </button>
          </div>

          <div className="my-auto text-center px-4 max-w-sm mx-auto">
            <div className="text-xs text-amber-300 font-semibold mb-3">
              Ads support this free guide
            </div>
            <img
              src={ADMOB_CONFIG.logoUrl}
              alt="SRD Status Guide Logo"
              className="w-20 h-20 mx-auto rounded-2xl object-cover mb-3 shadow-xl border-2 border-emerald-400/50 bg-[#063515]"
            />
            <div className="inline-block px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full mb-2">
              App Open Ad
            </div>
            <h3 className="text-lg font-bold text-white">
              SRD R370 Status Guide
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Fast, transparent &amp; compliant helper. Zero ID storage.
            </p>
            <button
              onClick={() => setShowAppOpenAd(false)}
              className="mt-6 px-6 py-2.5 bg-[#0A4D1F] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-lg"
            >
              Enter Helper Guide
            </button>
          </div>

          <div className="text-center text-[10.5px] text-slate-500 border-t border-slate-900 pt-3">
            <span>Google AdMob Web SDK • Slot 3873969774</span>
          </div>
        </div>
      )}

      {/* 8. Interstitial Ad Dialog / Overlay: slot ca-app-pub-2538513652201921/6746022504 (max 1 per 3 clicks) */}
      {showInterstitialAd && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 text-white flex flex-col justify-between p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-amber-400 text-black font-extrabold px-1.5 py-0.5 rounded">
                Ad
              </span>
              <span className="text-[10.5px] text-slate-400 font-mono">
                ca-app-pub-2538513652201921/6746022504
              </span>
            </div>
            <button
              onClick={handleProceedToOfficialSite}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-medium transition"
            >
              {interstitialCountdown > 0 ? `Continue in ${interstitialCountdown}s` : 'Skip to Portal ✕'}
            </button>
          </div>

          <div className="my-auto text-center px-4 max-w-sm mx-auto">
            <div className="text-xs text-amber-300 font-semibold mb-3">
              Ads support this free guide
            </div>
            <img
              src={ADMOB_CONFIG.logoUrl}
              alt="SRD Status Guide Logo"
              className="w-16 h-16 mx-auto rounded-2xl object-cover mb-3 shadow-xl border-2 border-emerald-400/50 bg-[#063515]"
            />
            <h3 className="text-base font-bold text-white">
              Opening Official Government Portal
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Sponsored interstitial ad. Your inputs have been cleared from this app for privacy.
            </p>
            <button
              onClick={handleProceedToOfficialSite}
              className="mt-6 w-full py-3 bg-[#0A4D1F] hover:bg-emerald-700 text-white text-xs font-bold uppercase rounded-xl transition shadow-lg"
            >
              Continue to srd.sassa.gov.za
            </button>
          </div>

          <div className="text-center text-[10.5px] text-slate-500 border-t border-slate-900 pt-3">
            <span>Google AdMob Web SDK • Interstitial Unit</span>
          </div>
        </div>
      )}

      {/* 9. Departure Disclaimer Dialog */}
      {showLeaveDisclaimerDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in zoom-in-95 duration-150">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-[#92400E] mb-2 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-[#B45309]" />
              <span>Leaving Helper Application</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              You will leave this helper app and go to official South African Government Portal (<strong>srd.sassa.gov.za</strong>) for real OTP verification. This app does not collect IDs.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLeaveDisclaimerDialog(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProceedToOfficialSite}
                className="px-4 py-2 bg-[#0A4D1F] hover:bg-[#073615] text-white text-xs font-bold rounded-lg transition shadow-xs"
              >
                Proceed to Official Site
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Reminder Permission Dialog */}
      {showReminderDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in zoom-in-95 duration-150">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 mb-2 font-bold text-sm">
              <Bell className="w-4 h-4 text-[#0A4D1F]" />
              <span>Daily Check Reminder</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              &ldquo;Remind me to check SASSA site tomorrow?&rdquo;
              <br />
              <span className="text-[11px] text-slate-500">
                This triggers a local Android WorkManager reminder once daily (at 09:00 AM) directing you to srd.sassa.gov.za/scid/.
              </span>
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReminderDialog(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReminder}
                className="px-4 py-2 bg-[#0A4D1F] hover:bg-[#073615] text-white text-xs font-bold rounded-lg transition shadow-xs"
              >
                Enable Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Support Us Dialog */}
      {showSupportAdDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in zoom-in-95 duration-150">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 text-center">
            <img
              src={ADMOB_CONFIG.logoUrl}
              alt="SRD Status Guide Logo"
              className="w-14 h-14 mx-auto rounded-xl object-cover mb-2 shadow-md border border-emerald-400/40 bg-[#063515]"
            />

            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Support Free Guide?
            </h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Support this free guide? Watch ad.
              <br />
              <span className="text-[10.5px] text-slate-400">
                You can continue free anytime without watching.
              </span>
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowSupportAdDialog(false);
                  setShowInterstitialAd(true);
                }}
                className="w-full py-2.5 bg-[#0A4D1F] hover:bg-[#073615] text-white text-xs font-bold uppercase rounded-xl transition shadow-xs"
              >
                Support Us (Watch Ad)
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSupportAdDialog(false);
                  showToast('Thank you for using our free guide!');
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Continue Free
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
