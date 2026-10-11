import React, { useState } from 'react';
import {
  ListTodo,
  History,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Layers,
} from 'lucide-react';
import type { LibretoProject } from '../../types/libreto';

interface TasksAndMemoryModuleProps {
  project: LibretoProject;
  onChange: (updated: Partial<LibretoProject>) => void;
}

export const TasksAndMemoryModule: React.FC<TasksAndMemoryModuleProps> = ({ project, onChange }) => {
  const { tasks, memory } = project;
  const [activeTab, setActiveTab] = useState<'tasks' | 'memory'>('tasks');
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState(0);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [newCompletedInput, setNewCompletedInput] = useState('');
  const [newInProgressInput, setNewInProgressInput] = useState('');
  const [newBlockerInput, setNewBlockerInput] = useState('');

  const handleUpdateTasks = (phases: typeof tasks.phases) => {
    onChange({ tasks: { phases } });
  };

  const handleUpdateMemory = (fields: Partial<typeof memory>) => {
    onChange({ memory: { ...memory, ...fields } });
  };

  const handleAddTaskToPhase = (phaseIdx: number) => {
    if (!newTaskInput.trim()) return;
    const currentPhases = [...tasks.phases];
    currentPhases[phaseIdx] = {
      ...currentPhases[phaseIdx],
      tasks: [...currentPhases[phaseIdx].tasks, newTaskInput.trim()],
    };
    handleUpdateTasks(currentPhases);
    setNewTaskInput('');
  };

  const handleRemoveTaskFromPhase = (phaseIdx: number, taskIdx: number) => {
    const currentPhases = [...tasks.phases];
    const newTaskList = [...currentPhases[phaseIdx].tasks];
    newTaskList.splice(taskIdx, 1);
    currentPhases[phaseIdx] = {
      ...currentPhases[phaseIdx],
      tasks: newTaskList,
    };
    handleUpdateTasks(currentPhases);
  };

  const handleAddCompletedMilestone = () => {
    if (!newCompletedInput.trim()) return;
    handleUpdateMemory({
      completedMilestones: [...memory.completedMilestones, newCompletedInput.trim()],
    });
    setNewCompletedInput('');
  };

  const handleRemoveCompletedMilestone = (idx: number) => {
    const next = [...memory.completedMilestones];
    next.splice(idx, 1);
    handleUpdateMemory({ completedMilestones: next });
  };

  const handleAddInProgressMilestone = () => {
    if (!newInProgressInput.trim()) return;
    handleUpdateMemory({
      inProgressMilestones: [...memory.inProgressMilestones, newInProgressInput.trim()],
    });
    setNewInProgressInput('');
  };

  const handleRemoveInProgressMilestone = (idx: number) => {
    const next = [...memory.inProgressMilestones];
    next.splice(idx, 1);
    handleUpdateMemory({ inProgressMilestones: next });
  };

  const handleAddBlocker = () => {
    if (!newBlockerInput.trim()) return;
    handleUpdateMemory({
      blockers: [...memory.blockers, newBlockerInput.trim()],
    });
    setNewBlockerInput('');
  };

  const handleRemoveBlocker = (idx: number) => {
    const next = [...memory.blockers];
    next.splice(idx, 1);
    handleUpdateMemory({ blockers: next });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              TASKS.md & MEMORY.md
            </span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Hoja de Ruta de Ejecución & Bitácora de Memoria
            </h2>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Organiza las fases de implementación secuencial y mantiene la bitácora de progreso vivo para sesiones sucesivas de IA.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5 text-blue-500" />
            TASKS.md
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'memory'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-purple-500" />
            MEMORY.md
          </button>
        </div>
      </div>

      {activeTab === 'tasks' ? (
        /* SECTION: TASKS.md */
        <div className="space-y-6">
          {/* Phase selector tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {tasks.phases.map((phase, idx) => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhaseIdx(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedPhaseIdx === idx
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{phase.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    selectedPhaseIdx === idx
                      ? 'bg-white/20 text-white'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {phase.tasks.length}
                </span>
              </button>
            ))}
          </div>

          {/* Active Phase Tasks list */}
          {tasks.phases[selectedPhaseIdx] && (
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  Tareas de la {tasks.phases[selectedPhaseIdx].name}
                </h3>
              </div>

              {/* Add task to current phase */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTaskToPhase(selectedPhaseIdx)}
                  className="flex-1 text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Añadir tarea a esta fase (Presiona Enter)..."
                />
                <button
                  onClick={() => handleAddTaskToPhase(selectedPhaseIdx)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Añadir
                </button>
              </div>

              {/* Tasks list */}
              <div className="space-y-2">
                {tasks.phases[selectedPhaseIdx].tasks.map((taskText, tIdx) => (
                  <div
                    key={tIdx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <span className="text-zinc-800 dark:text-zinc-200">{taskText}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveTaskFromPhase(selectedPhaseIdx, tIdx)}
                      className="opacity-40 group-hover:opacity-100 hover:text-red-500 text-zinc-400 p-1 transition-all"
                      title="Eliminar tarea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* SECTION: MEMORY.md */
        <div className="space-y-6">
          {/* Current State & Active Sprint */}
          <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              Estado Actual y Sprint Activo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Sprint o Hito Activo
                </label>
                <input
                  type="text"
                  value={memory.activeSprintOrMilestone}
                  onChange={(e) => handleUpdateMemory({ activeSprintOrMilestone: e.target.value })}
                  className="w-full text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                  placeholder="Ej. Sprint 1: Setup inicial y modelado"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Descripción del Estado del Proyecto
                </label>
                <textarea
                  rows={2}
                  value={memory.currentState}
                  onChange={(e) => handleUpdateMemory({ currentState: e.target.value })}
                  className="w-full text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                  placeholder="Describe en qué estado se encuentra la base de código..."
                />
              </div>
            </div>
          </div>

          {/* Completed & In Progress Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Completed */}
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Hitos Completados ({memory.completedMilestones.length})
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCompletedInput}
                  onChange={(e) => setNewCompletedInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCompletedMilestone()}
                  className="flex-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  placeholder="Añadir hito completado..."
                />
                <button
                  onClick={handleAddCompletedMilestone}
                  className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {memory.completedMilestones.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs group"
                  >
                    <span className="text-zinc-700 dark:text-zinc-300 truncate">✅ {item}</span>
                    <button
                      onClick={() => handleRemoveCompletedMilestone(idx)}
                      className="opacity-40 group-hover:opacity-100 hover:text-red-500 text-zinc-400 p-0.5 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Hitos en Progreso ({memory.inProgressMilestones.length})
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInProgressInput}
                  onChange={(e) => setNewInProgressInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddInProgressMilestone()}
                  className="flex-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  placeholder="Añadir hito en progreso..."
                />
                <button
                  onClick={handleAddInProgressMilestone}
                  className="px-2.5 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {memory.inProgressMilestones.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs group"
                  >
                    <span className="text-zinc-700 dark:text-zinc-300 truncate">⏳ {item}</span>
                    <button
                      onClick={() => handleRemoveInProgressMilestone(idx)}
                      className="opacity-40 group-hover:opacity-100 hover:text-red-500 text-zinc-400 p-0.5 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Blockers & Technical Debt */}
          <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Bloqueos Activos & Deuda Técnica ({memory.blockers.length})
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newBlockerInput}
                onChange={(e) => setNewBlockerInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddBlocker()}
                className="flex-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                placeholder="Añadir bloqueo detectado..."
              />
              <button
                onClick={handleAddBlocker}
                className="px-3.5 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {memory.blockers.map((blocker, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs group"
                >
                  <span className="text-red-600 dark:text-red-400 font-medium">⚠️ {blocker}</span>
                  <button
                    onClick={() => handleRemoveBlocker(idx)}
                    className="opacity-40 group-hover:opacity-100 hover:text-red-500 text-zinc-400 p-0.5 ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
