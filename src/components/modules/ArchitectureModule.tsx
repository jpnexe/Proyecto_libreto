import React, { useState } from 'react';
import {
  Globe,
  Smartphone,
  Layers,
  Code2,
  Database,
  Network,
  Cpu,
  Check,
  FileCode,
  Zap,
  ServerOff,
  Cloud,
  Search,
  Plus,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import type { LibretoProject, TargetPlatform } from '../../types/libreto';
import {
  ARCHITECTURAL_PATTERNS,
  BACKEND_FRAMEWORKS,
  CONNECTION_TYPES,
  DATABASES,
  FRONTEND_FRAMEWORKS,
  LANGUAGES,
  PLATFORMS,
  STATIC_HOSTINGS,
} from '../../constants/options';

interface ArchitectureModuleProps {
  project: LibretoProject;
  onChange: (updated: Partial<LibretoProject>) => void;
}

export const ArchitectureModule: React.FC<ArchitectureModuleProps> = ({ project, onChange }) => {
  const { architecture } = project;

  // Search states for long lists
  const [frontendSearch, setFrontendSearch] = useState('');
  const [backendSearch, setBackendSearch] = useState('');
  const [databaseSearch, setDatabaseSearch] = useState('');

  // Custom addition states
  const [customLangInput, setCustomLangInput] = useState('');
  const [showAddLang, setShowAddLang] = useState(false);

  const [customFrontendInput, setCustomFrontendInput] = useState('');
  const [showAddFrontend, setShowAddFrontend] = useState(false);

  const [customBackendInput, setCustomBackendInput] = useState('');
  const [showAddBackend, setShowAddBackend] = useState(false);

  const [customDbInput, setCustomDbInput] = useState('');
  const [showAddDb, setShowAddDb] = useState(false);

  const [customConnInput, setCustomConnInput] = useState('');
  const [showAddConn, setShowAddConn] = useState(false);

  const [customPatternInput, setCustomPatternInput] = useState('');
  const [showAddPattern, setShowAddPattern] = useState(false);

  const handleUpdate = (fields: Partial<typeof architecture>) => {
    onChange({
      architecture: {
        ...architecture,
        ...fields,
      },
    });
  };

  const isStaticSite =
    architecture?.platform === 'static' ||
    Boolean(architecture?.isStaticSite) ||
    Boolean(architecture?.database?.includes('Ninguna')) ||
    Boolean(architecture?.backendFramework?.includes('Ninguno'));

  const applyStaticPreset = () => {
    handleUpdate({
      platform: 'static',
      isStaticSite: true,
      frontendFramework: 'Astro (SSG / Islands Architecture)',
      backendFramework: 'Ninguno (Solo Frontend Estático / Jamstack)',
      database: 'Ninguna (Sitio Estático / Sin BD)',
      connectionType: 'Archivos Estáticos Locales (Markdown / MDX / JSON)',
      architecturalPattern: 'SSG (Static Site Generation / Jamstack)',
      staticHosting: architecture?.staticHosting || 'Cloudflare Pages',
    });
  };

  const applyDynamicPreset = () => {
    handleUpdate({
      platform: 'web',
      isStaticSite: false,
      frontendFramework: 'Next.js (App Router - Fullstack)',
      backendFramework: 'Node.js (NestJS)',
      database: 'PostgreSQL',
      connectionType: 'REST API (JSON)',
      architecturalPattern: 'Clean Architecture (Domain-Driven / Use Cases)',
    });
  };

  const QUICK_STACKS = [
    {
      id: 'static-jamstack',
      label: 'Web Estática Jamstack',
      badge: 'Astro (Sin BD)',
      icon: Zap,
      accentBg: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30',
      description: 'Astro SSG, sin backend, Markdown/MDX local y hosting en Edge CDN ($0 costo).',
      apply: applyStaticPreset,
    },
    {
      id: 'fullstack-next',
      label: 'Fullstack Serverless',
      badge: 'Next.js + Supabase',
      icon: Cloud,
      accentBg: 'bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 border border-cyan-500/30',
      description: 'Next.js App Router, Supabase Edge, PostgreSQL relacional y endpoints REST API.',
      apply: () => {
        handleUpdate({
          platform: 'web',
          isStaticSite: false,
          frontendFramework: 'Next.js (App Router - Fullstack)',
          backendFramework: 'Supabase Functions / Edge',
          database: 'Supabase (PostgreSQL BaaS)',
          connectionType: 'REST API (JSON)',
          architecturalPattern: 'Capas Clásicas (Controller - Service - Repository)',
        });
      },
    },
    {
      id: 'clean-react',
      label: 'Clean Architecture SPA',
      badge: 'React + NestJS',
      icon: Cpu,
      accentBg: 'bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/30',
      description: 'React Vite SPA, API modular NestJS en Node.js, PostgreSQL y Clean Architecture.',
      apply: () => {
        handleUpdate({
          platform: 'web',
          isStaticSite: false,
          frontendFramework: 'React (Vite)',
          backendFramework: 'Node.js (NestJS)',
          database: 'PostgreSQL',
          connectionType: 'REST API (JSON)',
          architecturalPattern: 'Clean Architecture (Domain-Driven / Use Cases)',
        });
      },
    },
    {
      id: 'mobile-expo',
      label: 'App Móvil React Native',
      badge: 'Expo + FastAPI',
      icon: Smartphone,
      accentBg: 'bg-purple-500/15 text-purple-500 dark:text-purple-400 border border-purple-500/30',
      description: 'Expo para iOS/Android, backend en FastAPI Python y patrón de arquitectura MVVM.',
      apply: () => {
        handleUpdate({
          platform: 'mobile',
          isStaticSite: false,
          frontendFramework: 'React Native / Expo',
          backendFramework: 'FastAPI (Python)',
          database: 'PostgreSQL',
          connectionType: 'REST API (JSON)',
          architecturalPattern: 'MVVM (Model-View-ViewModel)',
        });
      },
    },
  ];

  const toggleLanguage = (lang: string) => {
    const current = [...(architecture?.languages || [])];
    const index = current.indexOf(lang);
    if (index >= 0) {
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      current.push(lang);
    }
    handleUpdate({ languages: current });
  };

  const handleAddCustomLanguage = () => {
    const trimmed = customLangInput.trim();
    if (!trimmed) return;
    const current = [...(architecture?.languages || [])];
    if (!current.includes(trimmed)) {
      current.push(trimmed);
      handleUpdate({ languages: current });
    }
    setCustomLangInput('');
    setShowAddLang(false);
  };

  const filteredFrontend = FRONTEND_FRAMEWORKS.filter((fw) =>
    fw.toLowerCase().includes(frontendSearch.toLowerCase())
  );

  const filteredBackend = BACKEND_FRAMEWORKS.filter((bw) =>
    bw.toLowerCase().includes(backendSearch.toLowerCase())
  );

  const filteredDatabases = DATABASES.filter((db) =>
    db.toLowerCase().includes(databaseSearch.toLowerCase())
  );

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* 1. Module Header */}
      <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 shadow-xs">
              <Cpu className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25">
                  ARCHITECTURE.md
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                  Paso 2 de 8
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Pila Tecnológica & Arquitectura de Software
              </h2>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Configura la infraestructura de software, patrones de diseño y frameworks vinculantes para el asistente IA.
          </p>
        </div>

        {/* Mode Switcher Banner / Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                isStaticSite ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-500'
              }`}
            />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Modo Actual:{' '}
              <strong className={isStaticSite ? 'text-emerald-500' : 'text-cyan-500'}>
                {isStaticSite ? 'Sitio Web Estático (SSG / Jamstack)' : 'Aplicación Web Dinámica / Backend'}
              </strong>
            </span>
          </div>

          <div>
            {isStaticSite ? (
              <button
                type="button"
                onClick={applyDynamicPreset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 border border-zinc-700 shadow-xs transition-all active:scale-98 cursor-pointer"
                title="Cambiar a aplicación dinámica con backend y base de datos"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cambiar a Web Dinámica</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={applyStaticPreset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xs shadow-emerald-500/20 transition-all active:scale-98 cursor-pointer"
                title="Configurar automáticamente como sitio web estático Jamstack sin base de datos"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-200" />
                <span>Configurar como Web Estática (Sin BD)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Quick Stacks Cards (2 columns, roomy layout) */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Plantillas Rápidas de Stack Arquitectónico
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 hidden sm:inline">
            Aplica un stack verificado con 1 clic
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_STACKS.map((stack) => {
            const Icon = stack.icon;
            return (
              <button
                key={stack.id}
                type="button"
                onClick={stack.apply}
                className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-cyan-500/50 hover:bg-cyan-500/5 dark:hover:bg-cyan-950/20 text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${stack.accentBg}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 truncate">
                      {stack.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/80 shrink-0">
                    {stack.badge}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed pl-0.5">
                  {stack.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Static Site Mode Banner if active */}
      {isStaticSite && (
        <div className="bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4.5 flex items-start gap-3.5 transition-all">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <FileCode className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm flex-1">
            <div className="font-bold text-emerald-800 dark:text-emerald-300">
              ⚡ Modo Sitio Web Estático (SSG / Jamstack) Activo
            </div>
            <p className="text-emerald-700/90 dark:text-emerald-400/90 mt-1 leading-relaxed">
              Este proyecto <strong>no requiere base de datos</strong> ni servidores de backend dinámicos. La IA sabrá que el contenido se alimenta de archivos locales (Markdown, MDX o JSON) o contenido estático puro, generando un bundle HTML/CSS/JS ultrarrápido para CDNs como Cloudflare Pages o Vercel.
            </p>
          </div>
        </div>
      )}

      {/* 3. Plataforma Objetivo (2 spacious columns) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
            <Globe className="w-4.5 h-4.5" />
          </div>
          <div>
            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              1. Plataforma Objetivo
            </label>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Tipo de entorno de despliegue principal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PLATFORMS.map((plat) => {
            const isSelected = architecture?.platform === plat.id;
            return (
              <button
                key={plat.id}
                type="button"
                onClick={() => {
                  if (plat.id === 'static') {
                    applyStaticPreset();
                  } else {
                    handleUpdate({
                      platform: plat.id as TargetPlatform,
                      isStaticSite: false,
                      backendFramework:
                        architecture?.backendFramework?.includes('Ninguno')
                          ? 'Node.js (NestJS)'
                          : architecture?.backendFramework,
                      database:
                        architecture?.database?.includes('Ninguna')
                          ? 'PostgreSQL'
                          : architecture?.database,
                      connectionType:
                        architecture?.connectionType?.includes('Archivos Estáticos')
                          ? 'REST API (JSON)'
                          : architecture?.connectionType,
                      architecturalPattern:
                        architecture?.architecturalPattern?.includes('SSG')
                          ? 'Clean Architecture (Domain-Driven / Use Cases)'
                          : architecture?.architecturalPattern,
                    });
                  }
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/10 dark:bg-cyan-950/30 ring-2 ring-cyan-500/30 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    plat.id === 'web'
                      ? 'bg-blue-500/15 text-blue-500'
                      : plat.id === 'static'
                      ? 'bg-emerald-500/15 text-emerald-500'
                      : plat.id === 'mobile'
                      ? 'bg-purple-500/15 text-purple-500'
                      : 'bg-amber-500/15 text-amber-500'
                  }`}
                >
                  {plat.id === 'web' && <Globe className="w-5.5 h-5.5" />}
                  {plat.id === 'static' && <FileCode className="w-5.5 h-5.5" />}
                  {plat.id === 'mobile' && <Smartphone className="w-5.5 h-5.5" />}
                  {plat.id === 'dual' && <Layers className="w-5.5 h-5.5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                      {plat.label}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {plat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Lenguajes de Programación */}
      <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Code2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                2. Lenguajes de Programación
              </label>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Selecciona uno o varios lenguajes activos
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {(architecture?.languages || []).length} seleccionados
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {LANGUAGES.map((lang) => {
            const isSelected = (architecture?.languages || []).includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-xs ring-2 ring-amber-500/30'
                    : 'bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {isSelected && <Check className="w-4 h-4" />}
                <span>{lang}</span>
              </button>
            );
          })}

          {/* Custom added languages */}
          {(architecture?.languages || [])
            .filter((l) => !LANGUAGES.includes(l))
            .map((customL) => (
              <button
                key={customL}
                type="button"
                onClick={() => toggleLanguage(customL)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 bg-amber-500 text-black shadow-xs ring-2 ring-amber-500/30 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{customL} (Custom)</span>
              </button>
            ))}

          {/* Add custom language */}
          {!showAddLang ? (
            <button
              type="button"
              onClick={() => setShowAddLang(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-amber-500 hover:text-amber-500 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir otro lenguaje...</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={customLangInput}
                onChange={(e) => setCustomLangInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomLanguage();
                  } else if (e.key === 'Escape') {
                    setShowAddLang(false);
                  }
                }}
                placeholder="Ej. Elixir, Ruby, Rust..."
                className="px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-amber-500 rounded-xl outline-none text-zinc-900 dark:text-zinc-100"
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddCustomLanguage}
                className="px-3 py-1.5 bg-amber-500 text-black text-xs font-bold rounded-xl cursor-pointer"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => setShowAddLang(false)}
                className="px-2 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. Frontend & Backend Frameworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Frontend Framework */}
        <div className="space-y-3.5 bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <Cpu className="w-4.5 h-4.5" />
                </div>
                <div>
                  <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    3. Frontend / Generador Web
                  </label>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    Capa visual e interacción de usuario
                  </p>
                </div>
              </div>
            </div>

            {/* Currently Selected Pill */}
            {architecture?.frontendFramework && (
              <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-medium flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Seleccionado:</span>
                <span className="font-bold truncate ml-2">{architecture.frontendFramework}</span>
              </div>
            )}

            {/* Search Input */}
            <div className="relative pt-1">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-zinc-400" />
              <input
                type="text"
                value={frontendSearch}
                onChange={(e) => setFrontendSearch(e.target.value)}
                placeholder="Buscar framework frontend..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-900 dark:text-zinc-100 focus:border-blue-500"
              />
            </div>

            {/* Framework List: Single Column for Clean Readability */}
            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1 pt-1">
              {filteredFrontend.map((fw) => {
                const isSelected = architecture?.frontendFramework === fw;
                const isStaticFw =
                  fw.includes('Astro') ||
                  fw.includes('Vanilla') ||
                  fw.includes('Static Export') ||
                  fw.includes('SSG') ||
                  fw.includes('Docs') ||
                  fw.includes('11ty') ||
                  fw.includes('Hugo');

                return (
                  <button
                    key={fw}
                    type="button"
                    onClick={() => handleUpdate({ frontendFramework: fw })}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold ring-1 ring-blue-500/30'
                        : 'border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <span className="leading-snug pr-2">{fw}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isStaticFw && isStaticSite && (
                        <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                          SSG
                        </span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom frontend input */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
            {!showAddFrontend ? (
              <button
                type="button"
                onClick={() => setShowAddFrontend(true)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Especificar otro framework frontend...</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customFrontendInput}
                  onChange={(e) => setCustomFrontendInput(e.target.value)}
                  placeholder="Ej. SolidJS, Qwik, Remix..."
                  className="flex-1 text-xs px-3 py-2 bg-white dark:bg-zinc-950 border border-blue-500 rounded-xl outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customFrontendInput.trim()) {
                      handleUpdate({ frontendFramework: customFrontendInput.trim() });
                      setCustomFrontendInput('');
                      setShowAddFrontend(false);
                    }
                  }}
                  className="px-3 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl cursor-pointer"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFrontend(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer px-1"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Backend Framework */}
        <div className="space-y-3.5 bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <ServerOff className="w-4.5 h-4.5" />
                </div>
                <div>
                  <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    4. Backend / API
                  </label>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    Lógica de negocio y servicios
                  </p>
                </div>
              </div>

              {isStaticSite && (
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Sin Servidor
                </span>
              )}
            </div>

            {/* Currently Selected Pill */}
            {architecture?.backendFramework && (
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-medium flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Seleccionado:</span>
                <span className="font-bold truncate ml-2">{architecture.backendFramework}</span>
              </div>
            )}

            {/* Search Input */}
            <div className="relative pt-1">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-zinc-400" />
              <input
                type="text"
                value={backendSearch}
                onChange={(e) => setBackendSearch(e.target.value)}
                placeholder="Buscar framework backend..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-900 dark:text-zinc-100 focus:border-emerald-500"
              />
            </div>

            {/* Backend List: Single Column */}
            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1 pt-1">
              {filteredBackend.map((bw) => {
                const isSelected = architecture?.backendFramework === bw;
                const isNone = bw.includes('Ninguno');

                return (
                  <button
                    key={bw}
                    type="button"
                    onClick={() => handleUpdate({ backendFramework: bw })}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold ring-1 ring-emerald-500/30'
                        : isNone && isStaticSite
                        ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                        : 'border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <span className="leading-snug pr-2">{bw}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom backend input */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
            {!showAddBackend ? (
              <button
                type="button"
                onClick={() => setShowAddBackend(true)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Especificar otro backend personalizado...</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customBackendInput}
                  onChange={(e) => setCustomBackendInput(e.target.value)}
                  placeholder="Ej. Rust Axum, Go Fiber, Elixir Phoenix..."
                  className="flex-1 text-xs px-3 py-2 bg-white dark:bg-zinc-950 border border-emerald-500 rounded-xl outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customBackendInput.trim()) {
                      handleUpdate({ backendFramework: customBackendInput.trim() });
                      setCustomBackendInput('');
                      setShowAddBackend(false);
                    }
                  }}
                  className="px-3 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl cursor-pointer"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBackend(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer px-1"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Database & Connection Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Database */}
        <div className="space-y-3.5 bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                  <Database className="w-4.5 h-4.5" />
                </div>
                <div>
                  <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    5. Persistencia / Base de Datos
                  </label>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    Almacenamiento de datos o contenido
                  </p>
                </div>
              </div>

              {isStaticSite && (
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Sin Base de Datos
                </span>
              )}
            </div>

            {/* Currently Selected Pill */}
            {architecture?.database && (
              <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-medium flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Seleccionado:</span>
                <span className="font-bold truncate ml-2">{architecture.database}</span>
              </div>
            )}

            {/* Search Input */}
            <div className="relative pt-1">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-zinc-400" />
              <input
                type="text"
                value={databaseSearch}
                onChange={(e) => setDatabaseSearch(e.target.value)}
                placeholder="Buscar base de datos..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-900 dark:text-zinc-100 focus:border-purple-500"
              />
            </div>

            {/* Database List: Single Column */}
            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1 pt-1">
              {filteredDatabases.map((db) => {
                const isSelected = architecture?.database === db;
                const isNone = db.includes('Ninguna') || db.includes('Archivos Locales');

                return (
                  <button
                    key={db}
                    type="button"
                    onClick={() => handleUpdate({ database: db })}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold ring-1 ring-purple-500/30'
                        : isNone && isStaticSite
                        ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                        : 'border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <span className="leading-snug pr-2">{db}</span>
                    {isSelected && <Check className="w-4 h-4 text-purple-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom DB input */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
            {!showAddDb ? (
              <button
                type="button"
                onClick={() => setShowAddDb(true)}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Especificar otra base de datos personalizada...</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customDbInput}
                  onChange={(e) => setCustomDbInput(e.target.value)}
                  placeholder="Ej. Convex, SurrealDB, PlanetScale..."
                  className="flex-1 text-xs px-3 py-2 bg-white dark:bg-zinc-950 border border-purple-500 rounded-xl outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customDbInput.trim()) {
                      handleUpdate({ database: customDbInput.trim() });
                      setCustomDbInput('');
                      setShowAddDb(false);
                    }
                  }}
                  className="px-3 py-2 text-xs font-bold bg-purple-600 text-white rounded-xl cursor-pointer"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDb(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer px-1"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Connection Type */}
        <div className="space-y-3.5 bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Network className="w-4.5 h-4.5" />
                </div>
                <div>
                  <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    6. Conectividad & Protocolo de Datos
                  </label>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    Comunicación y formato de datos
                  </p>
                </div>
              </div>
            </div>

            {/* Currently Selected Pill */}
            {architecture?.connectionType && (
              <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-medium flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Seleccionado:</span>
                <span className="font-bold truncate ml-2">{architecture.connectionType}</span>
              </div>
            )}

            {/* Connection List: Single Column */}
            <div className="flex flex-col gap-1.5 max-h-68 overflow-y-auto pr-1 pt-1">
              {CONNECTION_TYPES.map((ct) => {
                const isSelected = architecture?.connectionType === ct;
                const isStaticConnection =
                  ct.includes('Archivos Estáticos') || ct.includes('Sin Conexión');

                return (
                  <button
                    key={ct}
                    type="button"
                    onClick={() => handleUpdate({ connectionType: ct })}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold ring-1 ring-indigo-500/30'
                        : isStaticConnection && isStaticSite
                        ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                        : 'border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <span className="leading-snug pr-2">{ct}</span>
                    {isSelected && <Check className="w-4 h-4 text-indigo-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Connectivity input */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
            {!showAddConn ? (
              <button
                type="button"
                onClick={() => setShowAddConn(true)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Especificar otro protocolo personalizado...</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customConnInput}
                  onChange={(e) => setCustomConnInput(e.target.value)}
                  placeholder="Ej. tRPC, GraphQL Subscriptions..."
                  className="flex-1 text-xs px-3 py-2 bg-white dark:bg-zinc-950 border border-indigo-500 rounded-xl outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customConnInput.trim()) {
                      handleUpdate({ connectionType: customConnInput.trim() });
                      setCustomConnInput('');
                      setShowAddConn(false);
                    }
                  }}
                  className="px-3 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl cursor-pointer"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddConn(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer px-1"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7. Patrón Arquitectónico del Software (2 spacious columns) */}
      <div className="space-y-4 bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
              <Layers className="w-4.5 h-4.5" />
            </div>
            <div>
              <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                7. Patrón Arquitectónico del Software
              </label>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Diseño estructural y separación de responsabilidades
              </p>
            </div>
          </div>

          {architecture?.architecturalPattern && (
            <span className="hidden sm:inline-block px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 max-w-[220px] truncate">
              {architecture.architecturalPattern}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ARCHITECTURAL_PATTERNS.map((pat) => {
            const isSelected = architecture?.architecturalPattern === pat;
            const isStaticPat =
              pat.includes('SSG') ||
              pat.includes('Islas') ||
              pat.includes('SPA Estática') ||
              pat.includes('Contenido');

            return (
              <button
                key={pat}
                type="button"
                onClick={() => handleUpdate({ architecturalPattern: pat })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-900 dark:text-cyan-200 ring-2 ring-cyan-500/30'
                    : isStaticPat && isStaticSite
                    ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                    : 'border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <span className="font-semibold text-xs leading-snug">{pat}</span>
                {isSelected && <Check className="w-4 h-4 text-cyan-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Custom Pattern input */}
        <div className="pt-1">
          {!showAddPattern ? (
            <button
              type="button"
              onClick={() => setShowAddPattern(true)}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Especificar otro patrón arquitectónico personalizado...</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customPatternInput}
                onChange={(e) => setCustomPatternInput(e.target.value)}
                placeholder="Ej. Vertical Slice Architecture, CQRS / Event Sourcing..."
                className="flex-1 text-xs px-3 py-2 bg-white dark:bg-zinc-950 border border-cyan-500 rounded-xl outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  if (customPatternInput.trim()) {
                    handleUpdate({ architecturalPattern: customPatternInput.trim() });
                    setCustomPatternInput('');
                    setShowAddPattern(false);
                  }
                }}
                className="px-3 py-2 text-xs font-bold bg-cyan-600 text-white rounded-xl cursor-pointer"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => setShowAddPattern(false)}
                className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer px-1"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Static Hosting CDN Recommendation if static */}
        {isStaticSite && (
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <Cloud className="w-4 h-4" />
              </div>
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Hosting Estático / CDN Sugerido para Despliegue ($0 Costo):
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STATIC_HOSTINGS.map((host) => {
                const isSelected = architecture?.staticHosting === host;
                return (
                  <button
                    key={host}
                    type="button"
                    onClick={() => handleUpdate({ staticHosting: host })}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer truncate ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                        : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    {host}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Notes */}
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Notas Arquitectónicas Particulares (Opcional)
          </label>
          <textarea
            rows={2}
            value={architecture?.customNotes || ''}
            onChange={(e) => handleUpdate({ customNotes: e.target.value })}
            className="w-full text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500 leading-relaxed"
            placeholder={
              isStaticSite
                ? 'Ej. Generación de sitio estático con Astro en carpeta dist/ y despliegue continuo en Cloudflare Pages.'
                : 'Ej. Uso de Docker Compose para orquestar la BD local y Redis para colas de mensajería BullMQ.'
            }
          />
        </div>
      </div>
    </div>
  );
};
