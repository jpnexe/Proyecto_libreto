import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Check,
  ExternalLink,
  Code2,
  Terminal,
  Layers,
  SunMoon,
  Search,
  RotateCcw,
  Plus,
  Trash2,
  Sliders,
  MessageSquarePlus,
  Type,
  Pencil,
  X,
} from 'lucide-react';
import type { DesignStyleId, LibretoProject } from '../../types/libreto';
import {
  ANIMATION_LIBRARIES,
  DESIGN_CATEGORIES,
  DESIGN_STYLES,
  ICON_LIBRARIES,
  STYLE_FRAMEWORKS,
} from '../../constants/options';

interface DesignModuleProps {
  project: LibretoProject;
  onChange: (updated: Partial<LibretoProject>) => void;
}

const TYPOGRAPHY_SUGGESTIONS = [
  'Inter, system-ui, sans-serif',
  'Inter & JetBrains Mono',
  'Plus Jakarta Sans & Fira Code',
  'Space Grotesk & Clash Display',
  'Geist Sans & Geist Mono',
  'Poppins & Roboto Mono',
  'Playfair Display & Source Sans 3',
  'System Font (San Francisco / Roboto)',
];

export const DesignModule: React.FC<DesignModuleProps> = ({ project, onChange }) => {
  const { design } = project;

  // Search and category filters for styles
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Search filters for animation and icon libraries (20 items each)
  const [animSearch, setAnimSearch] = useState('');
  const [iconSearch, setIconSearch] = useState('');

  // Custom framework, animation and icon library inputs
  const [showAddFramework, setShowAddFramework] = useState(false);
  const [customFrameworkInput, setCustomFrameworkInput] = useState('');
  const [customAnimInput, setCustomAnimInput] = useState('');
  const [customIconInput, setCustomIconInput] = useState('');

  // Observations list state (add & inline edit)
  const [newObservation, setNewObservation] = useState('');
  const [editingObsIdx, setEditingObsIdx] = useState<number | null>(null);
  const [editingObsText, setEditingObsText] = useState('');

  // New color input in custom palette
  const [newColorHex, setNewColorHex] = useState('#6366F1');

  const handleUpdate = (fields: Partial<typeof design>) => {
    onChange({
      design: {
        ...design,
        ...fields,
      },
    });
  };

  const observations = design.customObservations || [];

  const handleAddObservation = () => {
    if (!newObservation.trim()) return;
    handleUpdate({
      customObservations: [...observations, newObservation.trim()],
    });
    setNewObservation('');
  };

  const handleRemoveObservation = (idx: number) => {
    const next = [...observations];
    next.splice(idx, 1);
    handleUpdate({ customObservations: next });
    if (editingObsIdx === idx) {
      setEditingObsIdx(null);
      setEditingObsText('');
    }
  };

  const handleSaveEditObservation = (idx: number) => {
    if (!editingObsText.trim()) return;
    const next = [...observations];
    next[idx] = editingObsText.trim();
    handleUpdate({ customObservations: next });
    setEditingObsIdx(null);
    setEditingObsText('');
  };

  const handleAddCustomAnim = () => {
    const trimmed = customAnimInput.trim();
    if (!trimmed) return;
    if (!design.animationLibraries.includes(trimmed)) {
      handleUpdate({ animationLibraries: [...design.animationLibraries, trimmed] });
    }
    setCustomAnimInput('');
  };

  const handleAddCustomIcon = () => {
    const trimmed = customIconInput.trim();
    if (!trimmed) return;
    if (!design.iconLibraries.includes(trimmed)) {
      handleUpdate({ iconLibraries: [...design.iconLibraries, trimmed] });
    }
    setCustomIconInput('');
  };

  const currentStyleDef =
    DESIGN_STYLES.find((s) => s.id === design.style) || DESIGN_STYLES[0];

  // Get effective colors for a given style (either custom edited or defaults)
  const getStyleColors = (styleId: string): string[] => {
    if (design.styleColors && design.styleColors[styleId]) {
      return design.styleColors[styleId];
    }
    const def = DESIGN_STYLES.find((s) => s.id === styleId);
    return def ? def.colors : ['#000000', '#FFFFFF'];
  };

  // Update a single color in the active style palette
  const handleUpdateStyleColor = (styleId: string, colorIndex: number, newColor: string) => {
    const currentColors = [...getStyleColors(styleId)];
    currentColors[colorIndex] = newColor;

    const updatedMap = {
      ...(design.styleColors || {}),
      [styleId]: currentColors,
    };
    handleUpdate({ styleColors: updatedMap });
  };

  // Add a new color to the active style palette
  const handleAddStyleColor = (styleId: string) => {
    if (!newColorHex.trim()) return;
    const currentColors = [...getStyleColors(styleId), newColorHex.trim()];
    const updatedMap = {
      ...(design.styleColors || {}),
      [styleId]: currentColors,
    };
    handleUpdate({ styleColors: updatedMap });
  };

  // Remove a color from the active style palette
  const handleRemoveStyleColor = (styleId: string, colorIndex: number) => {
    const currentColors = [...getStyleColors(styleId)];
    if (currentColors.length <= 1) return; // Keep at least one color
    currentColors.splice(colorIndex, 1);

    const updatedMap = {
      ...(design.styleColors || {}),
      [styleId]: currentColors,
    };
    handleUpdate({ styleColors: updatedMap });
  };

  // Reset colors for a style back to its original default
  const handleResetStyleColors = (styleId: string) => {
    if (!design.styleColors || !design.styleColors[styleId]) return;
    const updatedMap = { ...design.styleColors };
    delete updatedMap[styleId];
    handleUpdate({ styleColors: updatedMap });
  };

  // Toggle animation library
  const toggleAnimationLib = (libName: string) => {
    const current = [...design.animationLibraries];
    const index = current.indexOf(libName);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(libName);
    }
    handleUpdate({ animationLibraries: current });
  };

  // Toggle icon library
  const toggleIconLib = (iconName: string) => {
    const current = [...design.iconLibraries];
    const index = current.indexOf(iconName);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(iconName);
    }
    handleUpdate({ iconLibraries: current });
  };

  // Filter styles by category and search
  const filteredStyles = DESIGN_STYLES.filter((style) => {
    if (style.id === 'minimalist' || style.id === 'dark_cyberpunk') return false;

    const matchesCategory =
      selectedCategory === 'Todos' || style.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.visualFeatures?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const activeStylePalette = getStyleColors(design.style);
  const isCustomizedPalette = Boolean(
    design.styleColors && design.styleColors[design.style]
  );

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* 1. Module Header */}
      <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-xs">
              <Palette className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25">
                  DESIGN.md
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                  Paso 3 de 8
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Sistema de Diseño Visual & 21 Estilos UI
              </h2>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Selecciona entre 21 estéticas visuales, edita la paleta de colores y define librerías de animación e iconografía.
            </p>
            <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-xl text-xs shrink-0 self-start sm:self-auto">
              <span className="text-zinc-500 font-medium">Estilo Activo:</span>
              <span className="font-bold text-purple-600 dark:text-purple-400 font-mono">
                {currentStyleDef.name.split(' (')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Categorized & Searchable Style Selector */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Sliders className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                1. Catálogo de Estilos Visuales (21 Estéticas)
              </h3>
              <p className="text-[11px] text-zinc-500">Haz clic en un estilo para aplicarlo instantáneamente</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar estilo visual..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scroll-smooth">
          {DESIGN_CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCatActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Style Cards Grid (2 columns on sm+ for maximum readability and zero overlap) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[580px] overflow-y-auto pr-1">
          {filteredStyles.map((style) => {
            const isSelected = design.style === style.id;
            const styleColors = getStyleColors(style.id);

            return (
              <div
                key={style.id}
                onClick={() => handleUpdate({ style: style.id as DesignStyleId })}
                className={`cursor-pointer rounded-2xl p-4 border transition-all relative overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-950/25 ring-2 ring-purple-500/30 shadow-md'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-semibold inline-block mb-1">
                        {style.category}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
                        {style.name}
                      </h4>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2 leading-relaxed">
                    {style.subtitle}
                  </p>
                </div>

                {/* Visual Preview Box */}
                <div className="space-y-3">
                  <div
                    className={`p-3.5 rounded-xl ${style.sampleBg} ${style.sampleBorder} ${style.sampleShadow} transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 text-[10px] ${style.sampleBadgeClass}`}>
                        Preview UI
                      </span>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <div className="h-1.5 w-14 rounded bg-zinc-400/40" />
                      <div className="h-1.5 w-8 rounded bg-zinc-400/30" />
                    </div>
                  </div>

                  {/* Palette Sample Dots */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    <span className="text-[10px] font-medium text-zinc-400">
                      Paleta ({styleColors.length}):
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {styleColors.slice(0, 5).map((c, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-black/10 dark:border-white/20 shadow-2xs"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                      {styleColors.length > 5 && (
                        <span className="text-[10px] font-mono text-zinc-400">
                          +{styleColors.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ADVANCED COLOR CONTROL FOR THE SELECTED STYLE */}
      <div className="bg-gradient-to-br from-purple-500/5 to-cyan-500/5 dark:from-purple-950/20 dark:to-cyan-950/20 p-5 sm:p-6 rounded-2xl border border-purple-500/20 dark:border-purple-500/30 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-purple-500/10 dark:border-purple-500/20 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                2. Editor de Colores para &ldquo;{currentStyleDef.name}&rdquo;
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Personaliza cada color de la paleta. Se reflejarán automáticamente en <code className="text-purple-600 dark:text-purple-400 font-mono">DESIGN.md</code>.
            </p>
          </div>

          {/* Reset Palette Button if customized */}
          {isCustomizedPalette && (
            <button
              type="button"
              onClick={() => handleResetStyleColors(design.style)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-purple-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
              title="Restablecer a la paleta predeterminada del estilo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Paleta</span>
            </button>
          )}
        </div>

        {/* Detailed Palette Specs info callout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/70 dark:bg-zinc-950/70 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Pautas de Paleta del Estilo:
            </span>
            <p className="text-zinc-500 leading-relaxed">
              {currentStyleDef.paletteDescription}
            </p>
          </div>
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Uso Recomendado en Interfaz:
            </span>
            <p className="text-zinc-500 leading-relaxed">
              {currentStyleDef.idealUse}
            </p>
          </div>
        </div>

        {/* Color Palette Swatches Editor */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2.5">
            Muestras de Color Editables ({activeStylePalette.length} colores en la paleta):
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeStylePalette.map((colorHex, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xs group"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Color Picker Input */}
                  <div className="relative shrink-0">
                    <input
                      type="color"
                      aria-label={`Seleccionar color #${idx + 1}`}
                      value={colorHex.startsWith('#') && colorHex.length === 7 ? colorHex : '#888888'}
                      onChange={(e) =>
                        handleUpdateStyleColor(design.style, idx, e.target.value)
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                    />
                  </div>

                  {/* Hex Text input */}
                  <input
                    type="text"
                    aria-label={`Código hexadecimal color #${idx + 1}`}
                    value={colorHex}
                    onChange={(e) =>
                      handleUpdateStyleColor(design.style, idx, e.target.value)
                    }
                    className="w-full text-xs font-mono uppercase bg-transparent text-zinc-900 dark:text-zinc-100 outline-none"
                    placeholder="#FFFFFF"
                  />
                </div>

                {/* Quick actions for each color swatch */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdate({ primaryColor: colorHex })}
                    className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-zinc-400 hover:text-purple-600 hover:bg-purple-500/10 transition-colors"
                    title="Usar como Color Primario"
                  >
                    P
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdate({ secondaryColor: colorHex })}
                    className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-zinc-400 hover:text-cyan-600 hover:bg-cyan-500/10 transition-colors"
                    title="Usar como Color Secundario"
                  >
                    S
                  </button>

                  {activeStylePalette.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStyleColor(design.style, idx)}
                      className="p-1 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                      title="Eliminar este color de la paleta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Color to Palette Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-purple-500/10 dark:border-purple-500/20">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Añadir nuevo color a esta paleta:
          </span>
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <input
              type="color"
              aria-label="Seleccionar nuevo color para añadir"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
            <input
              type="text"
              aria-label="Código hexadecimal del nuevo color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-20 text-xs font-mono uppercase bg-transparent text-zinc-900 dark:text-zinc-100 outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => handleAddStyleColor(design.style)}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Color</span>
          </button>
        </div>
      </div>

      {/* 4. Global Color Tokens, Typography & Dark mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Style Framework */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Layers className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  3. Framework de Estilos CSS / UI Kit
                </h3>
                <p className="text-[11px] text-zinc-500">Framework utilitario para maquetación</p>
              </div>
            </div>

            {design.styleFramework && (
              <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs font-medium flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Seleccionado:</span>
                <span className="font-bold truncate ml-2">{design.styleFramework}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {STYLE_FRAMEWORKS.map((sf) => {
                const isSelected = design.styleFramework === sf;
                return (
                  <button
                    key={sf}
                    type="button"
                    onClick={() => handleUpdate({ styleFramework: sf })}
                    className={`p-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold ring-1 ring-cyan-500/30'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <span className="truncate">{sf}</span>
                    {isSelected && <Check className="w-4 h-4 text-cyan-500 shrink-0 ml-1.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Style Framework input */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
            {!showAddFramework ? (
              <button
                type="button"
                onClick={() => setShowAddFramework(true)}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Especificar otro framework CSS / UI Kit personalizado...</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customFrameworkInput}
                  onChange={(e) => setCustomFrameworkInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customFrameworkInput.trim()) {
                      handleUpdate({ styleFramework: customFrameworkInput.trim() });
                      setCustomFrameworkInput('');
                      setShowAddFramework(false);
                    } else if (e.key === 'Escape') {
                      setShowAddFramework(false);
                    }
                  }}
                  placeholder="Ej. Tailwind CSS + DaisyUI, Panda CSS, UnoCSS..."
                  className="flex-1 text-xs px-3 py-2 bg-white dark:bg-zinc-950 border border-cyan-500 rounded-xl outline-none text-zinc-900 dark:text-zinc-100"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customFrameworkInput.trim()) {
                      handleUpdate({ styleFramework: customFrameworkInput.trim() });
                      setCustomFrameworkInput('');
                      setShowAddFramework(false);
                    }
                  }}
                  className="px-3 py-2 text-xs font-bold bg-cyan-600 text-white rounded-xl cursor-pointer"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFramework(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer px-1"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Primary/Secondary Color Tokens, Typography & Dark mode */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                4. Tokens de Acción, Tema y Tipografía
              </h3>
              <p className="text-[11px] text-zinc-500">Colores focales (CTA), modo oscuro y fuentes tipográficas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div>
              <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Color Primario (CTA)
              </span>
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <input
                  type="color"
                  aria-label="Color Primario"
                  value={design.primaryColor}
                  onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  aria-label="Código hexadecimal de Color Primario"
                  value={design.primaryColor}
                  onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                  className="w-full text-xs font-mono uppercase bg-transparent text-zinc-900 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Color Secundario / Acento
              </span>
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <input
                  type="color"
                  aria-label="Color Secundario"
                  value={design.secondaryColor}
                  onChange={(e) => handleUpdate({ secondaryColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  aria-label="Código hexadecimal de Color Secundario"
                  value={design.secondaryColor}
                  onChange={(e) => handleUpdate({ secondaryColor: e.target.value })}
                  className="w-full text-xs font-mono uppercase bg-transparent text-zinc-900 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Typography Input & Quick Presets */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-purple-500" />
              <span>Tipografía Principal y de Código (Editable)</span>
            </label>
            <input
              type="text"
              value={design.typography}
              onChange={(e) => handleUpdate({ typography: e.target.value })}
              placeholder="Ej. Inter & JetBrains Mono, Plus Jakarta Sans..."
              className="w-full text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
            />
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {TYPOGRAPHY_SUGGESTIONS.map((font) => {
                const isActiveFont = design.typography === font;
                return (
                  <button
                    key={font}
                    type="button"
                    onClick={() => handleUpdate({ typography: font })}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                      isActiveFont
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    {font.split(',')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <SunMoon className="w-4.5 h-4.5 text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Modo Oscuro Predeterminado (Dark-First)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={design.darkModeDefault}
                onChange={(e) => handleUpdate({ darkModeDefault: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 5. Animation Libraries with Repository Links */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Terminal className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  5. Librerías de Animaciones JavaScript & Efectos
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {design.animationLibraries.length} seleccionadas
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">20 motores profesionales con comandos de instalación e importaciones para DESIGN.md</p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-56 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={animSearch}
              onChange={(e) => setAnimSearch(e.target.value)}
              placeholder="Buscar animación..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1 max-h-[520px] overflow-y-auto pr-1">
          {ANIMATION_LIBRARIES.filter(
            (a) =>
              !animSearch ||
              a.name.toLowerCase().includes(animSearch.toLowerCase()) ||
              a.description.toLowerCase().includes(animSearch.toLowerCase())
          ).map((anim) => {
            const isSelected = design.animationLibraries.includes(anim.name);
            return (
              <div
                key={anim.name}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">{anim.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleAnimationLib(anim.name)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3" /> : null}
                      {isSelected ? 'Activo' : 'Añadir'}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">{anim.description}</p>
                </div>

                <div className="space-y-1.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-[11px]">
                  <div className="text-zinc-400 font-mono text-[10px] truncate" title={anim.installCommand}>
                    {anim.installCommand}
                  </div>
                  <a
                    href={anim.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-medium text-[11px]"
                  >
                    <span>Repositorio oficial</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Animation Libraries Input & Active Custom Pills */}
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2.5">
          {design.animationLibraries.filter((lib) => !ANIMATION_LIBRARIES.some((a) => a.name === lib)).length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-zinc-500">Personalizadas añadidas:</span>
              {design.animationLibraries
                .filter((lib) => !ANIMATION_LIBRARIES.some((a) => a.name === lib))
                .map((customLib) => (
                  <span
                    key={customLib}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-2xs"
                  >
                    <span>{customLib}</span>
                    <button
                      type="button"
                      onClick={() => toggleAnimationLib(customLib)}
                      className="hover:text-red-200 cursor-pointer"
                      title="Quitar librería"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customAnimInput}
              onChange={(e) => setCustomAnimInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomAnim()}
              placeholder="Especificar otra librería o efecto de animación personalizado (ej. Barba.js, Curtains.js, View Transitions API)..."
              className="flex-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <button
              type="button"
              onClick={handleAddCustomAnim}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Animación</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Icon Libraries */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Code2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  6. Librerías de Iconografía Sugeridas
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {design.iconLibraries.length} seleccionadas
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">20 colecciones vectoriales consistentes para interfaces limpias</p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-56 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
              placeholder="Buscar iconos..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 max-h-[520px] overflow-y-auto pr-1">
          {ICON_LIBRARIES.filter(
            (i) =>
              !iconSearch ||
              i.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
              i.description.toLowerCase().includes(iconSearch.toLowerCase())
          ).map((iconLib) => {
            const isSelected = design.iconLibraries.includes(iconLib.name);
            return (
              <div
                key={iconLib.name}
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-950/20 ring-1 ring-blue-500/30 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">{iconLib.name}</div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">{iconLib.description}</p>
                  <div className="text-[10px] text-zinc-400 font-mono mt-1 truncate" title={iconLib.installCommand}>
                    {iconLib.installCommand}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleIconLib(iconLib.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300'
                  }`}
                >
                  {isSelected ? 'Incluido' : 'Incluir'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom Icon Libraries Input & Active Custom Pills */}
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2.5">
          {design.iconLibraries.filter((lib) => !ICON_LIBRARIES.some((i) => i.name === lib)).length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-zinc-500">Personalizadas añadidas:</span>
              {design.iconLibraries
                .filter((lib) => !ICON_LIBRARIES.some((i) => i.name === lib))
                .map((customIcon) => (
                  <span
                    key={customIcon}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-2xs"
                  >
                    <span>{customIcon}</span>
                    <button
                      type="button"
                      onClick={() => toggleIconLib(customIcon)}
                      className="hover:text-red-200 cursor-pointer"
                      title="Quitar librería de iconos"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customIconInput}
              onChange={(e) => setCustomIconInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomIcon()}
              placeholder="Especificar otra librería de iconos o SVGs personalizados (ej. FontAwesome Pro, IconPark, SVGs propios)..."
              className="flex-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              type="button"
              onClick={handleAddCustomIcon}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Iconos</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. OBSERVACIONES, ESPECIFICACIONES Y DIRECTRICES PERSONALIZADAS DE DISEÑO */}
      <div className="bg-gradient-to-br from-purple-500/5 via-zinc-50 to-cyan-500/5 dark:from-purple-950/20 dark:via-zinc-900/60 dark:to-cyan-950/20 p-5 sm:p-6 rounded-2xl border border-purple-500/25 dark:border-purple-500/30 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-500/15 dark:border-purple-500/25">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  7. Observaciones y Especificaciones Adicionales de Diseño
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {observations.length} puntuales
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Escribe aquí cualquier detalle visual, comportamiento de layout, referencias o restricciones de UI/UX para especificar más a la IA.
              </p>
            </div>
          </div>
        </div>

        {/* 7.1 Lista de observaciones puntuales */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            A) Observaciones o Requerimientos Visuales Puntuales (Lista Editable):
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newObservation}
              onChange={(e) => setNewObservation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddObservation()}
              placeholder="Ej. El navbar debe ser flotante con blur; las cards deben tener bordes de 1px y radio de 16px..."
              className="flex-1 text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder:text-zinc-400"
            />
            <button
              type="button"
              onClick={handleAddObservation}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Observación</span>
            </button>
          </div>

          {observations.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {observations.map((obs, idx) => {
                const isEditing = editingObsIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs sm:text-sm transition-all ${
                      isEditing
                        ? 'border-purple-500 bg-purple-500/5 dark:bg-purple-950/20 ring-1 ring-purple-500/30'
                        : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          autoFocus
                          value={editingObsText}
                          onChange={(e) => setEditingObsText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEditObservation(idx);
                            if (e.key === 'Escape') {
                              setEditingObsIdx(null);
                              setEditingObsText('');
                            }
                          }}
                          className="flex-1 text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-purple-500 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEditObservation(idx)}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Guardar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingObsIdx(null);
                            setEditingObsText('');
                          }}
                          className="px-2.5 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <span className="w-5 h-5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span
                            onClick={() => {
                              setEditingObsIdx(idx);
                              setEditingObsText(obs);
                            }}
                            className="text-zinc-800 dark:text-zinc-200 leading-relaxed break-words cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            title="Haz clic para editar esta observación"
                          >
                            {obs}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingObsIdx(idx);
                              setEditingObsText(obs);
                            }}
                            className="p-1 text-zinc-400 hover:text-purple-600 hover:bg-purple-500/10 rounded-md transition-colors cursor-pointer"
                            title="Editar observación"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveObservation(idx)}
                            className="p-1 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                            title="Eliminar observación"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-zinc-400 italic py-1">
              No hay observaciones puntuales añadidas aún. Escribe arriba y presiona Enter o &ldquo;Añadir Observación&rdquo;.
            </div>
          )}
        </div>

        {/* 7.2 Pautas y Observaciones Generales en Texto Libre (customDesignGuidelines) */}
        <div className="space-y-2 pt-3 border-t border-purple-500/15 dark:border-purple-500/25">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            B) Directrices Detalladas, Notas de Layout y Especificaciones Libres de Diseño:
          </label>
          <textarea
            rows={4}
            value={design.customDesignGuidelines || ''}
            onChange={(e) => handleUpdate({ customDesignGuidelines: e.target.value })}
            placeholder="Describe con total libertad detalles como: estructura del layout (sidebar fija, header pegajoso, bento de 3 columnas), referencias estéticas (ej. estilo Linear / Vercel / Stripe), comportamiento en móviles, uso de sombras, bordes, gradientes o microinteracciones específicas..."
            className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder:text-zinc-400 leading-relaxed"
          />
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            💡 Todo lo que especifiques aquí se inyectará directamente en <code className="font-mono text-purple-600 dark:text-purple-400">DESIGN.md</code> y en el Prompt Maestro de <code className="font-mono text-purple-600 dark:text-purple-400">PRD.md</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
