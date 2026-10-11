import React from 'react';
import {
  FolderDown,
  FileArchive,
  History,
  Sparkles,
  Columns2,
  Edit3,
  Eye,
  Sun,
  Moon,
  CheckCircle2,
  ScrollText,
} from 'lucide-react';
import type { LibretoProject } from '../types/libreto';

interface HeaderProps {
  project: LibretoProject;
  onUpdateProjectName: (name: string) => void;
  onOpenHistory: () => void;
  onOpenPresets: () => void;
  onExportFolder: () => void;
  onExportZip: () => void;
  isExporting: boolean;
  viewMode: 'split' | 'editor' | 'preview';
  onChangeViewMode: (mode: 'split' | 'editor' | 'preview') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  onUpdateProjectName,
  onOpenHistory,
  onOpenPresets,
  onExportFolder,
  onExportZip,
  isExporting,
  viewMode,
  onChangeViewMode,
  isDark,
  onToggleTheme,
  historyCount,
}) => {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [titleInput, setTitleInput] = React.useState(project.name);

  const handleStartEditing = () => {
    setTitleInput(project.name);
    setIsEditingTitle(true);
  };

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      onUpdateProjectName(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Project Name */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20 shrink-0">
            <ScrollText className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Construcción de Libreto
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-2.5 h-2.5" /> 8 Directivas .MD
              </span>
            </div>

            {isEditingTitle ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                  autoFocus
                  className="text-base font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            ) : (
              <button
                onClick={handleStartEditing}
                className="group flex items-center gap-1.5 text-base font-bold text-zinc-900 dark:text-zinc-100 hover:text-cyan-600 dark:hover:text-cyan-400 truncate text-left transition-colors"
                title="Clic para renombrar proyecto"
              >
                <span className="truncate">{project.name}</span>
                <Edit3 className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 text-zinc-500 transition-opacity shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* Center: View Switcher (Desktop) */}
        <div className="hidden lg:flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => onChangeViewMode('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              viewMode === 'editor'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Configuración
          </button>
          <button
            onClick={() => onChangeViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              viewMode === 'split'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            Dividido
          </button>
          <button
            onClick={() => onChangeViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              viewMode === 'preview'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Vista Previa
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Presets Modal Button */}
          <button
            onClick={onOpenPresets}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
            title="Explorar plantillas predefinidas"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Plantillas
          </button>

          {/* History Drawer Button */}
          <button
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
            title="Ver proyectos guardados"
          >
            <History className="w-3.5 h-3.5 text-cyan-500" />
            <span className="hidden md:inline">Historial</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-full">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
          </button>

          {/* Export ZIP Button */}
          <button
            onClick={onExportZip}
            disabled={isExporting}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-zinc-800 dark:text-zinc-100 bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 transition-all active:scale-95 disabled:opacity-50"
            title="Descargar paquete .ZIP universal"
          >
            <FileArchive className="w-3.5 h-3.5 text-blue-500" />
            Descargar .ZIP
          </button>

          {/* Export to System Folder Button (Primary) */}
          <button
            onClick={onExportFolder}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-md shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50"
            title="Guardar directamente en una carpeta de tu sistema con window.showDirectoryPicker()"
          >
            <FolderDown className="w-4 h-4 shrink-0" />
            <span className="font-bold">Guardar en Carpeta</span>
          </button>
        </div>
      </div>
    </header>
  );
};
