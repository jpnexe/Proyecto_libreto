import type { LibretoProject, TaskPhase } from '../types/libreto';

/**
 * Determina si el proyecto está configurado como sitio estático Jamstack / SSG sin backend
 */
export function isStaticProject(p: LibretoProject): boolean {
  return (
    p.architecture.platform === 'static' ||
    Boolean(p.architecture.isStaticSite) ||
    Boolean(p.architecture.database?.includes('Ninguna')) ||
    Boolean(p.architecture.backendFramework?.includes('Ninguno'))
  );
}

/**
 * Determina si el proyecto es una aplicación móvil nativa o híbrida
 */
export function isMobileProject(p: LibretoProject): boolean {
  return (
    p.architecture.platform === 'mobile' ||
    Boolean(p.architecture.frontendFramework?.toLowerCase().includes('react native')) ||
    Boolean(p.architecture.frontendFramework?.toLowerCase().includes('expo')) ||
    Boolean(p.architecture.frontendFramework?.toLowerCase().includes('flutter'))
  );
}

/**
 * Determina si el proyecto es un ecosistema dual (Web + Móvil)
 */
export function isDualProject(p: LibretoProject): boolean {
  return p.architecture.platform === 'dual';
}

/**
 * Genera la huella única de tecnologías para saber si el stack ha cambiado
 */
export function getStackFingerprint(p: LibretoProject): string {
  return [
    p.architecture.platform,
    p.architecture.frontendFramework,
    p.architecture.backendFramework,
    p.architecture.database,
    p.architecture.connectionType,
    p.architecture.architecturalPattern,
    p.architecture.staticHosting || '',
    Boolean(p.architecture.isStaticSite),
    p.design.style,
    p.design.styleFramework,
    (p.design.animationLibraries || []).join(','),
    (p.design.iconLibraries || []).join(','),
  ].join('|');
}

/**
 * Genera las 5 fases secuenciales de tareas adaptadas dinámicamente
 * a la arquitectura, diseño, plataforma y requerimientos del proyecto.
 */
export function generateSuggestedTasks(p: LibretoProject): TaskPhase[] {
  const isStatic = isStaticProject(p);
  const isMobile = isMobileProject(p);
  const isDual = isDualProject(p);

  const frontend = p.architecture.frontendFramework || 'Frontend';
  const backend = p.architecture.backendFramework || 'Backend';
  const database = p.architecture.database || 'Base de Datos';
  const connection = p.architecture.connectionType || 'REST API';
  const pattern = p.architecture.architecturalPattern || 'Clean Architecture';
  const hosting = p.architecture.staticHosting || 'Edge CDN (Vercel / Cloudflare Pages)';
  const styleFw = p.design.styleFramework || 'Tailwind CSS';
  const styleName = p.design.style || 'minimalist';
  const animLibs = (p.design.animationLibraries || []).join(', ') || 'Animaciones CSS / Framer Motion';
  const iconLibs = (p.design.iconLibraries || []).join(', ') || 'Lucide Icons';
  const primaryReq = p.prd.functionalRequirements?.[0];

  // 1. ARQUETIPO: SITIO WEB ESTÁTICO / JAMSTACK (Astro, 11ty, Hugo, SSG)
  if (isStatic) {
    return [
      {
        id: 'phase-1',
        name: 'Fase 1: Setup & Inicialización Jamstack',
        tasks: [
          `Inicializar repositorio con ${frontend} y tipado estricto en TypeScript`,
          `Configurar ${styleFw} con variables del sistema de diseño (${styleName}) y paleta principal`,
          `Instalar y configurar conjunto de iconos con ${iconLibs}`,
          `Establecer scripts de build estático (SSG) y verificación de compilación limpia`,
        ],
      },
      {
        id: 'phase-2',
        name: 'Fase 2: Estructura de Contenido & Colecciones',
        tasks: [
          `Definir esquemas de datos tipados (Zod/Frontmatter) para ${connection}`,
          `Estructurar colecciones de contenido y enrutamiento estático por archivos (File-based routing)`,
          `Crear plantillas maestras (Layouts) con metadatos de SEO, Open Graph y favicon dinámico`,
          `Configurar sitemap.xml y robots.txt automáticos para indexación en buscadores`,
        ],
      },
      {
        id: 'phase-3',
        name: 'Fase 3: Componentes UI & Sistema de Diseño',
        tasks: [
          `Construir componentes atómicos y reutilizables con estética ${styleName}`,
          `Integrar microinteracciones y efectos reactivos con ${animLibs}`,
          ...(primaryReq ? [`Implementar componente para requerimiento: "${primaryReq}"`] : []),
          `Crear vistas principales responsivas con hidratación selectiva de islas cliente (client:visible/load)`,
          `Implementar conmutador de tema claro/oscuro sin salto de renderizado (FOUC)`,
        ],
      },
      {
        id: 'phase-4',
        name: 'Fase 4: Optimización SEO, Performance & Assets',
        tasks: [
          `Optimizar imágenes en formatos modernos (WebP/AVIF) con compresión y dimensiones explícitas`,
          `Purgar CSS no utilizado y auditar tree-shaking para lograr tamaño mínimo de JavaScript`,
          `Implementar buscador client-side ligero o indexación estática local si aplica`,
          `Auditar puntuación de Google Lighthouse (objetivo: 95+ en Rendimiento, Accesibilidad y SEO)`,
        ],
      },
      {
        id: 'phase-5',
        name: 'Fase 5: Despliegue en Edge CDN & Verificación',
        tasks: [
          `Configurar pipeline de CI/CD para compilación atómica continua`,
          `Desplegar artefactos estáticos en ${hosting} con cabeceras de seguridad CSP y caché HTTP`,
          `Verificar ausencia de llamadas no autorizadas a servidores de backend en runtime`,
          `Auditoría final de accesibilidad WCAG AA y comprobación de enlaces rotos`,
        ],
      },
    ];
  }

  // 2. ARQUETIPO: APLICACIÓN MÓVIL (React Native / Expo / Flutter)
  if (isMobile) {
    return [
      {
        id: 'phase-1',
        name: 'Fase 1: Setup Móvil & Arquitectura Base',
        tasks: [
          `Inicializar proyecto móvil con ${frontend} y TypeScript estricto`,
          `Configurar arquitectura ${pattern} y cliente HTTP para ${connection}`,
          `Configurar tokens de diseño visual (${styleName}) adaptados a pantallas táctiles`,
          `Establecer sistema de navegación por rutas, pestañas y modales nativos`,
        ],
      },
      {
        id: 'phase-2',
        name: 'Fase 2: Persistencia Local, Modo Offline & Estado',
        tasks: [
          `Implementar almacenamiento local (SQLite / SecureStore) para funcionamiento offline`,
          `Diseñar esquemas de datos locales y sincronización bidireccional en segundo plano`,
          `Configurar gestor de estado reactivo global e hidratación de sesión de usuario`,
          `Implementar cacheo de peticiones y cola de mutaciones offline para reconexión`,
        ],
      },
      {
        id: 'phase-3',
        name: 'Fase 3: Backend & Endpoints API',
        tasks: [
          `Desarrollar servicios y endpoints en ${backend} consumidos vía ${connection}`,
          `Modelar tablas/colecciones en ${database} con validación estricta de esquemas`,
          `Implementar autenticación segura con JWT y refresco de tokens en KeyStore/Keychain`,
          ...(primaryReq ? [`Implementar lógica de negocio para: "${primaryReq}"`] : []),
          `Configurar endpoints de sincronización batch y compresión de respuestas para redes móviles`,
        ],
      },
      {
        id: 'phase-4',
        name: 'Fase 4: Pantallas Móviles, UI/UX & Microinteracciones',
        tasks: [
          `Construir vistas principales con componentes estilo ${styleName} e iconos ${iconLibs}`,
          `Integrar animaciones de gestos táctiles y transiciones fluidas con ${animLibs}`,
          `Diseñar estados de carga esqueletizados (skeletons) y retroalimentación háptica en botones`,
          `Configurar notificaciones push, gestión de permisos de cámara/sensores y deep linking`,
        ],
      },
      {
        id: 'phase-5',
        name: 'Fase 5: Pruebas en Dispositivos & Compilación',
        tasks: [
          `Escribir pruebas unitarias y pruebas de integración de flujos críticos`,
          `Pruebas de resiliencia con desconexión de red simulada (modo avión/poca cobertura)`,
          `Auditoría de seguridad móvil: verificar ausencia de secretos hardcodeados y SSL Pinning`,
          `Configurar pipeline de compilación de binarios de release (APK / AAB / IPA)`,
        ],
      },
    ];
  }

  // 3. ARQUETIPO: ECOSISTEMA DUAL (Web + Móvil)
  if (isDual) {
    return [
      {
        id: 'phase-1',
        name: 'Fase 1: Setup del Monorepo / Proyectos Duales',
        tasks: [
          `Configurar estructura compartida con frontend web (${frontend}) y móvil (${styleFw})`,
          `Establecer paquete de tipos y contratos TypeScript compartidos entre clientes`,
          `Configurar ${backend} con soporte CORS para dominios web y orígenes móviles`,
          `Establecer variables de entorno seguras en .env.example para ambos clientes`,
        ],
      },
      {
        id: 'phase-2',
        name: 'Fase 2: Modelado de Datos & Base de Datos',
        tasks: [
          `Diseñar esquemas de datos relacionales/documentales en ${database}`,
          `Crear migraciones y datos semilla (seeders) iniciales`,
          `Establecer políticas de acceso de datos (RLS o repositorios tipados)`,
          `Configurar índices de alto rendimiento para consultas concurrentes`,
        ],
      },
      {
        id: 'phase-3',
        name: 'Fase 3: Backend & Endpoints Unificados',
        tasks: [
          `Implementar controladores en ${backend} siguiendo ${pattern}`,
          `Desarrollar protocolo ${connection} con validación estricta de payloads`,
          `Implementar autenticación unificada compatible con cookies Web y tokens Móviles`,
          ...(primaryReq ? [`Implementar endpoint y servicio para: "${primaryReq}"`] : []),
          `Configurar rate limiting y middleware de auditoría de seguridad`,
        ],
      },
      {
        id: 'phase-4',
        name: 'Fase 4: Interfaces Web & Móvil (Diseño Compartido)',
        tasks: [
          `Construir componentes visuales con estética ${styleName} e iconos ${iconLibs}`,
          `Integrar animaciones consistentes con ${animLibs} en ambas plataformas`,
          `Conectar clientes Web y Móvil a los endpoints unificados con mutaciones optimistas`,
          `Implementar diseño 100% responsivo en web y adaptación a notches/safe-areas en móvil`,
        ],
      },
      {
        id: 'phase-5',
        name: 'Fase 5: Pruebas Cruzadas, Seguridad & Despliegue',
        tasks: [
          `Pruebas de integración verificando sincronización de datos entre Web y Móvil`,
          `Auditoría de seguridad (CORS, CSP, protección CSRF y sanitización de inputs)`,
          `Despliegue de backend en producción y frontend web en CDN`,
          `Generación de compilados móviles para distribución en tiendas de aplicaciones`,
        ],
      },
    ];
  }

  // 4. ARQUETIPO: APLICACIÓN WEB FULLSTACK / DINÁMICA (Next.js, React + NestJS, FastAPI, etc.)
  return [
    {
      id: 'phase-1',
      name: 'Fase 1: Setup & Inicialización del Entorno',
      tasks: [
        `Configurar repositorio con ${frontend} y ${backend} con TypeScript estricto`,
        `Configurar ${styleFw} con tokens del sistema de diseño (${styleName}) y paleta de colores`,
        `Instalar y configurar conjunto de iconos con ${iconLibs}`,
        `Establecer variables de entorno en .env.example y verificar arranque limpio sin advertencias`,
      ],
    },
    {
      id: 'phase-2',
      name: 'Fase 2: Modelado de Datos & Persistencia',
      tasks: [
        `Diseñar esquemas y relaciones de entidades en ${database}`,
        `Crear migraciones, índices optimizados y datos semilla (seeders) de prueba`,
        `Configurar cliente ORM / ODM con tipado estricto y pool de conexiones seguro`,
        `Establecer políticas de integridad referencial y transacciones atómicas`,
      ],
    },
    {
      id: 'phase-3',
      name: 'Fase 3: Backend, Casos de Uso & API',
      tasks: [
        `Implementar controladores y servicios en ${backend} siguiendo ${pattern}`,
        `Desarrollar endpoints ${connection} con validación estricta de esquemas (Zod/DTOs)`,
        `Implementar autenticación segura, control de sesiones y protección de rutas`,
        ...(primaryReq ? [`Implementar lógica de negocio para: "${primaryReq}"`] : []),
        `Configurar manejo global de excepciones con códigos HTTP estandarizados y rate limiting`,
      ],
    },
    {
      id: 'phase-4',
      name: 'Fase 4: Frontend, Vistas Interactivas & UI/UX',
      tasks: [
        `Construir componentes visuales reutilizables con estética ${styleName}`,
        `Integrar microinteracciones y animaciones de transición con ${animLibs}`,
        `Conectar vistas interactivas con los endpoints del backend usando caché y mutaciones optimistas`,
        `Implementar estados de carga esqueletizados (skeletons), modales y notificaciones toast`,
        `Garantizar diseño 100% responsivo para pantallas móviles, tabletas y monitores amplios`,
      ],
    },
    {
      id: 'phase-5',
      name: 'Fase 5: Seguridad Estricta, Pruebas & Despliegue',
      tasks: [
        `Auditoría de seguridad: verificar mitigación de XSS, SQLi, CSRF y cabeceras CSP`,
        `Escribir suite de pruebas unitarias y pruebas de integración para flujos críticos`,
        `Configurar pipeline de CI/CD para compilación automatizada y pruebas antes de merge`,
        `Desplegar backend y base de datos con monitoreo activo de rendimiento y registros de error`,
      ],
    },
  ];
}
