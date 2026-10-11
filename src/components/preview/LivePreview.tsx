import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Copy,
  Check,
  Code,
  Eye,
  Download,
  Files,
  FileText,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { GeneratedFiles, MarkdownFileKey } from '../../types/libreto';
import { saveAs } from 'file-saver';

interface LivePreviewProps {
  files: GeneratedFiles;
  activeFile: MarkdownFileKey;
  onSelectFile: (file: MarkdownFileKey) => void;
  onNavigateToStep?: (step: number) => void;
}

const FILE_ORDER: { key: MarkdownFileKey; label: string; badge: string }[] = [
  { key: 'PRD.md', label: 'PRD & Prompt', badge: 'PRD' },
  { key: 'ARCHITECTURE.md', label: 'Arquitectura', badge: 'ARCH' },
  { key: 'DESIGN.md', label: 'Diseño & UI', badge: 'DESIGN' },
  { key: 'RULES.md', label: 'Reglas IA', badge: 'RULES' },
  { key: 'DECISIONS.md', label: 'ADRs', badge: 'ADR' },
  { key: 'SECURITY.md', label: 'Seguridad', badge: 'SEC' },
  { key: 'TASKS.md', label: 'Tareas', badge: 'TASKS' },
  { key: 'MEMORY.md', label: 'Memoria', badge: 'MEM' },
];

export const LivePreview: React.FC<LivePreviewProps> = ({
  files,
  activeFile,
  onSelectFile,
  onNavigateToStep,
}) => {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Horizontal scroll state for file tabs
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState(false);
  const [canScrollTabsRight, setCanScrollTabsRight] = useState(false);

  const checkTabsScroll = useCallback(() => {
    if (!tabsScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsScrollRef.current;
    setCanScrollTabsLeft(scrollLeft > 4);
    setCanScrollTabsRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkTabsScroll();
    window.addEventListener('resize', checkTabsScroll);
    return () => window.removeEventListener('resize', checkTabsScroll);
  }, [checkTabsScroll]);

  // Auto-scroll to active tab when activeFile changes
  useEffect(() => {
    if (!tabsScrollRef.current) return;
    const activeTab = tabsScrollRef.current.querySelector<HTMLElement>(`[data-file="${activeFile}"]`);
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    const timer = setTimeout(checkTabsScroll, 300);
    return () => clearTimeout(timer);
  }, [activeFile, checkTabsScroll]);

  // Horizontal scroll with mouse wheel
  const handleTabsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!tabsScrollRef.current) return;
    if (e.deltaY !== 0) {
      tabsScrollRef.current.scrollLeft += e.deltaY;
      checkTabsScroll();
    }
  };

  const handleScrollTabsLeft = () => {
    if (tabsScrollRef.current) {
      tabsScrollRef.current.scrollBy({ left: -160, behavior: 'smooth' });
    }
  };

  const handleScrollTabsRight = () => {
    if (tabsScrollRef.current) {
      tabsScrollRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  const currentContent = files[activeFile] || '';
  const linesCount = currentContent.split('\n').length;
  const kbSize = (new Blob([currentContent]).size / 1024).toFixed(1);

  const handleCopyCurrent = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopiedFile(activeFile);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (e) {
      console.error('Error al copiar al portapapeles:', e);
    }
  };

  const handleCopyAll = async () => {
    try {
      const combined = Object.entries(files)
        .map(([name, content]) => `<!-- ==================== ${name} ==================== -->\n\n${content}`)
        .join('\n\n\n');
      await navigator.clipboard.writeText(combined);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (e) {
      console.error('Error al copiar todo:', e);
    }
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([currentContent], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, activeFile);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm transition-colors">
      {/* Top File Selector Tabs with Horizontal Scroll & Arrows */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-2 flex items-center justify-between gap-2">
        {/* Scrollable Tabs Wrapper */}
        <div className="relative flex items-center flex-1 min-w-0">
          {/* Scroll Left Chevron */}
          {canScrollTabsLeft && (
            <div className="absolute left-0 z-10 flex items-center h-full pr-1.5 bg-gradient-to-r from-zinc-50 via-zinc-50/90 to-transparent dark:from-zinc-900 dark:via-zinc-900/90 dark:to-transparent">
              <button
                type="button"
                onClick={handleScrollTabsLeft}
                className="p-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all hover:scale-105 active:scale-95"
                title="Desplazar pestañas a la izquierda"
                aria-label="Desplazar pestañas a la izquierda"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Tabs row with native scroll, mousewheel, visible scrollbar and auto-scroll */}
          <div
            ref={tabsScrollRef}
            onScroll={checkTabsScroll}
            onWheel={handleTabsWheel}
            className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 px-0.5 scroll-smooth w-full"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {FILE_ORDER.map((item) => {
              const isSelected = activeFile === item.key;
              return (
                <button
                  key={item.key}
                  data-file={item.key}
                  onClick={() => onSelectFile(item.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.key}</span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Chevron */}
          {canScrollTabsRight && (
            <div className="absolute right-0 z-10 flex items-center h-full pl-1.5 bg-gradient-to-l from-zinc-50 via-zinc-50/90 to-transparent dark:from-zinc-900 dark:via-zinc-900/90 dark:to-transparent">
              <button
                type="button"
                onClick={handleScrollTabsRight}
                className="p-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all hover:scale-105 active:scale-95"
                title="Desplazar pestañas a la derecha"
                aria-label="Desplazar pestañas a la derecha"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Global Copy All button (pinned on right with subtle divider) */}
        <div className="pl-2 border-l border-zinc-200 dark:border-zinc-800 shrink-0">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0"
            title="Copiar todos los 8 archivos combinados"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-bold">¡Copiado!</span>
              </>
            ) : (
              <>
                <Files className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden sm:inline">Copiar Todo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-header: File Stats & Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-100/50 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800 text-xs">
        {/* Left: Active File Details */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
            {activeFile}
          </span>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-500 text-[11px] font-mono shrink-0">
            {linesCount} líneas
          </span>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-500 text-[11px] font-mono shrink-0">
            {kbSize} KB
          </span>
          {activeFile === 'TASKS.md' && onNavigateToStep && (
            <button
              onClick={() => onNavigateToStep(7)}
              className="ml-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 flex items-center gap-1 transition-colors border border-blue-500/20 shrink-0"
              title="Abrir editor de tareas (Paso 7)"
            >
              <Pencil className="w-3 h-3" />
              <span>Editar tareas</span>
            </button>
          )}
          {activeFile === 'MEMORY.md' && onNavigateToStep && (
            <button
              onClick={() => onNavigateToStep(8)}
              className="ml-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 flex items-center gap-1 transition-colors border border-purple-500/20 shrink-0"
              title="Abrir editor de memoria (Paso 8)"
            >
              <Pencil className="w-3 h-3" />
              <span>Editar bitácora</span>
            </button>
          )}
        </div>

        {/* Right: Switch Mode & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Formatted vs Raw Switch */}
          <div className="flex items-center bg-zinc-200/60 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-300/60 dark:border-zinc-700">
            <button
              onClick={() => setViewMode('formatted')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                viewMode === 'formatted'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3 h-3" />
              Formato
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                viewMode === 'raw'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Code className="w-3 h-3" />
              Raw
            </button>
          </div>

          {/* Download Single File */}
          <button
            onClick={handleDownloadSingle}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title={`Descargar ${activeFile}`}
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Copy Single File Button */}
          <button
            onClick={handleCopyCurrent}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              copiedFile === activeFile
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-500/20'
            }`}
          >
            {copiedFile === activeFile ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-sm">
        {viewMode === 'formatted' ? (
          <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans prose-headings:font-bold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:bg-cyan-500/5 prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:rounded-r-lg prose-code:font-mono prose-code:text-xs prose-code:bg-zinc-100 dark:prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-900 dark:prose-pre:bg-black prose-pre:p-3 prose-pre:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {currentContent}
            </ReactMarkdown>
          </div>
        ) : (
          <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-words leading-relaxed select-all">
            {currentContent}
          </pre>
        )}
      </div>
    </div>
  );
};
