import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { PROJECT_PRESETS } from '../constants/presets';
import type { ProjectPreset } from '../constants/presets';

interface PresetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: ProjectPreset) => void;
}

export const PresetSelectorModal: React.FC<PresetSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Plantillas y Presets de Arquitectura
              </h3>
              <p className="text-xs text-zinc-500">
                Acelera la configuración inicial con esquemas completos probados por la industria.
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

        {/* Presets Grid */}
        <div className="grid grid-cols-1 gap-3.5">
          {PROJECT_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="group cursor-pointer p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-500/5 dark:hover:bg-cyan-950/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {preset.title}
                  </h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${preset.badgeColor}`}>
                    {preset.tag}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  {preset.description}
                </p>

                {/* Tech preview pills */}
                <div className="flex items-center gap-2 pt-1 text-[10px] text-zinc-400 font-mono">
                  <span>{preset.data.architecture.frontendFramework}</span>
                  <span>•</span>
                  <span>{preset.data.architecture.backendFramework}</span>
                  <span>•</span>
                  <span>{preset.data.architecture.database}</span>
                  <span>•</span>
                  <span className="capitalize">{preset.data.design.style}</span>
                </div>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 group-hover:bg-cyan-600 group-hover:text-white shadow-xs transition-all">
                  <span>Cargar Preset</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
