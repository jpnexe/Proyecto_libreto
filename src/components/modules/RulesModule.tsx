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
  Scale,
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
      title: 'Modularidad Estricta (Máximo 50 líneas útiles)',
      description: 'Ninguna función puede superar las 50 líneas de código útil. Fomenta componentes desacoplados y hooks reutilizables.',
    },
    {
      key: 'gitCommitConventions' as const,
      title: 'Convención de Commits Semánticos',
      description: 'Obligar a redactar commits siguiendo el estándar Conventional Commits (feat:, fix:, refactor:, chore:).',
    },
    {
      key: 'testCoverageRequirement' as const,
      title: 'Requisito de Pruebas Automatizadas',
      description: 'Toda lógica de negocio o cálculo crítico debe acompañarse de su correspondiente suite de pruebas unitarias.',
    },
  ];

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* 1. Module Header */}
      <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 shadow-xs">
              <Scale className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25">
                  RULES.md
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                  Paso 4 de 8
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Reglas de Comportamiento para la IA
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Establece los límites operativos innegociables y la Regla de Oro que el asistente de IA debe acatar sin excepción.
          </p>
        </div>
      </div>

      {/* 2. MANDATORY GOLDEN RULE */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/80 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent p-5 sm:p-6 dark:border-amber-400/60 shadow-lg shadow-amber-500/5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-black shadow-xs">
            <Lock className="w-3.5 h-3.5" /> Regla de Oro Inamovible
          </span>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
            (Obligatoria y Vinculante en todo Libreto)
          </span>
        </div>

        <blockquote className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1.5 bg-amber-500/5 dark:bg-amber-500/10 rounded-r-xl">
          «La Inteligencia Artificial DEBE preguntar siempre y solicitar aprobación explícita al usuario ANTES de instalar dependencias, ejecutar comandos en terminal, crear nuevos archivos o modificar funcionalidad crítica. Debe desglosar los archivos afectados y el impacto del cambio antes de tocar el código».
        </blockquote>

        <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200/90 pt-1">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            Esta regla se inyecta con máxima prioridad jerárquica en el encabezado de <code className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded font-bold">RULES.md</code>.
          </span>
        </div>
      </div>

      {/* 3. Additional Checkable Directives */}
      <div className="space-y-4 bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Directivas Técnicas de Ingeniería
            </h3>
            <p className="text-[11px] text-zinc-500">Selecciona las políticas activas que deben regir el código generado</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {standardDirectives.map((item) => {
            const isChecked = Boolean(rules[item.key]);
            return (
              <div
                key={item.key}
                onClick={() => handleUpdate({ [item.key]: !isChecked })}
                className={`cursor-pointer p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 select-none ${
                  isChecked
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30 shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5 text-zinc-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Custom Project Rules */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Reglas Particulares del Proyecto
              </h3>
              <p className="text-[11px] text-zinc-500">Restricciones personalizadas formuladas por el propietario</p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            {rules.customRules.length} Reglas
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomRule()}
            className="flex-1 text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-zinc-400"
            placeholder="Ej. Prohibido utilizar librerías de estilos distintas a Tailwind CSS..."
          />
          <button
            type="button"
            onClick={handleAddCustomRule}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 shrink-0"
          >
            <Plus className="w-4 h-4" /> Añadir Regla
          </button>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {rules.customRules.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm leading-relaxed break-words">
                  {rule}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveCustomRule(idx)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                title="Eliminar regla"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {rules.customRules.length === 0 && (
            <div className="text-xs text-zinc-400 italic py-2">
              No hay reglas personalizadas adicionales registradas aún.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
