/**
 * MOTOR DE COHERENCIA, INFERENCIA Y VALIDACIÓN EN TIEMPO REAL
 * Analiza el estado del proyecto, detecta contradicciones entre módulos
 * y permite sincronizar y auto-corregir con 1 solo clic.
 */

import type { LibretoProject } from '../types/libreto';
import { DOMAIN_BLUEPRINTS, type DomainBlueprint } from '../constants/domainDictionary';
import { generateSuggestedTasks } from './taskGenerator';

export interface CoherenceIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: 'platform' | 'language' | 'database' | 'design' | 'security' | 'rules';
  title: string;
  message: string;
  fixLabel: string;
  applyFix: (project: LibretoProject) => LibretoProject;
}

export interface CoherenceReport {
  score: number; // 0 to 100
  isFullyCoherent: boolean;
  issues: CoherenceIssue[];
  detectedDomain?: DomainBlueprint;
}

/**
 * 1. DETECCIÓN INTELIGENTE DE DOMINIO DESDE TEXTO O PRD
 */
export function detectProjectDomain(query: string): { domain: DomainBlueprint; score: number } | null {
  const normalized = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (!normalized.trim()) return null;

  let bestMatch: DomainBlueprint | null = null;
  let highestScore = 0;

  for (const domain of Object.values(DOMAIN_BLUEPRINTS)) {
    let score = 0;
    for (const kw of domain.keywords) {
      const normalizedKw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalized.includes(normalizedKw)) {
        // Palabras compuestas tienen mayor peso
        score += normalizedKw.includes(' ') ? 4 : 2;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = domain;
    }
  }

  if (bestMatch && highestScore >= 2) {
    return { domain: bestMatch, score: highestScore };
  }

  return null;
}

/**
 * 2. REGLAS DE VALIDACIÓN Y DETECCIÓN DE INCOHERENCIAS
 */
export function validateProjectCoherence(project: LibretoProject): CoherenceReport {
  const issues: CoherenceIssue[] = [];
  const { architecture, design, security } = project;

  const languages = architecture.languages || [];
  const frontend = architecture.frontendFramework || '';
  const backend = architecture.backendFramework || '';
  const database = architecture.database || '';
  const platform = architecture.platform;
  const isHeadless =
    platform === 'headless' ||
    Boolean(architecture.isHeadless) ||
    Boolean(design.isNoInterface) ||
    frontend.includes('Sin Interfaz') ||
    backend.includes('Python Data Science');

  const isStatic =
    !isHeadless &&
    (platform === 'static' ||
      Boolean(architecture.isStaticSite) ||
      database.includes('Ninguna') ||
      backend.includes('Ninguno'));

  // --- REGLA 1: Incoherencia de Lenguajes en Python Data Science / Backend ---
  if (
    (backend.includes('Python') || backend.includes('FastAPI') || backend.includes('Django')) &&
    !languages.includes('Python')
  ) {
    issues.push({
      id: 'missing-python-lang',
      severity: 'error',
      category: 'language',
      title: 'Lenguaje Python no añadido al Stack',
      message: `El backend o motor seleccionado es "${backend}", pero "Python" no está marcado en los lenguajes activos.`,
      fixLabel: 'Añadir Python a los Lenguajes',
      applyFix: (p) => ({
        ...p,
        architecture: {
          ...p.architecture,
          languages: Array.from(new Set([...p.architecture.languages, 'Python'])),
        },
      }),
    });
  }

  // --- REGLA 2: Incoherencia de Lenguajes en PHP / Laravel ---
  if (backend.includes('Laravel') && !languages.includes('PHP')) {
    issues.push({
      id: 'missing-php-lang',
      severity: 'error',
      category: 'language',
      title: 'Lenguaje PHP no añadido para Laravel',
      message: 'Has seleccionado Laravel como backend, pero PHP no está en la lista de lenguajes.',
      fixLabel: 'Añadir PHP a los Lenguajes',
      applyFix: (p) => ({
        ...p,
        architecture: {
          ...p.architecture,
          languages: Array.from(new Set([...p.architecture.languages, 'PHP'])),
        },
      }),
    });
  }

  // --- REGLA 3: Incoherencia de Lenguajes en Flutter Móvil ---
  if (frontend.includes('Flutter') && !languages.includes('Dart / Flutter')) {
    issues.push({
      id: 'missing-dart-lang',
      severity: 'error',
      category: 'language',
      title: 'Dart / Flutter no añadido para Flutter',
      message: 'El framework de frontend es Flutter, pero Dart / Flutter no figura en los lenguajes.',
      fixLabel: 'Añadir Dart / Flutter',
      applyFix: (p) => ({
        ...p,
        architecture: {
          ...p.architecture,
          languages: Array.from(new Set([...p.architecture.languages, 'Dart / Flutter'])),
        },
      }),
    });
  }

  // --- REGLA 4: Proyecto Headless (Sin Interfaz) con Framework CSS Web Forzado ---
  if (isHeadless && design.styleFramework && !design.styleFramework.includes('Sin Interfaz')) {
    issues.push({
      id: 'headless-with-web-css',
      severity: 'warning',
      category: 'design',
      title: 'Framework CSS Web en Proyecto Sin Interfaz',
      message: `El proyecto está en Modo Sin Interfaz / Datos / CLI, pero tiene asignado "${design.styleFramework}" que es para interfaces web HTML/DOM.`,
      fixLabel: 'Ajustar Diseño a Gráficos & Terminal',
      applyFix: (p) => ({
        ...p,
        design: {
          ...p.design,
          isNoInterface: true,
          styleFramework: 'Sin Interfaz Web (Gráficos Matplotlib / Seaborn / Plotly / Terminal)',
          style: 'terminal_cli',
        },
      }),
    });
  }

  // --- REGLA 5: Proyecto Headless con Cabeceras Web CORS/CSRF Forzadas ---
  if (isHeadless && (security.corsAndSecurityHeaders || security.csrfProtection)) {
    issues.push({
      id: 'headless-with-web-security',
      severity: 'info',
      category: 'security',
      title: 'Políticas Web CORS/CSRF en Proyecto Sin Interfaz',
      message: 'Las políticas CORS y CSRF aplican exclusivamente a navegadores web y generan confusión en scripts locales de Python o herramientas de terminal.',
      fixLabel: 'Desactivar CORS/CSRF y enfocar en Seguridad de Datos',
      applyFix: (p) => ({
        ...p,
        security: {
          ...p.security,
          corsAndSecurityHeaders: false,
          csrfProtection: false,
          secureAuth: false,
        },
      }),
    });
  }

  // --- REGLA 6: Sitio Estático Jamstack con Base de Datos Relacional o Backend Pesado ---
  if (
    isStatic &&
    (database.includes('PostgreSQL') || database.includes('MySQL') || database.includes('MongoDB'))
  ) {
    issues.push({
      id: 'static-with-sql-db',
      severity: 'error',
      category: 'database',
      title: 'Base de Datos Externa en Sitio Web Estático',
      message: `El proyecto está marcado como Sitio Estático Jamstack, pero tiene asignada "${database}", lo que contradice el principio de cero servidores backend.`,
      fixLabel: 'Cambiar a Archivos Locales (Markdown / JSON)',
      applyFix: (p) => ({
        ...p,
        architecture: {
          ...p.architecture,
          database: 'Archivos Locales (Markdown / MDX / JSON)',
          connectionType: 'Archivos Estáticos Locales (Markdown / MDX / JSON)',
          backendFramework: 'Ninguno (Solo Frontend Estático / Jamstack)',
        },
      }),
    });
  }

  // --- REGLA 7: Plataforma Móvil con Frontend Web incompatible ---
  if (platform === 'mobile' && !frontend.includes('React Native') && !frontend.includes('Flutter')) {
    issues.push({
      id: 'mobile-with-web-frontend',
      severity: 'error',
      category: 'platform',
      title: 'Frontend Web en Plataforma Móvil',
      message: `Has seleccionado Plataforma Móvil, pero el framework frontend actual es "${frontend}" en lugar de React Native / Expo o Flutter.`,
      fixLabel: 'Cambiar a React Native / Expo',
      applyFix: (p) => ({
        ...p,
        architecture: {
          ...p.architecture,
          frontendFramework: 'React Native / Expo',
        },
      }),
    });
  }

  // --- REGLA 8: Plataforma Web con Framework Móvil ---
  if (platform === 'web' && (frontend.includes('React Native') || frontend.includes('Flutter'))) {
    issues.push({
      id: 'web-with-mobile-frontend',
      severity: 'warning',
      category: 'platform',
      title: 'Framework Móvil en Plataforma Web',
      message: `La plataforma es Web Dinámica, pero el framework seleccionado es "${frontend}".`,
      fixLabel: 'Cambiar a Next.js (App Router)',
      applyFix: (p) => ({
        ...p,
        architecture: {
          ...p.architecture,
          frontendFramework: 'Next.js (App Router - Fullstack)',
        },
      }),
    });
  }

  // --- REGLA 9: Desincronización de flags isHeadless / platform ---
  if (platform === 'headless' && !design.isNoInterface) {
    issues.push({
      id: 'headless-platform-sync',
      severity: 'info',
      category: 'design',
      title: 'Sincronizar Modo Sin Interfaz en Diseño',
      message: 'La arquitectura es Sin Interfaz Web, pero el módulo de diseño no tiene marcado el modo sin interfaz.',
      fixLabel: 'Sincronizar Modo Sin Interfaz',
      applyFix: (p) => ({
        ...p,
        design: {
          ...p.design,
          isNoInterface: true,
        },
      }),
    });
  }

  // Cálculo de puntaje de coherencia
  let penalty = 0;
  for (const issue of issues) {
    if (issue.severity === 'error') penalty += 25;
    else if (issue.severity === 'warning') penalty += 15;
    else penalty += 5;
  }
  const score = Math.max(0, 100 - penalty);

  // Inferencia del dominio del proyecto según texto acumulado
  const combinedText = [
    project.name,
    project.description,
    project.targetAudience,
    ...(project.prd.functionalRequirements || []),
    project.prd.customNotes || '',
  ].join(' ');

  const detected = detectProjectDomain(combinedText);

  return {
    score,
    isFullyCoherent: issues.length === 0,
    issues,
    detectedDomain: detected?.domain,
  };
}

/**
 * 3. APLICAR TODAS LAS CORRECCIONES AUTOMÁTICAS CON 1 CLIC
 */
export function autoFixAllCoherence(project: LibretoProject): LibretoProject {
  let current = { ...project };
  let iterations = 0;

  // Ejecutamos hasta resolver o máximo 5 iteraciones por seguridad
  while (iterations < 5) {
    const report = validateProjectCoherence(current);
    if (report.issues.length === 0) break;

    for (const issue of report.issues) {
      current = issue.applyFix(current);
    }
    iterations++;
  }

  return current;
}

/**
 * Comprueba si un proyecto todavía conserva los valores o requerimientos de fábrica del template por defecto
 */
export function isDefaultFactoryTemplate(project: LibretoProject): boolean {
  const isDefaultName =
    !project.name ||
    project.name.trim() === 'Mi Proyecto Épico' ||
    project.name.trim() === 'Nuevo Proyecto' ||
    project.name.trim() === '';

  const isDefaultDesc =
    !project.description ||
    project.description.includes('Aplicación moderna de alto impacto con arquitectura robusta') ||
    project.description.trim() === '';

  const hasFactoryReqs =
    Array.isArray(project.prd.functionalRequirements) &&
    project.prd.functionalRequirements.some((req) =>
      req.includes('Autenticación y registro de usuarios con validación de credenciales.')
    );

  const isDefaultAudience =
    !project.targetAudience ||
    project.targetAudience.includes('Usuarios finales y desarrolladores');

  return isDefaultName || isDefaultDesc || hasFactoryReqs || isDefaultAudience;
}

/**
 * 4. APLICAR ARQUETIPO DE DOMINIO COHERENTE
 * Aplica un dominio completo armonizando Arquitectura, Diseño, Reglas, Seguridad, PRD y Tareas.
 * Si el proyecto contiene opciones de fábrica, las reemplaza completamente por las del arquetipo.
 * Si el usuario ya personalizó el proyecto, fusiona o respeta sus valores según se indique.
 */
export function applyDomainBlueprint(
  project: LibretoProject,
  domainId: string,
  options?: {
    preserveCustomText?: boolean;
    forceReplaceFactory?: boolean;
    userCustomIdea?: string;
  }
): LibretoProject {
  const bp = DOMAIN_BLUEPRINTS[domainId];
  if (!bp) return project;

  const isFactory = isDefaultFactoryTemplate(project);
  const forceReplace = options?.forceReplaceFactory ?? isFactory;
  const preserve = options?.preserveCustomText ?? !forceReplace;

  // 1. Nombre, Descripción y Audiencia
  let newName = project.name;
  let newDescription = project.description;
  let newAudience = project.targetAudience;

  if (forceReplace || isFactory) {
    newName = bp.defaultProjectName || project.name;
    newDescription = options?.userCustomIdea?.trim()
      ? options.userCustomIdea.trim()
      : (bp.defaultDescription || bp.description || project.description);
    newAudience = bp.defaultAudience || project.targetAudience;
  } else if (options?.userCustomIdea?.trim() && (!project.description || project.description.includes('Aplicación moderna de alto impacto'))) {
    newDescription = options.userCustomIdea.trim();
  }

  // 2. Requerimientos Funcionales, No Funcionales y User Stories
  const functionalRequirements = (!preserve || isFactory)
    ? [...bp.suggestedFunctionalRequirements]
    : Array.from(new Set([...(project.prd.functionalRequirements || []), ...bp.suggestedFunctionalRequirements]));

  const nonFunctionalRequirements = (!preserve || isFactory)
    ? [...bp.suggestedNonFunctionalRequirements]
    : Array.from(new Set([...(project.prd.nonFunctionalRequirements || []), ...bp.suggestedNonFunctionalRequirements]));

  const userStories = (!preserve || isFactory)
    ? [...bp.suggestedUserStories]
    : Array.from(new Set([...(project.prd.userStories || []), ...bp.suggestedUserStories]));

  // 3. Notas de Arquitectura
  const isDefaultArchNotes =
    !project.architecture.customNotes ||
    project.architecture.customNotes.includes('Separación modular estricta entre capa de presentación y lógica de dominio.');

  const customNotes = (forceReplace || isDefaultArchNotes)
    ? bp.suggestedArchitectureNotes
    : (project.architecture.customNotes || bp.suggestedArchitectureNotes);

  // 4. Notas y directivas de Diseño
  const isDefaultDesignGuidelines =
    !project.design.customDesignGuidelines ||
    project.design.customDesignGuidelines.includes('Diseño limpio, espacios respirables, accesibilidad AA');

  const customDesignGuidelines = (forceReplace || isDefaultDesignGuidelines)
    ? (bp.writtenDesignNotes || project.design.customDesignGuidelines)
    : project.design.customDesignGuidelines;

  const writtenNotes = (forceReplace || !project.design.writtenNotes)
    ? bp.writtenDesignNotes
    : (preserve && project.design.writtenNotes.trim() !== bp.writtenDesignNotes.trim()
        ? `${project.design.writtenNotes}\n\n${bp.writtenDesignNotes}`
        : bp.writtenDesignNotes);

  // 5. Estado de Memoria y Milestones adaptados al dominio
  const newMemory = (forceReplace || isFactory)
    ? {
        currentState: `Arquitectura de "${bp.name}" definida con directivas coherentes. Listo para inicializar.`,
        activeSprintOrMilestone: bp.isHeadless
          ? 'Fase 1: Configuración de entorno Python / CLI y datasets de prueba.'
          : 'Fase 1: Configuración de repositorio, stack base y diseño UI.',
        completedMilestones: [`Definición del arquetipo coherente: ${bp.name}`],
        inProgressMilestones: ['Inicialización del proyecto'],
        blockers: [],
      }
    : project.memory;

  // Construir proyecto base actualizado
  const updatedProject: LibretoProject = {
    ...project,
    name: newName,
    description: newDescription,
    targetAudience: newAudience,
    architecture: {
      ...project.architecture,
      platform: bp.suggestedPlatform,
      isHeadless: bp.isHeadless,
      isStaticSite: bp.isStaticSite,
      languages: [...bp.languages],
      frontendFramework: bp.frontendFramework,
      backendFramework: bp.backendFramework,
      database: bp.database,
      connectionType: bp.connectionType,
      architecturalPattern: bp.architecturalPattern,
      customNotes,
    },
    design: {
      ...project.design,
      style: bp.style,
      styleFramework: bp.styleFramework,
      primaryColor: bp.primaryColor,
      secondaryColor: bp.secondaryColor,
      darkModeDefault: bp.darkModeDefault,
      typography: bp.typography,
      isNoInterface: bp.isHeadless,
      customDesignGuidelines,
      writtenNotes,
      customObservations: (forceReplace || isFactory)
        ? [...bp.customObservations]
        : Array.from(new Set([...(project.design.customObservations || []), ...bp.customObservations])),
    },
    rules: {
      ...project.rules,
      customRules: (forceReplace || isFactory)
        ? [...bp.customRules]
        : Array.from(new Set([...(project.rules.customRules || []), ...bp.customRules])),
    },
    security: {
      ...project.security,
      corsAndSecurityHeaders: !bp.isHeadless,
      csrfProtection: !bp.isHeadless,
      secureAuth: !bp.isHeadless && !bp.isStaticSite,
      customSecurityPolicies: (forceReplace || isFactory)
        ? [...bp.customSecurityPolicies]
        : Array.from(new Set([...(project.security.customSecurityPolicies || []), ...bp.customSecurityPolicies])),
    },
    prd: {
      ...project.prd,
      masterPromptTone: bp.masterPromptTone,
      functionalRequirements,
      nonFunctionalRequirements,
      userStories,
    },
    decisions: {
      ...project.decisions,
      customDecisions: bp.suggestedADRs.map((adr, i) => ({
        id: `adr-coherent-${i + 1}`,
        title: adr.title,
        context: adr.context,
        decision: adr.decision,
        consequences: adr.consequences,
        discardedAlternatives: adr.discardedAlternatives,
      })),
    },
    memory: newMemory,
  };

  // 6. Generar las fases de tareas secuenciales coherentes con el nuevo stack
  try {
    const freshTasks = generateSuggestedTasks(updatedProject);
    if (freshTasks && freshTasks.length > 0) {
      updatedProject.tasks = {
        phases: freshTasks,
      };
    }
  } catch (err) {
    console.warn('Could not auto-generate tasks for domain blueprint:', err);
  }

  return updatedProject;
}
