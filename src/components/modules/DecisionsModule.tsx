import React, { useState } from 'react';
import {
  GitBranch,
  ShieldBan,
  Plus,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  BookmarkCheck,
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
      discarded: 'Bases de datos no relacionales sin justificación técnica.',
    },
    {
      code: 'ADR-004',
      domain: 'Sistema de Estilos',
      tech: `${design.styleFramework} (${design.style})`,
      why: 'Garantiza consistencia con los tokens de diseño y optimización de CSS en producción.',
      discarded: 'CSS vanilla sin convenciones, librerías con sobrecosto en runtime.',
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
    <div className="space-y-7 animate-fadeIn">
      {/* 1. Module Header */}
      <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
              <GitBranch className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                  DECISIONS.md
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                  Paso 5 de 8
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Decisiones de Arquitectura (ADR)
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Mapea formalmente la justificación técnica de cada tecnología elegida y bloquea migraciones no autorizadas por la IA.
          </p>
        </div>
      </div>

      {/* 2. Strict Migration Ban Notice */}
      <div className="bg-red-500/10 dark:bg-red-950/20 border border-red-500/30 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
          <ShieldBan className="w-5.5 h-5.5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-red-800 dark:text-red-300">
            Directiva Vinculante de Prohibición de Migración
          </h4>
          <p className="text-xs text-red-700 dark:text-red-400/90 mt-1 leading-relaxed">
            «La Inteligencia Artificial tiene <strong>terminantemente prohibido</strong> proponer cambios de stack, sugerir librerías alternativas o iniciar migraciones tecnológicas a menos que el usuario lo solicite expresamente por escrito».
          </p>
        </div>
      </div>

      {/* 3. Automatic ADRs from Stack choices */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                ADRs Mapeados Automáticamente ({mappedStackAdrs.length})
              </h3>
              <p className="text-[11px] text-zinc-500">Sincronizados en tiempo real con las opciones de arquitectura y diseño</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            Actualización Automática
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {mappedStackAdrs.map((adr) => (
            <div
              key={adr.code}
              className="p-4 sm:p-4.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2.5 text-xs shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md text-[11px]">
                    {adr.code}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" /> Ratificado
                  </span>
                </div>

                <span className="text-[11px] text-zinc-400 block font-medium">{adr.domain}</span>
                <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 mt-0.5 leading-snug">
                  {adr.tech}
                </h4>
              </div>

              <div className="text-zinc-600 dark:text-zinc-400 text-xs space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <p className="leading-relaxed">
                  <strong className="text-zinc-700 dark:text-zinc-300">Justificación:</strong> {adr.why}
                </p>
                <p className="text-red-600 dark:text-red-400 leading-relaxed">
                  <strong>Descartadas:</strong> {adr.discarded}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Custom ADRs Section */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <BookmarkCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                ADRs Específicos del Proyecto
              </h3>
              <p className="text-[11px] text-zinc-500">Decisiones personalizadas adicionales ({decisions.customDecisions.length})</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingCustom ? 'Cancelar' : 'Añadir ADR'}</span>
          </button>
        </div>

        {/* Form to add custom ADR */}
        {isAddingCustom && (
          <div className="bg-white dark:bg-zinc-950 p-4 sm:p-5 rounded-2xl border border-cyan-500/30 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
              Nuevo Registro de Decisión Arquitectónica
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Título de la Decisión
                </label>
                <input
                  type="text"
                  value={newAdr.title}
                  onChange={(e) => setNewAdr({ ...newAdr, title: e.target.value })}
                  placeholder="Ej. Adopción de React Query para caché del cliente"
                  className="w-full text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Alternativas Descartadas
                </label>
                <input
                  type="text"
                  value={newAdr.discardedAlternatives}
                  onChange={(e) => setNewAdr({ ...newAdr, discardedAlternatives: e.target.value })}
                  placeholder="Ej. Redux Toolkit, Zustand con polling manual"
                  className="w-full text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Contexto y Justificación
                </label>
                <textarea
                  rows={2}
                  value={newAdr.context}
                  onChange={(e) => setNewAdr({ ...newAdr, context: e.target.value })}
                  placeholder="Por qué surgió la necesidad..."
                  className="w-full text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Decisión Adoptada
                </label>
                <input
                  type="text"
                  value={newAdr.decision}
                  onChange={(e) => setNewAdr({ ...newAdr, decision: e.target.value })}
                  placeholder="Se adopta TanStack Query con staleTime de 5 minutos..."
                  className="w-full text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveCustomAdr}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-xs active:scale-98"
              >
                Guardar ADR
              </button>
            </div>
          </div>
        )}

        {/* List of custom ADRs */}
        <div className="space-y-2.5">
          {decisions.customDecisions.map((adr) => (
            <div
              key={adr.id}
              className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm block">{adr.title}</span>
                <p className="text-zinc-500 mt-1 leading-relaxed">{adr.decision}</p>
                {adr.discardedAlternatives && (
                  <p className="text-red-500 text-[11px] mt-1">
                    Descartadas: {adr.discardedAlternatives}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveCustomAdr(adr.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                title="Eliminar ADR"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {decisions.customDecisions.length === 0 && (
            <div className="text-xs text-zinc-400 italic py-2">
              No hay ADRs personalizados adicionales registrados aún.
            </div>
          )}
        </div>
      </div>

      {/* 5. Observaciones Generales sobre Decisiones Técnicas */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <GitBranch className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Observaciones y Especificaciones sobre Decisiones Técnicas (Opcional)
            </h3>
            <p className="text-[11px] text-zinc-500">
              Escribe aquí cualquier observación sobre librerías descartadas, motivos de negocio o restricciones técnicas sin necesidad de crear un ADR formal
            </p>
          </div>
        </div>
        <textarea
          rows={3}
          value={decisions.customNotes || ''}
          onChange={(e) => handleUpdate({ customNotes: e.target.value })}
          placeholder="Ej. Se descarta el uso de ORMs pesados en rutas de analítica para priorizar consultas SQL optimizadas; no utilizar librerías de fechas deprecadas como Moment.js..."
          className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-zinc-400 leading-relaxed"
        />
      </div>
    </div>
  );
};
