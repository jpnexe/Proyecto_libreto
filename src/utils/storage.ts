import { DEFAULT_PROJECT_TEMPLATE } from '../constants/presets';
import type { LibretoProject } from '../types/libreto';
import { slugify } from './markdownGenerators';

const CURRENT_PROJECT_KEY = 'libreto_current_project_v1';
const HISTORY_KEY = 'libreto_projects_history_v1';

export function loadCurrentProject(): LibretoProject {
  try {
    const raw = localStorage.getItem(CURRENT_PROJECT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && parsed.name) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error al cargar proyecto actual de localStorage:', e);
  }
  return { ...DEFAULT_PROJECT_TEMPLATE };
}

export function saveCurrentProject(project: LibretoProject): void {
  try {
    const updated = {
      ...project,
      slug: slugify(project.name),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(updated));
    // Sincronizar también con el historial si existe
    syncWithHistory(updated);
  } catch (e) {
    console.error('Error al guardar proyecto actual en localStorage:', e);
  }
}

export function getProjectsHistory(): LibretoProject[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error al cargar historial de proyectos:', e);
  }
  // Si no hay historial, inicializar con el template por defecto
  const initialHistory = [{ ...DEFAULT_PROJECT_TEMPLATE }];
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(initialHistory));
  } catch {}
  return initialHistory;
}

export function saveProjectsHistory(list: LibretoProject[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error al guardar historial de proyectos:', e);
  }
}

export function syncWithHistory(project: LibretoProject): LibretoProject[] {
  const history = getProjectsHistory();
  const index = history.findIndex((p) => p.id === project.id);
  let updatedHistory: LibretoProject[];

  if (index >= 0) {
    updatedHistory = [...history];
    updatedHistory[index] = { ...project };
  } else {
    updatedHistory = [project, ...history];
  }

  saveProjectsHistory(updatedHistory);
  return updatedHistory;
}

export function deleteProjectFromHistory(id: string): LibretoProject[] {
  const history = getProjectsHistory();
  const updated = history.filter((p) => p.id !== id);
  saveProjectsHistory(updated);
  return updated;
}

export function duplicateProject(source: LibretoProject): LibretoProject {
  const copy: LibretoProject = {
    ...JSON.parse(JSON.stringify(source)),
    id: 'libreto-' + Date.now(),
    name: `${source.name} (Copia)`,
    slug: `${source.slug}-copia`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  syncWithHistory(copy);
  return copy;
}

export function createNewProjectFromTemplate(name = 'Nuevo Proyecto'): LibretoProject {
  const newProj: LibretoProject = {
    ...JSON.parse(JSON.stringify(DEFAULT_PROJECT_TEMPLATE)),
    id: 'libreto-' + Date.now(),
    name,
    slug: slugify(name),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveCurrentProject(newProj);
  syncWithHistory(newProj);
  return newProj;
}
