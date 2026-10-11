import React, { useState } from 'react';
import {
  GitBranch,
  ShieldBan,
  Plus,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import type { CustomADR, LibretoProject } from '../../types/libreto';

interface DecisionsModuleProps {
  project: LibretoProject;
  onChange: (updated: Partial<LibretoProject>) => void;
}

export const DecisionsModule: React.FC<DecisionsModuleProps> = ({ project, onChange }) => {
  const { decisions, architecture, design } = project;

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newAdr, setNewAdr] = useState<Omit<CustomADR, 'id'>>({
    title: '',
    context: '',
    decision: '',
    consequences: '',
    discardedAlternatives: '',
  });

  const handleUpdate = (fields: Partial<typeof decisions>) => {
    onChange({
      decisions: {
        ...decisions,
        ...fields,
      },
    });
  };

  const handleSaveCustomAdr = () => {
    if (!newAdr.title.trim() || !newAdr.decision.trim()) return;
    const adr: CustomADR = {
      ...newAdr,
      id: 'adr-' + Date.now(),
    };
    handleUpdate({
      customDecisions: [...decisions.customDecisions, adr],
    });
    setNewAdr({
      title: '',
      context: '',
      decision: '',
      consequences: '',
      discardedAlternatives: '',
    });
    setIsAddingCustom(false);
  };

  const handleRemoveCustomAdr = (id: string) => {
    handleUpdate({
      customDecisions: decisions.customDecisions.filter((d) => d.id !== id),
    });
  };

  // Preview of automatic ADRs generated from stack choices
  const mappedStackAdrs = [
    {
      code: 'ADR-001',
      domain: 'Capa Frontend',
      tech: architecture.frontendFramework,
      why: `Optimizado para la plataforma ${architecture.platform.toUpperCase()} y reactividad moderna.`,
      discarded: 'Angular, jQuery, frameworks legacy.',
    },
    {
      code: 'ADR-002',
      domain: 'Capa Backend',
      tech: architecture.backendFramework,
      why: `Soporta protocolo ${architecture.connectionType} y garantiza modularidad en la lógica de negocio.`,
      discarded: 'Monolitos no estructurados, arquitecturas serverless no acordadas.',
    },
    {
      code: 'ADR-003',
      domain: 'Persistencia de Datos',
      tech: architecture.database,
      why: 'Garantiza consistencia transaccional y escalabilidad del esquema de entidades.',
      discarded: 'Bases de datos no relacionales no tipadas sin justificación técnica.',
    },
    {
      code: 'ADR-004',
      domain: 'Sistema de Estilos',
      tech: `${design.styleFramework} (${design.style})`,
      why: 'Garantiza consistencia con los tokens de diseño y optimización de CSS en producción.',
      discarded: 'CSS vanilla sin convenciones, librerías CSS-in-JS con sobrecosto en runtime.',
    },
    {
      code: 'ADR-005',
      domain: 'Patrón de Software',
      tech: architecture.architecturalPattern,
      why: 'Desacopla componentes, permitiendo pruebas unitarias e inversión de control.',
      discarded: 'Estructura plana acoplada sin separación de capas (Spaghetti Code).',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
              DECISIONS.md
            </span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Registro de Decisiones de Arquitectura (ADR)
            </h2>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Mapea formalmente la justificación técnica de cada tecnología elegida y bloquea migraciones no autorizadas por la IA.
          </p>
        </div>
      </div>

      {/* Strict Migration Ban Notice */}
      <div className="bg-red-500/10 dark:bg-red-950/20 border border-red-500/30 rounded-2xl p-5 flex items-start gap-3.5">
        <ShieldBan className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-red-800 dark:text-red-300">
            Directiva Vinculante de Prohibición de Migración
          </h4>
          <p className="text-xs text-red-700 dark:text-red-400/90 mt-1 leading-relaxed">
            «La Inteligencia Artificial tiene <strong>terminantemente prohibido</strong> proponer cambios, sugerir librerías alternativas o iniciar migraciones tecnológicas a menos que el usuario lo solicite expresamente por escrito».
          </p>
        </div>
      </div>

      {/* Automatic ADRs from Stack choices */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-500" />
            ADRs Mapeados Automáticamente desde tu Stack ({mappedStackAdrs.length})
          </label>
          <span className="text-xs text-zinc-500">
            Sincronizados en tiempo real con MÓDULO A y B
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mappedStackAdrs.map((adr) => (
            <div
              key={adr.code}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  {adr.code}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ratificado
                </span>
              </div>

              <div>
                <span className="text-[11px] text-zinc-400 block">{adr.domain}</span>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">{adr.tech}</h4>
              </div>

              <div className="text-zinc-600 dark:text-zinc-400 text-[11px] space-y-1 pt-1 border-t border-zinc-200 dark:border-zinc-800">
                <p><strong>Justificación:</strong> {adr.why}</p>
                <p className="text-red-600 dark:text-red-400"><strong>Descartadas:</strong> {adr.discarded}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom ADRs Section */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-500" />
            ADRs Personalizados Específicos ({decisions.customDecisions.length})
          </label>
          <button
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {isAddingCustom ? 'Cancelar' : 'Añadir ADR'}
          </button>
        </div>

        {/* Form to add custom ADR */}
        {isAddingCustom && (
          <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-cyan-500/30 space-y-3">
            <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
              Nuevo Registro de Decisión
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Título de la Decisión
                </label>
                <input
                  type="text"
                  value={newAdr.title}
                  onChange={(e) => setNewAdr({ ...newAdr, title: e.target.value })}
                  placeholder="Ej. Adopción de React Query para caché del cliente"
                  className="w-full text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Alternativas Descartadas
                </label>
                <input
                  type="text"
                  value={newAdr.discardedAlternatives}
                  onChange={(e) => setNewAdr({ ...newAdr, discardedAlternatives: e.target.value })}
                  placeholder="Ej. Redux Toolkit, Zustand con polling manual"
                  className="w-full text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Contexto y Justificación
                </label>
                <textarea
                  rows={2}
                  value={newAdr.context}
                  onChange={(e) => setNewAdr({ ...newAdr, context: e.target.value })}
                  placeholder="Por qué surgió la necesidad..."
                  className="w-full text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Decisión Adoptada
                </label>
                <input
                  type="text"
                  value={newAdr.decision}
                  onChange={(e) => setNewAdr({ ...newAdr, decision: e.target.value })}
                  placeholder="Se adopta TanStack Query con staleTime de 5 minutos..."
                  className="w-full text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveCustomAdr}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
              >
                Guardar ADR
              </button>
            </div>
          </div>
        )}

        {/* List of custom ADRs */}
        <div className="space-y-2">
          {decisions.customDecisions.map((adr) => (
            <div
              key={adr.id}
              className="flex items-start justify-between p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs group"
            >
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{adr.title}</span>
                <p className="text-zinc-500 mt-0.5">{adr.decision}</p>
                {adr.discardedAlternatives && (
                  <p className="text-red-500 text-[11px] mt-0.5">
                    Descartadas: {adr.discardedAlternatives}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleRemoveCustomAdr(adr.id)}
                className="opacity-40 group-hover:opacity-100 hover:text-red-500 text-zinc-400 p-1"
                title="Eliminar ADR"
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
