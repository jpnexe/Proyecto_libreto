import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import confetti from 'canvas-confetti';
import type { GeneratedFiles, LibretoProject } from '../types/libreto';
import { slugify } from './markdownGenerators';

export interface ExportResult {
  success: boolean;
  type: 'directory' | 'zip';
  folderName: string;
  message: string;
}

/**
 * Dispara confeti festivo para celebrar la exportación exitosa
 */
export function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#06B6D4', '#3B82F6', '#A855F7', '#10B981', '#F59E0B'],
  });
}

/**
 * Descarga universal mediante archivo comprimido .ZIP
 */
export async function downloadZip(project: LibretoProject, files: GeneratedFiles): Promise<ExportResult> {
  const folderName = `libreto-${slugify(project.name) || 'proyecto'}`;
  const zip = new JSZip();
  const folder = zip.folder(folderName) || zip;

  for (const [filename, content] of Object.entries(files)) {
    folder.file(filename, content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${folderName}.zip`);
  fireConfetti();

  return {
    success: true,
    type: 'zip',
    folderName: `${folderName}.zip`,
    message: `Paquete comprimido ${folderName}.zip descargado correctamente con los 8 archivos maestros.`,
  };
}

/**
 * Exporta directamente a una carpeta del sistema usando File System Access API
 * con fallback automático a .ZIP si la API no está disponible o falla.
 */
export async function exportToSystemFolder(
  project: LibretoProject,
  files: GeneratedFiles
): Promise<ExportResult> {
  const folderName = `libreto-${slugify(project.name) || 'proyecto'}`;

  // Verificar si window.showDirectoryPicker está soportado en este navegador
  if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
    try {
      // 1. Solicitar al usuario que elija la carpeta base en su computador
      const dirHandle = await (window as unknown as {
        showDirectoryPicker: (options?: { mode: 'read' | 'readwrite' }) => Promise<FileSystemDirectoryHandle>;
      }).showDirectoryPicker({ mode: 'readwrite' });

      // 2. Crear la subcarpeta libreto-[nombre-proyecto]
      const subDirHandle = await dirHandle.getDirectoryHandle(folderName, { create: true });

      // 3. Escribir cada uno de los 8 archivos Markdown
      for (const [filename, content] of Object.entries(files)) {
        const fileHandle = await subDirHandle.getFileHandle(filename, { create: true });
        // En los tipos de navegador estándar, createWritable existe en FileSystemFileHandle
        const writable = await (fileHandle as unknown as {
          createWritable: () => Promise<FileSystemWritableFileStream>;
        }).createWritable();
        await writable.write(content);
        await writable.close();
      }

      fireConfetti();

      return {
        success: true,
        type: 'directory',
        folderName,
        message: `Los 8 archivos .md fueron guardados exitosamente en la carpeta local "${folderName}".`,
      };
    } catch (err: unknown) {
      const error = err as Error;
      // Si el usuario canceló el selector intencionalmente
      if (error?.name === 'AbortError') {
        throw new Error('Operación cancelada por el usuario');
      }

      console.warn('Fallo en File System Access API, ejecutando fallback a descarga ZIP:', error);
      // Fallback automático a .ZIP
      const zipResult = await downloadZip(project, files);
      return {
        ...zipResult,
        message: `Tu navegador requirió el fallback seguro: Se descargó el paquete "${folderName}.zip".`,
      };
    }
  } else {
    // Si la API no está presente (ej. Firefox sin flag o navegadores móviles)
    const zipResult = await downloadZip(project, files);
    return {
      ...zipResult,
      message: `File System Access API no disponible en este navegador. Se activó el fallback automático a archivo ZIP.`,
    };
  }
}
