import React, { useState } from 'react';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  FileClock,
} from 'lucide-react';
import type { LibretoProject } from '../../types/libreto';

interface MemoryModuleProps {
  project: LibretoProject;
  onChange: (updated: Partial<LibretoProject>) => void;
}

export const MemoryModule: React.FC<MemoryModuleProps> = ({ project, onChange }) => {
  const { memory } = project;

  // New inputs
  const [newCompletedInput, setNewCompletedInput] = useState('');
  const [newInProgressInput, setNewInProgressInput] = useState('');
  const [newBlockerInput, setNewBlockerInput] = useState('');

  // Editing items state
  const [editingCompleted, setEditingCompleted] = useState<{ idx: number; text: string } | null>(null);
  const [editingInProgress, setEditingInProgress] = useState<{ idx: number; text: string } | null>(null);
  const [editingBlocker, setEditingBlocker] = useState<{ idx: number; text: string } | null>(null);

  const handleUpdateMemory = (fields: Partial<typeof memory>) => {
    onChange({ memory: { ...memory, ...fields } });
  };

  // Completed Milestones handlers
  const handleAddCompletedMilestone = () => {
    if (!newCompletedInput.trim()) return;
    handleUpdateMemory({
      completedMilestones: [...memory.completedMilestones, newCompletedInput.trim()],
    });
    setNewCompletedInput('');
  };

  const handleSaveEditCompleted = () => {
    if (!editingCompleted || !editingCompleted.text.trim()) {
      setEditingCompleted(null);
      return;
    }
    const next = [...memory.completedMilestones];
    next[editingCompleted.idx] = editingCompleted.text.trim();
    handleUpdateMemory({ completedMilestones: next });
    setEditingCompleted(null);
  };

  const handleRemoveCompletedMilestone = (idx: number) => {
    const next = [...memory.completedMilestones];
    next.splice(idx, 1);
    handleUpdateMemory({ completedMilestones: next });
  };

  // In Progress Milestones handlers
  const handleAddInProgressMilestone = () => {
    if (!newInProgressInput.trim()) return;
    handleUpdateMemory({
      inProgressMilestones: [...memory.inProgressMilestones, newInProgressInput.trim()],
    });
    setNewInProgressInput('');
  };

  const handleSaveEditInProgress = () => {
    if (!editingInProgress || !editingInProgress.text.trim()) {
      setEditingInProgress(null);
      return;
    }
    const next = [...memory.inProgressMilestones];
    next[editingInProgress.idx] = editingInProgress.text.trim();
    handleUpdateMemory({ inProgressMilestones: next });
    setEditingInProgress(null);
  };

  const handleRemoveInProgressMilestone = (idx: number) => {
    const next = [...memory.inProgressMilestones];
    next.splice(idx, 1);
    handleUpdateMemory({ inProgressMilestones: next });
  };

  // Blocker handlers
  const handleAddBlocker = () => {
    if (!newBlockerInput.trim()) return;
    handleUpdateMemory({
      blockers: [...memory.blockers, newBlockerInput.trim()],
    });
    setNewBlockerInput('');
  };

  const handleSaveEditBlocker = () => {
    if (!editingBlocker || !editingBlocker.text.trim()) {
      setEditingBlocker(null);
      return;
    }
    const next = [...memory.blockers];
    next[editingBlocker.idx] = editingBlocker.text.trim();
    handleUpdateMemory({ blockers: next });
    setEditingBlocker(null);
  };

  const handleRemoveBlocker = (idx: number) => {
    const next = [...memory.blockers];
    next.splice(idx, 1);
    handleUpdateMemory({ blockers: next });
  };

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* 1. Module Header */}
      <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-xs">
              <FileClock className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25">
                  MEMORY.md
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                  Paso 8 de 8
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Bitácora Viva de Estado & Memoria de Sesiones
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Mantiene la memoria persistente del proyecto entre sesiones de IA: sprint activo, hitos completados, tareas en progreso y bloqueos detectados.
          </p>
        </div>
      </div>

      {/* 2. Current State & Active Sprint */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Estado Actual y Sprint Activo
            </h3>
            <p className="text-[11px] text-zinc-500">Punto de anclaje para que la IA retome el contexto sin desviaciones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Sprint o Hito Activo
            </label>
            <input
              type="text"
              value={memory.activeSprintOrMilestone}
              onChange={(e) => handleUpdateMemory({ activeSprintOrMilestone: e.target.value })}
              className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder:text-zinc-400"
              placeholder="Ej. Fase 1: Setup inicial, repositorio y modelos base"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Descripción del Estado del Proyecto
            </label>
            <textarea
              rows={3}
              value={memory.currentState}
              onChange={(e) => handleUpdateMemory({ currentState: e.target.value })}
              className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder:text-zinc-400 leading-relaxed"
              placeholder="Describe en qué estado se encuentra la base de código para que la IA retome el contexto inmediatamente..."
            />
          </div>
        </div>
      </div>

      {/* 3. Completed & In Progress Milestones Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Completed Milestones */}
        <div className="min-w-0 bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                Hitos Completados
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 shrink-0">
              {memory.completedMilestones.length} Completados
            </span>
          </div>

          <div className="flex gap-2 items-center min-w-0">
            <input
              type="text"
              value={newCompletedInput}
              onChange={(e) => setNewCompletedInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCompletedMilestone()}
              className="flex-1 min-w-0 text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder:text-zinc-400"
              placeholder="Añadir hito completado..."
            />
            <button
              type="button"
              onClick={handleAddCompletedMilestone}
              className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 transition-all shadow-xs active:scale-98 cursor-pointer"
              title="Añadir hito completado"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {memory.completedMilestones.map((item, idx) => (
              <div
                key={idx}
                className="group p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                {editingCompleted && editingCompleted.idx === idx ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={editingCompleted.text}
                      onChange={(e) => setEditingCompleted({ idx, text: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEditCompleted();
                        if (e.key === 'Escape') setEditingCompleted(null);
                      }}
                      className="flex-1 text-xs bg-white dark:bg-zinc-900 border border-emerald-500 rounded-lg px-2.5 py-1.5 outline-none text-zinc-900 dark:text-zinc-100"
                    />
                    <button
                      type="button"
                      onClick={handleSaveEditCompleted}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-500/10 rounded-md cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCompleted(null)}
                      className="p-1.5 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed break-words flex-1">
                      ✅ {item}
                    </span>
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 shrink-0 ml-1">
                      <button
                        type="button"
                        onClick={() => setEditingCompleted({ idx, text: item })}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-emerald-600 transition-colors cursor-pointer"
                        title="Editar hito"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveCompletedMilestone(idx)}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {memory.completedMilestones.length === 0 && (
              <div className="text-zinc-400 text-xs italic py-2">
                No hay hitos completados registrados aún.
              </div>
            )}
          </div>
        </div>

        {/* In Progress Milestones */}
        <div className="min-w-0 bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                Hitos en Progreso
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-lg border border-amber-500/20 shrink-0">
              {memory.inProgressMilestones.length} En Curso
            </span>
          </div>

          <div className="flex gap-2 items-center min-w-0">
            <input
              type="text"
              value={newInProgressInput}
              onChange={(e) => setNewInProgressInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddInProgressMilestone()}
              className="flex-1 min-w-0 text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-zinc-400"
              placeholder="Añadir hito activo en curso..."
            />
            <button
              type="button"
              onClick={handleAddInProgressMilestone}
              className="w-10 h-10 bg-amber-600 hover:bg-amber-500 text-white rounded-xl flex items-center justify-center shrink-0 transition-all shadow-xs active:scale-98 cursor-pointer"
              title="Añadir hito en progreso"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {memory.inProgressMilestones.map((item, idx) => (
              <div
                key={idx}
                className="group p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                {editingInProgress && editingInProgress.idx === idx ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={editingInProgress.text}
                      onChange={(e) => setEditingInProgress({ idx, text: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEditInProgress();
                        if (e.key === 'Escape') setEditingInProgress(null);
                      }}
                      className="flex-1 text-xs bg-white dark:bg-zinc-900 border border-amber-500 rounded-lg px-2.5 py-1.5 outline-none text-zinc-900 dark:text-zinc-100"
                    />
                    <button
                      type="button"
                      onClick={handleSaveEditInProgress}
                      className="p-1.5 text-amber-600 hover:bg-amber-500/10 rounded-md"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingInProgress(null)}
                      className="p-1.5 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed break-words flex-1">
                      ⏳ {item}
                    </span>
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 shrink-0 ml-1">
                      <button
                        type="button"
                        onClick={() => setEditingInProgress({ idx, text: item })}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-amber-600 transition-colors"
                        title="Editar hito"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveInProgressMilestone(idx)}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {memory.inProgressMilestones.length === 0 && (
              <div className="text-zinc-400 text-xs italic py-2">
                No hay hitos en progreso registrados.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Blockers & Technical Debt */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Bloqueos Activos & Deuda Técnica
              </h3>
              <p className="text-[11px] text-zinc-500">Riesgos o dependencias bloqueantes reportadas</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg border border-red-500/20">
            {memory.blockers.length} Bloqueos
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="text"
            value={newBlockerInput}
            onChange={(e) => setNewBlockerInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddBlocker()}
            className="flex-1 text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-red-500/30 transition-all placeholder:text-zinc-400"
            placeholder="Añadir bloqueo técnico detectado..."
          />
          <button
            type="button"
            onClick={handleAddBlocker}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 shrink-0"
          >
            <Plus className="w-4 h-4" /> Añadir Bloqueo
          </button>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {memory.blockers.map((blocker, idx) => (
            <div
              key={idx}
              className="group p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              {editingBlocker && editingBlocker.idx === idx ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={editingBlocker.text}
                    onChange={(e) => setEditingBlocker({ idx, text: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEditBlocker();
                      if (e.key === 'Escape') setEditingBlocker(null);
                    }}
                    className="flex-1 text-xs bg-white dark:bg-zinc-900 border border-red-500 rounded-lg px-2.5 py-1.5 outline-none text-zinc-900 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={handleSaveEditBlocker}
                    className="p-1.5 text-red-600 hover:bg-red-500/10 rounded-md"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBlocker(null)}
                    className="p-1.5 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <span className="text-red-600 dark:text-red-400 font-medium leading-relaxed break-words flex-1">
                    ⚠️ {blocker}
                  </span>
                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 shrink-0 ml-1">
                    <button
                      type="button"
                      onClick={() => setEditingBlocker({ idx, text: blocker })}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-red-600 transition-colors"
                      title="Editar bloqueo"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlocker(idx)}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {memory.blockers.length === 0 && (
            <div className="text-zinc-400 text-xs italic py-2">
              No hay bloqueos activos reportados al momento.
            </div>
          )}
        </div>
      </div>

      {/* 5. Observaciones Generales y Notas de Sesión */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Pencil className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Observaciones Generales y Notas de Bitácora (Opcional)
            </h3>
            <p className="text-[11px] text-zinc-500">
              Anota recordatorios para próximas sesiones, configuraciones pendientes o contexto importante para el asistente IA
            </p>
          </div>
        </div>
        <textarea
          rows={3}
          value={memory.customNotes || ''}
          onChange={(e) => handleUpdateMemory({ customNotes: e.target.value })}
          placeholder="Ej. Queda pendiente configurar las credenciales de producción de AWS S3; recordar mantener compatibilidad con los endpoints v1..."
          className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder:text-zinc-400 leading-relaxed"
        />
      </div>
    </div>
  );
};
