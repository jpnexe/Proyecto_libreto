import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Sparkles,
  Bot,
  Users,
  Target,
  Layers,
  Check,
  FileText,
  MessageSquare,
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

  const tones: { id: MasterPromptTone; label: string; desc: string; icon: string; badge: string }[] = [
    {
      id: 'strict_senior',
      label: 'Senior Riguroso',
      desc: 'Código limpio, tipado estricto, sin atajos ni tolerancias de deuda técnica.',
      icon: '🛡️',
      badge: 'Recomendado',
    },
    {
      id: 'collaborative_expert',
      label: 'Experto Colaborativo',
      desc: 'Explicaciones paso a paso, comunicación proactiva y propuestas didácticas.',
      icon: '🤝',
      badge: 'Pedagógico',
    },
    {
      id: 'architect_mentor',
      label: 'Arquitecto y Mentor',
      desc: 'Enfocado en escalabilidad a gran escala, micro-patrones y decisiones fundamentadas.',
      icon: '🏛️',
      badge: 'Escalabilidad',
    },
    {
      id: 'minimalist_concise',
      label: 'Pragmático y Conciso',
      desc: 'Respuestas directas al código sin charlas ni explicaciones redundantes.',
      icon: '⚡',
      badge: 'Alta velocidad',
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
    <div className="space-y-7 animate-fadeIn">
      {/* 1. Module Header */}
      <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25">
                  PRD.md
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                  Paso 1 de 8
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Requerimientos de Producto & Prompt Maestro
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Define la visión del producto, público objetivo, historias de usuario y el rol operativo vinculante que asumirá la IA.
          </p>
        </div>
      </div>

      {/* 2. Basic Metadata Card */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Target className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Información General del Proyecto
            </h3>
            <p className="text-[11px] text-zinc-500">Metadatos de identificación y propósito comercial</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Nombre del Proyecto
            </label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-zinc-400"
              placeholder="Ej. FinFlow Analytics"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Versión del Libreto
            </label>
            <input
              type="text"
              value={project.version}
              onChange={(e) => onChange({ version: e.target.value })}
              className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-zinc-400"
              placeholder="1.0.0"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Público Objetivo & Segmento de Usuarios
            </label>
            <input
              type="text"
              value={project.targetAudience}
              onChange={(e) => onChange({ targetAudience: e.target.value })}
              className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-zinc-400"
              placeholder="Ej. Desarrolladores frontend, analistas financieros y equipos de producto"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Descripción Ejecutiva / Resumen del Producto
            </label>
            <textarea
              rows={3}
              value={project.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-zinc-400 leading-relaxed"
              placeholder="Explica en 2 o 3 líneas qué problema resuelve tu proyecto..."
            />
          </div>
        </div>
      </div>

      {/* 3. Tone of the Master Prompt */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Bot className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Tono y Rol Operativo de la Inteligencia Artificial
            </h3>
            <p className="text-[11px] text-zinc-500">Define cómo debe comunicarse y estructurar el código el asistente</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {tones.map((t) => {
            const isSelected = project.prd.masterPromptTone === t.id;
            return (
              <div
                key={t.id}
                onClick={() => onChange({ prd: { ...project.prd, masterPromptTone: t.id } })}
                className={`cursor-pointer p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-950/25 ring-2 ring-purple-500/30 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{t.icon}</span>
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                        {t.label}
                      </h4>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2">
                    {t.desc}
                  </p>
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400">
                    {t.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
            <span>Directivas Especiales Adicionales para el Prompt Maestro (Opcional)</span>
          </label>
          <textarea
            rows={2}
            value={project.prd.customMasterPromptDirectives}
            onChange={(e) =>
              onChange({
                prd: { ...project.prd, customMasterPromptDirectives: e.target.value },
              })
            }
            className="w-full text-xs font-mono bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder:text-zinc-400 leading-relaxed"
            placeholder="Ej. Prioriza siempre componentes con Radix UI primitives. No uses styled-components bajo ningún motivo."
          />
        </div>
      </div>

      {/* 4. Functional Requirements */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Layers className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Requerimientos Funcionales Clave (MVP)
              </h3>
              <p className="text-[11px] text-zinc-500">Capacidades funcionales que deben satisfacerse</p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {project.prd.functionalRequirements.length} RFs
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="text"
            value={newFuncReq}
            onChange={(e) => setNewFuncReq(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddFuncReq()}
            className="flex-1 text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder:text-zinc-400"
            placeholder="Añadir nuevo requerimiento funcional (Presiona Enter)..."
          />
          <button
            type="button"
            onClick={handleAddFuncReq}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 shrink-0"
          >
            <Plus className="w-4 h-4" /> Añadir RF
          </button>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {project.prd.functionalRequirements.map((req, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm leading-relaxed break-words">
                  {req}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFuncReq(idx)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                title="Eliminar requerimiento"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {project.prd.functionalRequirements.length === 0 && (
            <div className="text-xs text-zinc-400 italic py-2">
              No hay requerimientos funcionales agregados aún.
            </div>
          )}
        </div>
      </div>

      {/* 5. Non-Functional Requirements & User Stories in 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NFR */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Requerimientos No Funcionales
              </h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              {project.prd.nonFunctionalRequirements.length} NFRs
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newNonFuncReq}
              onChange={(e) => setNewNonFuncReq(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNonFuncReq()}
              className="flex-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-zinc-400"
              placeholder="Ej. Tiempo de respuesta API < 200ms"
            />
            <button
              type="button"
              onClick={handleAddNonFuncReq}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {project.prd.nonFunctionalRequirements.map((nfr, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs group"
              >
                <span className="text-zinc-700 dark:text-zinc-300 leading-relaxed break-words flex-1">
                  {nfr}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveNonFuncReq(idx)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0 ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* User Stories */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Historias de Usuario
              </h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              {project.prd.userStories.length} Historias
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newUserStory}
              onChange={(e) => setNewUserStory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUserStory()}
              className="flex-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-zinc-400"
              placeholder="Como [rol], quiero [acción] para [beneficio]"
            />
            <button
              type="button"
              onClick={handleAddUserStory}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {project.prd.userStories.map((story, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs group"
              >
                <span className="text-zinc-700 dark:text-zinc-300 italic leading-relaxed break-words flex-1">
                  &ldquo;{story}&rdquo;
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveUserStory(idx)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0 ml-1"
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
