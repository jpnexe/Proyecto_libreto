import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Sparkles,
  Bot,
  Users,
  Target,
  Layers,
} from 'lucide-react';
import type { LibretoProject, MasterPromptTone } from '../../types/libreto';

interface PrdModuleProps {
  project: LibretoProject;
  onChange: (updated: Partial<LibretoProject>) => void;
}

export const PrdModule: React.FC<PrdModuleProps> = ({ project, onChange }) => {
  const [newFuncReq, setNewFuncReq] = useState('');
  const [newNonFuncReq, setNewNonFuncReq] = useState('');
  const [newUserStory, setNewUserStory] = useState('');

  const tones: { id: MasterPromptTone; label: string; desc: string; icon: string }[] = [
    {
      id: 'strict_senior',
      label: 'Senior Riguroso',
      desc: 'Código limpio, tipado estricto, sin atajos ni tolerancias de deuda.',
      icon: '🛡️',
    },
    {
      id: 'collaborative_expert',
      label: 'Experto Colaborativo',
      desc: 'Explicaciones paso a paso, comunicación proactiva y propuestas didácticas.',
      icon: '🤝',
    },
    {
      id: 'architect_mentor',
      label: 'Arquitecto y Mentor',
      desc: 'Enfocado en escalabilidad a gran escala y justificación de patrones.',
      icon: '🏛️',
    },
    {
      id: 'minimalist_concise',
      label: 'Pragmático y Conciso',
      desc: 'Respuestas directas al código sin charlas ni explicaciones redundantes.',
      icon: '⚡',
    },
  ];

  const handleAddFuncReq = () => {
    if (!newFuncReq.trim()) return;
    onChange({
      prd: {
        ...project.prd,
        functionalRequirements: [...project.prd.functionalRequirements, newFuncReq.trim()],
      },
    });
    setNewFuncReq('');
  };

  const handleRemoveFuncReq = (idx: number) => {
    const next = [...project.prd.functionalRequirements];
    next.splice(idx, 1);
    onChange({ prd: { ...project.prd, functionalRequirements: next } });
  };

  const handleAddNonFuncReq = () => {
    if (!newNonFuncReq.trim()) return;
    onChange({
      prd: {
        ...project.prd,
        nonFunctionalRequirements: [...project.prd.nonFunctionalRequirements, newNonFuncReq.trim()],
      },
    });
    setNewNonFuncReq('');
  };

  const handleRemoveNonFuncReq = (idx: number) => {
    const next = [...project.prd.nonFunctionalRequirements];
    next.splice(idx, 1);
    onChange({ prd: { ...project.prd, nonFunctionalRequirements: next } });
  };

  const handleAddUserStory = () => {
    if (!newUserStory.trim()) return;
    onChange({
      prd: {
        ...project.prd,
        userStories: [...project.prd.userStories, newUserStory.trim()],
      },
    });
    setNewUserStory('');
  };

  const handleRemoveUserStory = (idx: number) => {
    const next = [...project.prd.userStories];
    next.splice(idx, 1);
    onChange({ prd: { ...project.prd, userStories: next } });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Title */}
      <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
              PRD.md
            </span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Product Requirements Document & Prompt Maestro
            </h2>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Define la visión del producto, requerimientos clave y el prompt de inicialización para el modelo de IA.
          </p>
        </div>
      </div>

      {/* Basic Metadata Card */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-500" />
          Información General del Proyecto
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Nombre del Proyecto
            </label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ej. FinFlow Analytics"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Versión del Libreto
            </label>
            <input
              type="text"
              value={project.version}
              onChange={(e) => onChange({ version: e.target.value })}
              className="w-full text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="1.0.0"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Público Objetivo
            </label>
            <input
              type="text"
              value={project.targetAudience}
              onChange={(e) => onChange({ targetAudience: e.target.value })}
              className="w-full text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ej. Desarrolladores frontend, analistas financieros y equipos de producto"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Descripción Breve / Resumen Ejecutivo
            </label>
            <textarea
              rows={3}
              value={project.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className="w-full text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Explica en 2 o 3 líneas qué problema resuelve tu proyecto..."
            />
          </div>
        </div>
      </div>

      {/* Tone of the Master Prompt */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-500" />
          Tono y Rol Operativo de la Inteligencia Artificial
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tones.map((t) => {
            const isSelected = project.prd.masterPromptTone === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChange({ prd: { ...project.prd, masterPromptTone: t.id } })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10 text-purple-950 dark:text-purple-200 ring-2 ring-purple-500/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span>{t.icon}</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{t.label}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{t.desc}</p>
              </button>
            );
          })}
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Directivas Especiales Adicionales para el Prompt Maestro (Opcional)
          </label>
          <textarea
            rows={2}
            value={project.prd.customMasterPromptDirectives}
            onChange={(e) =>
              onChange({
                prd: { ...project.prd, customMasterPromptDirectives: e.target.value },
              })
            }
            className="w-full text-xs font-mono bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ej. Prioriza siempre componentes con Radix UI primitives. No uses styled-components bajo ningún motivo."
          />
        </div>
      </div>

      {/* Functional Requirements */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            Requerimientos Funcionales Clave ({project.prd.functionalRequirements.length})
          </h3>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newFuncReq}
            onChange={(e) => setNewFuncReq(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddFuncReq()}
            className="flex-1 text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Añadir nuevo requerimiento funcional (Presiona Enter)..."
          />
          <button
            onClick={handleAddFuncReq}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Añadir
          </button>
        </div>

        <div className="space-y-2">
          {project.prd.functionalRequirements.map((req, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">{req}</span>
              </div>
              <button
                onClick={() => handleRemoveFuncReq(idx)}
                className="opacity-40 group-hover:opacity-100 hover:text-red-500 text-zinc-400 p-1 transition-all"
                title="Eliminar requerimiento"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Functional Requirements & User Stories in 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NFR */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Requerimientos No Funcionales
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newNonFuncReq}
              onChange={(e) => setNewNonFuncReq(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNonFuncReq()}
              className="flex-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
              placeholder="Ej. Tiempo de respuesta < 200ms"
            />
            <button
              onClick={handleAddNonFuncReq}
              className="px-2.5 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {project.prd.nonFunctionalRequirements.map((nfr, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs group"
              >
                <span className="text-zinc-700 dark:text-zinc-300 truncate">{nfr}</span>
                <button
                  onClick={() => handleRemoveNonFuncReq(idx)}
                  className="opacity-40 group-hover:opacity-100 hover:text-red-500 text-zinc-400 p-0.5 ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* User Stories */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            Historias de Usuario
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newUserStory}
              onChange={(e) => setNewUserStory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUserStory()}
              className="flex-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
              placeholder="Como [rol], quiero [acción] para [beneficio]"
            />
            <button
              onClick={handleAddUserStory}
              className="px-2.5 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {project.prd.userStories.map((story, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs group"
              >
                <span className="text-zinc-700 dark:text-zinc-300 italic truncate">"{story}"</span>
                <button
                  onClick={() => handleRemoveUserStory(idx)}
                  className="opacity-40 group-hover:opacity-100 hover:text-red-500 text-zinc-400 p-0.5 ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
