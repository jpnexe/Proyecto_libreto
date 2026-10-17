import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Wand2,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowRight,
  ShieldCheck,
  X,
  Lightbulb,
} from 'lucide-react';
import type { LibretoProject } from '../../types/libreto';
import { DOMAIN_BLUEPRINTS, type DomainBlueprint } from '../../constants/domainDictionary';
import {
  detectProjectDomain,
  validateProjectCoherence,
  autoFixAllCoherence,
  applyDomainBlueprint,
} from '../../utils/coherenceEngine';

interface CoherenceAssistantProps {
  project: LibretoProject;
  onChange: (updated: Partial<LibretoProject>) => void;
  onToast: (msg: string) => void;
}

export const CoherenceAssistant: React.FC<CoherenceAssistantProps> = ({
  project,
  onChange,
  onToast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ideaText, setIdeaText] = useState('');
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);

  // Validación de coherencia en tiempo real
  const coherenceReport = useMemo(() => {
    return validateProjectCoherence(project);
  }, [project]);

  // Detección automática en base a lo que el usuario escribe en el input
  const detectedFromInput = useMemo(() => {
    return detectProjectDomain(ideaText);
  }, [ideaText]);

  // Dominio activo seleccionado o detectado
  const activeDomain: DomainBlueprint | null = useMemo(() => {
    if (selectedDomainId && DOMAIN_BLUEPRINTS[selectedDomainId]) {
      return DOMAIN_BLUEPRINTS[selectedDomainId];
    }
    if (detectedFromInput?.domain) {
      return detectedFromInput.domain;
    }
    if (coherenceReport.detectedDomain) {
      return coherenceReport.detectedDomain;
    }
    return null;
  }, [selectedDomainId, detectedFromInput, coherenceReport.detectedDomain]);

  // Aplicar arquetipo coherente completo
  const handleApplyDomain = (domainId: string) => {
    const updated = applyDomainBlueprint(project, domainId, { preserveCustomText: true });
    // Corregir cualquier detalle residual automáticamente
    const fixed = autoFixAllCoherence(updated);
    onChange(fixed);
    const domainName = DOMAIN_BLUEPRINTS[domainId]?.name || 'Dominio';
    onToast(`✨ Proyecto sincronizado y configurado coherentemente como: "${domainName}".`);
    setIdeaText('');
    setSelectedDomainId(null);
  };

  // Corregir todas las incoherencias detectadas con 1 solo clic
  const handleFixAll = () => {
    const fixed = autoFixAllCoherence(project);
    onChange(fixed);
    onToast('✅ Todas las incoherencias han sido corregidas con éxito.');
  };

  // Corregir un problema individual
  const handleFixSingle = (applyFix: (p: LibretoProject) => LibretoProject) => {
    const fixed = applyFix(project);
    onChange(fixed);
    onToast('✅ Incoherencia resuelta.');
  };

  const POPULAR_DOMAINS = [
    { id: 'python_data', label: '🐍 Análisis de Datos Python (Sin Interfaz)' },
    { id: 'saas_b2b', label: '⚡ SaaS B2B & Dashboards' },
    { id: 'ecommerce', label: '🛒 E-Commerce & Tienda Online' },
    { id: 'static_blog', label: '📄 Web Estática Jamstack (Sin BD)' },
    { id: 'python_cli', label: '💻 Herramienta CLI / ETL' },
    { id: 'mobile_app', label: '📱 App Móvil Offline-First' },
  ];

  return (
    <div className="mb-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs overflow-hidden transition-all">
      {/* Barra Superior de Estado y Conmutador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:px-5 bg-gradient-to-r from-zinc-50 via-white to-zinc-50 dark:from-zinc-900/90 dark:via-zinc-900/60 dark:to-zinc-900/90 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              coherenceReport.isFullyCoherent
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
            }`}
          >
            {coherenceReport.isFullyCoherent ? (
              <CheckCircle2 className="w-4.5 h-4.5" />
            ) : (
              <AlertTriangle className="w-4.5 h-4.5" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Asistente de Predicción & Coherencia</span>
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  coherenceReport.isFullyCoherent
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                }`}
              >
                {coherenceReport.isFullyCoherent
                  ? '100% Coherente'
                  : `${coherenceReport.issues.length} ${
                      coherenceReport.issues.length === 1 ? 'Incoherencia' : 'Incoherencias'
                    } (${coherenceReport.score}/100)`}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              {coherenceReport.isFullyCoherent
                ? coherenceReport.detectedDomain
                  ? `Stack armonizado con arquetipo: ${coherenceReport.detectedDomain.name}`
                  : 'Tecnologías, diseño y reglas perfectamente armonizados.'
                : 'Se detectaron discrepancias entre tecnologías, lenguajes o diseño.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!coherenceReport.isFullyCoherent && (
            <button
              type="button"
              onClick={handleFixAll}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-xs transition-all active:scale-98 flex items-center gap-1.5 cursor-pointer"
              title="Corregir todas las contradicciones detectadas automáticamente"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Corregir Todo</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-750 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{isOpen ? 'Ocultar Asistente' : '¿Qué quieres construir?'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Panel Desplegable: Asistente Interactivo de Ideas & Auditoría */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-5 animate-fadeIn">
          {/* 1. Buscador Predictor de Idea */}
          <div className="space-y-3 bg-zinc-50 dark:bg-zinc-950/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-cyan-500" />
                <span>Cuéntame tu idea (en lenguaje natural):</span>
              </label>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 hidden sm:inline">
                Infiere stack, diseño, tareas y requerimientos automáticamente
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={ideaText}
                onChange={(e) => {
                  setIdeaText(e.target.value);
                  setSelectedDomainId(null);
                }}
                placeholder="Ej. 'Quiero hacer un análisis de ventas en Python desde CSV y exportar gráficos', o 'Una tienda online con pagos y carrito'..."
                className="w-full text-xs sm:text-sm pl-3.5 pr-9 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-zinc-400"
              />
              {ideaText && (
                <button
                  type="button"
                  onClick={() => setIdeaText('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Chips de arquetipos rápidos */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                O elige un arquetipo verificado:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_DOMAINS.map((dom) => (
                  <button
                    key={dom.id}
                    type="button"
                    onClick={() => {
                      setSelectedDomainId(dom.id);
                      setIdeaText('');
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      activeDomain?.id === dom.id
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-700 dark:text-cyan-300 font-bold'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {dom.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tarjeta de Vista Previa del Dominio Sugerido */}
            {activeDomain && (
              <div className="mt-3 p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 dark:bg-cyan-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-900 dark:text-cyan-200">
                      Dominio Recomendado: {activeDomain.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-bold">
                      {activeDomain.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {activeDomain.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500 dark:text-zinc-400 pt-0.5">
                    <span><strong>Stack:</strong> {activeDomain.frontendFramework} + {activeDomain.backendFramework}</span>
                    <span>• <strong>BD:</strong> {activeDomain.database}</span>
                    <span>• <strong>Estilo:</strong> {activeDomain.style}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyDomain(activeDomain.id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs transition-all active:scale-98 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Auto-Configurar Proyecto</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 2. Lista de Incoherencias y Contradicciones (si existen) */}
          {coherenceReport.issues.length > 0 ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Incoherencias Detectadas ({coherenceReport.issues.length}):</span>
                </span>
                <span className="text-[11px] text-zinc-400">
                  Resuelve cada una individualmente o usa &ldquo;Corregir Todo&rdquo;
                </span>
              </div>

              <div className="space-y-2">
                {coherenceReport.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                          {issue.title}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">
                          {issue.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {issue.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFixSingle(issue.applyFix)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-900 border border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 transition-all shrink-0 self-start sm:self-auto cursor-pointer"
                    >
                      {issue.fixLabel}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <span>
                <strong>¡Excelente!</strong> No se detectaron contradicciones entre la plataforma, lenguajes, frameworks, diseño ni reglas. Todos los archivos serán 100% coherentes.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
