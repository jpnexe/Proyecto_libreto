import React, { useState } from 'react';
import {
  History,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
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
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              MEMORY.md
            </span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <History className="w-5 h-5 text-purple-500" />
              Bitácora Viva de Estado & Memoria
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Mantiene la memoria persistente del proyecto entre sesiones de IA: sprint activo, hitos completados, tareas en progreso y bloqueos detectados.
          </p>
        </div>
      </div>

      {/* Current State & Active Sprint */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-500" />
          Estado Actual y Sprint Activo
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Sprint o Hito Activo
            </label>
            <input
              type="text"
              value={memory.activeSprintOrMilestone}
              onChange={(e) => handleUpdateMemory({ activeSprintOrMilestone: e.target.value })}
              className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ej. Fase 1: Setup inicial, repositorio y modelos base"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Descripción del Estado del Proyecto
            </label>
            <textarea
              rows={3}
              value={memory.currentState}
              onChange={(e) => handleUpdateMemory({ currentState: e.target.value })}
              className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Describe en qué estado se encuentra la base de código para que la IA retome el contexto inmediatamente..."
            />
          </div>
        </div>
      </div>

      {/* Completed & In Progress Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed Milestones */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Hitos Completados
            </span>
            <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              {memory.completedMilestones.length}
            </span>
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newCompletedInput}
              onChange={(e) => setNewCompletedInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCompletedMilestone()}
              className="flex-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Añadir hito completado..."
            />
            <button
              type="button"
              onClick={handleAddCompletedMilestone}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {memory.completedMilestones.map((item, idx) => (
              <div
                key={idx}
                className="group p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs"
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
                      className="flex-1 text-xs bg-white dark:bg-zinc-900 border border-emerald-500 rounded-lg px-2 py-1 outline-none text-zinc-900 dark:text-zinc-100"
                    />
                    <button
                      type="button"
                      onClick={handleSaveEditCompleted}
                      className="p-1 text-emerald-600 hover:bg-emerald-500/10 rounded-md"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCompleted(null)}
                      className="p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-700 dark:text-zinc-300 truncate font-medium">
                      ✅ {item}
                    </span>
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingCompleted({ idx, text: item })}
                        className="p-1 text-zinc-400 hover:text-emerald-600 rounded-md"
                        title="Editar hito"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveCompletedMilestone(idx)}
                        className="p-1 text-zinc-400 hover:text-red-500 rounded-md"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3 h-3" />
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
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Hitos en Progreso
            </span>
            <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
              {memory.inProgressMilestones.length}
            </span>
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newInProgressInput}
              onChange={(e) => setNewInProgressInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddInProgressMilestone()}
              className="flex-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Añadir hito activo en curso..."
            />
            <button
              type="button"
              onClick={handleAddInProgressMilestone}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {memory.inProgressMilestones.map((item, idx) => (
              <div
                key={idx}
                className="group p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs"
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
                      className="flex-1 text-xs bg-white dark:bg-zinc-900 border border-amber-500 rounded-lg px-2 py-1 outline-none text-zinc-900 dark:text-zinc-100"
                    />
                    <button
                      type="button"
                      onClick={handleSaveEditInProgress}
                      className="p-1 text-amber-600 hover:bg-amber-500/10 rounded-md"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingInProgress(null)}
                      className="p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-700 dark:text-zinc-300 truncate font-medium">
                      ⏳ {item}
                    </span>
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingInProgress({ idx, text: item })}
                        className="p-1 text-zinc-400 hover:text-amber-600 rounded-md"
                        title="Editar hito"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveInProgressMilestone(idx)}
                        className="p-1 text-zinc-400 hover:text-red-500 rounded-md"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3 h-3" />
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

      {/* Blockers & Technical Debt */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Bloqueos Activos & Deuda Técnica
          </span>
          <span className="text-xs font-mono font-bold bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
            {memory.blockers.length}
          </span>
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={newBlockerInput}
            onChange={(e) => setNewBlockerInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddBlocker()}
            className="flex-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Añadir bloqueo técnico detectado..."
          />
          <button
            type="button"
            onClick={handleAddBlocker}
            className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {memory.blockers.map((blocker, idx) => (
            <div
              key={idx}
              className="group p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs"
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
                    className="flex-1 text-xs bg-white dark:bg-zinc-900 border border-red-500 rounded-lg px-2 py-1 outline-none text-zinc-900 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={handleSaveEditBlocker}
                    className="p-1 text-red-600 hover:bg-red-500/10 rounded-md"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBlocker(null)}
                    className="p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    ⚠️ {blocker}
                  </span>
                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingBlocker({ idx, text: blocker })}
                      className="p-1 text-zinc-400 hover:text-red-600 rounded-md"
                      title="Editar bloqueo"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlocker(idx)}
                      className="p-1 text-zinc-400 hover:text-red-500 rounded-md"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {memory.blockers.length === 0 && (
            <div className="text-zinc-400 text-xs italic py-1">
              No hay bloqueos activos reportados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
