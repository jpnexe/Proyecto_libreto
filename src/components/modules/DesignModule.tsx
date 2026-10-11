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

export const DesignModule: React.FC<DesignModuleProps> = ({ project, onChange }) => {
  const { design } = project;

  // Search and category filters for styles
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

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
    // Exclude compatibility aliases from regular cards unless matched specifically
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
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              DESIGN.md
            </span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-500" />
              Sistema de Diseño & 21 Estilos Visuales
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Selecciona entre 21 estéticas visuales, edita la paleta de colores de cada estilo y define librerías de animación e iconografía.
          </p>
        </div>

        {/* Active Style Indicator Pill */}
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs shrink-0 self-start sm:self-auto">
          <span className="text-zinc-500 font-medium">Estilo Activo:</span>
          <span className="font-bold text-purple-600 dark:text-purple-400 font-mono">
            {currentStyleDef.name.split(' (')[0]}
          </span>
        </div>
      </div>

      {/* 1. Categorized & Searchable Style Selector */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-500" />
            <span>1. Catálogo de Estilos Visuales (21 Estéticas Disponibles)</span>
          </label>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar estilo visual..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Category Filter Pills with horizontal scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-smooth">
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
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Style Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[560px] overflow-y-auto pr-1">
          {filteredStyles.map((style) => {
            const isSelected = design.style === style.id;
            const styleColors = getStyleColors(style.id);

            return (
              <div
                key={style.id}
                onClick={() => handleUpdate({ style: style.id as DesignStyleId })}
                className={`cursor-pointer rounded-2xl p-4 border transition-all relative overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/5 dark:bg-purple-950/25 ring-2 ring-purple-500/30 shadow-md'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {/* Top: Category, Title and Checkmark */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-semibold">
                        {style.category}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 mt-1 line-clamp-1">
                        {style.name}
                      </h4>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2.5 line-clamp-2 leading-relaxed">
                    {style.subtitle}
                  </p>
                </div>

                {/* Visual Preview Box */}
                <div className="space-y-2.5">
                  <div
                    className={`p-3 rounded-xl ${style.sampleBg} ${style.sampleBorder} ${style.sampleShadow} transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 text-[10px] ${style.sampleBadgeClass}`}>
                        Preview UI
                      </span>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-1.5 w-12 rounded bg-zinc-400/40" />
                      <div className="h-1.5 w-6 rounded bg-zinc-400/30" />
                    </div>
                  </div>

                  {/* Palette Sample Dots (reflecting customizations) */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    <span className="text-[10px] font-medium text-zinc-400">
                      Paleta ({styleColors.length}):
                    </span>
                    <div className="flex items-center gap-1">
                      {styleColors.slice(0, 5).map((c, i) => (
                        <div
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-2xs"
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

      {/* 2. ADVANCED COLOR CONTROL FOR THE SELECTED STYLE */}
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
              Personaliza cada color de la paleta asignada a este estilo. Los cambios se reflejarán automáticamente en <code className="text-purple-600 dark:text-purple-400 font-mono">DESIGN.md</code>.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white/60 dark:bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-0.5">
              Pautas de Paleta Original:
            </span>
            <p className="text-zinc-500 leading-relaxed">
              {currentStyleDef.paletteDescription}
            </p>
          </div>
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-0.5">
              Uso Ideal Recomendado:
            </span>
            <p className="text-zinc-500 leading-relaxed">
              {currentStyleDef.idealUse}
            </p>
          </div>
        </div>

        {/* Color Palette Swatches Editor */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
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
                      className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
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
                  {/* Set as Primary color */}
                  <button
                    type="button"
                    onClick={() => handleUpdate({ primaryColor: colorHex })}
                    className="p-1 rounded-md text-[10px] font-semibold text-zinc-400 hover:text-purple-600 hover:bg-purple-500/10 transition-colors"
                    title="Usar como Color Primario"
                  >
                    P
                  </button>

                  {/* Set as Secondary color */}
                  <button
                    type="button"
                    onClick={() => handleUpdate({ secondaryColor: colorHex })}
                    className="p-1 rounded-md text-[10px] font-semibold text-zinc-400 hover:text-cyan-600 hover:bg-cyan-500/10 transition-colors"
                    title="Usar como Color Secundario"
                  >
                    S
                  </button>

                  {/* Remove color button */}
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
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-500/10 dark:border-purple-500/20">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Añadir nuevo color a esta paleta:
          </span>
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 px-2 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <input
              type="color"
              aria-label="Seleccionar nuevo color para añadir"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
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
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Color</span>
          </button>
        </div>
      </div>

      {/* 3. Global Color Tokens & Dark mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Style Framework */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
          <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-500" />
            3. Framework de Estilos CSS / UI Kit
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STYLE_FRAMEWORKS.map((sf) => {
              const isSelected = design.styleFramework === sf;
              return (
                <button
                  key={sf}
                  type="button"
                  onClick={() => handleUpdate({ styleFramework: sf })}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <span className="truncate">{sf}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary/Secondary Color Tokens & Dark mode */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            4. Tokens de Acción Principal y Tema
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Color Primario (CTA)
              </span>
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <input
                  type="color"
                  aria-label="Color Primario"
                  value={design.primaryColor}
                  onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
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
              <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Color Secundario / Acento
              </span>
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <input
                  type="color"
                  aria-label="Color Secundario"
                  value={design.secondaryColor}
                  onChange={(e) => handleUpdate({ secondaryColor: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
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

          <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <SunMoon className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
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
              <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Animation Libraries with Repository Links & Install Commands */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-500" />
          5. Librerías de Animaciones JavaScript & Repositorios
        </label>
        <p className="text-xs text-zinc-500">
          La aplicación generará automáticamente en <code className="text-cyan-500 font-mono">DESIGN.md</code> los enlaces oficiales al repositorio y los comandos de instalación.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ANIMATION_LIBRARIES.map((anim) => {
            const isSelected = design.animationLibraries.includes(anim.name);
            return (
              <div
                key={anim.name}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{anim.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleAnimationLib(anim.name)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                      }`}
                    >
                      {isSelected ? <Check className="w-2.5 h-2.5" /> : null}
                      {isSelected ? 'Activo' : 'Añadir'}
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-500 mb-2 leading-tight">{anim.description}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[10px]">
                  <div className="flex items-center justify-between text-zinc-400 font-mono">
                    <span className="truncate">{anim.installCommand}</span>
                  </div>
                  <a
                    href={anim.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>Repositorio oficial</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Icon Libraries */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-500" />
          6. Librerías de Iconografía Sugeridas
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ICON_LIBRARIES.map((iconLib) => {
            const isSelected = design.iconLibraries.includes(iconLib.name);
            return (
              <div
                key={iconLib.name}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{iconLib.name}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">{iconLib.installCommand}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleIconLib(iconLib.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {isSelected ? 'Incluido' : 'Incluir'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
