import type { LibretoProject } from '../types/libreto';

export interface ProjectPreset {
  id: string;
  title: string;
  tag: string;
  description: string;
  badgeColor: string;
  data: Omit<LibretoProject, 'id' | 'createdAt' | 'updatedAt'>;
}

export const PROJECT_PRESETS: ProjectPreset[] = [
  {
    id: 'saas-b2b-fullstack',
    title: 'SaaS B2B Fullstack',
    tag: 'Next.js + Supabase',
    description: 'Plataforma web moderna con autenticación segura, dashboards interactivos, base de datos relacional y estilo Dark Tech.',
    badgeColor: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    data: {
      name: 'Nexus Cloud Hub',
      slug: 'nexus-cloud-hub',
      description: 'Plataforma SaaS B2B para la orquestación y monitoreo de microservicios con dashboards en tiempo real y facturación por consumo.',
      targetAudience: 'Equipos de ingeniería, DevOps y líderes técnicos de medianas y grandes empresas.',
      version: '1.0.0',
      architecture: {
        platform: 'web',
        languages: ['TypeScript', 'SQL'],
        frontendFramework: 'Next.js (App Router)',
        backendFramework: 'Supabase Functions / Edge',
        database: 'Supabase (PostgreSQL BaaS)',
        connectionType: 'REST API (JSON)',
        architecturalPattern: 'Capas Clásicas (Controller - Service - Repository)',
        customNotes: 'Uso de Server Actions para mutaciones y Middleware de Next.js para protección de rutas con RBAC (Control de acceso basado en roles).',
      },
      design: {
        style: 'dark_cyberpunk',
        styleFramework: 'Tailwind CSS v4 / v3',
        animationLibraries: ['Framer Motion'],
        iconLibraries: ['Lucide Icons'],
        primaryColor: '#06B6D4',
        secondaryColor: '#A855F7',
        darkModeDefault: true,
        typography: 'Inter & JetBrains Mono',
        customDesignGuidelines: 'Contraste alto, acentos neón en gráficos y estados de alerta, bordes técnicos con opacidad suave.',
      },
      rules: {
        goldenRule: true,
        atomicModifications: true,
        strictTyping: true,
        mandatoryExceptionHandling: true,
        strictModularity: true,
        gitCommitConventions: true,
        testCoverageRequirement: true,
        customRules: [
          'Todas las llamadas a la base de datos deben utilizar RLS (Row Level Security) verificado.',
          'Prohibido exponer variables con prefijo NEXT_PUBLIC_ si contienen llaves privadas de servicio.',
        ],
      },
      decisions: {
        strictlyForbidAlternativeStacks: true,
        customDecisions: [
          {
            id: 'adr-1',
            title: 'Uso de Next.js App Router',
            context: 'Se requiere optimización SEO en landing pública y carga instantánea en dashboards protegidos.',
            decision: 'Adoptar Next.js con App Router y React Server Components.',
            consequences: 'Mejor rendimiento inicial y separación limpia de capas cliente/servidor.',
            discardedAlternatives: 'Single Page Application pura con React Vite (carece de SSR nativo out-of-the-box).',
          },
        ],
      },
      security: {
        envVariablesManagement: true,
        secureAuth: true,
        inputSanitization: true,
        sqlInjectionAndXssProtection: true,
        corsAndSecurityHeaders: true,
        rateLimiting: true,
        csrfProtection: true,
        customSecurityPolicies: [
          'Tokens de sesión gestionados mediante cookies seguras HttpOnly con SameSite=Strict.',
          'Esquemas de validación Zod en todos los Server Actions y endpoints de API.',
        ],
      },
      prd: {
        functionalRequirements: [
          'Autenticación multifactor (MFA) y login social vía GitHub y Google.',
          'Panel de métricas con gráficas en tiempo real de consumo de API y latencia.',
          'Módulo de gestión de miembros de equipo con roles (Admin, Editor, Visor).',
          'Integración con pasarela de pagos Stripe para suscripciones recurrentes.',
          'Generador y revocador de API Keys seguras con permisos granulares.',
        ],
        nonFunctionalRequirements: [
          'Tiempo de respuesta en llamadas a API inferior a 150ms.',
          'Puntaje de Lighthouse en Performance y Accesibilidad superior a 90.',
          'Disponibilidad del 99.9% con recuperación automática de sesiones.',
        ],
        userStories: [
          'Como desarrollador DevOps, quiero generar una API Key para automatizar despliegues desde mi pipeline de CI/CD.',
          'Como administrador, quiero asignar el rol de sólo lectura a los auditores para proteger los parámetros de configuración.',
        ],
        masterPromptTone: 'strict_senior',
        customMasterPromptDirectives: 'Prioriza siempre la solidez tipada y la seguridad de las rutas. No implementes prototipos frágiles; cada feature debe contar con manejo de errores y validación Zod.',
      },
      tasks: {
        phases: [
          {
            id: 'phase-1',
            name: 'Fase 1: Setup & Inicialización',
            tasks: [
              'Configurar repositorio con TypeScript, Next.js y Tailwind CSS',
              'Establecer cliente de Supabase y variables en .env.example',
              'Configurar linters, formateador Prettier y Husky hooks',
            ],
          },
          {
            id: 'phase-2',
            name: 'Fase 2: Modelado de Datos y Base de Datos',
            tasks: [
              'Definir esquemas de Usuarios, Organizaciones, Proyectos y API Keys',
              'Aplicar políticas de Row Level Security (RLS) en Supabase',
              'Crear scripts de semillas (seeders) y migraciones iniciales',
            ],
          },
          {
            id: 'phase-3',
            name: 'Fase 3: Backend & Endpoints API',
            tasks: [
              'Construir Server Actions para CRUD de recursos principales',
              'Implementar middleware de autenticación y verificación de roles',
              'Crear endpoints para recepción de webhooks de facturación (Stripe)',
            ],
          },
          {
            id: 'phase-4',
            name: 'Fase 4: Frontend, UI/UX y Componentes',
            tasks: [
              'Diseñar Shell del Dashboard con barra lateral responsiva',
              'Construir componentes de gráficos interactivos con Framer Motion',
              'Crear vistas de configuración de cuenta y gestión de miembros',
            ],
          },
          {
            id: 'phase-5',
            name: 'Fase 5: Seguridad, Pruebas y Despliegue',
            tasks: [
              'Ejecutar auditoría de vulnerabilidades en dependencias y headers CSP',
              'Escribir pruebas de integración con Vitest y Playwright',
              'Configurar pipeline de despliegue continuo en Vercel',
            ],
          },
        ],
      },
      memory: {
        currentState: 'Inicialización de arquitectura y definición de requerimientos completada.',
        activeSprintOrMilestone: 'Sprint 1: Modelado de base de datos y esquema RLS en Supabase.',
        completedMilestones: [
          'Definición de PRD y arquitectura maestro',
          'Configuración del libreto de directivas para el asistente IA',
        ],
        inProgressMilestones: [
          'Esquematización de tablas en PostgreSQL y políticas RLS',
        ],
        blockers: [],
      },
    },
  },
  {
    id: 'ecommerce-neobrutalism',
    title: 'E-Commerce Neo-Brutalista',
    tag: 'React + Node NestJS',
    description: 'Tienda en línea de moda urbana con estética disruptiva de alto contraste, bordes gruesos y carrito reactivo.',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    data: {
      name: 'KICKZ Vault Store',
      slug: 'kickz-vault-store',
      description: 'E-Commerce de zapatillas de colección y ropa urbana con experiencia de compra inmersiva y microinteracciones audaces.',
      targetAudience: 'Compradores jóvenes, entusiastas de la moda streetwear y coleccionistas.',
      version: '1.0.0',
      architecture: {
        platform: 'web',
        languages: ['TypeScript', 'JavaScript'],
        frontendFramework: 'React (Vite)',
        backendFramework: 'Node.js (NestJS)',
        database: 'PostgreSQL',
        connectionType: 'REST API (JSON)',
        architecturalPattern: 'Clean Architecture (Domain-Driven / Use Cases)',
        customNotes: 'Desacoplamiento total entre frontend SPA y backend API NestJS con TypeORM.',
      },
      design: {
        style: 'neo_brutalism',
        styleFramework: 'Tailwind CSS v4 / v3',
        animationLibraries: ['Framer Motion'],
        iconLibraries: ['Lucide Icons'],
        primaryColor: '#FFE600',
        secondaryColor: '#FF5C93',
        darkModeDefault: false,
        typography: 'Space Grotesk & Clash Display',
        customDesignGuidelines: 'Bordes negros duros de 3px, sombras sólidas de 4px sin blur, colores pop amarillos y fucsia.',
      },
      rules: {
        goldenRule: true,
        atomicModifications: true,
        strictTyping: true,
        mandatoryExceptionHandling: true,
        strictModularity: true,
        gitCommitConventions: true,
        testCoverageRequirement: true,
        customRules: [
          'Mantener diseño neo-brutalista estricto en todos los modales y alertas.',
          'Los precios y cálculos del carrito deben validarse siempre del lado del servidor.',
        ],
      },
      decisions: {
        strictlyForbidAlternativeStacks: true,
        customDecisions: [],
      },
      security: {
        envVariablesManagement: true,
        secureAuth: true,
        inputSanitization: true,
        sqlInjectionAndXssProtection: true,
        corsAndSecurityHeaders: true,
        rateLimiting: true,
        csrfProtection: true,
        customSecurityPolicies: [
          'Validación de payloads con class-validator en NestJS DTOs.',
          'Rate limiting estricto en el endpoint de checkout.',
        ],
      },
      prd: {
        functionalRequirements: [
          'Catálogo interactivo con filtros dinámicos por talla, precio y marca.',
          'Carrito de compras persistente con cálculo automático de envíos e impuestos.',
          'Checkout seguro con procesamiento de tarjeta vía Stripe Elements.',
          'Historial de pedidos y seguimiento de envíos en tiempo real.',
        ],
        nonFunctionalRequirements: [
          'Carga de página de producto inferior a 1 segundo.',
          'Diseño 100% responsivo adaptable a dispositivos móviles.',
        ],
        userStories: [
          'Como comprador, quiero añadir un producto al carrito y ver la actualización instantánea sin recargar la página.',
        ],
        masterPromptTone: 'collaborative_expert',
        customMasterPromptDirectives: 'Enfócate en la estética neo-brutalista cuidando la accesibilidad visual y contraste de textos.',
      },
      tasks: {
        phases: [
          {
            id: 'phase-1',
            name: 'Fase 1: Setup & Inicialización',
            tasks: [
              'Configurar monorepo / proyectos separados con React Vite y NestJS',
              'Configurar Tailwind con plugins de tipografía y colores neo-brutalistas',
            ],
          },
          {
            id: 'phase-2',
            name: 'Fase 2: Modelado de Datos y Base de Datos',
            tasks: [
              'Diseñar entidades Product, Variant, Order, Customer en TypeORM',
              'Configurar migraciones en PostgreSQL',
            ],
          },
          {
            id: 'phase-3',
            name: 'Fase 3: Backend & Endpoints API',
            tasks: [
              'Implementar controladores y servicios de catálogo de productos',
              'Crear pasarela de checkout con validación de inventario concurrente',
            ],
          },
          {
            id: 'phase-4',
            name: 'Fase 4: Frontend, UI/UX y Componentes',
            tasks: [
              'Construir componentes Neo-Brutalistas (botones con sombra dura, tarjetas con borde negro)',
              'Diseñar vista de catálogo y ficha de producto interactiva',
            ],
          },
          {
            id: 'phase-5',
            name: 'Fase 5: Seguridad, Pruebas y Despliegue',
            tasks: [
              'Pruebas unitarias de cálculo de impuestos y stock',
              'Despliegue de API en Railway / Render y Frontend en Vercel',
            ],
          },
        ],
      },
      memory: {
        currentState: 'Diseño de arquitectura y especificación visual completados.',
        activeSprintOrMilestone: 'Sprint 1: Modelado de catálogo y componentes base de UI.',
        completedMilestones: ['Especificación del Libreto'],
        inProgressMilestones: ['Construcción de componentes Neo-Brutalistas'],
        blockers: [],
      },
    },
  },
  {
    id: 'mobile-crossplatform',
    title: 'App Móvil Multiplataforma',
    tag: 'Expo + FastAPI',
    description: 'Aplicación nativa para iOS y Android desarrollada con Expo / React Native conectada a un backend de alto rendimiento en Python FastAPI.',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    data: {
      name: 'FitPulse Tracker',
      slug: 'fitpulse-tracker',
      description: 'Aplicación móvil de salud y entrenamiento con sincronización en tiempo real, registro de rutinas y análisis predictivo.',
      targetAudience: 'Deportistas, entrenadores y personas enfocadas en su bienestar físico.',
      version: '1.0.0',
      architecture: {
        platform: 'mobile',
        languages: ['TypeScript', 'Python'],
        frontendFramework: 'React Native / Expo',
        backendFramework: 'FastAPI (Python)',
        database: 'PostgreSQL',
        connectionType: 'REST API (JSON)',
        architecturalPattern: 'MVVM (Model-View-ViewModel)',
        customNotes: 'Almacenamiento offline con SQLite local y sincronización en segundo plano con FastAPI.',
      },
      design: {
        style: 'glassmorphism',
        styleFramework: 'Tailwind CSS v4 / v3',
        animationLibraries: ['Framer Motion', 'LottieFiles (lottie-react)'],
        iconLibraries: ['Lucide Icons'],
        primaryColor: '#10B981',
        secondaryColor: '#3B82F6',
        darkModeDefault: true,
        typography: 'System Font (San Francisco / Roboto)',
        customDesignGuidelines: 'Microanimaciones fluidas con Lottie, tarjetas con transparencia suave y feedback háptico en botones.',
      },
      rules: {
        goldenRule: true,
        atomicModifications: true,
        strictTyping: true,
        mandatoryExceptionHandling: true,
        strictModularity: true,
        gitCommitConventions: true,
        testCoverageRequirement: true,
        customRules: [
          'Todos los tokens sensibles deben guardarse en SecureStore en iOS/Android.',
          'El estado offline debe ser tolerante a fallos sin crashear la aplicación.',
        ],
      },
      decisions: {
        strictlyForbidAlternativeStacks: true,
        customDecisions: [],
      },
      security: {
        envVariablesManagement: true,
        secureAuth: true,
        inputSanitization: true,
        sqlInjectionAndXssProtection: true,
        corsAndSecurityHeaders: true,
        rateLimiting: true,
        csrfProtection: true,
        customSecurityPolicies: [
          'Tokens JWT con refresco seguro en Keychain/Keystore mediante expo-secure-store.',
          'Esquemas Pydantic para validación estricta de todos los requests en FastAPI.',
        ],
      },
      prd: {
        functionalRequirements: [
          'Registro y seguimiento de entrenamientos con cronómetro y series.',
          'Modo offline con sincronización automática al recuperar conexión.',
          'Gráficos de evolución semanal de calorías y peso.',
          'Notificaciones push programadas para recordatorios de entrenamiento.',
        ],
        nonFunctionalRequirements: [
          'Consumo optimizado de batería (< 3% por hora de uso activo).',
          'Arranque en frío menor a 1.5 segundos en dispositivos de gama media.',
        ],
        userStories: [
          'Como usuario en el gimnasio, quiero registrar mis series sin internet y que se guarden sin errores.',
        ],
        masterPromptTone: 'architect_mentor',
        customMasterPromptDirectives: 'Garantiza que ningún código utilice APIs obsoletas de Expo y asegura que el tipado de TypeScript sea 100% estricto.',
      },
      tasks: {
        phases: [
          {
            id: 'phase-1',
            name: 'Fase 1: Setup & Inicialización',
            tasks: [
              'Inicializar proyecto Expo con template TypeScript y NativeWind/Tailwind',
              'Configurar entorno virtual Python con Poetry y FastAPI',
            ],
          },
          {
            id: 'phase-2',
            name: 'Fase 2: Modelado de Datos y Base de Datos',
            tasks: [
              'Modelar tablas de Entrenamientos y Ejercicios con SQLAlchemy y Alembic',
              'Configurar base de datos SQLite local para modo offline',
            ],
          },
          {
            id: 'phase-3',
            name: 'Fase 3: Backend & Endpoints API',
            tasks: [
              'Endpoints de sincronización batch en FastAPI',
              'Módulo de autenticación OAuth2 con Password Bearer JWT',
            ],
          },
          {
            id: 'phase-4',
            name: 'Fase 4: Frontend, UI/UX y Componentes',
            tasks: [
              'Pantallas principales de Rutinas, Cronómetro y Perfil',
              'Integración de animaciones Lottie para celebración de metas cumplidas',
            ],
          },
          {
            id: 'phase-5',
            name: 'Fase 5: Seguridad, Pruebas y Despliegue',
            tasks: [
              'Configuración de EAS Build para compilación de APK e IPA',
              'Pruebas de sincronización con desconexión de red simulada',
            ],
          },
        ],
      },
      memory: {
        currentState: 'Diseño técnico y dependencias definidas.',
        activeSprintOrMilestone: 'Sprint 1: Esqueleto de pantallas Expo y modelos FastAPI.',
        completedMilestones: ['Especificación del Libreto de Directivas'],
        inProgressMilestones: ['Configuración de Expo Router'],
        blockers: [],
      },
    },
  },
  {
    id: 'static-jamstack-astro',
    title: 'Sitio Web Estático & Jamstack',
    tag: 'Astro + Jamstack (Sin BD)',
    description: 'Landing page o sitio de documentación ultrarrápido con arquitectura de islas, cero costo de servidor y hosting en Vercel o Cloudflare Pages.',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    data: {
      name: 'AstroNova Landing & Docs',
      slug: 'astronova-landing-docs',
      description: 'Sitio web estático moderno de alto rendimiento para landing page y documentación técnica basado en colecciones Markdown/MDX.',
      targetAudience: 'Visitantes, desarrolladores y clientes en busca de tiempos de carga instantáneos.',
      version: '1.0.0',
      architecture: {
        platform: 'static',
        languages: ['TypeScript', 'JavaScript'],
        frontendFramework: 'Astro (SSG / Islands Architecture)',
        backendFramework: 'Ninguno (Solo Frontend Estático / Jamstack)',
        database: 'Ninguna (Sitio Estático / Sin BD)',
        connectionType: 'Archivos Estáticos Locales (Markdown / MDX / JSON)',
        architecturalPattern: 'SSG (Static Site Generation / Jamstack)',
        customNotes: 'Sitio 100% pre-renderizado en tiempo de compilación. Cero bases de datos y despliegue global en Edge CDN.',
        isStaticSite: true,
        staticHosting: 'Cloudflare Pages',
      },
      design: {
        style: 'bento_grid',
        styleFramework: 'Tailwind CSS v4 / v3',
        animationLibraries: ['Framer Motion'],
        iconLibraries: ['Lucide Icons'],
        primaryColor: '#38BDF8',
        secondaryColor: '#10B981',
        darkModeDefault: true,
        typography: 'Inter, system-ui, sans-serif',
        customDesignGuidelines: 'Diseño modular estilo Bento Grid, tarjetas con bordes redondeados y micro-interacciones sutiles.',
      },
      rules: {
        goldenRule: true,
        atomicModifications: true,
        strictTyping: true,
        mandatoryExceptionHandling: true,
        strictModularity: true,
        gitCommitConventions: true,
        testCoverageRequirement: true,
        customRules: [
          'No introducir dependencias de servidor ni paquetes de bases de datos.',
          'Todas las imágenes deben optimizarse mediante la etiqueta <Image /> de Astro.',
        ],
      },
      decisions: {
        strictlyForbidAlternativeStacks: true,
        customDecisions: [
          {
            id: 'adr-1',
            title: 'Adopción de Astro para Arquitectura SSG',
            context: 'Se busca máxima puntuación en Google Lighthouse (100) y cero costo de infraestructura.',
            decision: 'Usar Astro con arquitectura de islas y exportación estática HTML pura.',
            consequences: 'Velocidad inigualable y bundle JavaScript casi nulo.',
            discardedAlternatives: 'Next.js con SSR dinámico (complejidad y costo de servidor innecesarios).',
          },
        ],
      },
      security: {
        envVariablesManagement: true,
        secureAuth: false,
        inputSanitization: true,
        sqlInjectionAndXssProtection: true,
        corsAndSecurityHeaders: true,
        rateLimiting: false,
        csrfProtection: false,
        customSecurityPolicies: [
          'Cabeceras de Content-Security-Policy (CSP) estrictas en el archivo _headers del hosting.',
          'Sanitización estricta de cualquier HTML insertado desde Markdown de terceros.',
        ],
      },
      prd: {
        functionalRequirements: [
          'Generación estática de páginas para inicio, características y blog.',
          'Buscador estático client-side indexado con Pagefind.',
          'Soporte para modo claro y oscuro con persistencia en localStorage.',
          'Formulario de contacto conectado a servicio serverless (ej. Formspree o Resend).',
        ],
        nonFunctionalRequirements: [
          'Puntaje de 100/100 en Google Lighthouse para Rendimiento y SEO.',
          'Tiempo de carga inicial inferior a 500ms en redes 4G.',
          'Cero costo mensual recurrente de servidores o bases de datos.',
        ],
        userStories: [
          'Como visitante, quiero cargar las páginas de forma instantánea sin parpadeos ni demoras.',
          'Como creador de contenido, quiero redactar artículos en archivos .mdx con componentes interactivos.',
        ],
        masterPromptTone: 'strict_senior',
        customMasterPromptDirectives: 'Prioriza el mínimo peso del bundle JavaScript. Cualquier componente interactivo debe cargarse de forma diferida con client:visible.',
      },
      tasks: {
        phases: [
          {
            id: 'phase-1',
            name: 'Fase 1: Setup & Configuración Jamstack',
            tasks: [
              'Inicializar proyecto con Astro, TypeScript y Tailwind CSS',
              'Configurar adaptador de exportación estática y layouts base',
              'Establecer tokens tipográficos y variables de tema',
            ],
          },
          {
            id: 'phase-2',
            name: 'Fase 2: Estructura de Contenido & Colecciones',
            tasks: [
              'Definir esquemas Zod en content/config.ts para artículos y páginas',
              'Crear plantillas de artículos Markdown con metadatos de SEO',
              'Configurar enrutamiento dinámico [...slug].astro',
            ],
          },
          {
            id: 'phase-3',
            name: 'Fase 3: Componentes UI & Bento Grid',
            tasks: [
              'Construir componentes Bento Grid para características del producto',
              'Diseñar barra de navegación responsiva y pie de página',
              'Implementar selector de tema claro/oscuro sin salto de hidratación',
            ],
          },
          {
            id: 'phase-4',
            name: 'Fase 4: Optimización SEO, Performance y Assets',
            tasks: [
              'Generar sitemap XML automático y robots.txt',
              'Configurar Open Graph meta tags e imágenes de previsualización social',
              'Optimizar compresión de fuentes web y recursos multimedia',
            ],
          },
          {
            id: 'phase-5',
            name: 'Fase 5: Despliegue en Edge CDN & Verificación',
            tasks: [
              'Configurar flujo de integración continua en GitHub Actions',
              'Desplegar en Cloudflare Pages / Vercel con cabeceras de seguridad',
              'Auditar con Google Lighthouse y verificar puntuación perfecta',
            ],
          },
        ],
      },
      memory: {
        currentState: 'Arquitectura estática y definición de contenido completada.',
        activeSprintOrMilestone: 'Fase 1: Configuración de Astro y layout base.',
        completedMilestones: ['Especificación del Libreto Jamstack'],
        inProgressMilestones: ['Inicialización del proyecto'],
        blockers: [],
      },
    },
  },
];

export const DEFAULT_PROJECT_TEMPLATE: LibretoProject = {
  id: 'libreto-' + Date.now(),
  name: 'Mi Proyecto Épico',
  slug: 'mi-proyecto-epico',
  description: 'Aplicación moderna de alto impacto con arquitectura robusta y directivas estrictas para desarrollo asistido por IA.',
  targetAudience: 'Usuarios finales y desarrolladores',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  architecture: {
    platform: 'web',
    languages: ['TypeScript'],
    frontendFramework: 'React (Vite)',
    backendFramework: 'Node.js (NestJS)',
    database: 'PostgreSQL',
    connectionType: 'REST API (JSON)',
    architecturalPattern: 'Clean Architecture (Domain-Driven / Use Cases)',
    customNotes: 'Separación modular estricta entre capa de presentación y lógica de dominio.',
  },
  design: {
    style: 'minimalist',
    styleFramework: 'Tailwind CSS v4 / v3',
    animationLibraries: ['Framer Motion'],
    iconLibraries: ['Lucide Icons'],
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    darkModeDefault: true,
    typography: 'Inter, system-ui, sans-serif',
    customDesignGuidelines: 'Diseño limpio, espacios respirables, accesibilidad AA y soporte completo para modo oscuro y claro.',
  },
  rules: {
    goldenRule: true,
    atomicModifications: true,
    strictTyping: true,
    mandatoryExceptionHandling: true,
    strictModularity: true,
    gitCommitConventions: true,
    testCoverageRequirement: true,
    customRules: [],
  },
  decisions: {
    strictlyForbidAlternativeStacks: true,
    customDecisions: [],
  },
  security: {
    envVariablesManagement: true,
    secureAuth: true,
    inputSanitization: true,
    sqlInjectionAndXssProtection: true,
    corsAndSecurityHeaders: true,
    rateLimiting: true,
    csrfProtection: true,
    customSecurityPolicies: [],
  },
  prd: {
    functionalRequirements: [
      'Autenticación y registro de usuarios con validación de credenciales.',
      'Panel de control interactivo con resumen de actividades.',
      'Gestión de perfil y preferencias de configuración.',
      'Búsqueda y filtrado dinámico de información en tiempo real.',
    ],
    nonFunctionalRequirements: [
      'Tiempo de carga inicial inferior a 1.5s.',
      'Diseño responsivo optimizado para móviles y pantallas grandes.',
      'Compatibilidad con navegadores modernos (Chrome, Firefox, Safari, Edge).',
    ],
    userStories: [
      'Como usuario, quiero acceder de manera rápida y segura para consultar mis datos.',
      'Como administrador, quiero gestionar los permisos y accesos de los usuarios.',
    ],
    masterPromptTone: 'strict_senior',
    customMasterPromptDirectives: '',
  },
  tasks: {
    phases: [
      {
        id: 'phase-1',
        name: 'Fase 1: Setup & Inicialización',
        tasks: [
          'Inicializar repositorio con control de versiones y linting',
          'Configurar variables de entorno iniciales en .env.example',
          'Instalar dependencias base y verificar compilación limpia',
        ],
      },
      {
        id: 'phase-2',
        name: 'Fase 2: Modelado de Datos y Base de Datos',
        tasks: [
          'Definir esquemas de datos y relaciones',
          'Crear migraciones y semillas de prueba',
          'Verificar integridad referencial e índices',
        ],
      },
      {
        id: 'phase-3',
        name: 'Fase 3: Backend & Endpoints API',
        tasks: [
          'Implementar controladores y casos de uso de negocio',
          'Añadir validación estricta de esquemas de entrada',
          'Implementar manejo global de excepciones y códigos de estado HTTP',
        ],
      },
      {
        id: 'phase-4',
        name: 'Fase 4: Frontend, UI/UX y Componentes',
        tasks: [
          'Construir componentes atómicos (botones, tarjetas, inputs, modales)',
          'Implementar vistas principales con conexión a API',
          'Añadir transiciones y microinteracciones fluidas',
        ],
      },
      {
        id: 'phase-5',
        name: 'Fase 5: Seguridad, Pruebas y Despliegue',
        tasks: [
          'Escribir pruebas unitarias y de integración',
          'Auditoría de seguridad (CORS, CSP, Headers, sanitización)',
          'Preparar pipelines de integración continua y despliegue a producción',
        ],
      },
    ],
  },
  memory: {
    currentState: 'Definición de requerimientos y arquitectura aprobada. Listo para inicializar el proyecto.',
    activeSprintOrMilestone: 'Fase 1: Configuración de entorno y repositorio.',
    completedMilestones: ['Creación de libreto maestro de directivas'],
    inProgressMilestones: ['Inicialización del proyecto'],
    blockers: [],
  },
};
