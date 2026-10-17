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
  Pencil,
  Check,
  X,
  BookOpen,
  Search,
} from 'lucide-react';
import type { LibretoProject } from '../../types/libreto';

interface RulesModuleProps {
  project: LibretoProject;
  onChange: (updated: Partial<LibretoProject>) => void;
}

const PRESET_RULES_CATALOG = [
  {
    category: 'Seguridad & Secretos',
    rule: 'Prohibido almacenar API Keys, credenciales o contraseñas en el código fuente; todo secreto debe residir en variables de entorno validadas.',
  },
  {
    category: 'Seguridad & Secretos',
    rule: 'Almacenar tokens de autenticación únicamente en cookies HttpOnly, Secure y SameSite=Strict; nunca en localStorage ni sessionStorage.',
  },
  {
    category: 'Seguridad & Secretos',
    rule: 'Sanitizar todas las entradas y parámetros en frontera de API con esquemas estrictos de validación (Zod / DTOs) antes de persistirlos.',
  },
  {
    category: 'Calidad & Tipado',
    rule: 'Cero uso de tipos any o unknown sin refinamiento (type narrowing) previo en TypeScript.',
  },
  {
    category: 'Calidad & Tipado',
    rule: 'Toda mutación de estado o cálculo crítico debe ser una función pura inmutable sin efectos secundarios ocultos.',
  },
  {
    category: 'Calidad & Tipado',
    rule: 'Implementar retornos tempranos (Early Returns) y evitar estructuras if/else con más de 2 niveles de anidamiento.',
  },
  {
    category: 'Arquitectura & Modularidad',
    rule: 'Separar estrictamente la lógica de negocio y llamadas a API de los componentes visuales de presentación.',
  },
  {
    category: 'Arquitectura & Modularidad',
    rule: 'Ningún archivo individual debe superar las 250 líneas de código útil; descomponer en subcomponentes o custom hooks.',
  },
  {
    category: 'Arquitectura & Modularidad',
    rule: 'Prohibidas las dependencias circulares; la jerarquía de módulos debe fluir en una sola dirección.',
  },
  {
    category: 'UI, Estilos & Accesibilidad',
    rule: 'Utilizar exclusivamente los tokens de color, espaciado y tipografía del sistema de diseño ratificado en DESIGN.md.',
  },
  {
    category: 'UI, Estilos & Accesibilidad',
    rule: 'Todos los elementos accionables deben ser accesibles por teclado (focus-visible) y contar con atributos semánticos WAI-ARIA.',
  },
  {
    category: 'UI, Estilos & Accesibilidad',
    rule: 'Diseño Mobile-First estricto: toda vista debe adaptarse fluidamente a dispositivos móviles sin desbordamientos horizontales.',
  },
  {
    category: 'Git & Commits',
    rule: 'Redactar todos los mensajes de commit siguiendo el estándar Conventional Commits (feat:, fix:, refactor:, chore:, docs:).',
  },
  {
    category: 'Git & Commits',
    rule: 'Cada commit debe ser atómico, autónomo y dejar la rama principal en estado compilable sin errores de linter.',
  },
  {
    category: 'Pruebas & Resiliencia',
    rule: 'Toda lógica de negocio o algoritmo debe contar con pruebas unitarias que cubran casos de éxito y valores de borde (edge cases).',
  },
  {
    category: 'Pruebas & Resiliencia',
    rule: 'Encapsular toda llamada asíncrona en bloques try/catch con retroalimentación visual amigable (toasts / skeletons) ante fallas.',
  },
];

export const RulesModule: React.FC<RulesModuleProps> = ({ project, onChange }) => {
  const { rules } = project;
  const [newRule, setNewRule] = useState('');

  // Editing state for existing rules
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  // Preset catalog filter state
  const [selectedPresetCat, setSelectedPresetCat] = useState('Todas');
  const [presetSearch, setPresetSearch] = useState('');

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
    if (editingIndex === idx) {
      setEditingIndex(null);
      setEditingText('');
    }
  };

  const handleStartEdit = (idx: number, currentText: string) => {
    setEditingIndex(idx);
    setEditingText(currentText);
  };

  const handleSaveEdit = (idx: number) => {
    if (!editingText.trim()) return;
    const next = [...rules.customRules];
    next[idx] = editingText.trim();
    handleUpdate({ customRules: next });
    setEditingIndex(null);
    setEditingText('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingText('');
  };

  const handleSelectPresetRule = (presetRuleText: string) => {
    if (rules.customRules.includes(presetRuleText)) return;
    handleUpdate({
      customRules: [...rules.customRules, presetRuleText],
    });
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

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {rules.customRules.map((rule, idx) => {
            const isEditing = editingIndex === idx;
            return (
              <div
                key={idx}
                className={`p-3 sm:p-3.5 rounded-xl border text-sm transition-all ${
                  isEditing
                    ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-950/20 ring-1 ring-cyan-500/30'
                    : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {isEditing ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Editando Regla #{idx + 1}</span>
                    </div>
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSaveEdit(idx);
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      rows={2}
                      className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500/40"
                      placeholder="Redacta la regla personalizada..."
                      autoFocus
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(idx)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-98"
                      >
                        <Check className="w-3.5 h-3.5" /> Guardar Cambios
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span
                        onClick={() => handleStartEdit(idx, rule)}
                        className="text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm leading-relaxed break-words cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                        title="Haz clic para editar esta regla"
                      >
                        {rule}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(idx, rule)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-cyan-600 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                        title="Editar regla"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomRule(idx)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Eliminar regla"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {rules.customRules.length === 0 && (
            <div className="text-xs text-zinc-400 italic py-2">
              No hay reglas personalizadas adicionales registradas aún. Puedes redactar una arriba o seleccionar del catálogo de abajo.
            </div>
          )}
        </div>
      </div>

      {/* 5. Selectable Presets Rule Catalog */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  5. Catálogo de Reglas Profesionales Seleccionables
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {PRESET_RULES_CATALOG.length} directivas
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">Haz clic en "Seleccionar" para incorporarlas a tu proyecto y editarlas a tu medida</p>
            </div>
          </div>

          {/* Preset Search */}
          <div className="relative w-full sm:w-56 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={presetSearch}
              onChange={(e) => setPresetSearch(e.target.value)}
              placeholder="Filtrar catálogo..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['Todas', 'Seguridad & Secretos', 'Calidad & Tipado', 'Arquitectura & Modularidad', 'UI, Estilos & Accesibilidad', 'Git & Commits', 'Pruebas & Resiliencia'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedPresetCat(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                selectedPresetCat === cat
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Preset Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
          {PRESET_RULES_CATALOG.filter((item) => {
            const matchesCat = selectedPresetCat === 'Todas' || item.category === selectedPresetCat;
            const matchesQuery =
              !presetSearch ||
              item.rule.toLowerCase().includes(presetSearch.toLowerCase()) ||
              item.category.toLowerCase().includes(presetSearch.toLowerCase());
            return matchesCat && matchesQuery;
          }).map((preset, idx) => {
            const isAlreadyAdded = rules.customRules.includes(preset.rule);
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isAlreadyAdded
                    ? 'border-purple-500/40 bg-purple-500/5 dark:bg-purple-950/20 ring-1 ring-purple-500/20'
                    : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      {preset.category}
                    </span>
                    {isAlreadyAdded ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Añadida
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                    {preset.rule}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleSelectPresetRule(preset.rule)}
                    disabled={isAlreadyAdded}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isAlreadyAdded
                        ? 'opacity-50 cursor-not-allowed bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-xs active:scale-98'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {isAlreadyAdded ? 'En tus reglas' : 'Seleccionar y Añadir'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Observaciones y Notas Adicionales sobre Reglas de la IA */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <Pencil className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              6. Observaciones y Especificaciones Adicionales de Reglas (Opcional)
            </h3>
            <p className="text-[11px] text-zinc-500">
              Espacio libre para detallar convenciones de código del equipo, idioma de comentarios/variables o flujo de trabajo con la IA
            </p>
          </div>
        </div>
        <textarea
          rows={3}
          value={rules.customNotes || ''}
          onChange={(e) => handleUpdate({ customNotes: e.target.value })}
          placeholder="Ej. Todos los nombres de variables y funciones deben estar en inglés, pero los comentarios, mensajes de error al usuario y documentación en español..."
          className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-red-500/30 transition-all placeholder:text-zinc-400 leading-relaxed"
        />
      </div>
    </div>
  );
};
