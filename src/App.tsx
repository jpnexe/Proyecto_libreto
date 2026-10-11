import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StepNavigation } from './components/StepNavigation';
import { PrdModule } from './components/modules/PrdModule';
import { ArchitectureModule } from './components/modules/ArchitectureModule';
import { DesignModule } from './components/modules/DesignModule';
import { RulesModule } from './components/modules/RulesModule';
import { DecisionsModule } from './components/modules/DecisionsModule';
import { SecurityModule } from './components/modules/SecurityModule';
import { TasksModule } from './components/modules/TasksModule';
import { MemoryModule } from './components/modules/MemoryModule';
import { LivePreview } from './components/preview/LivePreview';
import { HistoryDrawer } from './components/HistoryDrawer';
import { PresetSelectorModal } from './components/PresetSelectorModal';
import { ExportSuccessModal } from './components/ExportSuccessModal';
import {
  loadCurrentProject,
  saveCurrentProject,
  getProjectsHistory,
  syncWithHistory,
  deleteProjectFromHistory,
  duplicateProject,
  createNewProjectFromTemplate,
} from './utils/storage';
import { generateAllMarkdownFiles } from './utils/markdownGenerators';
import { generateSuggestedTasks } from './utils/taskGenerator';
import { downloadZip, exportToSystemFolder } from './utils/fileExporter';
import type { ExportResult } from './utils/fileExporter';
import type { LibretoProject, MarkdownFileKey } from './types/libreto';
import type { ProjectPreset } from './constants/presets';
import {
  ArrowLeft,
  ArrowRight,
  FolderDown,
  Sparkles,
} from 'lucide-react';

export function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('libreto_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('libreto_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('libreto_theme', 'light');
    }
  }, [isDark]);

  // Project state
  const [project, setProject] = useState<LibretoProject>(() => loadCurrentProject());
  const [projectsHistory, setProjectsHistory] = useState<LibretoProject[]>(() => getProjectsHistory());

  // UI Navigation states
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [activePreviewFile, setActivePreviewFile] = useState<MarkdownFileKey>('PRD.md');

  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generate all 8 markdown files in real time
  const generatedFiles = useMemo(() => {
    return generateAllMarkdownFiles(project);
  }, [project]);

  const stepToFileMap: Record<number, MarkdownFileKey> = {
    1: 'PRD.md',
    2: 'ARCHITECTURE.md',
    3: 'DESIGN.md',
    4: 'RULES.md',
    5: 'DECISIONS.md',
    6: 'SECURITY.md',
    7: 'TASKS.md',
    8: 'MEMORY.md',
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    if (stepToFileMap[step]) {
      setActivePreviewFile(stepToFileMap[step]);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateProject = (fields: Partial<LibretoProject>) => {
    let updated: LibretoProject = {
      ...project,
      ...fields,
      updatedAt: new Date().toISOString(),
    };

    // Auto-sincronizar tareas si cambió la arquitectura, el diseño o requerimientos del PRD
    // y la sincronización automática está habilitada y no fue bloqueada por edición manual
    if (
      (fields.architecture || fields.design || fields.prd) &&
      !fields.tasks &&
      updated.tasks?.autoSync !== false &&
      !updated.tasks?.customEdited
    ) {
      const generatedPhases = generateSuggestedTasks(updated);
      updated = {
        ...updated,
        tasks: {
          ...updated.tasks,
          phases: generatedPhases,
        },
      };
    }

    setProject(updated);
    saveCurrentProject(updated);
    const updatedHistory = syncWithHistory(updated);
    setProjectsHistory(updatedHistory);
  };

  const handleLoadProject = (proj: LibretoProject) => {
    setProject(proj);
    saveCurrentProject(proj);
    showToast(`Libreto "${proj.name}" cargado exitosamente.`);
  };

  const handleDuplicateProject = (source: LibretoProject) => {
    const copy = duplicateProject(source);
    setProject(copy);
    setProjectsHistory(getProjectsHistory());
    showToast(`Copia creada: "${copy.name}".`);
  };

  const handleDeleteProject = (id: string) => {
    const remaining = deleteProjectFromHistory(id);
    setProjectsHistory(remaining);
    if (project.id === id) {
      if (remaining.length > 0) {
        setProject(remaining[0]);
      } else {
        const fresh = createNewProjectFromTemplate('Mi Libreto');
        setProject(fresh);
      }
    }
    showToast('Libreto eliminado del historial.');
  };

  const handleCreateNew = () => {
    const fresh = createNewProjectFromTemplate('Nuevo Proyecto');
    setProject(fresh);
    setProjectsHistory(getProjectsHistory());
    setCurrentStep(1);
    showToast('Nuevo libreto creado en blanco.');
  };

  const handleSelectPreset = (preset: ProjectPreset) => {
    const customized: LibretoProject = {
      ...preset.data,
      id: 'libreto-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProject(customized);
    saveCurrentProject(customized);
    setProjectsHistory(getProjectsHistory());
    showToast(`Plantilla "${preset.title}" cargada con éxito.`);
  };

  // Export handlers
  const handleExportSystemFolder = async () => {
    try {
      setIsExporting(true);
      const res = await exportToSystemFolder(project, generatedFiles);
      setExportResult(res);
    } catch (err: unknown) {
      const error = err as Error;
      if (error?.message !== 'Operación cancelada por el usuario') {
        console.error(err);
        showToast('Hubo un error al exportar. Probando descarga ZIP...');
        const zipRes = await downloadZip(project, generatedFiles);
        setExportResult(zipRes);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      const res = await downloadZip(project, generatedFiles);
      setExportResult(res);
    } catch (err) {
      console.error(err);
      showToast('Error al empaquetar el archivo ZIP.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* App Header */}
      <Header
        project={project}
        onUpdateProjectName={(name) => handleUpdateProject({ name })}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onExportFolder={handleExportSystemFolder}
        onExportZip={handleExportZip}
        isExporting={isExporting}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        historyCount={projectsHistory.length}
      />

      {/* Steps Navigation Bar */}
      <StepNavigation
        currentStep={currentStep}
        onSelectStep={(step) => {
          goToStep(step);
          if (viewMode === 'preview') {
            setViewMode('split');
          }
        }}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div
          className={`h-full ${
            viewMode === 'split'
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'
              : 'w-full'
          }`}
        >
          {/* Left Column / Editor Form */}
          {(viewMode === 'editor' || viewMode === 'split') && (
            <div className="bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-7 shadow-xs">
              {/* Step Module Component */}
              {currentStep === 1 && (
                <PrdModule project={project} onChange={handleUpdateProject} />
              )}
              {currentStep === 2 && (
                <ArchitectureModule project={project} onChange={handleUpdateProject} />
              )}
              {currentStep === 3 && (
                <DesignModule project={project} onChange={handleUpdateProject} />
              )}
              {currentStep === 4 && (
                <RulesModule project={project} onChange={handleUpdateProject} />
              )}
              {currentStep === 5 && (
                <DecisionsModule project={project} onChange={handleUpdateProject} />
              )}
              {currentStep === 6 && (
                <SecurityModule project={project} onChange={handleUpdateProject} />
              )}
              {currentStep === 7 && (
                <TasksModule project={project} onChange={handleUpdateProject} />
              )}
              {currentStep === 8 && (
                <MemoryModule project={project} onChange={handleUpdateProject} />
              )}

              {/* Step Navigation Bottom Controls */}
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => goToStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 disabled:opacity-40 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Paso Anterior
                </button>

                <div className="text-xs font-mono text-zinc-400">
                  Paso {currentStep} de 8
                </div>

                {currentStep < 8 ? (
                  <button
                    type="button"
                    onClick={() => goToStep(Math.min(8, currentStep + 1))}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-500/20 transition-all active:scale-98"
                  >
                    <span>Siguiente Paso</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleExportSystemFolder}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 transition-all active:scale-98"
                  >
                    <FolderDown className="w-4 h-4" />
                    <span>¡Finalizar y Exportar!</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Column / Live Preview */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`sticky top-24 ${viewMode === 'split' ? 'h-[calc(100vh-8rem)]' : 'h-[calc(100vh-10rem)]'}`}>
              <LivePreview
                files={generatedFiles}
                activeFile={activePreviewFile}
                onSelectFile={setActivePreviewFile}
                onNavigateToStep={(step) => {
                  goToStep(step);
                  if (viewMode === 'preview') {
                    setViewMode('split');
                  }
                }}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modals & Drawers */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        projects={projectsHistory}
        currentProjectId={project.id}
        onLoadProject={handleLoadProject}
        onDuplicateProject={handleDuplicateProject}
        onDeleteProject={handleDeleteProject}
        onCreateNew={handleCreateNew}
      />

      <PresetSelectorModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <ExportSuccessModal
        result={exportResult}
        onClose={() => setExportResult(null)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-zinc-700/50">
          <Sparkles className="w-4 h-4 text-cyan-400 dark:text-cyan-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
