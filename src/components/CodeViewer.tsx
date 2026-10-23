import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  FileText, 
  Layers, 
  Settings, 
  Palette, 
  FileCheck2, 
  Search,
  ExternalLink,
  Code
} from 'lucide-react';
import { ANDROID_FILES, ProjectFile, ADMOB_CONFIG } from '../data/androidFiles';

interface CodeViewerProps {
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
}

export function CodeViewer({ onDownloadZip, isDownloadingZip }: CodeViewerProps) {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('app/src/main/java/com/srd/guide/helper/MainActivity.kt');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentFile = ANDROID_FILES.find((f) => f.path === selectedFilePath) || ANDROID_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (file: ProjectFile) => {
    if (file.language === 'kotlin') return <FileCode className="w-4 h-4 text-purple-400" />;
    if (file.language === 'xml') return <FileText className="w-4 h-4 text-amber-400" />;
    if (file.language === 'groovy') return <Layers className="w-4 h-4 text-blue-400" />;
    if (file.language === 'properties') return <Settings className="w-4 h-4 text-slate-400" />;
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  const filteredFiles = ANDROID_FILES.filter((f) => 
    f.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[740px]">
      
      {/* Top Header */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-200">
            Android Studio Project Workspace
          </span>
          <span className="text-[10px] bg-blue-950 text-blue-300 font-mono px-2 py-0.5 rounded border border-blue-800/80">
            package {ADMOB_CONFIG.packageName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
            title="Copy current file contents"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy File</span>
              </>
            )}
          </button>

          <button
            onClick={onDownloadZip}
            disabled={isDownloadingZip}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md transition disabled:opacity-50"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>{isDownloadingZip ? 'Building ZIP...' : 'Download Project (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Body: File Tree Sidebar & Code Pane */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar: File Navigation */}
        <div className="w-full md:w-72 bg-slate-950/50 border-r border-slate-800 flex flex-col shrink-0">
          
          {/* Search Box */}
          <div className="p-2.5 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search project files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Quick AdMob IDs reference snippet */}
          <div className="px-3 py-2 bg-emerald-950/30 border-b border-emerald-900/40 text-[11px] text-emerald-300">
            <div className="font-semibold text-emerald-200 mb-0.5">Configured Ad Units:</div>
            <div className="text-[10px] text-slate-300 font-mono truncate">AppOpen: ...9257395921</div>
            <div className="text-[10px] text-slate-300 font-mono truncate">Inter: ...1033173712</div>
            <div className="text-[10px] text-amber-300 font-mono truncate">Native: ...NATIVE_ID (1/3 max)</div>
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
              Project Structure
            </div>
            {filteredFiles.map((file) => {
              const isSelected = file.path === selectedFilePath;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {getFileIcon(file)}
                  <span className="truncate flex-1">{file.name}</span>
                  {file.name === 'MainActivity.kt' && (
                    <span className="text-[9px] bg-purple-900/60 text-purple-300 px-1 rounded">
                      Core
                    </span>
                  )}
                  {file.name === 'AndroidManifest.xml' && (
                    <span className="text-[9px] bg-amber-900/60 text-amber-300 px-1 rounded">
                      Meta
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-slate-900/70 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Ready for Android Studio</span>
            <span className="text-[10px] font-mono text-blue-400">Kotlin 2.0 / AGP 8.7</span>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950/20">
          
          {/* File path breadcrumb & description */}
          <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono text-blue-400 font-semibold truncate">
                {currentFile.path}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 truncate max-w-md hidden sm:inline">
              {currentFile.description}
            </span>
          </div>

          {/* Raw Code with line numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300 select-text">
            <pre className="relative whitespace-pre font-mono">
              {currentFile.content.split('\n').map((line, idx) => {
                const isAdMobId = 
                  line.includes('ca-app-pub-2538513652201921') ||
                  line.includes('srd.sassa.gov.za');
                const isDisclaimer = line.includes('NOT affiliated with SASSA');
                const isColor = line.includes('#0B57D0');

                return (
                  <div 
                    key={idx} 
                    className={`flex items-start hover:bg-slate-800/40 rounded px-1 ${
                      isAdMobId ? 'bg-amber-950/30 text-amber-200 border-l-2 border-amber-500' : ''
                    } ${isDisclaimer ? 'bg-yellow-950/40 text-yellow-300' : ''} ${
                      isColor ? 'bg-blue-950/40 text-blue-300' : ''
                    }`}
                  >
                    <span className="w-10 select-none text-slate-600 text-right pr-4 shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="flex-1 overflow-x-auto">
                      {line}
                    </span>
                  </div>
                );
              })}
            </pre>
          </div>

          {/* Bottom Bar info */}
          <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span>Encoding: UTF-8</span>
              <span>Lines: {currentFile.content.split('\n').length}</span>
              <span>Type: {currentFile.language.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-400 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              100% Google Play & AdMob Policy Compliant
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
