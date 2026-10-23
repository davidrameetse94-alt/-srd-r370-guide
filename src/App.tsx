import React, { useState } from 'react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeViewer } from './components/CodeViewer';
import { downloadAndroidStudioZip } from './utils/zipExport';

export default function App() {
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloadingZip(true);
      await downloadAndroidStudioZip();
    } catch (err) {
      console.error('Failed to download project zip:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="w-[100vw] max-w-[100vw] min-h-screen bg-white flex flex-col p-0 m-0 overflow-x-hidden select-none">
      
      {/* Code Workspace hidden with display: none per specification */}
      <div style={{ display: 'none' }} aria-hidden="true" className="hidden">
        <CodeViewer onDownloadZip={handleDownload} isDownloadingZip={isDownloadingZip} />
      </div>

      {/* 
        Full Screen Screen Fit (100vw):
        SRD R370 Status Guide (Unofficial) v1.2.0
        - Header #0A4D1F width: 100%
        - Yellow notice #FEF3C7 width: 100%
        - White card Official Portal Check width: 100% with 16px padding
        - AdMob ads (Banner, App Open, Interstitial, Native)
        - Bottom nav fixed bottom 0 width 100vw
      */}
      <main className="w-[100vw] max-w-[100vw] min-h-screen p-0 m-0 flex flex-col bg-white overflow-x-hidden">
        <PhoneSimulator onDownloadZip={handleDownload} />
      </main>

    </div>
  );
}
