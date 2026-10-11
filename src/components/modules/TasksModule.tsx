import React, { useState } from 'react';
import {
  ListTodo,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Layers,
  ArrowUp,
  ArrowDown,
  Search,
  Eye,
  CheckCircle2,
  MoveRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Zap,
} from 'lucide-react';
import type { LibretoProject, TaskPhase } from '../../types/libreto';
import { generateSuggestedTasks, isStaticProject } from '../../utils/taskGenerator';

interface TasksModuleProps {
  project: LibretoProject;
  onChange: (updated: Partial<LibretoProject>) => void;
}

export const TasksModule: React.FC<TasksModuleProps> = ({ project, onChange }) => {
  const { tasks, architecture, design } = project;

  // Selected phase index
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState(0);

  // View modes: 'single-phase' or 'all-roadmap'
  const [viewMode, setViewMode] = useState<'single-phase' | 'all-roadmap'>('single-phase');

  // Input for adding new task
  const [newTaskInput, setNewTaskInput] = useState('');

  // Search filter for tasks
  const [searchQuery, setSearchQuery] = useState('');

  // Notification / toast feedback for tasks regeneration
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Editing state for task: { phaseIdx: number, taskIdx: number, text: string } | null
  const [editingTask, setEditingTask] = useState<{
    phaseIdx: number;
    taskIdx: number;
    text: string;
  } | null>(null);

  // Editing phase name state
  const [editingPhaseIdx, setEditingPhaseIdx] = useState<number | null>(null);
  const [editingPhaseName, setEditingPhaseName] = useState('');

  // Adding new phase state
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState('');

  const isStatic = isStaticProject(project);

  const showFeedback = (msg: string) => {
    setSyncFeedback(msg);
    setTimeout(() => setSyncFeedback(null), 3500);
  };

  // Helper to commit changes to tasks
  const handleUpdateTasks = (updatedTasks: Partial<typeof tasks>) => {
    onChange({
      tasks: {
        ...tasks,
        ...updatedTasks,
      },
    });
  };

  // Helper to commit changes to phases while marking manual customization
  const handleUpdatePhases = (newPhases: TaskPhase[], markCustom = true) => {
    onChange({
      tasks: {
        ...tasks,
        phases: newPhases,
        ...(markCustom ? { customEdited: true } : {}),
      },
    });
  };

  // Regenerate tasks dynamically from current architecture and design
  const handleRegenerateFromStack = () => {
    const generatedPhases = generateSuggestedTasks(project);
    handleUpdateTasks({
      phases: generatedPhases,
      customEdited: false,
    });
    showFeedback('¡Tareas sincronizadas y adaptadas exitosamente a tu arquitectura y diseño actual!');
  };

  // Toggle auto-sync behavior
  const handleToggleAutoSync = () => {
    const nextVal = tasks.autoSync === false;
    handleUpdateTasks({
      autoSync: nextVal,
      ...(nextVal ? { customEdited: false } : {}),
    });
    showFeedback(
      nextVal
        ? 'Sincronización automática activada. Las tareas se actualizarán al cambiar arquitectura o diseño.'
        : 'Sincronización automática desactivada. Tus tareas manuales están protegidas.'
    );
  };

  // Add a task to a specific phase
  const handleAddTask = (phaseIdx: number) => {
    if (!newTaskInput.trim()) return;
    const currentPhases = [...tasks.phases];
    if (!currentPhases[phaseIdx]) return;

    currentPhases[phaseIdx] = {
      ...currentPhases[phaseIdx],
      tasks: [...currentPhases[phaseIdx].tasks, newTaskInput.trim()],
    };
    handleUpdatePhases(currentPhases);
    setNewTaskInput('');
  };

  // Start editing a task
  const handleStartEditTask = (phaseIdx: number, taskIdx: number, currentText: string) => {
    setEditingTask({ phaseIdx, taskIdx, text: currentText });
  };

  // Save edited task
  const handleSaveEditTask = () => {
    if (!editingTask || !editingTask.text.trim()) {
      setEditingTask(null);
      return;
    }
    const { phaseIdx, taskIdx, text } = editingTask;
    const currentPhases = [...tasks.phases];
    if (currentPhases[phaseIdx] && currentPhases[phaseIdx].tasks[taskIdx] !== undefined) {
      const updatedTasks = [...currentPhases[phaseIdx].tasks];
      updatedTasks[taskIdx] = text.trim();
      currentPhases[phaseIdx] = {
        ...currentPhases[phaseIdx],
        tasks: updatedTasks,
      };
      handleUpdatePhases(currentPhases);
    }
    setEditingTask(null);
  };

  // Cancel edit task
  const handleCancelEditTask = () => {
    setEditingTask(null);
  };

  // Delete task
  const handleRemoveTask = (phaseIdx: number, taskIdx: number) => {
    const currentPhases = [...tasks.phases];
    if (!currentPhases[phaseIdx]) return;
    const updatedTasks = [...currentPhases[phaseIdx].tasks];
    updatedTasks.splice(taskIdx, 1);
    currentPhases[phaseIdx] = {
      ...currentPhases[phaseIdx],
      tasks: updatedTasks,
    };
    handleUpdatePhases(currentPhases);

    // If currently editing this task, cancel edit
    if (editingTask && editingTask.phaseIdx === phaseIdx && editingTask.taskIdx === taskIdx) {
      setEditingTask(null);
    }
  };

  // Move task up/down within same phase
  const handleMoveTaskOrder = (phaseIdx: number, taskIdx: number, direction: 'up' | 'down') => {
    const currentPhases = [...tasks.phases];
    const targetTasks = [...currentPhases[phaseIdx].tasks];
    const newIdx = direction === 'up' ? taskIdx - 1 : taskIdx + 1;
    if (newIdx < 0 || newIdx >= targetTasks.length) return;

    const [movedItem] = targetTasks.splice(taskIdx, 1);
    targetTasks.splice(newIdx, 0, movedItem);

    currentPhases[phaseIdx] = {
      ...currentPhases[phaseIdx],
      tasks: targetTasks,
    };
    handleUpdatePhases(currentPhases);
  };

  // Move task to a different phase
  const handleMoveTaskToPhase = (fromPhaseIdx: number, taskIdx: number, toPhaseIdx: number) => {
    if (fromPhaseIdx === toPhaseIdx) return;
    const currentPhases = [...tasks.phases];
    const sourceTasks = [...currentPhases[fromPhaseIdx].tasks];
    const [movedItem] = sourceTasks.splice(taskIdx, 1);

    currentPhases[fromPhaseIdx] = {
      ...currentPhases[fromPhaseIdx],
      tasks: sourceTasks,
    };

    currentPhases[toPhaseIdx] = {
      ...currentPhases[toPhaseIdx],
      tasks: [...currentPhases[toPhaseIdx].tasks, movedItem],
    };

    handleUpdatePhases(currentPhases);
  };

  // Edit phase name
  const handleStartEditPhase = (phaseIdx: number) => {
    setEditingPhaseIdx(phaseIdx);
    setEditingPhaseName(tasks.phases[phaseIdx]?.name || '');
  };

  const handleSaveEditPhase = () => {
    if (editingPhaseIdx === null || !editingPhaseName.trim()) {
      setEditingPhaseIdx(null);
      return;
    }
    const currentPhases = [...tasks.phases];
    currentPhases[editingPhaseIdx] = {
      ...currentPhases[editingPhaseIdx],
      name: editingPhaseName.trim(),
    };
    handleUpdatePhases(currentPhases);
    setEditingPhaseIdx(null);
  };

  // Add new phase
  const handleAddNewPhase = () => {
    if (!newPhaseName.trim()) return;
    const newPhase: TaskPhase = {
      id: `phase-${Date.now()}`,
      name: newPhaseName.trim(),
      tasks: [],
    };
    const updated = [...tasks.phases, newPhase];
    handleUpdatePhases(updated);
    setNewPhaseName('');
    setIsAddingPhase(false);
    setSelectedPhaseIdx(updated.length - 1);
  };

  // Remove a phase
  const handleRemovePhase = (phaseIdx: number) => {
    if (tasks.phases.length <= 1) return; // Keep at least one phase
    const currentPhases = tasks.phases.filter((_, idx) => idx !== phaseIdx);
    handleUpdatePhases(currentPhases);
    setSelectedPhaseIdx(Math.max(0, phaseIdx - 1));
  };

  // Navigation handlers for next/previous phase button
  const handleNextPhase = () => {
    if (selectedPhaseIdx < tasks.phases.length - 1) {
      setSelectedPhaseIdx((prev) => prev + 1);
    }
  };

  const handlePrevPhase = () => {
    if (selectedPhaseIdx > 0) {
      setSelectedPhaseIdx((prev) => prev - 1);
    }
  };

  // Total tasks calculation
  const totalTasksCount = tasks.phases.reduce((acc, p) => acc + p.tasks.length, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header */}
      <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
              <ListTodo className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25">
                  TASKS.md
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                  Paso 7 de 8
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Planificación y Hoja de Ruta de Tareas
              </h2>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Visualiza y edita las tareas secuenciales que la Inteligencia Artificial debe ejecutar fase por fase durante el desarrollo.
            </p>
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs shrink-0 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>{tasks.phases.length} Fases</span>
              </div>
              <span className="text-zinc-400">•</span>
              <div className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{totalTasksCount} Tareas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Feedback Notification Toast if triggered */}
      {syncFeedback && (
        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-between gap-2 transition-all animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setSyncFeedback(null)}
            className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-200 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Smart Stack Dynamic Synchronization Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3.5 shadow-xs">
        {/* Top Header & Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide leading-tight">
                Sincronización con Stack Tecnológico
              </h4>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                {tasks.customEdited ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Modo Personalizado (Ediciones manuales activas)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Check className="w-3 h-3" />
                    Sincronizado con Arquitectura & Diseño
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: Auto-sync toggle & Regenerate button (stacked vertically) */}
          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto items-stretch sm:items-end">
            <button
              type="button"
              onClick={handleToggleAutoSync}
              className={`w-full sm:w-auto px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                tasks.autoSync !== false && !tasks.customEdited
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
              }`}
              title="Alternar sincronización automática cuando cambies opciones en Arquitectura o Diseño"
            >
              <Zap className={`w-3.5 h-3.5 shrink-0 ${tasks.autoSync !== false && !tasks.customEdited ? 'text-emerald-500' : 'text-zinc-400'}`} />
              <span className="whitespace-nowrap">
                {tasks.autoSync !== false && !tasks.customEdited ? 'Auto-sincronizar: Activo' : 'Auto-sincronizar: Pausado'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleRegenerateFromStack}
              className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Regenerar tareas sugeridas a partir del frontend, backend, base de datos y diseño seleccionados"
            >
              <RefreshCw className="w-3.5 h-3.5 shrink-0 text-blue-200" />
              <span className="whitespace-nowrap">Sincronizar con Stack Actual</span>
            </button>
          </div>
        </div>

        {/* Bottom Detected Stack Chips Row */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs shrink-0">
            Stack activo:
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-medium text-xs text-zinc-900 dark:text-zinc-100 shadow-2xs">
            {architecture?.frontendFramework || 'Frontend'}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-medium text-xs text-zinc-900 dark:text-zinc-100 shadow-2xs flex items-center gap-1">
            {isStatic ? <Zap className="w-3 h-3 text-amber-500" /> : null}
            <span>{isStatic ? 'Jamstack (Sin BD)' : architecture?.backendFramework || 'Backend'}</span>
          </span>
          {!isStatic && architecture?.database && (
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-medium text-xs text-zinc-900 dark:text-zinc-100 shadow-2xs">
              {architecture.database}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-medium text-xs text-cyan-600 dark:text-cyan-400 shadow-2xs">
            Estilo: {design?.style || 'minimalist'}
          </span>
        </div>
      </div>

      {/* 4. View Mode & Search Bar Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Switch View: Por Fase vs Roadmap Completo */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 self-start">
          <button
            type="button"
            onClick={() => setViewMode('single-phase')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'single-phase'
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Por Fase</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('all-roadmap')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'all-roadmap'
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Roadmap Completo</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tarea..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 5. Phase selection tabs (Shown in 'single-phase' mode) */}
      {viewMode === 'single-phase' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tasks.phases.map((phase, idx) => {
            const isSelected = selectedPhaseIdx === idx;
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => setSelectedPhaseIdx(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{phase.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {phase.tasks.length}
                </span>
              </button>
            );
          })}

          {/* Add New Phase Button */}
          {!isAddingPhase ? (
            <button
              type="button"
              onClick={() => setIsAddingPhase(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Fase</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-300 dark:border-zinc-700">
              <input
                type="text"
                autoFocus
                value={newPhaseName}
                onChange={(e) => setNewPhaseName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddNewPhase();
                  if (e.key === 'Escape') setIsAddingPhase(false);
                }}
                placeholder="Nombre de fase..."
                className="text-xs px-2 py-1 bg-white dark:bg-zinc-950 rounded-lg outline-none text-zinc-900 dark:text-zinc-100 w-36"
              />
              <button
                type="button"
                onClick={handleAddNewPhase}
                className="p-1 text-emerald-600 hover:bg-emerald-500/10 rounded-lg cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsAddingPhase(false)}
                className="p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 6. Main Container: Single Phase View or All Roadmap View */}
      {viewMode === 'single-phase' ? (
        /* SINGLE PHASE VIEW */
        tasks.phases[selectedPhaseIdx] && (
          <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            {/* Phase Title Bar & Quick Edit */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
              {editingPhaseIdx === selectedPhaseIdx ? (
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <input
                    type="text"
                    autoFocus
                    value={editingPhaseName}
                    onChange={(e) => setEditingPhaseName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEditPhase();
                      if (e.key === 'Escape') setEditingPhaseIdx(null);
                    }}
                    className="flex-1 text-sm font-bold bg-white dark:bg-zinc-950 border border-blue-500 rounded-xl px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSaveEditPhase}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-500/10 rounded-lg cursor-pointer"
                    title="Guardar nombre"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPhaseIdx(null)}
                    className="p-1.5 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
                      {selectedPhaseIdx + 1}
                    </span>
                    <span>{tasks.phases[selectedPhaseIdx].name}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleStartEditPhase(selectedPhaseIdx)}
                    className="p-1 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors cursor-pointer"
                    title="Editar nombre de esta fase"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Delete phase button (if more than 1 phase exists) */}
              {tasks.phases.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePhase(selectedPhaseIdx)}
                  className="text-xs text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-500/10 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Eliminar esta fase completa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Eliminar Fase</span>
                </button>
              )}
            </div>

            {/* Input to add a new task to this phase (Espacio libre para editar y añadir) */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask(selectedPhaseIdx)}
                className="flex-1 text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                placeholder={`Añadir tarea a ${tasks.phases[selectedPhaseIdx].name}... (Presiona Enter)`}
              />
              <button
                type="button"
                onClick={() => handleAddTask(selectedPhaseIdx)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-blue-500/20 active:scale-98 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir</span>
              </button>
            </div>

            {/* List of Tasks in this phase */}
            <div className="space-y-2 pt-1">
              {tasks.phases[selectedPhaseIdx].tasks
                .filter((t) => !searchQuery || t.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((taskText) => {
                  const actualTaskIdx = tasks.phases[selectedPhaseIdx].tasks.indexOf(taskText);
                  const isEditing =
                    editingTask &&
                    editingTask.phaseIdx === selectedPhaseIdx &&
                    editingTask.taskIdx === actualTaskIdx;

                  return (
                    <div
                      key={actualTaskIdx}
                      className={`group p-3 rounded-xl border transition-all ${
                        isEditing
                          ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500 ring-2 ring-blue-500/20'
                          : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs'
                      }`}
                    >
                      {isEditing ? (
                        /* INLINE EDIT FORM */
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            autoFocus
                            value={editingTask.text}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, text: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditTask();
                              if (e.key === 'Escape') handleCancelEditTask();
                            }}
                            className="flex-1 text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-blue-500 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleSaveEditTask}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Guardar cambios (Enter)"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Guardar</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditTask}
                            className="px-2.5 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            title="Cancelar (Escape)"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        /* DISPLAY MODE */
                        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            {/* Sequence Badge / Dot */}
                            <span className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {actualTaskIdx + 1}
                            </span>
                            <span className="text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed break-words">
                              {taskText}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-40 group-hover:opacity-100 transition-opacity">
                            {/* Move Up */}
                            <button
                              type="button"
                              disabled={actualTaskIdx === 0}
                              onClick={() =>
                                handleMoveTaskOrder(selectedPhaseIdx, actualTaskIdx, 'up')
                              }
                              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 rounded-md transition-colors cursor-pointer"
                              title="Subir prioridad"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>

                            {/* Move Down */}
                            <button
                              type="button"
                              disabled={
                                actualTaskIdx === tasks.phases[selectedPhaseIdx].tasks.length - 1
                              }
                              onClick={() =>
                                handleMoveTaskOrder(selectedPhaseIdx, actualTaskIdx, 'down')
                              }
                              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 rounded-md transition-colors cursor-pointer"
                              title="Bajar prioridad"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() =>
                                handleStartEditTask(selectedPhaseIdx, actualTaskIdx, taskText)
                              }
                              className="p-1.5 text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors cursor-pointer"
                              title="Editar tarea"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {/* Move to another phase dropdown */}
                            {tasks.phases.length > 1 && (
                              <div className="relative group/menu">
                                <select
                                  aria-label="Mover tarea a otra fase"
                                  value=""
                                  onChange={(e) => {
                                    if (e.target.value !== '') {
                                      handleMoveTaskToPhase(
                                        selectedPhaseIdx,
                                        actualTaskIdx,
                                        parseInt(e.target.value, 10)
                                      );
                                    }
                                  }}
                                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                  title="Mover a otra fase"
                                >
                                  <option value="" disabled>
                                    Mover a...
                                  </option>
                                  {tasks.phases.map((p, pIdx) =>
                                    pIdx !== selectedPhaseIdx ? (
                                      <option key={p.id} value={pIdx}>
                                        {p.name}
                                      </option>
                                    ) : null
                                  )}
                                </select>
                                <div className="p-1.5 text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10 rounded-md cursor-pointer pointer-events-none">
                                  <MoveRight className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            )}

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveTask(selectedPhaseIdx, actualTaskIdx)}
                              className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                              title="Eliminar tarea"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

              {tasks.phases[selectedPhaseIdx].tasks.length === 0 && (
                <div className="text-center py-8 text-zinc-400 text-xs border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                  No hay tareas registradas en esta fase. ¡Agrega la primera tarea arriba!
                </div>
              )}
            </div>

            {/* 7. BOTÓN INFERIOR PARA PASAR A LA SIGUIENTE FASE (Sin cambiar entre Por Fase y Roadmap) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 mt-6 border-t border-zinc-200 dark:border-zinc-800">
              {/* Botón Fase Anterior */}
              <button
                type="button"
                disabled={selectedPhaseIdx === 0}
                onClick={handlePrevPhase}
                className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Fase Anterior</span>
              </button>

              {/* Indicador de progreso entre fases */}
              <div className="flex items-center justify-center gap-1.5">
                {tasks.phases.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPhaseIdx(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === selectedPhaseIdx
                        ? 'w-6 bg-blue-600 dark:bg-blue-500'
                        : 'w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400'
                    }`}
                    title={`Ir a ${p.name}`}
                  />
                ))}
                <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 ml-1.5">
                  Fase {selectedPhaseIdx + 1} de {tasks.phases.length}
                </span>
              </div>

              {/* Botón Siguiente Fase */}
              {selectedPhaseIdx < tasks.phases.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextPhase}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <span className="truncate max-w-[200px]">
                    Siguiente: {tasks.phases[selectedPhaseIdx + 1]?.name}
                  </span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setViewMode('all-roadmap')}
                  className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-750 text-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 border border-zinc-700 shadow-xs transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Ver Roadmap Completo</span>
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        /* ALL ROADMAP VIEW - VER TODAS LAS FASES COMPLETAS */
        <div className="space-y-6">
          {tasks.phases.map((phase, pIdx) => {
            const filteredTasks = phase.tasks.filter(
              (t) => !searchQuery || t.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return (
              <div
                key={phase.id}
                className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3"
              >
                {/* Phase Title */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-500 text-white font-mono text-[10px] flex items-center justify-center">
                      {pIdx + 1}
                    </span>
                    <span>{phase.name}</span>
                    <span className="text-xs font-normal text-zinc-400 font-mono">
                      ({phase.tasks.length} tareas)
                    </span>
                  </h3>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPhaseIdx(pIdx);
                      setViewMode('single-phase');
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Editar esta fase</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tasks List */}
                <div className="space-y-2">
                  {filteredTasks.map((taskText) => {
                    const actualTaskIdx = phase.tasks.indexOf(taskText);
                    const isEditing =
                      editingTask &&
                      editingTask.phaseIdx === pIdx &&
                      editingTask.taskIdx === actualTaskIdx;

                    return (
                      <div
                        key={actualTaskIdx}
                        className={`group p-3 rounded-xl border transition-all ${
                          isEditing
                            ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500'
                            : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs'
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              autoFocus
                              value={editingTask.text}
                              onChange={(e) =>
                                setEditingTask({ ...editingTask, text: e.target.value })
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEditTask();
                                if (e.key === 'Escape') handleCancelEditTask();
                              }}
                              className="flex-1 text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-blue-500 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleSaveEditTask}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Guardar</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEditTask}
                              className="px-2.5 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                              <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                                {taskText}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-40 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleStartEditTask(pIdx, actualTaskIdx, taskText)}
                                className="p-1.5 text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors cursor-pointer"
                                title="Editar tarea"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveTask(pIdx, actualTaskIdx)}
                                className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                                title="Eliminar tarea"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {filteredTasks.length === 0 && (
                    <div className="text-xs text-zinc-400 italic py-2">
                      Sin tareas registradas en esta fase.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
