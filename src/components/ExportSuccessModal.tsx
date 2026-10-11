import React, { useState } from 'react';
import {
  CheckCircle2,
  FolderCheck,
  FileArchive,
  X,
  Copy,
  Check,
  Bot,
} from 'lucide-react';
import type { ExportResult } from '../utils/fileExporter';

interface ExportSuccessModalProps {
  result: ExportResult | null;
  onClose: () => void;
}

const FILES_LIST = [
  'PRD.md',
  'ARCHITECTURE.md',
  'DESIGN.md',
  'RULES.md',
  'DECISIONS.md',
  'SECURITY.md',
  'TASKS.md',
  'MEMORY.md',
];

export const ExportSuccessModal: React.FC<ExportSuccessModalProps> = ({ result, onClose }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!result) return null;

  const quickAiPrompt = `Hola. He configurado el libreto maestro de arquitectura y directivas para este proyecto en la carpeta "${result.folderName}".
Por favor lee minuciosamente los siguientes 8 archivos antes de generar código:
- PRD.md
- ARCHITECTURE.md
- DESIGN.md
- RULES.md (Cumpliendo estrictamente la Regla de Oro de aprobación previa)
- DECISIONS.md
- SECURITY.md
- TASKS.md
- MEMORY.md

Por favor confirma que has leído y entendido el libreto, y presenta los pasos para iniciar la Fase 1 de TASKS.md sin modificar código aún.`;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(quickAiPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
              {result.type === 'directory' ? (
                <FolderCheck className="w-7 h-7" />
              ) : (
                <FileArchive className="w-7 h-7" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  ¡Libreto Exportado con Éxito!
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  8 Archivos .MD
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {result.message}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8 Files Grid */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
            Archivos Generados en {result.folderName}:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FILES_LIST.map((fileName) => (
              <div
                key={fileName}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate text-zinc-800 dark:text-zinc-200">{fileName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prompt ready to inject into AI */}
        <div className="bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/30 p-4 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan-500" />
              Prompt de Activación para inyectar en tu IA:
            </span>
            <button
              onClick={handleCopyPrompt}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                copiedPrompt
                  ? 'bg-emerald-500 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs'
              }`}
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? '¡Copiado!' : 'Copiar Prompt'}</span>
            </button>
          </div>

          <pre className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 bg-white/60 dark:bg-zinc-900/80 p-3 rounded-xl border border-cyan-500/20 whitespace-pre-wrap leading-relaxed select-all">
            {quickAiPrompt}
          </pre>
        </div>

        {/* Close CTA */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Entendido, Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
