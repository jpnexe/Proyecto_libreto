import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  FileCheck2,
  AlertTriangle,
} from 'lucide-react';
import type { LibretoProject } from '../../types/libreto';

interface RulesModuleProps {
  project: LibretoProject;
  onChange: (updated: Partial<LibretoProject>) => void;
}

export const RulesModule: React.FC<RulesModuleProps> = ({ project, onChange }) => {
  const { rules } = project;
  const [newRule, setNewRule] = useState('');

  const handleUpdate = (fields: Partial<typeof rules>) => {
    onChange({
      rules: {
        ...rules,
        ...fields,
      },
    });
  };

  const handleAddCustomRule = () => {
    if (!newRule.trim()) return;
    handleUpdate({
      customRules: [...rules.customRules, newRule.trim()],
    });
    setNewRule('');
  };

  const handleRemoveCustomRule = (idx: number) => {
    const next = [...rules.customRules];
    next.splice(idx, 1);
    handleUpdate({ customRules: next });
  };

  const standardDirectives = [
    {
      key: 'atomicModifications' as const,
      title: 'Modificaciones Atómicas y Quirúrgicas',
      description: 'Prohibir a la IA reescribir archivos enteros cuando solo modifica unas pocas líneas. Obligar a reemplazos focalizados y preservar comentarios.',
    },
    {
      key: 'strictTyping' as const,
      title: 'Tipado Estricto Sin Excepciones',
      description: 'Cero uso de any en TypeScript o conversiones ambiguas. Todas las funciones, endpoints y props deben tener tipos explícitos.',
    },
    {
      key: 'mandatoryExceptionHandling' as const,
      title: 'Manejo Obligatorio de Excepciones',
      description: 'Bloques try/catch y respuestas con códigos de estado HTTP semánticos (400, 401, 403, 404, 409, 500) en cada endpoint o mutación.',
    },
    {
      key: 'strictModularity' as const,
      title: 'Modularidad Estricta (Máximo 50 líneas por función)',
      description: 'Ninguna función puede superar las 50 líneas de código útil. Fomenta componentes desacoplados y hooks reutilizables.',
    },
    {
      key: 'gitCommitConventions' as const,
      title: 'Convención de Commits Semánticos',
      description: 'Obligar a redactar commits siguiendo el estándar Conventional Commits (feat:, fix:, refactor:, chore:).',
    },
    {
      key: 'testCoverageRequirement' as const,
      title: 'Requisito de Pruebas Unitarias',
      description: 'Toda lógica de negocio o cálculo crítico debe acompañarse de su correspondiente suite de pruebas unitarias.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-red-500/10 text-red-600 dark:text-red-400">
              RULES.md
            </span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Reglas de Comportamiento para la IA
            </h2>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Establece los límites operativos innegociables para el asistente de IA durante el ciclo de vida del proyecto.
          </p>
        </div>
      </div>

      {/* 1. MANDATORY GOLDEN RULE (Inamovible y destacada) */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/80 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 dark:border-amber-400/60 shadow-lg shadow-amber-500/5">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-black">
            <Lock className="w-3.5 h-3.5" /> Regla de Oro Inamovible
          </span>
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
            (Obligatoria en todo Libreto)
          </span>
        </div>

        <blockquote className="mt-2 text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1">
          «La Inteligencia Artificial DEBE preguntar siempre y solicitar aprobación explícita al usuario ANTES de instalar dependencias, ejecutar comandos, crear nuevos archivos o implementar cualquier funcionalidad crítica. Debe desglosar los archivos afectados y el impacto antes de tocar el código».
        </blockquote>

        <div className="mt-3 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200/80">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            Esta regla se inyecta con máxima prioridad jerárquica en el archivo <code className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">RULES.md</code>.
          </span>
        </div>
      </div>

      {/* 2. Additional Checkable Directives */}
      <div className="space-y-4 bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-500" />
            Directivas Adicionales Seleccionables por Checkbox
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {standardDirectives.map((item) => {
            const isChecked = Boolean(rules[item.key]);
            return (
              <div
                key={item.key}
                onClick={() => handleUpdate({ [item.key]: !isChecked })}
                className={`cursor-pointer p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 select-none ${
                  isChecked
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Custom Project Rules */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-500" />
          Reglas y Restricciones Específicas del Proyecto ({rules.customRules.length})
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomRule()}
            className="flex-1 text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Ej. Prohibido utilizar librerías de estilos distintas a Tailwind CSS..."
          />
          <button
            onClick={handleAddCustomRule}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Añadir
          </button>
        </div>

        <div className="space-y-2">
          {rules.customRules.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">{rule}</span>
              </div>
              <button
                onClick={() => handleRemoveCustomRule(idx)}
                className="opacity-40 group-hover:opacity-100 hover:text-red-500 text-zinc-400 p-1 transition-all"
                title="Eliminar regla"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
