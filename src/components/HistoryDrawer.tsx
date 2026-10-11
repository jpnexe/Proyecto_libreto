import React, { useState } from 'react';
import {
  X,
  History,
  Copy,
  Trash2,
  FolderOpen,
  Plus,
  Search,
  Calendar,
} from 'lucide-react';
import type { LibretoProject } from '../types/libreto';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: LibretoProject[];
  currentProjectId: string;
  onLoadProject: (project: LibretoProject) => void;
  onDuplicateProject: (project: LibretoProject) => void;
  onDeleteProject: (projectId: string) => void;
  onCreateNew: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onLoadProject,
  onDuplicateProject,
  onDeleteProject,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.architecture.frontendFramework.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.architecture.backendFramework.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col">
          {/* Top Bar */}
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Historial de Libretos
                </h3>
                <p className="text-xs text-zinc-500">
                  Proyectos guardados en el navegador ({projects.length})
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Project CTA + Search Input */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50 dark:bg-zinc-900/40">
            <button
              onClick={() => {
                onCreateNew();
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              Crear Nuevo Libreto en Blanco
            </button>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o tecnología..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 text-xs">
                No se encontraron libretos coincidentes.
              </div>
            ) : (
              filtered.map((proj) => {
                const isCurrent = proj.id === currentProjectId;
                return (
                  <div
                    key={proj.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      isCurrent
                        ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-950/20 ring-1 ring-cyan-500/30'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                            {proj.name}
                          </h4>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-cyan-500 text-white rounded">
                              Activo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                          {proj.description || 'Sin descripción'}
                        </p>
                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md font-mono">
                        {proj.architecture.platform.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md font-mono">
                        {proj.architecture.frontendFramework}
                      </span>
                      <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md font-mono">
                        {proj.architecture.backendFramework}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs">
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Load Project Button */}
                        {!isCurrent && (
                          <button
                            onClick={() => {
                              onLoadProject(proj);
                              onClose();
                            }}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                            title="Continuar editando este proyecto"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Duplicate Button */}
                        <button
                          onClick={() => onDuplicateProject(proj)}
                          className="px-2 py-1 text-xs rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                          title="Duplicar libreto"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        {deleteConfirmId === proj.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                onDeleteProject(proj.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg hover:bg-red-500"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-1 text-zinc-400 text-[11px] hover:text-zinc-200"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(proj.id)}
                            className="px-2 py-1 text-xs rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Eliminar libreto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
