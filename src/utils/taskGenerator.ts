import type { LibretoProject, TaskPhase } from '../types/libreto';

/**
 * Determina si el proyecto es un proyecto sin interfaz web (Análisis de Datos Python, ETL, CLI, Notebooks o Scripts)
 */
export function isHeadlessProject(p: LibretoProject): boolean {
  return (
    p.architecture.platform === 'headless' ||
    Boolean(p.architecture.isHeadless) ||
    Boolean(p.design.isNoInterface) ||
    Boolean(p.architecture.frontendFramework?.includes('Sin Interfaz')) ||
    Boolean(p.architecture.frontendFramework?.includes('Jupyter')) ||
    Boolean(p.architecture.frontendFramework?.includes('CLI Interactiva')) ||
    Boolean(p.architecture.backendFramework?.includes('Python Data Science')) ||
    Boolean(p.architecture.backendFramework?.includes('Scripts de Automatización'))
  );
}

/**
 * Determina si el proyecto está configurado como sitio estático Jamstack / SSG sin backend
 */
export function isStaticProject(p: LibretoProject): boolean {
  if (isHeadlessProject(p)) return false;
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
    Boolean(p.architecture.isHeadless),
    Boolean(p.design.isNoInterface),
    p.design.style,
    p.design.styleFramework,
    (p.design.animationLibraries || []).join(','),
    (p.design.iconLibraries || []).join(','),
  ].join('|');
}

/**
 * Genera tareas específicas adaptadas a la base de datos seleccionada
 */
function getDatabaseSetupTask(database: string): string {
  if (database.includes('Datasets Locales')) {
    return 'Estructurar directorios de datos (data/raw, data/interim, data/processed) con esquemas validados para CSV, Parquet y Excel';
  }
  if (database.includes('DuckDB')) {
    return 'Configurar motor analítico DuckDB in-process para consultas SQL vectorizadas sobre archivos Parquet y DataFrames';
  }
  if (database.includes('Supabase')) {
    return 'Inicializar proyecto en Supabase con migraciones SQL, tipos automáticos y políticas de Row Level Security (RLS) en todas las tablas';
  }
  if (database.includes('PostgreSQL')) {
    return 'Diseñar esquemas relacionales, llaves foráneas, índices optimizados y migraciones en PostgreSQL con cliente ORM tipado (Prisma / Drizzle)';
  }
  if (database.includes('MongoDB')) {
    return 'Modelar colecciones, esquemas e índices compuestos en MongoDB asegurando validación estricta de documentos (Mongoose)';
  }
  if (database.includes('SQLite') || database.includes('Turso')) {
    return 'Configurar base de datos SQLite / Turso con migraciones estructuradas, pool de conexiones y Journal Mode WAL';
  }
  if (database.includes('Firebase')) {
    return 'Configurar Firestore con colecciones tipadas, reglas de seguridad de lectura/escritura e índices compuestos';
  }
  if (database.includes('Archivos Locales') || database.includes('Ninguna')) {
    return 'Estructurar colecciones de contenido estático (Markdown / MDX / JSON) con validación de esquemas tipados (Zod / Frontmatter)';
  }
  return `Diseñar esquemas, entidades y migraciones de datos en ${database} con integridad referencial y pool seguro`;
}

/**
 * Genera tareas específicas adaptadas al framework de backend seleccionado
 */
function getBackendSetupTask(backend: string, connection: string, pattern: string): string {
  if (backend.includes('Python Data Science')) {
    return `Implementar módulos vectorizados de procesamiento y análisis en Python (Pandas / Polars / NumPy / Scikit-Learn) bajo ${pattern}`;
  }
  if (backend.includes('Scripts de Automatización')) {
    return `Desarrollar pipeline de automatización / ETL idempotente en Python con logging estructurado y manejo de errores para ${connection}`;
  }
  if (backend.includes('FastAPI')) {
    return `Desarrollar controladores modulares en FastAPI con enrutadores APIRouter, esquemas Pydantic v2 y endpoints ${connection}`;
  }
  if (backend.includes('NestJS')) {
    return `Generar módulos, controladores y servicios en NestJS siguiendo ${pattern} con pipes de validación (class-validator) para ${connection}`;
  }
  if (backend.includes('Express')) {
    return `Estructurar servidor Express con enrutador desacoplado bajo ${pattern}, middlewares de seguridad Helmet y endpoints ${connection}`;
  }
  if (backend.includes('Django')) {
    return `Implementar ViewSets y serializadores en Django REST Framework siguiendo ${pattern} para comunicación ${connection}`;
  }
  if (backend.includes('Laravel')) {
    return `Desarrollar controladores de recursos, FormRequests de validación y recursos API en Laravel bajo ${pattern} para ${connection}`;
  }
  if (backend.includes('Go')) {
    return `Construir handlers, capas de servicio y repositorios idiomáticos en Go con router Gin/Fiber para ${connection}`;
  }
  if (backend.includes('Spring Boot')) {
    return `Implementar @RestController, capas de servicio transaccionales y DTOs en Spring Boot siguiendo ${pattern} para ${connection}`;
  }
  if (backend.includes('Serverless') || backend.includes('Edge')) {
    return `Desarrollar Serverless Edge Functions (Vercel / Cloudflare) con baja latencia y validación de payloads para ${connection}`;
  }
  if (backend.includes('Ninguno')) {
    return `Configurar consumo de datos estáticos client-side bajo demanda o endpoints estáticos para ${connection}`;
  }
  return `Implementar controladores y servicios de negocio en ${backend} siguiendo ${pattern} para el protocolo ${connection}`;
}

/**
 * Genera las 5 fases secuenciales de tareas adaptadas dinámicamente
 * a la arquitectura, diseño, plataforma y requerimientos del proyecto.
 */
export function generateSuggestedTasks(p: LibretoProject): TaskPhase[] {
  const isHeadless = isHeadlessProject(p);
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
  const animLibs = (p.design.animationLibraries && p.design.animationLibraries.length > 0)
    ? p.design.animationLibraries.join(', ')
    : 'Animaciones CSS / Framer Motion';
  const iconLibs = (p.design.iconLibraries && p.design.iconLibraries.length > 0)
    ? p.design.iconLibraries.join(', ')
    : 'Lucide Icons';
  const languages = (p.architecture.languages && p.architecture.languages.length > 0)
    ? p.architecture.languages.join(' + ')
    : 'TypeScript';
  const primaryReq = p.prd.functionalRequirements?.[0];

  const dbTask = getDatabaseSetupTask(database);
  const beTask = getBackendSetupTask(backend, connection, pattern);

  // 0. ARQUETIPO: PROYECTO SIN INTERFAZ WEB / ANÁLISIS DE DATOS PYTHON / CLI / ETL
  if (isHeadless) {
    return [
      {
        id: 'phase-1',
        name: 'Fase 1: Setup del Entorno & Estructura Modular (Sin Interfaz Web)',
        tasks: [
          `Inicializar entorno aislado (${languages}) con dependencias fijadas (requirements.txt / pyproject.toml) y tipado estricto`,
          `Estructurar arquitectura ${pattern} separando código fuente (src/), datos (data/raw, data/processed) y reportes/salidas`,
          `Configurar módulo central de configuración (src/config.py), semillas de reproducibilidad y sistema de logging estructurado`,
          `Configurar .gitignore estricto para proteger datasets sensibles, archivos temporales y variables de entorno (.env)`,
        ],
      },
      {
        id: 'phase-2',
        name: 'Fase 2: Ingesta de Datos, Validación de Esquemas & Almacenamiento',
        tasks: [
          dbTask,
          `Implementar conectores de carga y validación de tipos de columnas, rangos esperados y detección temprana de datos corruptos`,
          `Estandarizar nombres de variables en snake_case, codificación UTF-8 y parseo seguro de fechas/series temporales`,
          `Registrar resumen de diagnóstico de ingesta (conteo de filas, memoria consumida y porcentaje de valores nulos por columna)`,
        ],
      },
      {
        id: 'phase-3',
        name: 'Fase 3: Limpieza, Transformación Vectorizada & Lógica Analítica',
        tasks: [
          beTask,
          `Implementar funciones puras y vectorizadas para tratamiento de valores faltantes (imputación/filtrado), duplicados y outliers`,
          ...(primaryReq ? [`Implementar lógica analítica / procesamiento para: "${primaryReq}"`] : []),
          `Construir indicadores clave (KPIs), agregaciones estadísticas, cruces validados (joins/merges) o modelos predictivos`,
          `Exportar datasets procesados limpios en formato eficiente (Parquet / CSV) listos para consumo reproducible`,
        ],
      },
      {
        id: 'phase-4',
        name: 'Fase 4: Visualización de Datos, Gráficos, CLI & Reportes de Salida',
        tasks: [
          `Configurar tema visual consistente de gráficos y reportes aplicando la paleta definida (${p.design.primaryColor} / ${p.design.secondaryColor}) y las Notas Escritas de Diseño`,
          `Generar visualizaciones estadísticas de alta resolución (Matplotlib / Seaborn / Plotly) exportadas en reports/figures/`,
          `Formatear salida en consola (tablas resumen, métricas clave y barras de progreso en CLI) o estructurar Jupyter Notebooks ejecutables`,
          `Generar tablas finales de hallazgos y métricas de evaluación exportadas en data/outputs/`,
        ],
      },
      {
        id: 'phase-5',
        name: 'Fase 5: Pruebas de Integridad de Datos, Reproducibilidad & Documentación',
        tasks: [
          `Escribir suite de pruebas unitarias (pytest) validando funciones de transformación con datasets sintéticos y casos borde`,
          `Verificar que el pipeline completo o los Notebooks se ejecuten de principio a fin con un solo comando sin intervención manual`,
          `Auditar rendimiento de memoria y ausencia de bucles lentos o fugas de datos (Data Leakage)`,
          `Documentar diccionario de datos, parámetros de CLI y guía de ejecución paso a paso en README.md`,
        ],
      },
    ];
  }

  // 1. ARQUETIPO: SITIO WEB ESTÁTICO / JAMSTACK (Astro, 11ty, Hugo, SSG)
  if (isStatic) {
    return [
      {
        id: 'phase-1',
        name: 'Fase 1: Setup & Inicialización Jamstack',
        tasks: [
          `Inicializar repositorio con ${frontend} utilizando ${languages} con tipado estricto`,
          `Configurar ${styleFw} con variables del sistema de diseño (${styleName}) y paleta principal`,
          `Instalar y configurar conjunto de iconos con ${iconLibs}`,
          `Establecer scripts de build estático (SSG) y verificación de compilación limpia`,
        ],
      },
      {
        id: 'phase-2',
        name: 'Fase 2: Estructura de Contenido & Colecciones',
        tasks: [
          dbTask,
          `Estructurar colecciones de contenido y enrutamiento estático por archivos (File-based routing)`,
          `Crear plantillas maestras (Layouts) con metadatos de SEO, Open Graph y favicon dinámico`,
          `Configurar sitemap.xml y robots.txt automáticos para indexación en buscadores`,
        ],
      },
      {
        id: 'phase-3',
        name: 'Fase 3: Componentes UI & Sistema de Diseño',
        tasks: [
          `Construir componentes atómicos y reutilizables con estética ${styleName} e iconos ${iconLibs}`,
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
          `Configurar pipeline de CI/CD para compilación atómica continua con verificación de tipos`,
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
          `Inicializar proyecto móvil con ${frontend} utilizando ${languages} con tipado riguroso`,
          `Configurar arquitectura ${pattern} y cliente de red para protocolo ${connection}`,
          `Configurar tokens de diseño visual (${styleName}) adaptados a pantallas táctiles`,
          `Establecer sistema de navegación por rutas, pestañas y modales nativos`,
        ],
      },
      {
        id: 'phase-2',
        name: 'Fase 2: Persistencia Local, Modo Offline & Estado',
        tasks: [
          `Implementar almacenamiento local seguro (SQLite / SecureStore / Keychain) para funcionamiento offline`,
          `Diseñar esquemas de datos locales y sincronización bidireccional en segundo plano`,
          `Configurar gestor de estado reactivo global e hidratación de sesión de usuario`,
          `Implementar cacheo de peticiones y cola de mutaciones offline para reconexión`,
        ],
      },
      {
        id: 'phase-3',
        name: 'Fase 3: Backend & Endpoints API',
        tasks: [
          beTask,
          dbTask,
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
          `Escribir pruebas unitarias y pruebas de integración de flujos críticos en ${languages}`,
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
          `Configurar estructura compartida con frontend web (${frontend}) y cliente móvil con ${languages}`,
          `Establecer paquete de tipos y contratos de datos compartidos entre clientes`,
          `Configurar ${backend} con soporte CORS para dominios web y orígenes móviles`,
          `Establecer variables de entorno seguras en .env.example para ambos entornos`,
        ],
      },
      {
        id: 'phase-2',
        name: 'Fase 2: Modelado de Datos & Base de Datos',
        tasks: [
          dbTask,
          `Crear migraciones, índices optimizados y datos semilla (seeders) iniciales`,
          `Establecer políticas de acceso y roles de seguridad a nivel de datos`,
          `Configurar pool de conexiones seguro y transacciones atómicas`,
        ],
      },
      {
        id: 'phase-3',
        name: 'Fase 3: Backend & Endpoints Unificados',
        tasks: [
          beTask,
          `Implementar protocolo ${connection} con validación estricta de esquemas`,
          `Implementar autenticación unificada compatible con cookies Web y tokens Móviles`,
          ...(primaryReq ? [`Implementar endpoint y servicio para: "${primaryReq}"`] : []),
          `Configurar rate limiting y middleware de auditoría de seguridad defensiva`,
        ],
      },
      {
        id: 'phase-4',
        name: 'Fase 4: Interfaces Web & Móvil (Diseño Compartido)',
        tasks: [
          `Construir componentes visuales con estética ${styleName} e iconografía ${iconLibs}`,
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
        `Configurar repositorio con ${frontend} y ${backend} utilizando ${languages} con tipado estricto`,
        `Configurar ${styleFw} con tokens del sistema de diseño (${styleName}) y paleta de colores`,
        `Instalar y configurar conjunto de iconos con ${iconLibs}`,
        `Establecer variables de entorno en .env.example y verificar arranque limpio sin advertencias`,
      ],
    },
    {
      id: 'phase-2',
      name: 'Fase 2: Modelado de Datos & Persistencia',
      tasks: [
        dbTask,
        `Crear migraciones, índices de alto rendimiento y datos semilla (seeders) de prueba`,
        `Configurar cliente de base de datos con tipado estricto y pool de conexiones seguro`,
        `Establecer políticas de integridad referencial y transacciones atómicas`,
      ],
    },
    {
      id: 'phase-3',
      name: 'Fase 3: Backend, Casos de Uso & API',
      tasks: [
        beTask,
        `Desarrollar endpoints ${connection} con validación estricta de esquemas y tipos`,
        `Implementar autenticación segura, control de sesiones y protección de rutas`,
        ...(primaryReq ? [`Implementar lógica de negocio para: "${primaryReq}"`] : []),
        `Configurar manejo global de excepciones con códigos HTTP estandarizados y rate limiting`,
      ],
    },
    {
      id: 'phase-4',
      name: 'Fase 4: Frontend, Vistas Interactivas & UI/UX',
      tasks: [
        `Construir componentes visuales reutilizables con estética ${styleName} e iconos ${iconLibs}`,
        `Integrar microinteracciones y animaciones de transición fluidas con ${animLibs}`,
        `Conectar vistas interactivas con los endpoints del backend usando caché y mutaciones optimistas`,
        `Implementar estados de carga esqueletizados (skeletons), modales y notificaciones toast`,
        `Garantizar diseño 100% responsivo para pantallas móviles, tabletas y monitores amplios`,
      ],
    },
    {
      id: 'phase-5',
      name: 'Fase 5: Seguridad Estricta, Pruebas & Despliegue',
      tasks: [
        `Auditoría de seguridad defensiva para ${backend} y ${database} (mitigación de XSS, SQLi, CSRF y cabeceras CSP)`,
        `Escribir suite de pruebas unitarias y pruebas de integración para flujos críticos en ${languages}`,
        `Configurar pipeline de CI/CD para compilación automatizada y pruebas antes de merge`,
        `Desplegar backend y base de datos con monitoreo activo de rendimiento y registros de error`,
      ],
    },
  ];
}
