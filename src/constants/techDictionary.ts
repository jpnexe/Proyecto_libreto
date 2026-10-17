/**
 * DICCIONARIO TÉCNICO EXHAUSTIVO DE TECNOLOGÍAS, FRAMEWORKS Y PATRONES
 * Este archivo nutre dinámicamente las especificaciones de arquitectura, tareas,
 * diseño, seguridad y decisiones con definiciones ricas, arquitecturas detalladas,
 * comandos CLI, buenas prácticas y directivas vinculantes para la IA.
 */

export interface TechDetail {
  name: string;
  category: string;
  description: string;
  paradigm: string;
  architectureGuide: string;
  recommendedFolderStructure: string;
  cliCommands: { label: string; command: string }[];
  keyLibraries: string[];
  performanceDirectives: string[];
  bestPractices: string[];
  securityConsiderations: string[];
  commonPitfalls: string[];
}

export interface StyleDetail {
  id: string;
  name: string;
  category: string;
  philosophy: string;
  cssRules: string[];
  colorTokens: { token: string; hex: string; role: string }[];
  typographyGuideline: string;
  componentDirectives: string[];
  animationProfile: string;
}

// ==========================================
// 1. DICCIONARIO DE FRONTEND FRAMEWORKS
// ==========================================
export const FRONTEND_TECH_MAP: Record<string, TechDetail> = {
  'HTML5 + Vanilla JS + CSS3 (Puro)': {
    name: 'HTML5 + Vanilla JS + CSS3 (Puro)',
    category: 'Desarrollo Web Nativo sin Dependencias',
    description: 'Arquitectura web fundamental basada en estándares nativos W3C y ECMAScript moderno. Cero dependencias externas, cero sobrecarga de compilación y máxima compatibilidad con navegadores.',
    paradigm: 'Web Standards + Native DOM API + Modular ES6 Modules',
    architectureGuide: `La aplicación se organiza en módulos nativos ES (\`type="module"\`) que encapsulan componentes mediante Web Components nativos (Custom Elements + Shadow DOM) o funciones manipuladoras del DOM. El CSS se estructura con CSS Custom Properties nativas, CSS Grid y Flexbox. No requiere bundler para desarrollo local, aunque puede utilizarse Rollup/Vite para minificación de producción.`,
    recommendedFolderStructure: `public/ o src/
├── index.html            # Marcado semántico HTML5 accesible (WAI-ARIA)
├── css/
│   ├── variables.css     # Variables CSS nativas (--primary, --surface, etc.)
│   ├── reset.css         # Modern CSS reset (box-sizing, márgenes)
│   ├── layout.css        # Cuadrículas maestras y contenedores
│   └── components/       # Estilos modulares encapsulados
├── js/
│   ├── main.js           # Punto de entrada inicial (importación de módulos)
│   ├── components/       # Custom Elements o módulos de UI reutilizables
│   ├── services/         # Clientes de API con fetch nativo y async/await
│   └── state/            # Gestor de estado observable basado en EventTarget
└── assets/               # Imágenes optimizadas (AVIF/WebP) y tipografías WOFF2`,
    cliCommands: [
      { label: 'Servidor Local Rápido', command: 'npx serve . -l 3000' },
      { label: 'Formateo y Linter', command: 'npx prettier --write "**/*.{html,css,js}"' },
      { label: 'Minificación Producción', command: 'npx terser js/main.js -o dist/main.min.js' },
    ],
    keyLibraries: ['Fetch API nativa', 'Web Components API', 'CSS Custom Properties', 'EventTarget / CustomEvent'],
    performanceDirectives: [
      'Cero overhead de runtime de JavaScript (0 KB de librería base).',
      'Carga diferida de scripts no críticos mediante defer o async en etiquetas <script>.',
      'Optimización de imágenes con loading="lazy" y decoding="async" nativos.',
      'Calificación Lighthouse garantizada de 100/100 en Performance y SEO.',
    ],
    bestPractices: [
      'Utilizar delegación de eventos en contenedores comunes para evitar memory leaks por listeners excesivos.',
      'Separar estrictamente estructura (HTML), presentación (CSS) y comportamiento (JS).',
      'Definir constantes de estado inmutables mediante Object.freeze() si es necesario.',
    ],
    securityConsiderations: [
      'Nunca utilizar innerHTML con datos suministrados por el usuario; usar textContent o createElement con appendChild.',
      'Configurar cabeceras de Content-Security-Policy (CSP) estrictas en el servidor.',
    ],
    commonPitfalls: [
      'Polución del scope global con variables var o declaraciones en window.',
      'Manipulación directa ineficiente del DOM dentro de bucles de alta frecuencia sin DocumentFragment.',
    ],
  },

  'Astro (SSG / Islands Architecture)': {
    name: 'Astro (SSG / Islands Architecture)',
    category: 'Generador de Sitios Estáticos & Arquitectura de Islas',
    description: 'Framework web moderno orientado a contenido que prioriza la entrega de cero JavaScript al cliente por defecto mediante Static Site Generation (SSG) y componentes de islas hidratadas bajo demanda.',
    paradigm: 'Content-driven SSG + Partial Hydration (Islands Architecture)',
    architectureGuide: `Astro renderiza todo el marcado HTML en tiempo de compilación (build time). Los componentes interactivos (React, Vue, Svelte) se aíslan en "islas" independientes y solo cargan su JavaScript cuando cumplen directivas del cliente (ej. \`client:visible\`, \`client:idle\` o \`client:media\`). Cero JS innecesario en el hilo principal.`,
    recommendedFolderStructure: `src/
├── content/              # Colecciones tipadas con esquemas Zod (docs, blog, productos)
│   ├── blog/             # Archivos Markdown / MDX con frontmatter validado
│   └── config.ts         # Definición de colecciones y tipos con defineCollection
├── components/           # Componentes UI reutilizables
│   ├── static/           # Componentes .astro cero-JS (Headers, Footers, Tarjetas)
│   └── islands/          # Componentes interactivos hidratados (.tsx / .svelte)
├── layouts/              # Plantillas maestras de página (BaseLayout, DocLayout)
├── pages/                # Enrutamiento basado en archivos (File-based routing)
│   ├── [...slug].astro   # Generación de rutas estáticas con getStaticPaths()
│   ├── index.astro       # Página de inicio
│   └── 404.astro         # Página de error estática
├── styles/               # Tokens de CSS global, variables y temas Tailwind
└── public/               # Assets estáticos servidos directamente sin procesamiento`,
    cliCommands: [
      { label: 'Iniciar Servidor Dev', command: 'npx astro dev' },
      { label: 'Compilar Bundle SSG', command: 'npx astro build' },
      { label: 'Previsualizar Build Local', command: 'npx astro preview' },
      { label: 'Chequeo de Tipos de Contenido', command: 'npx astro check' },
    ],
    keyLibraries: ['@astrojs/tailwind', '@astrojs/mdx', '@astrojs/sitemap', 'pagefind (búsqueda estática)', 'zod'],
    performanceDirectives: [
      'Prohibido usar client:load a menos que el componente sea crítico para el renderizado inicial arriba del pliegue (above-the-fold).',
      'Utilizar client:visible para modales, carruseles y secciones inferiores.',
      'Procesar todas las imágenes mediante el componente nativo <Image /> de Astro con formatos AVIF y WebP automáticos.',
      'Asegurar un puntaje de Google Lighthouse de 98+ en Rendimiento y SEO.',
    ],
    bestPractices: [
      'Utilizar Content Collections para todo contenido editorial con tipado Zod en src/content/config.ts.',
      'Separar componentes de maquetación pura (.astro) de la lógica reactiva de islas (.tsx).',
      'Configurar adapter de exportación estática en astro.config.mjs.',
    ],
    securityConsiderations: [
      'Sanitizar cualquier HTML inyectado de fuentes de terceros usando librerías como sanitize-html o rehype-sanitize.',
      'Configurar cabeceras de Content-Security-Policy (CSP) en el archivo _headers o middleware del hosting.',
    ],
    commonPitfalls: [
      'Importar librerías que requieran el objeto window o document en la sección de frontmatter de componentes .astro.',
      'Olvidar declarar getStaticPaths() en rutas con parámetros dinámicos [...slug].astro.',
    ],
  },

  'React (Vite)': {
    name: 'React (Vite)',
    category: 'Single Page Application (SPA) Client-Side',
    description: 'Ecosistema reactivo client-side de alto rendimiento impulsado por Vite como bundler ultrarrápido con Hot Module Replacement (HMR) instantáneo sobre módulos ES nativos.',
    paradigm: 'Component-Based Reactive UI + Client-Side Routing',
    architectureGuide: `La aplicación se compila en un paquete estático HTML/JS/CSS que se ejecuta íntegramente en el navegador del cliente. Toda la navegación se gestiona en memoria sin recargas de página mediante History API. La comunicación con APIs se realiza asíncronamente mediante fetch/axios o librerías de query caching (TanStack Query).`,
    recommendedFolderStructure: `src/
├── assets/               # Imágenes, fuentes e iconos vectoriales SVG
├── components/           # Componentes UI reutilizables
│   ├── common/           # Botones, inputs, badges, modales genéricos
│   └── layout/           # Navbar, Sidebar, Footer, PageWrapper
├── features/             # Módulos organizados por dominio funcional (Feature-Sliced)
│   ├── auth/             # Componentes, hooks y servicios de autenticación
│   └── dashboard/        # Métricas, gráficas y widgets
├── hooks/                # Custom hooks reutilizables (useDebounce, useLocalStorage)
├── services/             # Clientes de API HTTP tipados y adaptadores de transporte
├── stores/               # Estado global reactivo ligero (Zustand / Redux Toolkit)
├── types/                # Interfaces y contratos TypeScript centralizados
├── utils/                # Funciones auxiliares puras y formateadores
├── App.tsx               # Enrutador principal y proveedores de contexto
└── main.tsx              # Punto de entrada y montaje en el DOM`,
    cliCommands: [
      { label: 'Servidor de Desarrollo', command: 'npm run dev' },
      { label: 'Compilación TypeScript & Build', command: 'npm run build' },
      { label: 'Previsualizar Producción', command: 'npm run preview' },
      { label: 'Auditoría de Linter', command: 'npx oxlint / npm run lint' },
    ],
    keyLibraries: ['@tanstack/react-query', 'zustand', 'react-router-dom', 'lucide-react', 'zod', 'clsx', 'tailwind-merge'],
    performanceDirectives: [
      'Implementar lazy loading de rutas mediante React.lazy() y React.Suspense con skeletons de carga.',
      'Memoizar callbacks pesados con useCallback y cálculos intensivos con useMemo.',
      'Evitar renders innecesarios dividiendo contextos grandes en stores atómicos con selectores precisos.',
    ],
    bestPractices: [
      'Tipado estricto sin uso de any; preferir interfaces explícitas sobre tipos implícitos.',
      'Mantener funciones de componentes por debajo de 50 líneas útiles separando lógica en custom hooks.',
      'Centralizar la gestión de llamadas HTTP en una capa de servicios desacoplada de la UI.',
    ],
    securityConsiderations: [
      'Prohibido almacenar tokens JWT en localStorage debido a vulnerabilidades de XSS; usar cookies HttpOnly o memoria volátil con silent refresh.',
      'Sanitizar entradas de usuario y escapar salidas visuales.',
    ],
    commonPitfalls: [
      'Prop drilling excesivo en lugar de emplear composition o stores globales.',
      'Efectos useEffect con dependencias incompletas o que disparan bucles infinitos de renderizado.',
    ],
  },

  'Next.js (App Router - Fullstack)': {
    name: 'Next.js (App Router - Fullstack)',
    category: 'Framework Fullstack Híbrido (RSC + SSR + Server Actions)',
    description: 'Framework empresarial para aplicaciones web modernas con React Server Components (RSC), renderizado híbrido (SSR/SSG), Server Actions mutacionales y optimización de assets.',
    paradigm: 'React Server Components + Server-Driven Fullstack Architecture',
    architectureGuide: `La arquitectura se divide en Server Components (ejecutados en el servidor, cero impacto en el bundle de JS del cliente) y Client Components marcados con \`'use client'\` para interactividad reactiva. Las mutaciones de base de datos se ejecutan en Server Actions con validación de esquemas Zod y revalidación de caché bajo demanda.`,
    recommendedFolderStructure: `src/
├── app/                  # Enrutador basado en carpetas (App Router)
│   ├── (auth)/           # Grupo de rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/      # Grupo de rutas protegidas del panel
│   │   ├── layout.tsx    # Layout persistente del dashboard
│   │   └── page.tsx      # Vista principal
│   ├── api/              # Route Handlers para webhooks y endpoints REST
│   ├── globals.css       # Estilos globales y tokens Tailwind
│   ├── layout.tsx        # Root layout maestro
│   └── page.tsx          # Landing page pública
├── components/           # Componentes cliente y servidor
│   ├── ui/               # Componentes atómicos Shadcn / Tailwind
│   └── modules/          # Componentes compuestos por feature
├── actions/              # Server Actions seguros ('use server')
├── lib/                  # Clientes de BD (Prisma/Drizzle/Supabase), utilidades
└── types/                # Contratos TypeScript`,
    cliCommands: [
      { label: 'Servidor Dev', command: 'npx next dev' },
      { label: 'Build Producción', command: 'npx next build' },
      { label: 'Iniciar Producción', command: 'npx next start' },
    ],
    keyLibraries: ['next-auth / @supabase/auth-helpers', 'zod', 'prisma / drizzle-orm', 'server-only', 'shadcn/ui'],
    performanceDirectives: [
      'Mantener la mayor cantidad posible de componentes como Server Components.',
      'Utilizar streaming con loading.tsx y React.Suspense para carga progresiva.',
      'Optimizar imágenes con next/image y fuentes con next/font.',
    ],
    bestPractices: [
      'Validar todos los argumentos en Server Actions con esquemas Zod antes de mutar datos.',
      'Usar revalidatePath y revalidateTag para invalidación granular de caché.',
    ],
    securityConsiderations: [
      'Prohibido exponer variables sensibles con el prefijo NEXT_PUBLIC_.',
      'Validar sesiones de usuario dentro de Server Actions y Route Handlers.',
    ],
    commonPitfalls: [
      'Colocar "use client" en la raíz del layout en lugar de bajarlo a las hojas del árbol de componentes.',
    ],
  },

  'Next.js (Static Export / SSG)': {
    name: 'Next.js (Static Export / SSG)',
    category: 'Framework Web con Exportación Estática',
    description: 'Configuración de Next.js optimizada exclusivamente para Static Site Generation con "output: export", produciendo archivos estáticos HTML/CSS/JS compatibles con cualquier Edge CDN.',
    paradigm: 'Static Site Generation (SSG) + Client Components Hydration',
    architectureGuide: `Next.js compila todas las rutas y páginas a archivos HTML estáticos en tiempo de compilación. No se utilizan servidores Node.js en tiempo de ejecución. Las rutas dinámicas se resuelven mediante generateStaticParams().`,
    recommendedFolderStructure: `src/
├── app/                  # Enrutador App Router con export estático
│   ├── [...slug]/        # generateStaticParams() para páginas dinámicas
│   ├── layout.tsx        # Shell HTML base
│   └── page.tsx          # Home estático
├── components/           # Componentes de interfaz
└── out/                  # Directorio generado listo para CDN`,
    cliCommands: [
      { label: 'Build Export Estático', command: 'npx next build' },
      { label: 'Servidor de Previsualización', command: 'npx serve out' },
    ],
    keyLibraries: ['next/image (desoptimizado para estático)', 'lucide-react', 'tailwind-merge'],
    performanceDirectives: [
      'Desplegar en CDN global para latencia menor a 50ms.',
      'Cero costos de computación backend en producción.',
    ],
    bestPractices: [
      'Configurar output: "export" e images: { unoptimized: true } en next.config.mjs.',
    ],
    securityConsiderations: [
      'No hay servidor ejecutable en runtime, mitigando ataques de servidor.',
    ],
    commonPitfalls: [
      'Usar Server Actions, cookies() o headers() dinámicos que requieren servidor activo.',
    ],
  },

  'Vue.js (Vite / Nuxt SSG)': {
    name: 'Vue.js (Vite / Nuxt SSG)',
    category: 'Framework Reactivo Basado en Single File Components',
    description: 'Ecosistema de interfaz reactivo y progresivo con Composition API, Single File Components (.vue) y compilación optimizada basada en Vite o Nuxt para SSG.',
    paradigm: 'Declarative Reactivity + Composition API + SFC Architecture',
    architectureGuide: `La interfaz se modela mediante Single File Components (.vue) combinando <template>, <script setup lang="ts"> y <style scoped>. La reactividad se basa en Proxies nativos con ref() y reactive(). El enrutamiento se gestiona con vue-router o file-based en Nuxt.`,
    recommendedFolderStructure: `src/
├── components/           # Componentes SFC reutilizables (.vue)
├── composables/          # Funciones reactivas reutilizables (useAuth, useFetch)
├── views/ o pages/       # Vistas de página principales
├── router/               # Configuración de Vue Router
├── stores/               # Estado centralizado con Pinia
├── types/                # Contratos TypeScript
└── App.vue               # Componente raíz`,
    cliCommands: [
      { label: 'Servidor Dev', command: 'npm run dev' },
      { label: 'Compilación Producción', command: 'npm run build' },
      { label: 'Pruebas Unitarias', command: 'npm run test:unit' },
    ],
    keyLibraries: ['pinia', 'vue-router', '@vueuse/core', 'lucide-vue-next', 'zod'],
    performanceDirectives: [
      'Aprovechar el compilador de templates optimizado de Vue con hoisting de nodos estáticos.',
      'Usar shallowRef para estructuras de datos grandes que no requieran reactividad profunda.',
    ],
    bestPractices: [
      'Utilizar exclusivamente <script setup lang="ts"> con Composition API.',
      'Modularizar el estado global en stores de Pinia tipadas.',
    ],
    securityConsiderations: [
      'Evitar el uso de v-html con texto proveniente de usuarios para prevenir XSS.',
    ],
    commonPitfalls: [
      'Desestructurar directamente objetos devueltos por reactive() perdiendo la reactividad; usar toRefs().',
    ],
  },

  'Svelte / SvelteKit': {
    name: 'Svelte / SvelteKit',
    category: 'Compilador Reactivo sin Virtual DOM',
    description: 'Framework radical que desplaza el trabajo de computación reactiva al tiempo de compilación. Cero Virtual DOM, código mínimo compilado y reactividad quirúrgica nativa.',
    paradigm: 'Compile-Time Reactivity + Zero Virtual DOM',
    architectureGuide: `Svelte transforma los componentes en código imperativo altamente optimizado que actualiza directamente el DOM cuando el estado muta. SvelteKit gestiona el enrutamiento basado en archivos (+page.svelte, +layout.svelte, +page.server.ts).`,
    recommendedFolderStructure: `src/
├── lib/                  # Componentes y utilidades compartidas ($lib)
│   ├── components/       # Componentes visuales .svelte
│   └── stores/           # Stores reactivos nativos o Runes
├── routes/               # Enrutamiento basado en archivos SvelteKit
│   ├── +layout.svelte    # Layout maestro
│   └── +page.svelte      # Página principal
└── app.html              # Plantilla HTML raíz`,
    cliCommands: [
      { label: 'Servidor Dev', command: 'npm run dev' },
      { label: 'Build Producción', command: 'npm run build' },
      { label: 'Chequeo de Tipos', command: 'npx svelte-check' },
    ],
    keyLibraries: ['@sveltejs/kit', 'lucide-svelte', 'tailwind-merge'],
    performanceDirectives: [
      'Bundle ultraliviano con actualización directa de nodos DOM en milisegundos.',
    ],
    bestPractices: [
      'Aprovechar las Runes ($state, $derived, $effect) en Svelte 5.',
      'Evitar sobrecargar los efectos reactivos.',
    ],
    securityConsiderations: [
      'Sanitizar datos al usar {@html} para mitigar XSS.',
    ],
    commonPitfalls: [
      'Modificar arrays u objetos in-situ sin reasignar si se usan stores anteriores a Svelte 5.',
    ],
  },

  'Angular': {
    name: 'Angular',
    category: 'Plataforma Empresarial Fullstack Frontend',
    description: 'Plataforma empresarial robusta de Google basada en TypeScript con inyección de dependencias, Signals reactivos, Zoneless Change Detection y arquitectura modular escalable.',
    paradigm: 'Component-Based + Dependency Injection + Reactive Signals',
    architectureGuide: `Estructura orientada a componentes standalone con inyección de dependencias jerárquica en constructores. El estado reactivo se maneja con Signals nativos (\`signal()\`, \`computed()\`) y RxJS para flujos asíncronos complejos.`,
    recommendedFolderStructure: `src/app/
├── core/                 # Servicios singleton, interceptores y guards
├── features/             # Módulos o componentes standalone por funcionalidad
├── shared/               # Componentes de UI comunes y pipes reutilizables
├── app.config.ts         # Proveedores de configuración de la app
└── app.routes.ts         # Enrutamiento de la aplicación`,
    cliCommands: [
      { label: 'Servidor Dev', command: 'ng serve' },
      { label: 'Build Producción', command: 'ng build' },
      { label: 'Pruebas Unitarias', command: 'ng test' },
    ],
    keyLibraries: ['@angular/core', '@angular/router', 'rxjs', 'lucide-angular'],
    performanceDirectives: [
      'Utilizar componentes standalone y habilitar changeDetection: ChangeDetectionStrategy.OnPush.',
      'Adoptar Signals nativos para minimizar el overhead de Zone.js.',
    ],
    bestPractices: [
      'Desuscribirse explícitamente de Observables con takeUntilDestroyed().',
      'Configurar interceptores HTTP tipados en app.config.ts.',
    ],
    securityConsiderations: [
      'Confiar en el Sanitizer nativo de Angular y evitar DomSanitizer.bypassSecurityTrustHtml indiscriminadamente.',
    ],
    commonPitfalls: [
      'Fugas de memoria por suscripciones RxJS huérfanas en ngOnDestroy.',
    ],
  },

  'React Native / Expo': {
    name: 'React Native / Expo',
    category: 'Desarrollo Móvil Multiplataforma (iOS & Android)',
    description: 'Plataforma líder para desarrollo de aplicaciones móviles nativas para iOS y Android con TypeScript, acceso a sensores de hardware y compilación mediante Expo Application Services (EAS).',
    paradigm: 'Declarative Native UI + Offline-First Synchronized Architecture',
    architectureGuide: `La interfaz compila a componentes nativos reales de cada sistema operativo (UIKit en iOS y ViewGroups en Android). La navegación se estructura mediante Expo Router con enrutamiento basado en archivos. Se implementa una capa offline-first con SQLite local o SecureStore para persistencia y sincronización en segundo plano con el backend.`,
    recommendedFolderStructure: `app/                     # Expo Router (Enrutamiento por archivos)
├── (tabs)/              # Navegación por pestañas inferiores (Bottom Tabs)
│   ├── index.tsx        # Pantalla de inicio
│   ├── explore.tsx      # Búsqueda y descubrimiento
│   └── profile.tsx      # Perfil de usuario
├── (auth)/              # Flujo de autenticación modal
├── _layout.tsx          # Layout maestro con proveedores y temas
└── +not-found.tsx       # Pantalla 404 móvil
src/
├── components/          # Componentes de UI nativos (Botones, Tarjetas, Modales)
├── hooks/               # Custom hooks de sensores, red y almacenamiento
├── services/            # Clientes de API con interceptores de reconexión
├── storage/             # SQLite local y SecureStore para tokens
└── types/               # Tipos TypeScript compartidos`,
    cliCommands: [
      { label: 'Iniciar Expo CLI', command: 'npx expo start' },
      { label: 'Ejecutar en Android', command: 'npx expo run:android' },
      { label: 'Ejecutar en iOS', command: 'npx expo run:ios' },
      { label: 'Build Producción EAS', command: 'eas build --platform all' },
    ],
    keyLibraries: ['expo-router', 'expo-secure-store', 'expo-crypto', 'react-native-reanimated', 'lucide-react-native'],
    performanceDirectives: [
      'Utilizar FlatList o FlashList en lugar de ScrollView para listas largas para reciclar vistas.',
      'Ejecutar animaciones complejas en el hilo nativo mediante Reanimated.',
      'Optimizar el consumo de batería limitando el polling en segundo plano.',
    ],
    bestPractices: [
      'Almacenar tokens de autenticación en expo-secure-store en lugar de AsyncStorage.',
      'Soportar modo oscuro nativo respondiendo a useColorScheme().',
    ],
    securityConsiderations: [
      'Configurar SSL Pinning en peticiones de alta sensibilidad.',
      'Proteger la app contra ejecuciones en dispositivos con jailbreak/root si maneja pagos.',
    ],
    commonPitfalls: [
      'Usar estilos con valores de pixel absolutos sin considerar distintas densidades de pantalla.',
    ],
  },

  'Flutter': {
    name: 'Flutter',
    category: 'Framework Multiplataforma Nativo de Alto Rendimiento',
    description: 'Framework UI de código abierto de Google basado en Dart que compila a código de máquina ARM nativo para iOS, Android, Web y Desktop con motor de renderizado propio (Impeller).',
    paradigm: 'Widget Tree Composition + Reactive State Management',
    architectureGuide: `Todo en Flutter es un Widget. La interfaz se construye componiendo widgets sin depender de wrappers OEM de la plataforma. La lógica de negocio y estado se desacoplan mediante patrones BLoC, Riverpod o Provider, conectando con repositorios que consumen APIs REST o bases de datos locales (Isar/Hive/SQLite).`,
    recommendedFolderStructure: `lib/
├── core/                 # Configuración de red, temas, constantes y utilidades
├── features/             # Módulos organizados por feature
│   ├── auth/             # Vistas, BLoC/Providers y repositorios de autenticación
│   └── home/             # Pantallas principales y widgets de catálogo
├── shared/               # Widgets visuales comunes reutilizables
└── main.dart             # Punto de entrada de la aplicación`,
    cliCommands: [
      { label: 'Ejecutar en Dispositivo', command: 'flutter run' },
      { label: 'Compilar APK Release', command: 'flutter build apk --release' },
      { label: 'Compilar App Bundle', command: 'flutter build appbundle' },
      { label: 'Análisis Estático', command: 'flutter analyze' },
    ],
    keyLibraries: ['flutter_bloc / flutter_riverpod', 'dio (cliente HTTP)', 'shared_preferences', 'flutter_secure_storage'],
    performanceDirectives: [
      'Construir widgets inmutables anteponiendo const en constructores para evitar reconstrucciones de árbol innecesarias.',
      'Optimizar ListView.builder con renderizado perezoso de elementos.',
    ],
    bestPractices: [
      'Separar estrictamente la lógica de negocio de los widgets visuales mediante State Management.',
    ],
    securityConsiderations: [
      'Utilizar flutter_secure_storage para claves de acceso y tokens JWT.',
    ],
    commonPitfalls: [
      'Llamar setState() en la raíz del árbol de widgets provocando repintados globales masivos.',
    ],
  },

  'Docusaurus / Starlight (Docs)': {
    name: 'Docusaurus / Starlight (Docs)',
    category: 'Sistemas Especializados de Documentación Técnica',
    description: 'Plataformas optimizadas para generar portales de documentación técnica, guías de API y bases de conocimiento con soporte MDX, búsqueda estática y versionado de documentación.',
    paradigm: 'Documentation-Driven SSG + Full-text Search Indexing',
    architectureGuide: `El contenido se redacta en archivos Markdown o MDX enriquecidos con componentes interactivos. La arquitectura genera una estructura jerárquica con barra lateral automática, tabla de contenidos flotante y búsqueda en tiempo real indexada localmente.`,
    recommendedFolderStructure: `docs/
├── intro.md              # Introducción y visión general
├── guides/               # Tutoriales y guías paso a paso
├── api/                  # Referencia de especificación de API
└── docusaurus.config.js / astro.config.mjs`,
    cliCommands: [
      { label: 'Servidor Dev', command: 'npm run start / npx astro dev' },
      { label: 'Compilar Portal Estático', command: 'npm run build' },
    ],
    keyLibraries: ['@docusaurus/core / @astrojs/starlight', 'pagefind / algolia search'],
    performanceDirectives: ['Carga de páginas instantánea y búsqueda offline ligera.'],
    bestPractices: ['Validar enlaces rotos en cada compilación de CI/CD.'],
    securityConsiderations: ['No exponer documentación interna o rutas no autorizadas.'],
    commonPitfalls: ['Frontmatter inconsistente o enlaces relativos rotos en archivos Markdown.'],
  },

  '11ty (Eleventy)': {
    name: '11ty (Eleventy)',
    category: 'Generador Estático Agnóstico de Cero Dependencias de Runtime',
    description: 'Generador de sitios estáticos simple y flexible basado en Node.js que procesa Markdown, Nunjucks, Liquid y HTML puro sin inyectar ningún framework de JS en el cliente.',
    paradigm: 'Template Engine SSG + Pure Static Artifacts',
    architectureGuide: `Procesa carpetas de plantillas y datos (.json, .js) produciendo un árbol estático en _site/. Cero JavaScript en el cliente por defecto.`,
    recommendedFolderStructure: `src/
├── _data/                # Datos globales de configuración y APIs
├── _includes/            # Plantillas y parciales de diseño
└── pages/                # Contenido en Markdown / Nunjucks`,
    cliCommands: [
      { label: 'Servidor Dev', command: 'npx @11ty/eleventy --serve' },
      { label: 'Compilación', command: 'npx @11ty/eleventy' },
    ],
    keyLibraries: ['@11ty/eleventy'],
    performanceDirectives: ['Puntajes Lighthouse perfectos de 100/100 garantizados.'],
    bestPractices: ['Usar colecciones de datos globales centralizadas en _data.'],
    securityConsiderations: ['Impenetrable a vulnerabilidades dinámicas de runtime.'],
    commonPitfalls: ['Mezclar motores de plantillas incompatibles en el mismo proyecto.'],
  },

  'Hugo / Jekyll (SSG)': {
    name: 'Hugo / Jekyll (SSG)',
    category: 'Generadores Estáticos Nativos de Alto Rendimiento',
    description: 'Generadores estáticos de compilación ultra-rápida (Hugo en Go / Jekyll en Ruby) ideales para blogs, documentación y sitios institucionales compilados en milisegundos.',
    paradigm: 'File-based Content Generation',
    architectureGuide: `Compilan miles de páginas en pocos segundos directamente desde archivos Markdown con frontmatter YAML hacia archivos HTML inmutables.`,
    recommendedFolderStructure: `content/
├── posts/
layouts/
└── _default/
static/`,
    cliCommands: [
      { label: 'Servidor Local Hugo', command: 'hugo server -D' },
      { label: 'Compilación Hugo', command: 'hugo --minify' },
    ],
    keyLibraries: ['Hugo Engine (Go) / Jekyll (Ruby)'],
    performanceDirectives: ['Tiempos de compilación de subsegundos para miles de páginas.'],
    bestPractices: ['Versionar contenido y temas de forma desacoplada.'],
    securityConsiderations: ['Cero vectores de ataque en runtime.'],
    commonPitfalls: ['Sintaxis de plantillas Go/Liquid complejas al extender temas.'],
  },

  'Ninguno (Sin Interfaz Gráfica / Script / CLI / Notebooks)': {
    name: 'Ninguno (Sin Interfaz Gráfica / Script / CLI / Notebooks)',
    category: 'Ejecución Headless / Sin Interfaz Web (CLI, Scripts, Datos)',
    description: 'El proyecto prescinde completamente de una interfaz gráfica web (sin HTML/CSS/DOM). Toda la interacción e inspección ocurre mediante scripts ejecutables, pipelines de datos, línea de comandos (CLI), logs estructurados o generación de reportes/gráficos en archivos.',
    paradigm: 'Headless Execution + Batch / Pipeline Processing + CLI / Output Artifacts',
    architectureGuide: `No existe capa de navegador ni componentes UI web. El punto de entrada del sistema es un script principal (\`main.py\`, CLI o notebook reproducible) que orquesta la lectura de entradas/datasets, procesamiento en módulos desacoplados y exportación de resultados (archivos CSV/Parquet, gráficos estáticos PNG/SVG/PDF, modelos entrenados o salida en terminal).`,
    recommendedFolderStructure: `project_root/
├── data/
│   ├── raw/              # Datasets originales inmutables (CSV, Parquet, JSON, Excel)
│   ├── processed/        # Datos limpios y transformados listos para análisis
│   └── outputs/          # Reportes finales, tablas exportadas y figuras generadas
├── notebooks/            # Jupyter Notebooks numerados para exploración (01_eda.ipynb)
├── src/
│   ├── __init__.py
│   ├── config.py         # Rutas, constantes, semillas aleatorias y parámetros
│   ├── ingestion.py      # Carga y validación de esquemas de datos
│   ├── processing.py     # Limpieza, transformación y feature engineering
│   ├── analysis.py       # Modelos estadísticos, ML o reglas de negocio
│   └── visualization.py  # Generación de gráficos (Matplotlib / Seaborn / Plotly)
├── tests/                # Pruebas unitarias de funciones de transformación (pytest)
├── main.py               # Script / CLI orquestador del pipeline completo
├── requirements.txt      # Dependencias fijadas con versión exacta (o pyproject.toml)
└── README.md             # Instrucciones de ejecución y diccionario de datos`,
    cliCommands: [
      { label: 'Crear Entorno Virtual', command: 'python -m venv .venv && .venv\\Scripts\\activate' },
      { label: 'Instalar Dependencias', command: 'pip install -r requirements.txt' },
      { label: 'Ejecutar Pipeline Principal', command: 'python main.py' },
      { label: 'Ejecutar Suite de Tests', command: 'pytest -v' },
    ],
    keyLibraries: ['argparse / typer / click', 'logging / rich', 'pathlib', 'pytest', 'python-dotenv'],
    performanceDirectives: [
      'Utilizar operaciones vectorizadas (Pandas/Polars/NumPy) en lugar de bucles for nativos sobre filas de datos.',
      'Procesar archivos masivos mediante lectura por bloques (chunking) o evaluación perezosa (lazy evaluation) para no saturar la RAM.',
    ],
    bestPractices: [
      'Separar estrictamente los datos crudos (data/raw, solo lectura) de los datos procesados (data/processed).',
      'Extraer funciones reutilizables hacia módulos en src/ en lugar de duplicar código en múltiples scripts o notebooks.',
      'Fijar semillas aleatorias (random seed) para garantizar reproducibilidad exacta de resultados.',
    ],
    securityConsiderations: [
      'Nunca subir datasets con Información Personal Identificable (PII) ni credenciales en el repositorio Git (.gitignore estricto).',
      'Validar rutas de archivos de entrada y esquemas de columnas antes de ejecutar transformaciones destructivas.',
    ],
    commonPitfalls: [
      'Rutas de archivo absolutas hardcodeadas que rompen la ejecución en otras máquinas (usar siempre pathlib.Path relativo a la raíz).',
      'Mutación silenciosa de DataFrames en memoria sin copia explícita (SettingWithCopyWarning).',
    ],
  },

  'Jupyter Notebooks / Google Colab (Ciencia de Datos)': {
    name: 'Jupyter Notebooks / Google Colab (Ciencia de Datos)',
    category: 'Entorno Interactivo de Análisis Exploratorio y Ciencia de Datos',
    description: 'Entorno computacional literario e interactivo que combina código ejecutable (Python/R/SQL), texto narrativo en Markdown, fórmulas matemáticas LaTeX y visualizaciones de datos inline.',
    paradigm: 'Literate Computing + Exploratory Data Analysis (EDA) + Modular src/',
    architectureGuide: `Los Notebooks (\`.ipynb\`) actúan como capa narrativa, de experimentación y presentación de hallazgos (EDA, gráficas comparativas, conclusiones), mientras que las funciones pesadas de limpieza y transformación se modularizan en el paquete local \`src/\` e importan con \`%autoreload\`.`,
    recommendedFolderStructure: `project_root/
├── data/
│   ├── raw/              # Datos crudos originales (inmutables)
│   └── processed/        # Datasets limpios exportados (.parquet / .csv)
├── notebooks/
│   ├── 01_exploracion_eda.ipynb
│   ├── 02_limpieza_transformacion.ipynb
│   └── 03_modelado_y_resultados.ipynb
├── reports/
│   └── figures/          # Gráficos de alta resolución exportados (300 DPI)
├── src/                  # Módulos Python reutilizables importados desde notebooks
└── requirements.txt`,
    cliCommands: [
      { label: 'Iniciar Jupyter Lab', command: 'jupyter lab' },
      { label: 'Ejecutar Notebook por CLI', command: 'jupyter nbconvert --to notebook --execute notebooks/01_exploracion_eda.ipynb' },
      { label: 'Exportar Reporte a HTML/PDF', command: 'jupyter nbconvert --to html notebooks/03_modelado_y_resultados.ipynb' },
    ],
    keyLibraries: ['jupyterlab', 'ipykernel', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'plotly'],
    performanceDirectives: [
      'Persistir estados intermedios en formato Apache Parquet para recargar tipos y datos 10x más rápido entre notebooks.',
      'Evitar imprimir DataFrames gigantes completos en celdas para no inflar el tamaño del archivo .ipynb.',
    ],
    bestPractices: [
      'Garantizar que todo Notebook se ejecute sin errores de principio a fin con "Restart Kernel and Run All Cells".',
      'Numerar los notebooks secuencialmente (01_, 02_, 03_) y documentar cada hallazgo con celdas Markdown.',
    ],
    securityConsiderations: [
      'Limpiar salidas de celdas con datos confidenciales antes de hacer commit en Git (nbstripout).',
    ],
    commonPitfalls: [
      'Ejecutar celdas fuera de orden provocando estados ocultos irreproducibles en memoria.',
    ],
  },

  'CLI Interactiva en Terminal (Rich / Typer / Click)': {
    name: 'CLI Interactiva en Terminal (Rich / Typer / Click)',
    category: 'Herramienta de Línea de Comandos (CLI) en Consola',
    description: 'Aplicación ejecutada íntegramente en terminal con subcomandos tipados, validación de argumentos, barras de progreso, tablas formateadas en consola y paneles coloreados ANSI.',
    paradigm: 'Command-Line Interface + POSIX Arguments + Rich Terminal Formatting',
    architectureGuide: `La interfaz de usuario es la propia terminal. Los comandos y flags se definen declarativamente mediante decoradores y type hints (Typer/Click), delegando la lógica pesada a servicios puros y presentando resultados con tablas y paneles de Rich.`,
    recommendedFolderStructure: `src/
├── cli/
│   ├── main.py           # Punto de entrada Typer/Click y registro de comandos
│   ├── commands/         # Subcomandos modulares (analyze, export, clean)
│   └── console.py        # Instancia compartida de Rich Console y estilos
├── core/                 # Lógica de negocio y procesamiento
└── tests/                # Pruebas de CLI con CliRunner`,
    cliCommands: [
      { label: 'Mostrar Ayuda CLI', command: 'python -m src.cli.main --help' },
      { label: 'Ejecutar Comando', command: 'python -m src.cli.main run --input data/input.csv' },
    ],
    keyLibraries: ['typer', 'rich', 'click', 'pydantic'],
    performanceDirectives: [
      'Mostrar indicadores de progreso (rich.progress) en toda operación que supere 500ms.',
    ],
    bestPractices: [
      'Devolver códigos de salida estándar POSIX (0 para éxito, != 0 para errores controlados).',
      'Soportar flag --quiet / --json para permitir integración en pipelines automatizados.',
    ],
    securityConsiderations: [
      'Ocultar entradas sensibles con prompts enmascarados (password=True) y nunca imprimir secretos en stdout.',
    ],
    commonPitfalls: [
      'Capturar excepciones sin mostrar mensajes claros ni sugerencias de corrección al usuario de la consola.',
    ],
  },

  'Streamlit / Gradio (Dashboard de Datos Ligero)': {
    name: 'Streamlit / Gradio (Dashboard de Datos Ligero)',
    category: 'Data Apps y Dashboards Analíticos en Python Puro',
    description: 'Frameworks en Python puro para transformar scripts de análisis de datos y modelos de Machine Learning en dashboards interactivos sin escribir HTML, CSS ni JavaScript.',
    paradigm: 'Reactive Data Script Execution + Python-only Widgets',
    architectureGuide: `El script de Python declara controles interactivos (filtros, sliders, carga de CSV) y renderiza tablas y gráficos (Plotly/Altair/Matplotlib) reactivamente usando decoradores de caché (\`@st.cache_data\`) para evitar recálculos costosos.`,
    recommendedFolderStructure: `app/
├── Home.py               # Entrada principal del dashboard
├── pages/                # Vistas multipágina automáticas
├── src/                  # Funciones de datos cacheadas y modelos
└── requirements.txt`,
    cliCommands: [
      { label: 'Ejecutar Dashboard', command: 'streamlit run app/Home.py' },
    ],
    keyLibraries: ['streamlit / gradio', 'plotly', 'altair', 'pandas'],
    performanceDirectives: [
      'Decorar obligatoriamente las funciones de carga de datasets y modelos con @st.cache_data y @st.cache_resource.',
    ],
    bestPractices: [
      'Separar el cálculo de datos pesados en módulos de src/ para mantener el script de UI limpio.',
    ],
    securityConsiderations: [
      'Gestionar credenciales mediante .streamlit/secrets.toml o variables de entorno.',
    ],
    commonPitfalls: [
      'Recargar datasets grandes desde disco en cada interacción de widget por olvidar @st.cache_data.',
    ],
  },
};

// ==========================================
// 2. DICCIONARIO DE BACKEND FRAMEWORKS
// ==========================================
export const BACKEND_TECH_MAP: Record<string, TechDetail> = {
  'Python Data Science (Pandas / Polars / NumPy / Scikit-Learn)': {
    name: 'Python Data Science (Pandas / Polars / NumPy / Scikit-Learn)',
    category: 'Motor de Análisis de Datos, Estadística y Machine Learning en Python',
    description: 'Ecosistema científico de Python para ingesta, limpieza, transformación tabular de alto rendimiento, análisis estadístico exploratorio (EDA), visualización y modelado predictivo sin necesidad de servidores web.',
    paradigm: 'Vectorized Tabular Data Processing + Reproducible Analytical Pipelines',
    architectureGuide: `La arquitectura se estructura como un pipeline modular de datos: 1) Ingesta y validación de tipos desde fuentes crudas (CSV, Parquet, Excel, SQL), 2) Limpieza y transformación vectorizada con Pandas/Polars/NumPy (tratamiento de nulos, outliers, normalización y agregaciones), 3) Análisis estadístico o entrenamiento/evaluación con Scikit-Learn/SciPy, y 4) Generación de artefactos finales (tablas resumen, reportes y gráficos de alta resolución).`,
    recommendedFolderStructure: `project_root/
├── data/
│   ├── raw/              # Datasets crudos originales (inmutables)
│   ├── interim/          # Transformaciones intermedias
│   └── processed/        # Datasets limpios finales (.parquet / .csv)
├── notebooks/            # Notebooks exploratorios y de reporte
├── src/
│   ├── data_loader.py    # Lectura segura y validación de esquemas
│   ├── preprocessing.py  # Limpieza de nulos, duplicados, tipos y outliers
│   ├── features.py       # Creación de variables e indicadores (KPIs)
│   ├── models.py         # Análisis estadístico / entrenamiento y métricas
│   └── plots.py          # Funciones estandarizadas de visualización
├── reports/
│   └── figures/          # Gráficos exportados (PNG/SVG/PDF)
├── tests/                # Pruebas de integridad de datos con pytest
├── main.py               # Ejecución automatizada de punta a punta
└── requirements.txt`,
    cliCommands: [
      { label: 'Instalar Stack Data Science', command: 'pip install pandas polars numpy scipy scikit-learn matplotlib seaborn plotly pyarrow pytest' },
      { label: 'Ejecutar Pipeline de Análisis', command: 'python main.py' },
      { label: 'Ejecutar Pruebas de Datos', command: 'pytest tests/' },
    ],
    keyLibraries: ['pandas / polars', 'numpy', 'scipy', 'scikit-learn', 'matplotlib / seaborn / plotly', 'pyarrow (Parquet)', 'pandera / pydantic'],
    performanceDirectives: [
      'Prohibido iterar sobre filas con .iterrows() cuando exista una operación vectorizada equivalente en Pandas/NumPy o expresiones en Polars.',
      'Especificar tipos de datos eficientes (dtype category, int32, float32) o formato Parquet para reducir el consumo de memoria RAM hasta un 70%.',
    ],
    bestPractices: [
      'Encadenar transformaciones de DataFrames mediante .pipe() o métodos inmutables claros y documentados.',
      'Validar que no existan valores NaN inesperados ni duplicados tras cada cruce (merge/join) de tablas.',
      'Documentar cada métrica, fórmula estadística y supuesto de negocio en docstrings con Type Hints.',
    ],
    securityConsiderations: [
      'Anonimizar o aplicar hash a columnas con datos personales sensibles antes de exportar reportes o gráficos.',
      'No cargar archivos .pickle de orígenes no confiables (riesgo de ejecución arbitraria de código); preferir Parquet, CSV, JSON o safetensors.',
    ],
    commonPitfalls: [
      'Fuga de datos (Data Leakage) al calcular medias o escaladores sobre todo el dataset antes de separar train/test.',
      'Explosionar el número de filas accidentalmente en un pd.merge() por claves duplicadas (usar validate="one_to_one" o "many_to_one").',
    ],
  },

  'Scripts de Automatización / ETL / Cron Jobs (Python)': {
    name: 'Scripts de Automatización / ETL / Cron Jobs (Python)',
    category: 'Pipelines ETL, Automatización por Lotes y Procesamiento Headless',
    description: 'Arquitectura de scripts autónomos en Python para extracción, transformación y carga de datos (ETL), web scraping ético, procesamiento de archivos por lotes y tareas programadas sin interfaz gráfica.',
    paradigm: 'Idempotent Batch Processing + Structured Logging + Fault Tolerance',
    architectureGuide: `Cada ejecución del script es atómica e idempotente: extrae datos de archivos locales, APIs o bases de datos, aplica reglas de negocio y validaciones con Pydantic, registra trazabilidad detallada en consola/archivo de log con rotación, y deposita los resultados en el destino configurado.`,
    recommendedFolderStructure: `project_root/
├── config/               # Configuraciones y variables de entorno (.env)
├── logs/                 # Archivos de registro de ejecución con rotación
├── src/
│   ├── extractors/       # Conectores de entrada (archivos, APIs, scrapers)
│   ├── transformers/     # Reglas de limpieza y negocio puras
│   └── loaders/          # Exportadores a CSV, BD, Excel o almacenamiento
├── tests/                # Tests unitarios con mocks
└── main.py               # Entrypoint ejecutable por CLI o Cron/Task Scheduler`,
    cliCommands: [
      { label: 'Ejecutar Proceso ETL', command: 'python main.py --env prod' },
      { label: 'Ejecutar en Modo Dry-Run', command: 'python main.py --dry-run' },
    ],
    keyLibraries: ['pydantic', 'python-dotenv', 'httpx / requests', 'tenacity (reintentos)', 'schedule / apscheduler', 'rich / loguru'],
    performanceDirectives: [
      'Implementar reintentos con backoff exponencial (tenacity) ante fallos de red o lectura de fuentes externas.',
      'Usar generadores (yield) para procesar flujos de datos grandes con huella de memoria constante O(1).',
    ],
    bestPractices: [
      'Diseñar procesos idempotentes: ejecutar el script dos veces con la misma entrada no debe duplicar ni corromper registros.',
      'Incluir un modo --dry-run que simule y valide la ejecución sin escribir cambios destructivos.',
    ],
    securityConsiderations: [
      'Cargar credenciales exclusivamente desde variables de entorno (.env) y nunca escribirlas en los archivos de log.',
    ],
    commonPitfalls: [
      'Silenciar excepciones con bloques try/except vacíos que ocultan fallos críticos en tareas automatizadas.',
    ],
  },

  'Ninguno (Solo Frontend Estático / Jamstack)': {
    name: 'Ninguno (Solo Frontend Estático / Jamstack)',
    category: 'Arquitectura Serverless / Cero Servidores Backend',
    description: 'La solución prescinde por completo de servidores dinámicos de backend tradicionales. Todo el contenido y las reglas de negocio se resuelven en tiempo de compilación o mediante APIs públicas sin estado.',
    paradigm: 'Jamstack (JavaScript, APIs, Markup) - Serverless Edge',
    architectureGuide: `No existe servidor que mantener, parchear ni escalar. El código se compila a un bundle estático distribuido globalmente en Edge CDNs (Cloudflare Pages, Vercel, Netlify). La persistencia se basa en archivos versionados en Git (Markdown/MDX/JSON) o microservicios serverless bajo demanda.`,
    recommendedFolderStructure: `dist/ o build/ (Artefactos estáticos listos para CDN)
├── index.html            # HTML pre-renderizado ultrarrápido
├── assets/               # CSS y JS optimizados con hash de contenido
└── public/               # Archivos estáticos directos`,
    cliCommands: [
      { label: 'Compilación Estática', command: 'npm run build' },
      { label: 'Servidor Local de Prueba', command: 'npx serve dist' },
    ],
    keyLibraries: ['Static CDN Hosting', 'Local Markdown/MDX', 'Client-side APIs'],
    performanceDirectives: [
      'Latencia de primer byte (TTFB) inferior a 50ms gracias al cacheo distribuido en Edge CDN.',
      'Cero coste recurrente mensual de infraestructura de servidores.',
    ],
    bestPractices: [
      'Todo cambio de contenido se gestiona mediante commits de Git que disparan un nuevo despliegue atómico.',
    ],
    securityConsiderations: [
      'No hay superficies de ataque basadas en ejecución de código en servidor ni bases de datos expuestas en red.',
    ],
    commonPitfalls: [
      'Intentar llamar APIs de servidor dinámicas no existentes en tiempo de ejecución.',
    ],
  },

  'Serverless Edge Functions (Vercel / Cloudflare)': {
    name: 'Serverless Edge Functions (Vercel / Cloudflare)',
    category: 'Computación Distribuida en el Borde (Edge Runtime)',
    description: 'Microfunciones sin estado ejecutadas en ubicaciones perimetrales distribuidas geográficamente (V8 isolates), con arranque en frío instantáneo (0ms cold start) y latencia ultra-baja.',
    paradigm: 'Event-driven Serverless Micro-handlers',
    architectureGuide: `Los endpoints son funciones individuales de TypeScript que interceptan peticiones en el punto de presencia (PoP) de la CDN más cercano al usuario. No mantienen conexiones de base de datos persistentes tradicionales; utilizan HTTP pools (Neon, Turso, Supabase).`,
    recommendedFolderStructure: `api/ o functions/
├── auth.ts               # Handler edge para verificación de credenciales
├── webhook.ts            # Procesamiento de webhooks externos
└── utils/                # Criptografía ligera (Web Crypto API)`,
    cliCommands: [
      { label: 'Desarrollo Edge Local', command: 'npx wrangler dev / vercel dev' },
      { label: 'Despliegue a Producción', command: 'npx wrangler deploy / vercel deploy --prod' },
    ],
    keyLibraries: ['@cloudflare/workers-types', 'itty-router / hono', 'zod'],
    performanceDirectives: [
      'Arranque en frío de 0 a 5 milisegundos gracias al aislamiento V8.',
    ],
    bestPractices: [
      'Usar APIs web estándar (fetch, Request, Response, Web Crypto) en lugar de módulos nativos de Node.js.',
    ],
    securityConsiderations: [
      'Validar cabeceras y firmas HMAC de webhooks antes de procesar.',
    ],
    commonPitfalls: [
      'Intentar importar librerías pesadas que dependan del sistema de archivos fs o procesos nativos de C++.',
    ],
  },

  'Node.js (NestJS)': {
    name: 'Node.js (NestJS)',
    category: 'Framework Empresarial Backend Modular',
    description: 'Framework backend progresivo para Node.js basado en TypeScript que implementa patrones empresariales robustos (Inyección de Dependencias, Módulos, Controladores, Proveedores y Pipes de Validación).',
    paradigm: 'Modular Architecture + Inversion of Control (IoC) + Clean Layering',
    architectureGuide: `Estructura en capas Controller -> Service -> Repository. Las solicitudes HTTP entran por Controllers decorados con rutas, pasan por Guards de autenticación, Interceptors de serialización y Pipes de validación (class-validator) antes de llegar a la lógica de negocio pura en Services inyectables.`,
    recommendedFolderStructure: `src/
├── common/               # Guards, interceptores, pipes y decoradores globales
│   ├── guards/           # JwtAuthGuard, RolesGuard
│   ├── interceptors/     # TransformInterceptor (respuestas estandarizadas)
│   └── filters/          # HttpExceptionFilter (manejo global de errores)
├── config/               # Configuración de variables de entorno con Joi/Zod
├── modules/              # Módulos encapsulados por dominio funcional
│   ├── auth/             # Módulo de autenticación (JWT, hashing bcrypt)
│   ├── users/            # Módulo de usuarios (Controllers, Services, Entidades)
│   └── products/         # Módulo de catálogo
├── database/             # Migraciones, entidades ORM y semillas
├── app.module.ts         # Módulo raíz de la aplicación
└── main.ts               # Punto de entrada y configuración de NestFactory`,
    cliCommands: [
      { label: 'Servidor Dev', command: 'npm run start:dev' },
      { label: 'Build de Producción', command: 'npm run build' },
      { label: 'Ejecutar Pruebas', command: 'npm run test' },
      { label: 'Migraciones BD', command: 'npm run typeorm migration:run' },
    ],
    keyLibraries: ['@nestjs/core', '@nestjs/swagger', 'class-validator', 'class-transformer', 'passport-jwt', 'typeorm / prisma'],
    performanceDirectives: [
      'Utilizar FastifyAdapter como motor HTTP en lugar de Express para alto throughput si es necesario.',
      'Implementar cacheo con Redis en endpoints de lectura frecuente.',
    ],
    bestPractices: [
      'Validar el 100% de los DTOs entrantes con ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }).',
      'Desacoplar la persistencia usando Repository pattern o Prisma Service.',
    ],
    securityConsiderations: [
      'Activar Helmet y CORS restrictivo en main.ts.',
      'Hashear contraseñas con bcrypt (costo mínimo 12) o argon2.',
    ],
    commonPitfalls: [
      'Dependencias circulares entre módulos; resolver mediante forwardRef() o rediseñar la arquitectura.',
    ],
  },

  'Node.js (Express)': {
    name: 'Node.js (Express)',
    category: 'Framework Backend Minimalista y Flexible',
    description: 'Framework web minimalista, no dogmático y rápido para Node.js, ampliamente extendido y con un rico ecosistema de middlewares para construcción de APIs RESTful.',
    paradigm: 'Middleware-Chain Pipeline Architecture',
    architectureGuide: `Las peticiones fluyen a través de una cadena de middlewares (CORS, body-parser, autenticación, validación). Las rutas delegan en controladores que orquestan los servicios de lógica de negocio y repositorios de datos.`,
    recommendedFolderStructure: `src/
├── controllers/          # Manejadores de petición y respuesta HTTP
├── middlewares/          # Auth, error handling, rate limiting, validaciones
├── routes/               # Definición de rutas modularizadas
├── services/             # Lógica de negocio desacoplada
├── repositories/         # Capa de persistencia a base de datos
├── schemas/              # Esquemas de validación Zod
└── server.ts             # Inicialización de Express y middlewares`,
    cliCommands: [
      { label: 'Servidor Dev con TS-Node', command: 'npm run dev' },
      { label: 'Compilación TypeScript', command: 'npm run build' },
    ],
    keyLibraries: ['express', 'cors', 'helmet', 'zod', 'jsonwebtoken', 'dotenv'],
    performanceDirectives: [
      'Habilitar compresión de respuestas con gzip/brotli.',
      'Gestionar procesos con PM2 en modo cluster para aprovechar todos los núcleos de CPU.',
    ],
    bestPractices: [
      'Encapsular manejo de errores en un middleware global final (err, req, res, next).',
      'Validar el cuerpo de peticiones con esquemas Zod antes de acceder al controlador.',
    ],
    securityConsiderations: [
      'Usar helmet() obligatoriamente para configurar cabeceras HTTP defensivas.',
      'Evitar fugas de trazas de error (stack traces) en entornos de producción.',
    ],
    commonPitfalls: [
      'Olvidar invocar next(err) en operaciones asíncronas no capturadas, colgando la petición.',
    ],
  },

  'FastAPI (Python)': {
    name: 'FastAPI (Python)',
    category: 'Framework Backend Asíncrono de Alto Rendimiento',
    description: 'Framework moderno para construir APIs REST en Python 3.10+ con tipado estricto, serialización automática mediante Pydantic y documentación OpenAPI interactiva out-of-the-box.',
    paradigm: 'Async / Await Event Loop + Pydantic Data Contracts',
    architectureGuide: `Construido sobre Starlette y Uvicorn. Los endpoints definen firmas asíncronas (\`async def\`) con esquemas Pydantic que validan y serializan los datos de entrada y salida automáticamente. Se utiliza inyección de dependencias nativa mediante \`Depends()\` para transacciones de base de datos y verificación de tokens.`,
    recommendedFolderStructure: `app/
├── api/                  # Rutas y controladores de endpoints
│   ├── v1/               # Versionado de API
│   │   ├── endpoints/    # auth.py, users.py, items.py
│   │   └── api.py        # Router centralizado
├── core/                 # Configuración del sistema, seguridad y settings
│   ├── config.py         # Pydantic BaseSettings (.env)
│   └── security.py       # Hashing de passwords y generación de tokens JWT
├── crud/                 # Operaciones de persistencia desacopladas (Create, Read, Update, Delete)
├── db/                   # Sesión de base de datos, motor SQLAlchemy y modelos
├── models/               # Modelos declarativos ORM (SQLAlchemy / SQLModel)
├── schemas/              # Esquemas Pydantic para Request y Response DTOs
└── main.py               # Instancia de FastAPI, CORS y middleware`,
    cliCommands: [
      { label: 'Servidor Dev Uvicorn', command: 'uvicorn app.main:app --reload --port 8000' },
      { label: 'Ejecutar Migraciones', command: 'alembic upgrade head' },
      { label: 'Crear Migración', command: 'alembic revision --autogenerate -m "nombre"' },
      { label: 'Pruebas Pytest', command: 'pytest -v' },
    ],
    keyLibraries: ['pydantic', 'sqlalchemy', 'alembic', 'python-jose', 'passlib', 'uvicorn'],
    performanceDirectives: [
      'Asegurar el uso de sesiones de base de datos asíncronas con asyncpg.',
      'Evitar llamadas bloqueantes de I/O dentro de funciones async def; ejecutarlas con run_in_executor si son síncronas.',
    ],
    bestPractices: [
      'Separar esquemas Pydantic en variantes (ItemCreate, ItemUpdate, ItemResponse) para evitar fugas de campos privados.',
      'Configurar Alembic para migraciones versionadas.',
    ],
    securityConsiderations: [
      'Validar tokens OAuth2 Password Bearer con expiración estricta.',
      'Aplicar rate limiting en endpoints de login con slowapi.',
    ],
    commonPitfalls: [
      'Mezclar llamadas síncronas bloqueantes dentro de rutas declaradas como async def.',
    ],
  },

  'Django REST Framework': {
    name: 'Django REST Framework',
    category: 'Framework Backend Web Empresarial Completo (Python)',
    description: 'Framework robusto de alto nivel para APIs en Python sobre Django con ORM maduro, sistema de autenticación integral, panel administrativo y serializadores potentes.',
    paradigm: 'MVT / Model-Serializer-View Architecture',
    architectureGuide: `Los modelos definen el esquema relacional. Los Serializers validan y transforman los datos bidireccionalmente. Las ViewSets encapsulan la lógica de consulta y mutación con permisos granulares (PermissionClasses).`,
    recommendedFolderStructure: `myproject/
├── core/                 # Configuración global, wsgi, settings.py
├── apps/                 # Módulos de aplicación encapsulados
│   ├── authentication/   # Modelos de usuario personalizado y tokens
│   └── items/            # models.py, serializers.py, views.py, urls.py
└── manage.py`,
    cliCommands: [
      { label: 'Servidor Dev', command: 'python manage.py runserver' },
      { label: 'Crear Migraciones', command: 'python manage.py makemigrations' },
      { label: 'Aplicar Migraciones', command: 'python manage.py migrate' },
    ],
    keyLibraries: ['djangorestframework', 'django-cors-headers', 'drf-spectacular', 'psycopg2-binary'],
    performanceDirectives: [
      'Evitar consultas N+1 empleando select_related() para ForeignKey y prefetch_related() para ManyToMany.',
    ],
    bestPractices: [
      'Crear un modelo de usuario personalizado (AbstractUser) desde el inicio.',
    ],
    securityConsiderations: [
      'Configurar SECRET_KEY fuera del repositorio y DEBUG=False en producción.',
    ],
    commonPitfalls: [
      'Olvidar registrar aplicaciones en INSTALLED_APPS o descuidar índices de base de datos.',
    ],
  },

  'Laravel (PHP)': {
    name: 'Laravel (PHP)',
    category: 'Framework Backend Elegante y Productivo (PHP 8.2+)',
    description: 'Framework de desarrollo web con sintaxis expresiva, ORM Eloquent potente, sistema de colas, migraciones de base de datos y ecosistema maduro de herramientas.',
    paradigm: 'MVC + Active Record (Eloquent) + Service Container',
    architectureGuide: `Enrutamiento claro en routes/api.php, controladores tipados con Form Requests para validación previa a la ejecución, políticas de autorización (Policies) y recursos API (API Resources) para serialización de respuestas JSON.`,
    recommendedFolderStructure: `app/
├── Http/
│   ├── Controllers/      # Controladores de endpoints
│   ├── Requests/         # Form Requests con reglas de validación
│   └── Resources/        # Transformadores de recursos JSON
├── Models/               # Modelos Eloquent con relaciones
└── Services/             # Lógica de dominio desacoplada`,
    cliCommands: [
      { label: 'Servidor Dev', command: 'php artisan serve' },
      { label: 'Ejecutar Migraciones', command: 'php artisan migrate' },
      { label: 'Generar Controlador', command: 'php artisan make:controller Api/ItemController --api' },
    ],
    keyLibraries: ['laravel/sanctum', 'spatie/laravel-permission', 'pestphp/pest'],
    performanceDirectives: [
      'Ejecutar php artisan config:cache, route:cache y view:cache en despliegue.',
    ],
    bestPractices: [
      'Encapsular validaciones complejas en FormRequest dedicados.',
    ],
    securityConsiderations: [
      'Proteger atributos masivos con protected $fillable en modelos Eloquent.',
    ],
    commonPitfalls: [
      'Dejar variables APP_DEBUG=true en servidores de producción expuestos.',
    ],
  },

  'Go Gin / Fiber': {
    name: 'Go Gin / Fiber',
    category: 'Microframework Backend en Go de Ultra Alta Velocidad',
    description: 'Framework web ligero en Go compilado directamente a código de máquina con latencia de microsegundos, concurrencia masiva mediante Goroutines y consumo mínimo de memoria.',
    paradigm: 'Static Compiled Concurrency + Fast Routing Pipeline',
    architectureGuide: `Compilado en un único binario ejecutable sin dependencias externas. Estructura limpia de capas con handlers HTTP, casos de uso de servicio y repositorios de base de datos interactuando mediante interfaces.`,
    recommendedFolderStructure: `cmd/
└── api/
    └── main.go           # Inicialización del servidor y rutas
internal/
├── handler/              # Manejadores de rutas HTTP Gin/Fiber
├── service/              # Casos de uso de lógica empresarial
└── repository/           # Acceso a base de datos con GORM o pgx`,
    cliCommands: [
      { label: 'Ejecutar Servidor Dev', command: 'go run cmd/api/main.go' },
      { label: 'Compilar Binario', command: 'go build -o bin/api cmd/api/main.go' },
      { label: 'Descargar Módulos', command: 'go mod tidy' },
    ],
    keyLibraries: ['gin-gonic/gin o gofiber/fiber', 'gorm.io/gorm', 'golang-jwt/jwt'],
    performanceDirectives: [
      'Throughput superior a 100,000 req/sec con consumo de memoria inferior a 30MB.',
    ],
    bestPractices: [
      'Manejar errores explícitamente comprobando if err != nil sin pánicos.',
    ],
    securityConsiderations: [
      'Sanitizar entradas y validar límites de memoria en uploads.',
    ],
    commonPitfalls: [
      'Data races al compartir punteros entre Goroutines concurrentes sin mutexes o canales.',
    ],
  },

  'Supabase Functions / Edge': {
    name: 'Supabase Functions / Edge',
    category: 'Edge Functions Serviceless en Deno / TypeScript',
    description: 'Funciones de servidor ejecutadas en la red perimetral global mediante Deno, con acceso directo a la base de datos Supabase, autenticación automática de usuarios y cero mantenimiento de servidores.',
    paradigm: 'Deno TypeScript Serverless Edge Runtime',
    architectureGuide: `Funciones sin servidor escritas en TypeScript moderno con soporte nativo de módulos ES. Cada función recibe peticiones HTTP con autorización de tokens JWT de Supabase Auth ya validados.`,
    recommendedFolderStructure: `supabase/functions/
├── create-payment/
│   └── index.ts
└── send-notification/
    └── index.ts`,
    cliCommands: [
      { label: 'Servidor Local Edge', command: 'npx supabase functions serve' },
      { label: 'Desplegar Función', command: 'npx supabase functions deploy nombre' },
    ],
    keyLibraries: ['https://esm.sh/@supabase/supabase-js', 'https://deno.land/std'],
    performanceDirectives: ['Ejecución en menos de 10ms cerca del usuario final.'],
    bestPractices: ['Validar el encabezado Authorization con el cliente de Supabase.'],
    securityConsiderations: ['Nunca incluir llaves service_role en el código fuente de clientes.'],
    commonPitfalls: ['Intentar usar módulos incompatibles de Node.js no soportados en Deno.'],
  },

  'ASP.NET Core (C#)': {
    name: 'ASP.NET Core (C#)',
    category: 'Framework Empresarial Multiplataforma de Alto Rendimiento',
    description: 'Plataforma empresarial moderna de Microsoft de código abierto y tipado estricto con Entity Framework Core, inyección de dependencias nativa y rendimiento de primer nivel.',
    paradigm: 'Clean Architecture + Dependency Injection + Async Controllers',
    architectureGuide: `Controllers decorados con atributos [ApiController] y [Route], inyección de servicios mediante interfaces en constructores, y persistencia a través de DbContext con Entity Framework Core.`,
    recommendedFolderStructure: `src/
├── Controllers/
├── Models/
├── Data/                 # ApplicationDbContext y migraciones
└── Services/`,
    cliCommands: [
      { label: 'Servidor Dev', command: 'dotnet run' },
      { label: 'Compilar Release', command: 'dotnet publish -c Release' },
      { label: 'Aplicar Migraciones', command: 'dotnet ef database update' },
    ],
    keyLibraries: ['Microsoft.EntityFrameworkCore', 'Swashbuckle.AspNetCore'],
    performanceDirectives: ['Compilación Ahead-of-Time (AOT) para arranque instantáneo.'],
    bestPractices: ['Utilizar AsNoTracking() en consultas de Entity Framework de solo lectura.'],
    securityConsiderations: ['Habilitar middleware de autenticación y autorización JWT.'],
    commonPitfalls: ['Bloqueo de hilos al invocar .Result o .Wait() en tareas asíncronas.'],
  },

  'Spring Boot (Java/Kotlin)': {
    name: 'Spring Boot (Java/Kotlin)',
    category: 'Ecosistema Empresarial Robusto (Java / JVM)',
    description: 'Framework líder en la industria financiera y corporativa para servicios backend y microservicios con autoconfiguración, inyección de dependencias y Spring Security.',
    paradigm: 'Inversion of Control + Aspect-Oriented Programming + Spring Data',
    architectureGuide: `Anotaciones @RestController, @Service y @Repository organizadas en capas limpias con Spring Data JPA para consultas declarativas y transacciones gestionadas con @Transactional.`,
    recommendedFolderStructure: `src/main/java/com/app/
├── controller/
├── service/
├── repository/
└── model/`,
    cliCommands: [
      { label: 'Servidor Dev Maven', command: './mvnw spring-boot:run' },
      { label: 'Empaquetar JAR', command: './mvnw clean package' },
    ],
    keyLibraries: ['spring-boot-starter-web', 'spring-boot-starter-data-jpa', 'spring-boot-starter-security'],
    performanceDirectives: ['Compilar con GraalVM Native Image para arranque en milisegundos.'],
    bestPractices: ['Validar beans con anotaciones @Valid y @NotNull.'],
    securityConsiderations: ['Configurar SecurityFilterChain con protección CSRF y CORS explícitos.'],
    commonPitfalls: ['Cargar relaciones Eager en entidades JPA provocando problemas de memoria.'],
  },
};

// ==========================================
// 3. DICCIONARIO DE BASES DE DATOS
// ==========================================
export const DATABASE_TECH_MAP: Record<string, TechDetail> = {
  'Datasets Locales (CSV / Parquet / Excel / JSON)': {
    name: 'Datasets Locales (CSV / Parquet / Excel / JSON)',
    category: 'Almacenamiento Analítico en Archivos de Datos Locales',
    description: 'Persistencia basada en datasets tabulares y estructurados en disco (CSV, Apache Parquet columnar, Excel .xlsx, JSON/JSONL), ideal para proyectos de análisis de datos en Python, ETL y ciencia de datos sin servidores de base de datos.',
    paradigm: 'Immutable Raw Datasets + Columnar Processed Storage (Parquet)',
    architectureGuide: `Los datasets originales se depositan en \`data/raw/\` en modo de solo lectura inmutable. Los pipelines de limpieza y transformación generan nuevos archivos optimizados en \`data/processed/\` (preferiblemente en formato Parquet para conservar tipos de datos exactos y compresión Snappy/Zstd) y tablas o reportes finales en \`data/outputs/\`.`,
    recommendedFolderStructure: `data/
├── raw/                  # Archivos CSV/Excel originales (NUNCA modificar directamente)
├── interim/              # Datos parcialmente transformados o unidos
├── processed/            # Datasets limpios tipados (.parquet / .csv)
└── outputs/              # Tablas de resultados, resúmenes estadísticos y reportes`,
    cliCommands: [
      { label: 'Inspeccionar Dataset con Python', command: 'python -c "import pandas as pd; df = pd.read_csv(\'data/raw/dataset.csv\'); print(df.info())"' },
    ],
    keyLibraries: ['pandas', 'polars', 'pyarrow', 'openpyxl', 'pandera'],
    performanceDirectives: [
      'Utilizar Apache Parquet (pyarrow) para datasets intermedios y procesados: reduce el peso en disco hasta un 80% y acelera la lectura 10x frente a CSV.',
      'Especificar usecols y dtype al leer archivos CSV grandes para cargar únicamente las columnas necesarias en memoria.',
    ],
    bestPractices: [
      'Mantener los datasets crudos (data/raw/) estrictamente inmutables para poder reproducir todo el análisis desde cero.',
      'Estandarizar nombres de columnas en snake_case sin tildes ni espacios al momento de la ingesta.',
    ],
    securityConsiderations: [
      'Añadir archivos de datos pesados o sensibles al .gitignore y documentar su estructura con un archivo data_dictionary.md o muestra sintética.',
    ],
    commonPitfalls: [
      'Problemas de codificación de caracteres (usar siempre encoding="utf-8" o "utf-8-sig") y pérdida de ceros a la izquierda en códigos/IDs al leer CSV sin especificar dtype=str.',
    ],
  },

  'DuckDB (Analítica SQL In-Process / Olap)': {
    name: 'DuckDB (Analítica SQL In-Process / Olap)',
    category: 'Motor SQL Analítico Columnar In-Process (OLAP Serverless)',
    description: 'Sistema de gestión de bases de datos SQL analítico (OLAP) embebido y ultrarrápido que se ejecuta dentro del mismo proceso de Python sin servidores externos, capaz de consultar archivos CSV, Parquet y DataFrames de Pandas/Polars directamente con SQL.',
    paradigm: 'In-Process Vectorized Columnar OLAP Engine',
    architectureGuide: `DuckDB opera directamente sobre un archivo local (\`.duckdb\`) o en memoria interrogando archivos Parquet/CSV y DataFrames de Pandas sin copiar datos (Zero-Copy integration). Ideal para agregaciones masivas, joins complejos y ventanas analíticas SQL en proyectos sin interfaz o de ciencia de datos.`,
    recommendedFolderStructure: `data/
├── analytics.duckdb      # Base de datos analítica embebida
├── parquet/              # Archivos Parquet consultados directamente vía SQL
└── queries/              # Scripts SQL analíticos parametrizados`,
    cliCommands: [
      { label: 'Instalar DuckDB en Python', command: 'pip install duckdb' },
      { label: 'Consulta Directa sobre Parquet', command: 'python -c "import duckdb; duckdb.sql(\'SELECT * FROM \\"data/processed/*.parquet\\" LIMIT 10\').show()"' },
    ],
    keyLibraries: ['duckdb', 'pyarrow', 'pandas', 'polars'],
    performanceDirectives: [
      'Ejecución vectorizada columnar capaz de agregar decenas de millones de filas en milisegundos en una sola máquina local.',
    ],
    bestPractices: [
      'Combinar la expresividad de SQL (CTEs, Window Functions) en DuckDB con el ecosistema de visualización y ML de Python.',
    ],
    securityConsiderations: [
      'Utilizar consultas parametrizadas (?) al inyectar variables dinámicas en sentencias SQL de DuckDB.',
    ],
    commonPitfalls: [
      'Intentar usar DuckDB para cargas transaccionales web de alta concurrencia de escritura (OLTP) en lugar de cargas analíticas (OLAP).',
    ],
  },

  'Ninguna (Sitio Estático / Sin BD)': {
    name: 'Ninguna (Sitio Estático / Sin BD)',
    category: 'Sin Persistencia Externa / Contenido en Archivos',
    description: 'El proyecto no requiere base de datos relacional ni documental. Toda la información reside en archivos estáticos locales versionados junto con el código fuente.',
    paradigm: 'Git-backed Content Repository',
    architectureGuide: `Los datos se almacenan en archivos estructurados (.md, .mdx, .json) en la carpeta del proyecto. Durante el proceso de build, estos archivos son leídos, parseados, validados contra esquemas tipados y compilados a páginas HTML optimizadas.`,
    recommendedFolderStructure: `content/
├── pages/                # Páginas estáticas en Markdown
├── blog/                 # Artículos estructurados
└── data/                 # Archivos JSON / YAML para catálogos y configuraciones`,
    cliCommands: [
      { label: 'Validar Formato JSON', command: 'npx prettier --check "src/content/**/*.json"' },
    ],
    keyLibraries: ['zod', 'gray-matter', 'remark', 'rehype'],
    performanceDirectives: [
      'Tiempos de lectura instantáneos en build; cero sobrecarga de red en runtime.',
    ],
    bestPractices: [
      'Validar el frontmatter de todos los documentos con esquemas Zod en compilación.',
    ],
    securityConsiderations: [
      'No existe riesgo de inyección SQL ni filtración de credenciales de base de datos.',
    ],
    commonPitfalls: [
      'Intentar implementar funcionalidades dinámicas que requieran persistencia concurrente de usuarios sin una API auxiliar.',
    ],
  },

  'Archivos Locales (Markdown / MDX / JSON)': {
    name: 'Archivos Locales (Markdown / MDX / JSON)',
    category: 'Persistencia Estructurada en Archivos Planos',
    description: 'Almacén de datos basado en el sistema de archivos local con esquemas de validación tipados, ideal para blogs, catálogos estáticos y documentación técnica.',
    paradigm: 'Static Document Store + Git Version Control',
    architectureGuide: `Los datos se guardan en archivos JSON o Markdown con frontmatter YAML. En tiempo de compilación o inicio de la aplicación, los archivos se leen con fs nativo o importaciones estáticas y se validan contra esquemas de Zod.`,
    recommendedFolderStructure: `data/
├── products.json         # Catálogo de productos
├── settings.json         # Configuración del sitio
└── posts/                # Entradas de contenido`,
    cliCommands: [
      { label: 'Validar Esquemas', command: 'npm run validate-data' },
    ],
    keyLibraries: ['zod', 'gray-matter'],
    performanceDirectives: ['Lecturas en memoria inmediatas con cero latencia de red.'],
    bestPractices: ['Definir esquemas Zod estrictos que garanticen la integridad estructural de cada archivo.'],
    securityConsiderations: ['Evitar guardar datos sensibles o privados en archivos comiteados en repositorios públicos.'],
    commonPitfalls: ['Escrituras concurrentes en runtime sin mecanismos de bloqueo de archivos.'],
  },

  'Headless CMS (Contentful / Sanity / Strapi)': {
    name: 'Headless CMS (Contentful / Sanity / Strapi)',
    category: 'Gestor de Contenidos Desacoplado con API',
    description: 'Plataforma externa para edición visual de contenidos por parte de redactores, consumida por el frontend mediante APIs REST o GraphQL con webhooks de revalidación automática.',
    paradigm: 'Content-as-a-Service (CaaS) + Webhook Invalidation',
    architectureGuide: `Los redactores gestionan el contenido en el panel del Headless CMS. Las mutaciones disparan webhooks hacia el frontend para reconstruir o revalidar páginas en la CDN.`,
    recommendedFolderStructure: `src/services/
├── cms.client.ts         # Cliente tipado de Sanity/Contentful/Strapi
└── schemas/              # Tipos generados automáticamente del CMS`,
    cliCommands: [
      { label: 'Generar Tipos del CMS', command: 'npm run cms:types' },
    ],
    keyLibraries: ['@sanity/client / contentful', 'zod'],
    performanceDirectives: ['Cachear respuestas de la API del CMS en build time o con revalidación incremental.'],
    bestPractices: ['Utilizar claves de API de solo lectura (Delivery API) en clientes públicos.'],
    securityConsiderations: ['Validar la firma secreta de webhooks entrantes para evitar ejecuciones falsificadas.'],
    commonPitfalls: ['Exceder límites de cuota de API por realizar peticiones no cacheadas en cada renderizado.'],
  },

  'LocalStorage / IndexedDB (Cliente)': {
    name: 'LocalStorage / IndexedDB (Cliente)',
    category: 'Almacenamiento Local en Navegador Web',
    description: 'Persistencia puramente client-side en el dispositivo del usuario sin servidores ni costes de infraestructura, ideal para aplicaciones offline-first, borradores y preferencias.',
    paradigm: 'Client-side Key-Value / Object Store',
    architectureGuide: `IndexedDB gestiona almacenamiento estructurado de gran volumen de forma asíncrona mediante librerías como idb o Dexie.js. LocalStorage se reserva exclusivamente para preferencias simples de UI (ej. tema oscuro).`,
    recommendedFolderStructure: `src/storage/
├── db.ts                 # Esquema de tablas de Dexie.js / IndexedDB
└── preferences.ts        # Almacenamiento de tema y configuración simple`,
    cliCommands: [
      { label: 'Pruebas de Storage', command: 'npm run test:storage' },
    ],
    keyLibraries: ['dexie', 'idb', 'localforage'],
    performanceDirectives: ['Evitar operaciones bloqueantes síncronas de LocalStorage en hilos principales con datos pesados.'],
    bestPractices: ['Encapsular accesos a storage en custom hooks reactivos con manejo de cuota de almacenamiento.'],
    securityConsiderations: ['Nunca almacenar tokens de autenticación sensibles ni contraseñas en LocalStorage.'],
    commonPitfalls: ['Asumir persistencia permanente; los navegadores pueden limpiar IndexedDB si el disco está lleno.'],
  },

  'PostgreSQL': {
    name: 'PostgreSQL',
    category: 'Base de Datos Relacional SQL Empresarial',
    description: 'Sistema de gestión de bases de datos relacional y orientado a objetos de código abierto más avanzado del mundo, reconocido por su fiabilidad, integridad transaccional (ACID) y extensibilidad.',
    paradigm: 'Relational ACID + JSONB Document Support + Complex Indexing',
    architectureGuide: `Los datos se modelan en tablas con tipado estricto, llaves primarias, foráneas y restricciones de integridad (CHECK, UNIQUE). Se aprovechan tipos de datos avanzados como UUIDv4 para identificadores, JSONB para datos semi-estructurados indexables con GIN, y extensiones como pg_trgm para búsqueda de texto completo.`,
    recommendedFolderStructure: `database/
├── migrations/           # Scripts SQL versionados (up / down)
├── seeds/                # Datos iniciales para pruebas y catálogos
├── schemas/              # Definiciones DDL de tablas y tipos ENUM
└── queries/              # Consultas optimizadas con EXPLAIN ANALYZE`,
    cliCommands: [
      { label: 'Conexión psql CLI', command: 'psql -h localhost -U usuario -d nombre_bd' },
      { label: 'Dump / Backup', command: 'pg_dump -U usuario -d nombre_bd > backup.sql' },
      { label: 'Restaurar Backup', command: 'psql -U usuario -d nombre_bd < backup.sql' },
    ],
    keyLibraries: ['pg (node-postgres)', 'prisma', 'typeorm', 'sqlalchemy', 'asyncpg'],
    performanceDirectives: [
      'Configurar pool de conexiones seguro (ej. 10 a 20 conexiones máximas) para evitar agotar la memoria del servidor.',
      'Crear índices B-Tree en todas las columnas utilizadas en cláusulas WHERE y JOIN frecuentes.',
      'Monitorear consultas lentas activando la extensión pg_stat_statements.',
    ],
    bestPractices: [
      'Utilizar transacciones atómicas (BEGIN ... COMMIT) en operaciones que involucren múltiples escrituras dependientes.',
      'Versionar el 100% de las alteraciones de esquema mediante herramientas de migración.',
    ],
    securityConsiderations: [
      'Prohibir el acceso directo de usuarios con privilegios superuser (postgres); crear un usuario de aplicación con permisos mínimos.',
      'Cifrar conexiones en tránsito exigiendo SSL/TLS (sslmode=require).',
    ],
    commonPitfalls: [
      'Consultas N+1 en ORMs al no utilizar Eager Loading (joins) en relaciones uno-a-muchos.',
    ],
  },

  'Supabase (PostgreSQL BaaS)': {
    name: 'Supabase (PostgreSQL BaaS)',
    category: 'Backend as a Service basado en PostgreSQL',
    description: 'Plataforma BaaS de código abierto que ofrece una base de datos PostgreSQL completa con autenticación integrada, APIs REST y GraphQL instantáneas, suscripciones en tiempo real y almacenamiento de objetos.',
    paradigm: 'Row Level Security (RLS) + Edge Functions + Realtime Subscriptions',
    architectureGuide: `La seguridad de datos no reside en el servidor de backend, sino en la propia base de datos mediante políticas de Row Level Security (RLS) en PostgreSQL. Esto permite que el cliente frontend consulte la base de datos de forma directa y segura utilizando el cliente de Supabase sin exponer datos ajenos.`,
    recommendedFolderStructure: `supabase/
├── migrations/           # Migraciones SQL generadas por la CLI de Supabase
│   └── 20261011000000_schema_initial.sql
├── functions/            # Edge Functions en Deno / TypeScript para lógica privada
├── seed.sql              # Datos iniciales de prueba
└── config.toml           # Configuración del entorno local de Supabase`,
    cliCommands: [
      { label: 'Iniciar Entorno Local', command: 'npx supabase start' },
      { label: 'Crear Migración', command: 'npx supabase migration new nombre' },
      { label: 'Generar Tipos TypeScript', command: 'npx supabase gen types typescript --local > src/types/supabase.ts' },
      { label: 'Desplegar a Producción', command: 'npx supabase db push' },
    ],
    keyLibraries: ['@supabase/supabase-js', '@supabase/ssr'],
    performanceDirectives: [
      'Crear índices en las columnas referenciadas en las políticas RLS (ej. user_id) para evitar escaneos secuenciales completos.',
    ],
    bestPractices: [
      'Habilitar Row Level Security (RLS) en el 100% de las tablas creadas sin excepción.',
      'Generar tipos TypeScript automáticos para tipar de forma estricta las consultas en el cliente.',
    ],
    securityConsiderations: [
      'Nunca exponer la SUPABASE_SERVICE_ROLE_KEY en el cliente; esa llave omite todas las políticas de RLS.',
      'Usar exclusivamente SUPABASE_ANON_KEY en el frontend.',
    ],
    commonPitfalls: [
      'Olvidar habilitar "ALTER TABLE tabla ENABLE ROW LEVEL SECURITY;", lo que deja la tabla pública para lectura y escritura.',
    ],
  },

  'MySQL': {
    name: 'MySQL',
    category: 'Base de Datos Relacional Popular y Estable',
    description: 'Uno de los motores de bases de datos relacionales más populares del mundo, impulsado por Oracle con motor de almacenamiento transaccional InnoDB.',
    paradigm: 'Relational ACID + InnoDB Storage Engine',
    architectureGuide: `Estructura en tablas normalizadas con claves primarias autoincrementales o UUIDs. Se utilizan transacciones ACID completas con índices B-Tree y consultas preparadas obligatorias.`,
    recommendedFolderStructure: `database/
├── migrations/
└── seeds/`,
    cliCommands: [
      { label: 'Cliente MySQL CLI', command: 'mysql -u root -p nombre_bd' },
      { label: 'Backup mysqldump', command: 'mysqldump -u root -p nombre_bd > backup.sql' },
    ],
    keyLibraries: ['mysql2', 'prisma', 'typeorm', 'sequelize'],
    performanceDirectives: [
      'Verificar planes de consulta ejecutando EXPLAIN en queries complejas.',
    ],
    bestPractices: [
      'Utilizar siempre el conjunto de caracteres utf8mb4 y collation utf8mb4_unicode_ci.',
    ],
    securityConsiderations: [
      'Evitar usuarios sin contraseña y restringir el host de conexión a 127.0.0.1.',
    ],
    commonPitfalls: [
      'Usar el motor obsoleto MyISAM en lugar del transaccional InnoDB.',
    ],
  },

  'MongoDB': {
    name: 'MongoDB',
    category: 'Base de Datos NoSQL Basada en Documentos',
    description: 'Base de datos NoSQL líder orientada a documentos JSON/BSON flexibles, con alta velocidad de lectura/escritura y escalabilidad horizontal distribuida.',
    paradigm: 'Document-Oriented NoSQL + Aggregation Framework',
    architectureGuide: `Los datos se almacenan en colecciones de documentos BSON polimórficos. Las relaciones se resuelven mediante incrustación (embedding) para datos de alta coherencia o referencias (_id) para relaciones uno-a-muchos grandes.`,
    recommendedFolderStructure: `src/models/
├── User.model.ts         # Esquema de Mongoose con validación de tipos
└── Order.model.ts        # Colección con índices compuestos`,
    cliCommands: [
      { label: 'Shell mongosh', command: 'mongosh "mongodb://localhost:27017/nombre_bd"' },
      { label: 'Exportar Colección', command: 'mongoexport --db nombre_bd --collection users --out users.json' },
    ],
    keyLibraries: ['mongoose', 'mongodb (driver nativo)'],
    performanceDirectives: [
      'Crear índices compuestos alineados con las consultas más frecuentes para evitar escaneos de colección (COLLSCAN).',
    ],
    bestPractices: [
      'Definir esquemas con Mongoose o Zod para garantizar que no se inserten documentos corruptos.',
    ],
    securityConsiderations: [
      'Deshabilitar el acceso sin autenticación en mongod.conf y sanitizar operadores ($where, $gt) para evitar NoSQL Injection.',
    ],
    commonPitfalls: [
      'Incrustar matrices infinitas que superen el límite de 16MB por documento BSON.',
    ],
  },

  'SQLite / Turso': {
    name: 'SQLite / Turso',
    category: 'Base de Datos SQL Embebida & Distribuida en Edge',
    description: 'Motor de base de datos SQL embebido ultraligero que opera sobre un archivo local (SQLite) o distribuido globalmente en nodos de borde con replicación libSQL (Turso).',
    paradigm: 'Embedded Serverless SQL + Zero-Config Engine',
    architectureGuide: `Cero configuración de servidores o puertos. En local, opera directamente sobre un archivo .db con transacciones ACID ultrarrápidas. En la nube (Turso), ofrece réplicas de lectura en milisegundos con sincronización automática.`,
    recommendedFolderStructure: `data/
├── local.db              # Archivo de base de datos SQLite local
└── migrations/           # Migraciones SQL`,
    cliCommands: [
      { label: 'Turso CLI Dev', command: 'turso dev' },
      { label: 'Conexión Local SQLite', command: 'sqlite3 data/local.db' },
    ],
    keyLibraries: ['better-sqlite3', '@libsql/client', 'drizzle-orm'],
    performanceDirectives: [
      'Activar el modo WAL (Write-Ahead Logging): PRAGMA journal_mode = WAL; para soportar lectores y escritores concurrentes.',
    ],
    bestPractices: [
      'Utilizar Drizzle ORM para tipado estricto sin sobrecarga de rendimiento.',
    ],
    securityConsiderations: [
      'Asegurar que el archivo .db no esté ubicado en la carpeta public accesible por el navegador.',
    ],
    commonPitfalls: [
      'Bloqueos por concurrencia de escritura masiva si no se activa el modo WAL.',
    ],
  },

  'Firebase Firestore': {
    name: 'Firebase Firestore',
    category: 'Base de Datos NoSQL en Tiempo Real en la Nube',
    description: 'Base de datos documental en la nube de Google Cloud con sincronización en tiempo real entre clientes, soporte offline nativo y escalabilidad automática sin servidores.',
    paradigm: 'Realtime Document-Collection Hierarchy + Security Rules',
    architectureGuide: `Estructura de colecciones y documentos con suscripciones en tiempo real (onSnapshot). La seguridad se rige por las Reglas de Seguridad de Firestore (Security Rules) evaluadas por documento.`,
    recommendedFolderStructure: `src/services/firebase/
├── firestore.ts          # Inicialización y referencias tipadas
└── rules/
    └── firestore.rules   # Reglas de seguridad declarativas`,
    cliCommands: [
      { label: 'Desplegar Reglas', command: 'firebase deploy --only firestore:rules' },
      { label: 'Emulador Local', command: 'firebase emulators:start' },
    ],
    keyLibraries: ['firebase', 'firebase-admin'],
    performanceDirectives: ['Diseñar consultas que aprovechen los índices compuestos automáticos de Firestore.'],
    bestPractices: ['Utilizar conversiones de datos tipadas con withConverter().'],
    securityConsiderations: ['Nunca dejar las reglas en modo de prueba abiertas (allow read, write: if true).'],
    commonPitfalls: ['Consultas complejas con múltiples cláusulas de desigualdad en diferentes campos no permitidas.'],
  },

  'Redis (Cache / KV)': {
    name: 'Redis (Cache / KV)',
    category: 'Almacén Clave-Valor en Memoria de Alta Velocidad',
    description: 'Estructura de datos en memoria utilizada como base de datos en tiempo real, caché de alto rendimiento, gestor de sesiones de usuario y broker de mensajes Pub/Sub.',
    paradigm: 'In-Memory Key-Value Store + Pub/Sub Messaging',
    architectureGuide: `Se sitúa delante de la base de datos principal para cachear resultados de consultas costosas, almacenar listas de tokens revocados (blacklist) y gestionar límites de peticiones (rate limiting) con TTL (Time-To-Live).`,
    recommendedFolderStructure: `src/cache/
├── redis.client.ts       # Conexión persistente con reconexión automática
└── rateLimiter.ts        # Algoritmo de Token Bucket en Redis`,
    cliCommands: [
      { label: 'Redis CLI', command: 'redis-cli' },
      { label: 'Monitorear Claves', command: 'redis-cli monitor' },
    ],
    keyLibraries: ['ioredis', 'redis'],
    performanceDirectives: ['Tiempos de respuesta de submilisegundos en lectura y escritura.'],
    bestPractices: ['Asignar siempre un tiempo de expiración (EX / TTL) a las claves cacheadas para evitar saturar la RAM.'],
    securityConsiderations: ['Exigir contraseña segura (requirepass) y prohibir la exposición del puerto 6379 a internet público.'],
    commonPitfalls: ['Ejecutar el comando KEYS * en producción, lo cual bloquea el hilo principal de Redis; usar SCAN.'],
  },
};

// ==========================================
// 4. DICCIONARIO DE PATRONES ARQUITECTÓNICOS
// ==========================================
export const PATTERN_TECH_MAP: Record<string, TechDetail> = {
  'Pipeline de Datos / ETL (Extract - Transform - Load)': {
    name: 'Pipeline de Datos / ETL (Extract - Transform - Load)',
    category: 'Arquitectura de Procesamiento Secuencial de Datos',
    description: 'Patrón arquitectónico que desacopla el flujo de datos en tres etapas puras y auditables: Extracción desde fuentes crudas, Transformación/Limpieza vectorizada en memoria y Carga/Exportación de artefactos finales.',
    paradigm: 'Staged Data Pipeline + Functional Transformations',
    architectureGuide: `Cada etapa recibe un contrato de datos claro (DataFrame / Dataset validado) y produce una salida determinista sin efectos secundarios ocultos. Permite re-ejecutar únicamente la fase de transformación o visualización sin volver a descargar o extraer los datos originales.`,
    recommendedFolderStructure: `src/
├── extract/              # Lectores de CSV, Excel, SQL, APIs
├── transform/            # Limpieza, normalización, cruces y KPIs
├── load/                 # Exportadores a Parquet, reportes y gráficos
└── pipeline.py           # Orquestador secuencial con logging de tiempos`,
    cliCommands: [{ label: 'Ejecutar Pipeline ETL', command: 'python -m src.pipeline' }],
    keyLibraries: ['pandas', 'polars', 'pyarrow', 'pandera', 'pydantic'],
    performanceDirectives: ['Ejecución vectorizada por etapas con validación de conteo de filas y memoria en cada transición.'],
    bestPractices: ['Asegurar que las funciones de transformación sean funciones puras fáciles de probar con pytest.'],
    securityConsiderations: ['Validar esquemas y tipos en la etapa Extract antes de propagar datos al resto del pipeline.'],
    commonPitfalls: ['Mezclar lectura de archivos, lógica de limpieza y generación de gráficos en un solo script monolítico.'],
  },

  'Arquitectura Modular de Ciencia de Datos & Notebooks (Cookiecutter Data Science)': {
    name: 'Arquitectura Modular de Ciencia de Datos & Notebooks (Cookiecutter Data Science)',
    category: 'Estándar Industrial para Proyectos de Análisis de Datos y ML',
    description: 'Organización estandarizada donde los datos siguen un flujo unidireccional (raw -> interim -> processed), los notebooks se usan para exploración y comunicación, y el código productivo reside en un paquete Python modular en src/.',
    paradigm: 'Reproducible Data Science + Separation of Exploration and Production Code',
    architectureGuide: `Los datos originales en \`data/raw/\` jamás se editan. Toda función que se utilice más de una vez en un notebook se refactoriza inmediatamente hacia \`src/\` y se prueba con \`pytest\`. Las figuras generadas se exportan de forma programática a \`reports/figures/\`.`,
    recommendedFolderStructure: `project_root/
├── data/
│   ├── raw/              # Datos originales inmutables
│   ├── interim/          # Datos intermedios transformados
│   └── processed/        # Datasets finales para análisis/modelado
├── notebooks/            # Notebooks numerados (01_eda, 02_features, 03_report)
├── reports/
│   └── figures/          # Gráficos y tablas exportadas
├── src/                  # Código fuente modular Python
└── tests/                # Tests unitarios de transformaciones`,
    cliCommands: [{ label: 'Instalar Paquete Local en Modo Editable', command: 'pip install -e .' }],
    keyLibraries: ['pandas', 'numpy', 'matplotlib', 'seaborn', 'scikit-learn', 'jupyterlab', 'pytest'],
    performanceDirectives: ['Almacenar datasets procesados en Parquet para preservar tipos y acelerar cargas en notebooks.'],
    bestPractices: ['Mantener los notebooks limpios y apoyados en funciones importadas desde src/.'],
    securityConsiderations: ['Excluir data/ del control de versiones salvo muestras sintéticas pequeñas.'],
    commonPitfalls: ['Tener código duplicado y desincronizado entre múltiples archivos .ipynb.'],
  },

  'CLI Modular por Comandos (Command Pattern)': {
    name: 'CLI Modular por Comandos (Command Pattern)',
    category: 'Arquitectura de Herramientas de Consola y Automatización',
    description: 'Patrón que encapsula cada acción del sistema como un comando independiente ejecutable por terminal con sus propios argumentos, validaciones y códigos de retorno.',
    paradigm: 'Command Pattern + Subcommand Routing + Core Service Layer',
    architectureGuide: `La capa CLI actúa únicamente como adaptador de entrada/salida en consola (parseo de flags y formateo de tablas Rich), delegando el trabajo real a servicios de dominio desacoplados.`,
    recommendedFolderStructure: `src/
├── cli/                  # Definición de comandos y argumentos
├── services/             # Lógica de negocio reutilizable
└── utils/                # Formateadores, logs y manejo de archivos`,
    cliCommands: [{ label: 'Ejecutar CLI', command: 'python main.py --help' }],
    keyLibraries: ['typer', 'click', 'rich', 'argparse'],
    performanceDirectives: ['Importaciones perezosas (lazy imports) de librerías pesadas para que --help responda instantáneamente.'],
    bestPractices: ['Separar la lógica de consola de la lógica de negocio para poder testear ambas por separado.'],
    securityConsiderations: ['Sanitizar rutas y argumentos pasados por consola.'],
    commonPitfalls: ['Acoplar cálculos de negocio directamente dentro de las funciones decoradas de la CLI.'],
  },

  'SSG (Static Site Generation / Jamstack)': {
    name: 'SSG (Static Site Generation / Jamstack)',
    category: 'Generación Estática en Compilación',
    description: 'Patrón donde todo el marcado HTML, CSS y assets se compilan de antemano durante el build y se distribuyen en una red global CDN, eliminando la necesidad de servidores de renderizado en runtime.',
    paradigm: 'Pre-rendered Immutable Artifacts',
    architectureGuide: `Toda la información se procesa una sola vez durante el pipeline de integración continua. El resultado es un conjunto de archivos estáticos HTML/CSS/JS inmutables con hashes de contenido para invalidación de caché instantánea.`,
    recommendedFolderStructure: `dist/
├── index.html
├── 404.html
├── blog/
│   └── post-1/index.html
└── assets/`,
    cliCommands: [{ label: 'Compilar SSG', command: 'npm run build' }],
    keyLibraries: ['Astro', 'Next.js Static Export', '11ty', 'Vite'],
    performanceDirectives: ['Time to First Byte (TTFB) menor a 50ms.', 'Puntaje Lighthouse 98+.'],
    bestPractices: ['Asegurar builds deterministas y reproducibles.'],
    securityConsiderations: ['Superficie de ataque prácticamente nula.'],
    commonPitfalls: ['Construir sitios que requieran datos en tiempo real de milisegundos usando SSG puro sin revalidación.'],
  },

  'Arquitectura de Islas (Islands Architecture - Astro)': {
    name: 'Arquitectura de Islas (Islands Architecture - Astro)',
    category: 'Hidratación Selectiva Componente por Componente',
    description: 'Patrón donde la página web es un documento HTML estático puro por defecto, y solo los componentes dinámicos interactivos se transforman en "islas" aisladas hidratadas en cliente.',
    paradigm: 'Partial Selective Hydration + Static HTML Shell',
    architectureGuide: `Las islas operan independientemente unas de otras. Si una isla falla, el resto de la página sigue funcionando a la perfección. La hidratación se posterga hasta que el usuario interactúa o hace scroll hasta la isla.`,
    recommendedFolderStructure: `src/
├── components/
│   ├── static/           # Componentes 0-JS
│   └── islands/          # Componentes cliente con directivas client:*`,
    cliCommands: [{ label: 'Compilar Islas', command: 'npx astro build' }],
    keyLibraries: ['Astro', '@astrojs/react', '@astrojs/vue', '@astrojs/svelte'],
    performanceDirectives: ['Reduce el JavaScript del cliente hasta en un 90% en comparación con SPAs monolíticas.'],
    bestPractices: ['Preferir client:visible sobre client:load para componentes secundarios.'],
    securityConsiderations: ['Menor JavaScript ejecutándose en cliente reduce los vectores de ataque de inyección en runtime.'],
    commonPitfalls: ['Hacer una sola isla gigante que envuelva toda la página perdiendo las ventajas del patrón.'],
  },

  'SPA Estática Client-Side (Vite)': {
    name: 'SPA Estática Client-Side (Vite)',
    category: 'Aplicación de Página Única Client-Side',
    description: 'Patrón donde un solo archivo HTML inicial carga un paquete JavaScript que gestiona todo el ciclo de vida de la aplicación, el renderizado de vistas y las transiciones en el navegador.',
    paradigm: 'Client-Side Rendering (CSR) + PushState Routing',
    architectureGuide: `El navegador descarga el bundle estático y monta la aplicación en un elemento root del DOM. Las transiciones de pantalla se realizan al instante en memoria sin recargar el navegador.`,
    recommendedFolderStructure: `src/
├── routes/               # Configuración de rutas client-side
├── views/                # Pantallas completas
└── components/           # Componentes UI`,
    cliCommands: [{ label: 'Compilación SPA', command: 'npm run build' }],
    keyLibraries: ['react-router-dom / vue-router', '@tanstack/react-query'],
    performanceDirectives: ['Implementar code-splitting por ruta con React.lazy() o import() dinámico.'],
    bestPractices: ['Mostrar skeletons y estados de carga claros mientras se obtienen datos del backend.'],
    securityConsiderations: ['Manejo seguro de tokens en memoria o cookies HttpOnly.'],
    commonPitfalls: ['Bundle inicial masivo sin code splitting que degrade el First Contentful Paint.'],
  },

  'Colecciones de Contenido (Content Collections / Markdown)': {
    name: 'Colecciones de Contenido (Content Collections / Markdown)',
    category: 'Gestión Tipada de Contenidos en Archivos',
    description: 'Patrón de organización donde los documentos editoriales residen en carpetas tipadas con esquemas de validación Zod que impiden la compilación si un archivo carece de campos obligatorios.',
    paradigm: 'Schema-Validated Content Driven Architecture',
    architectureGuide: `Cada carpeta representa una colección tipada (ej. blog, productos). En src/content/config.ts se define el esquema Zod exacto con campos requeridos, tipos y valores predeterminados.`,
    recommendedFolderStructure: `src/content/
├── config.ts             # Esquemas Zod para cada colección
├── blog/                 # Archivos .md/.mdx
└── docs/                 # Documentación técnica`,
    cliCommands: [{ label: 'Verificar Esquemas', command: 'npx astro check' }],
    keyLibraries: ['zod', 'astro:content'],
    performanceDirectives: ['Todo el parsing se efectúa en compilación, generando objetos JSON tipados ultrarrápidos.'],
    bestPractices: ['Definir siempre esquemas estrictos con descripciones claras.'],
    securityConsiderations: ['Sanitizar frontmatter antes de renderizar.'],
    commonPitfalls: ['Modificar el nombre de un campo de frontmatter en un archivo sin actualizar el esquema Zod.'],
  },

  'Clean Architecture (Domain-Driven / Use Cases)': {
    name: 'Clean Architecture (Domain-Driven / Use Cases)',
    category: 'Arquitectura Limpia & Dominio Desacoplado',
    description: 'Patrón arquitectónico que separa el software en capas concéntricas con una regla de dependencia estricta: las capas internas (Dominio y Casos de Uso) no conocen ni dependen de las capas externas (Infraestructura, Frameworks y UI).',
    paradigm: 'Dependency Inversion + Hexagonal / Ports and Adapters',
    architectureGuide: `La capa central Domain contiene entidades y reglas de negocio puras sin frameworks. Application orquesta los Casos de Uso e interfaces (puertos). Infrastructure implementa adaptadores (base de datos, clientes HTTP). Presentation contiene componentes UI y controladores.`,
    recommendedFolderStructure: `src/
├── domain/               # Entidades de negocio, Value Objects y reglas empresariales
│   ├── entities/         # Clases o interfaces con reglas invariantes
│   └── value-objects/    # Objetos inmutables (Email, Dinero, PasswordHash)
├── application/          # Casos de uso (Use Cases) y DTOs
│   ├── use-cases/        # CreateUserUseCase, AuthenticateUserUseCase
│   └── ports/            # Interfaces de repositorios (IUserRepository)
├── infrastructure/       # Implementaciones concretas de puertos
│   ├── repositories/     # PostgresUserRepository implements IUserRepository
│   └── http/             # Clientes de API, adaptadores de terceros
└── presentation/         # UI, controladores, rutas y componentes reactivos`,
    cliCommands: [{ label: 'Pruebas Unitarias de Casos de Uso', command: 'npm run test:unit' }],
    keyLibraries: ['InversifyJS / NestJS IoC', 'Zod', 'Vitest'],
    performanceDirectives: ['Permite cambiar el motor de base de datos o framework visual sin modificar la lógica empresarial.'],
    bestPractices: ['El Dominio nunca debe importar nada de Infrastructure ni de librerías externas de UI.'],
    securityConsiderations: ['Validar invariantes de negocio en entidades y DTOs en application.'],
    commonPitfalls: ['Permitir que entidades de dominio importen decoradores de ORMs específicos acoplando la lógica.'],
  },

  'MVC (Model-View-Controller)': {
    name: 'MVC (Model-View-Controller)',
    category: 'Patrón Clásico de Separación de Presentación',
    description: 'Patrón arquitectónico fundacional que separa los datos del dominio (Model), la interfaz visible al usuario (View) y el mediador de peticiones (Controller).',
    paradigm: 'Three-tier Structural Separation',
    architectureGuide: `El Controller recibe la petición del usuario, interactúa con el Model para obtener o modificar datos, y finalmente selecciona la View adecuada para presentar la respuesta.`,
    recommendedFolderStructure: `src/
├── models/               # Clases y esquemas de datos
├── views/                # Plantillas o componentes visuales
└── controllers/          # Manejadores de rutas y peticiones`,
    cliCommands: [{ label: 'Ejecutar MVC', command: 'npm run start' }],
    keyLibraries: ['Express / Laravel / Django'],
    performanceDirectives: ['Mantener controladores delgados ("Fat Models, Skinny Controllers").'],
    bestPractices: ['No ubicar lógica de negocio compleja dentro de las vistas ni de los controladores.'],
    securityConsiderations: ['Validación estricta de parámetros en controladores.'],
    commonPitfalls: ['Acumular toda la lógica de negocio dentro de los controladores haciéndolos inmanejables.'],
  },

  'MVVM (Model-View-ViewModel)': {
    name: 'MVVM (Model-View-ViewModel)',
    category: 'Patrón para Interfaces con Enlace de Datos Reactivo',
    description: 'Patrón orientado a aplicaciones móviles y clientes reactivos donde el ViewModel expone flujos de estado observables consumidos por la View sin que el ViewModel conozca la UI directamente.',
    paradigm: 'Two-Way Data Binding + Observable State Streams',
    architectureGuide: `Model representa los datos y la lógica de negocio. ViewModel expone propiedades observables y comandos. View se suscribe a los cambios del ViewModel y renderiza la interfaz.`,
    recommendedFolderStructure: `src/
├── models/               # Entidades y esquemas de persistencia
├── viewmodels/           # Stores reactivos y comandos (useUserViewModel)
└── views/                # Pantallas y componentes visuales`,
    cliCommands: [{ label: 'Pruebas de ViewModels', command: 'npm run test:viewmodels' }],
    keyLibraries: ['Zustand / MobX / Flutter BLoC'],
    performanceDirectives: ['Emisión granular de eventos de estado para evitar reconstrucciones de vistas completas.'],
    bestPractices: ['Los ViewModels deben ser 100% testeables sin necesidad de montar componentes de UI.'],
    securityConsiderations: ['Sanitizar entradas en el ViewModel antes de llamar a servicios de red.'],
    commonPitfalls: ['Importar elementos visuales o referencias al DOM dentro del ViewModel.'],
  },

  'Arquitectura Hexagonal (Puertos y Adaptadores)': {
    name: 'Arquitectura Hexagonal (Puertos y Adaptadores)',
    category: 'Desacoplamiento Tecnológico Extremo',
    description: 'Patrón ideado por Alistair Cockburn que aísla el núcleo de la aplicación de los detalles externos mediante interfaces (Puertos) y componentes que las implementan (Adaptadores).',
    paradigm: 'Ports and Adapters Architectural Isolation',
    architectureGuide: `El núcleo de la aplicación reside en el centro del hexágono. Los puertos de entrada reciben peticiones (HTTP, CLI, Mensajería). Los puertos de salida interactúan con el exterior (Base de datos, Pasarelas de pago, Emails) a través de adaptadores intercambiables.`,
    recommendedFolderStructure: `src/
├── core/
│   ├── domain/           # Entidades puras
│   └── ports/
│       ├── in/           # Casos de uso / Interfaces de comandos
│       └── out/          # Interfaces de repositorios y servicios externos
└── adapters/
    ├── in/               # Controladores HTTP, CLI, WebSockets
    └── out/              # Implementaciones SQL, Mock, AWS S3`,
    cliCommands: [{ label: 'Pruebas del Núcleo', command: 'npm run test:core' }],
    keyLibraries: ['TypeScript Interfaces', 'Vitest'],
    performanceDirectives: ['Permite sustituir infraestructura sin tocar una sola línea del core.'],
    bestPractices: ['Definir puertos con tipos de datos nativos sin filtrar tipos del adaptador.'],
    securityConsiderations: ['Aislamiento de la lógica crítica frente a vulnerabilidades de dependencias externas.'],
    commonPitfalls: ['Permitir que el núcleo importe librerías de adaptadores específicos.'],
  },

  'Capas Clásicas (Controller - Service - Repository)': {
    name: 'Capas Clásicas (Controller - Service - Repository)',
    category: 'Estructura en Capas Horizontal Estándar',
    description: 'La arquitectura en tres capas más extendida en la industria: Controllers para transporte HTTP, Services para lógica de negocio y Repositories para acceso a datos.',
    paradigm: 'Layered Separation of Concerns',
    architectureGuide: `Las peticiones entran por Controllers -> invocan Services -> que consumen Repositories -> que interactúan con el motor de base de datos. Ninguna capa se salta su nivel jerárquico.`,
    recommendedFolderStructure: `src/
├── controllers/          # Manejo de peticiones y respuestas HTTP
├── services/             # Reglas de negocio y orquestación
├── repositories/         # Consultas de base de datos y persistencia
├── models/               # Entidades y esquemas
└── routes/               # Enrutamiento`,
    cliCommands: [{ label: 'Iniciar Servidor', command: 'npm start' }],
    keyLibraries: ['Express', 'NestJS', 'TypeORM', 'Prisma'],
    performanceDirectives: ['Optimización de transacciones en la capa de servicios.'],
    bestPractices: ['No colocar lógica SQL dentro de los controllers ni lógica HTTP dentro de los repositories.'],
    securityConsiderations: ['Validación en controladores y sanitización en repositorios.'],
    commonPitfalls: ['Hacer que los controladores accedan directamente a los repositorios saltándose la capa de servicio.'],
  },

  'Microservicios Event-Driven': {
    name: 'Microservicios Event-Driven',
    category: 'Sistemas Distribuidos Orientados a Eventos',
    description: 'Arquitectura donde múltiples servicios independientes se comunican de forma asíncrona mediante la emisión y consumo de eventos a través de un bus de mensajes (Kafka, RabbitMQ, Redis).',
    paradigm: 'Asynchronous Event-Driven Messaging',
    architectureGuide: `Los servicios no realizan llamadas HTTP bloqueantes entre sí para operaciones de escritura. En su lugar, publican eventos de dominio (ej. \`OrderCreated\`) que otros servicios escuchan y procesan de forma autónoma con consistencia eventual.`,
    recommendedFolderStructure: `services/
├── order-service/
│   ├── src/events/       # Publicadores de eventos
│   └── ...
└── notification-service/
    ├── src/listeners/    # Suscriptores de eventos
    └── ...`,
    cliCommands: [{ label: 'Iniciar Bus de Mensajes', command: 'docker-compose up -d redis rabbitmq' }],
    keyLibraries: ['kafkajs', 'amqplib', 'ioredis'],
    performanceDirectives: ['Desacoplamiento temporal y alta tolerancia a fallos por colas de retintento.'],
    bestPractices: ['Garantizar idempotencia en los manejadores de eventos ante posibles duplicados.'],
    securityConsiderations: ['Cifrado mTLS en las comunicaciones del bus de mensajes y autenticación por servicio.'],
    commonPitfalls: ['No implementar estrategias de compensación (patrón Saga) ante fallos en transacciones distribuidas.'],
  },
};

// ==========================================
// 5. DICCIONARIO DE ESTILOS VISUALES
// ==========================================
export const STYLE_TECH_MAP: Record<string, StyleDetail> = {
  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    category: 'Táctil & 3D Translúcido',
    philosophy: 'Efecto de cristal esmerilado flotante con capas semitransparentes, desenfoque de fondo y bordes de alta fidelidad que transmiten profundidad y sofisticación tecnológica.',
    cssRules: [
      'backdrop-filter: blur(12px) saturate(180%)',
      'background: rgba(255, 255, 255, 0.08) en modo oscuro; rgba(255, 255, 255, 0.65) en modo claro',
      'border: 1px solid rgba(255, 255, 255, 0.15)',
      'box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36)',
    ],
    colorTokens: [
      { token: 'Glass Background', hex: 'rgba(255, 255, 255, 0.08)', role: 'Fondo de tarjetas y modales flotantes' },
      { token: 'Glass Border', hex: 'rgba(255, 255, 255, 0.18)', role: 'Borde ultrafino de cristal' },
      { token: 'Accent Glow Primary', hex: '#3B82F6', role: 'Resplandor azul de fondo para proyectar contraste' },
      { token: 'Accent Glow Secondary', hex: '#8B5CF6', role: 'Gradiente de malla violeta' },
    ],
    typographyGuideline: 'Tipografía sans-serif geométrica nítida (Inter, Plus Jakarta Sans) con pesos semibold y tracking ajustado para máxima legibilidad sobre fondos difuminados.',
    componentDirectives: [
      'Tarjetas: rounded-2xl con backdrop-blur-md y bordes blancos translúcidos de 1px.',
      'Botones primarios: degradados luminosos con sombras proyectadas coloreadas.',
      'Inputs: fondos oscurecidos con 30% de opacidad y borde con realce en foco.',
    ],
    animationProfile: 'Transiciones de elevación suaves de 250ms con curvas cubic-bezier(0.16, 1, 0.3, 1) y resplandores en hover.',
  },

  bento_grid: {
    id: 'bento_grid',
    name: 'Bento Grid',
    category: 'Modular Apple / Linear',
    philosophy: 'Composición asimétrica inspirada en las cajas bento japonesas, organizando la información en módulos rectangulares armónicos de proporciones variadas (1x1, 2x1, 2x2) con esquinas redondeadas generosas.',
    cssRules: [
      'border-radius: 1.25rem (rounded-2xl)',
      'border: 1px solid rgba(255, 255, 255, 0.08) en dark; rgba(0, 0, 0, 0.08) en light',
      'background: #18181B (zinc-900) sobre fondo #09090B (zinc-950)',
      'gap: 1rem a 1.5rem entre celdas del grid',
    ],
    colorTokens: [
      { token: 'Canvas Dark', hex: '#09090B', role: 'Fondo de pantalla principal mate' },
      { token: 'Surface Card', hex: '#18181B', role: 'Superficie de módulos bento' },
      { token: 'Surface Highlight', hex: '#27272A', role: 'Hover y bordes destacados' },
      { token: 'Accent Vibrant', hex: '#38BDF8', role: 'Insignias, iconos y métricas de alto impacto' },
    ],
    typographyGuideline: 'Jerarquía milimétrica con números grandes en fuente monoespaciada o display y etiquetas en minúsculas técnicas con espaciado amplio.',
    componentDirectives: [
      'Cada celda del Bento debe albergar un único concepto conciso (una métrica, un gráfico interactivo, una ilustración o un control).',
      'Microdetalles: badges redondeados pill con bordes sutiles y textos en monoespaciado.',
    ],
    animationProfile: 'Microinteracciones discretas: sutil escala (1.01x) y realce de borde al posar el cursor.',
  },

  neo_brutalism: {
    id: 'neo_brutalism',
    name: 'Neo-Brutalismo',
    category: 'Pop & Expresivo de Alto Contraste',
    philosophy: 'Estética disruptiva y lúdica que homenajea la web temprana con bordes negros gruesos, sombras sólidas duras sin desenfoque (hard shadows), paletas pop saturadas y formas geométricas rectas.',
    cssRules: [
      'border: 3px solid #000000',
      'box-shadow: 4px 4px 0px #000000 (o 5px 5px 0px en botones)',
      'border-radius: 0.5rem a 0.75rem (rounded-lg o rounded-xl)',
      'colores primarios hiper-saturados sobre fondos claros',
    ],
    colorTokens: [
      { token: 'Pop Yellow', hex: '#FFE600', role: 'Botones principales de acción y banners' },
      { token: 'Pop Pink', hex: '#FF5C93', role: 'Acentos y etiquetas llamativas' },
      { token: 'Hard Black', hex: '#000000', role: 'Bordes estructurales de 3-4px y sombras sólidas' },
      { token: 'Canvas Cream', hex: '#FFFDF5', role: 'Fondo cálido de alto contraste' },
    ],
    typographyGuideline: 'Tipografías grotescas o display pesadas (Space Grotesk, Clash Display, Archivo Black) en negrita marcada con mayúsculas llamativas.',
    componentDirectives: [
      'Botones: transform: translate(-2px, -2px) con sombra de 4px que colapsa a translate(0px, 0px) y sombra 0px al hacer click (active state táctil).',
      'Alertas y tarjetas con marco negro prominente y rotaciones sutiles opcionales (-0.5deg a 0.5deg).',
    ],
    animationProfile: 'Movimientos secos y mecánicos sin atenuación suave (duraciones rápidas de 100ms a 150ms).',
  },

  dark_tech: {
    id: 'dark_tech',
    name: 'Dark Tech / Cyberpunk Minimal',
    category: 'Tech & Terminal',
    philosophy: 'Atmósfera técnica y profesional inspirada en consolas de ciberseguridad, dashboards de observabilidad DevOps y terminales con negro azabache, microbordes y destellos flúor de alta precisión.',
    cssRules: [
      'background: #030712 (gray-950) con tarjetas en #111827 (gray-900)',
      'border: 1px solid rgba(16, 185, 129, 0.25) o rgba(6, 182, 212, 0.25)',
      'box-shadow: 0 0 15px rgba(16, 185, 129, 0.1)',
    ],
    colorTokens: [
      { token: 'Void Black', hex: '#030712', role: 'Fondo de interfaz ultra-oscuro' },
      { token: 'Surface Panel', hex: '#111827', role: 'Paneles de herramientas y consolas' },
      { token: 'Matrix Emerald', hex: '#10B981', role: 'Indicadores de estado óptimo y datos de consola' },
      { token: 'Cyber Cyan', hex: '#06B6D4', role: 'Enlaces activos, gráficas y métricas' },
    ],
    typographyGuideline: 'Inter para párrafos combinada obligatoriamente con JetBrains Mono o Fira Code para identificadores, comandos y métricas.',
    componentDirectives: [
      'Consolas de código con bordes tenues y botones con resplandor neón perimetral.',
      'Indicadores de actividad con puntos de luz palpitantes (ping animation).',
    ],
    animationProfile: 'Animaciones de parpadeo y transiciones milimétricas con acentos de escaneo visual.',
  },

  neumorphism: {
    id: 'neumorphism',
    name: 'Neumorphism (Soft UI / Relieve Táctil)',
    category: 'Táctil & 3D',
    philosophy: 'Componentes que parecen brotar orgánicamente de la superficie mediante el uso de dos sombras complementarias proyectadas (una clara superior-izquierda y una oscura inferior-derecha).',
    cssRules: [
      'box-shadow: 5px 5px 10px #CAD2DE, -5px -5px 10px #FFFFFF',
      'background: #E0E5EC',
      'border: 0px',
      'border-radius: 1rem (rounded-xl)',
    ],
    colorTokens: [
      { token: 'Canvas Surface', hex: '#E0E5EC', role: 'Fondo unificado donde se hunden y brotan los elementos' },
      { token: 'Light Shadow', hex: '#FFFFFF', role: 'Sombra superior cenital' },
      { token: 'Dark Shadow', hex: '#CAD2DE', role: 'Sombra inferior de relieve' },
      { token: 'Accent Tonal', hex: '#3B82F6', role: 'Indicadores activos' },
    ],
    typographyGuideline: 'Fuentes redondeadas y suaves (Nunito, Poppins) con colores de texto de contraste accesible (#4B5563).',
    componentDirectives: [
      'Botones inactivos: sombra convexa brotando del fondo. Botones activos/presionados: sombra cóncava inset.',
    ],
    animationProfile: 'Transición fluida de sombra exterior a sombra inset de 180ms.',
  },

  cyberpunk_neon: {
    id: 'cyberpunk_neon',
    name: 'Cyberpunk High-Contrast (Glow Neón)',
    category: 'Tech & Cyber',
    philosophy: 'Máximo contraste visual y atmósfera arcade con luces fluorescentes de neón magenta, amarillo flúor y cian sobre fondos negro absoluto.',
    cssRules: [
      'background: #000000',
      'border: 1px solid #FF007F',
      'box-shadow: 0 0 18px rgba(255, 0, 127, 0.4), inset 0 0 8px rgba(255, 0, 127, 0.2)',
    ],
    colorTokens: [
      { token: 'Pure Void', hex: '#000000', role: 'Fondo absoluto' },
      { token: 'Neon Pink', hex: '#FF007F', role: 'Bordes, botones y acentos fluorescentes' },
      { token: 'Neon Cyan', hex: '#00FFFF', role: 'Enlaces y datos secundarios' },
      { token: 'Neon Yellow', hex: '#FFFF00', role: 'Alertas y llamadas a la acción' },
    ],
    typographyGuideline: 'Tipografías tecno-geométricas o displays angulares (Orbitron, Rajdhani) con mayúsculas y tracking amplio.',
    componentDirectives: [
      'Botones con efecto de resplandor neón pulsante (glow effect) y bordes cortados en diagonal (clip-path).',
    ],
    animationProfile: 'Micro-parpadeos de neón y transiciones de gradiente rápidas.',
  },

  minimalist_flat: {
    id: 'minimalist_flat',
    name: 'Minimalist Flat 2.0 (Clean Modern)',
    category: 'Moderno & Limpio',
    philosophy: 'Claridad ejecutiva contemporánea con foco supremo en la jerarquía tipográfica, generosos espacios en blanco y líneas divisorias refinadas de 1 píxel.',
    cssRules: [
      'background: #FFFFFF (dark: #09090B)',
      'border: 1px solid #E5E7EB (dark: #27272A)',
      'box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    ],
    colorTokens: [
      { token: 'Canvas Pure', hex: '#FFFFFF', role: 'Fondo inmaculado' },
      { token: 'Text Primary', hex: '#111827', role: 'Tipografía de alto contraste' },
      { token: 'Border Subtle', hex: '#E5E7EB', role: 'Líneas divisorias precisas' },
      { token: 'Brand Accent', hex: '#2563EB', role: 'Puntos focales de interacción' },
    ],
    typographyGuideline: 'Inter o Geist Sans con escala modular estricta de tamaños y pesos 400 y 600.',
    componentDirectives: [
      'Componentes con elevación mínima, bordes definidos y ausencia total de adornos superficiales.',
    ],
    animationProfile: 'Transiciones de opacidad y color tenues de 150ms.',
  },

  terminal_cli: {
    id: 'terminal_cli',
    name: 'Terminal / CLI Aesthetic (Hacker UI)',
    category: 'Tech & Cyber',
    philosophy: 'Entorno de línea de comandos auténtico con fondo negro puro, tipografía monoespaciada estricta, prompts interactivos y detalles de fósforo verde o ámbar.',
    cssRules: [
      'background: #0C0C0C',
      'border: 1px solid rgba(0, 255, 102, 0.4)',
      'box-shadow: 0 0 10px rgba(0, 255, 102, 0.15)',
      'font-family: monospace',
    ],
    colorTokens: [
      { token: 'Phosphor Green', hex: '#00FF66', role: 'Texto, bordes e iconos de consola' },
      { token: 'Terminal Black', hex: '#0C0C0C', role: 'Superficie de fondo' },
      { token: 'Cursor Amber', hex: '#FFB000', role: 'Acentos y advertencias' },
    ],
    typographyGuideline: 'JetBrains Mono, Fira Code o Courier New obligatoria en toda la interfaz sin excepción.',
    componentDirectives: [
      'Botones con corchetes [ EJECUTAR ], indicadores de prompt >_, y separadores ascii.',
    ],
    animationProfile: 'Parpadeo de cursor de 530ms y transiciones de texto instantáneas sin easing.',
  },

  pure_brutalism: {
    id: 'pure_brutalism',
    name: 'Brutalismo Puro (Web Brutalism)',
    category: 'Pop & Expresivo',
    philosophy: 'Estética web radical y minimalista con cero florituras cosméticas, enlaces nativos azules estándar y fuentes de sistema crudas.',
    cssRules: [
      'background: #FFFFFF',
      'border: 1px solid #000000',
      'border-radius: 0px',
      'box-shadow: none',
    ],
    colorTokens: [
      { token: 'Raw White', hex: '#FFFFFF', role: 'Fondo' },
      { token: 'Raw Black', hex: '#000000', role: 'Texto y marcos' },
      { token: 'Standard Blue Link', hex: '#0000EE', role: 'Enlaces hipertexto estándar' },
    ],
    typographyGuideline: 'Fuentes nativas de sistema sin suavizar: Times New Roman o Arial estándar.',
    componentDirectives: ['Botones estándar HTML con bordes rectos y cajas sin redondeos.'],
    animationProfile: 'Cero animaciones cosméticas; transiciones nativas directas.',
  },

  claymorphism: {
    id: 'claymorphism',
    name: 'Claymorphism (Plastilina 3D Suave)',
    category: 'Táctil & 3D',
    philosophy: 'Volúmenes inflados y amigables estilo plastilina mate con esquinas muy redondeadas y sombras interiores que proyectan luz suave.',
    cssRules: [
      'border-radius: 2rem (rounded-3xl)',
      'box-shadow: 6px 6px 14px rgba(0,0,0,0.08), inset 3px 3px 6px rgba(255,255,255,0.8), inset -3px -3px 6px rgba(0,0,0,0.05)',
      'border: 0px',
    ],
    colorTokens: [
      { token: 'Clay Mint', hex: '#A7F3D0', role: 'Fondo de tarjetas' },
      { token: 'Clay Peach', hex: '#FED7AA', role: 'Botones' },
      { token: 'Clay Lavender', hex: '#DDD6FE', role: 'Insignias' },
    ],
    typographyGuideline: 'Tipografías redondeadas y amigables como Fredoka o Quicksand.',
    componentDirectives: ['Componentes esponjosos con volumen mate y gran radio de curvatura.'],
    animationProfile: 'Efectos de rebote elástico (spring physics).',
  },

  skeuomorphism: {
    id: 'skeuomorphism',
    name: 'Esqueumorfismo Clásico',
    category: 'Táctil & 3D',
    philosophy: 'Recreación digital de objetos físicos con texturas de materiales reales, iluminación cenital, biseles y degradados profundos.',
    cssRules: [
      'border-top: 1px solid rgba(255, 255, 255, 0.6)',
      'border-bottom: 1px solid rgba(0, 0, 0, 0.4)',
      'box-shadow: inset 1px 1px 1px #fff, 2px 2px 4px rgba(0,0,0,0.4)',
    ],
    colorTokens: [
      { token: 'Brushed Metal', hex: '#4A5568', role: 'Carcasas' },
      { token: 'Chrome Highlight', hex: '#E2E8F0', role: 'Bisel superior iluminado' },
    ],
    typographyGuideline: 'Fuentes con sombra de texto proyectada tenue (text-shadow).',
    componentDirectives: ['Botones con relieve 3D mecánico y bisel reflectante.'],
    animationProfile: 'Presión física con reducción de sombra en active.',
  },

  swiss_editorial: {
    id: 'swiss_editorial',
    name: 'Estilo Editorial / Suizo (Swiss Typographic)',
    category: 'Editorial & Minimal',
    philosophy: 'Rigor compositivo helvético con cuadrículas asimétricas rígidas, titulares monumentales y rojo bermellón clásico.',
    cssRules: [
      'border-top: 2px solid #000000',
      'border-radius: 0px',
      'background: #FBF9F5',
    ],
    colorTokens: [
      { token: 'Warm Cream', hex: '#FBF9F5', role: 'Fondo papel' },
      { token: 'Ink Black', hex: '#111111', role: 'Tipografía' },
      { token: 'Swiss Vermilion', hex: '#E63946', role: 'Acento rojo' },
    ],
    typographyGuideline: 'Helvetica, Neue Haas Grotesk o Archivo con jerarquía titánica.',
    componentDirectives: ['Líneas divisorias horizontales gruesas y numeración monumental.'],
    animationProfile: 'Transiciones editoriales sobrias sin rebotes.',
  },

  aurora_ui: {
    id: 'aurora_ui',
    name: 'Aurora UI (Degradados Orgánicos / Mesh Glow)',
    category: 'Tech & Cyber',
    philosophy: 'Gradientes de malla fluidos y etéreos difuminados en segundo plano creando una atmósfera envolvente y moderna.',
    cssRules: [
      'background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2), rgba(236,72,153,0.2))',
      'backdrop-filter: blur(40px)',
    ],
    colorTokens: [
      { token: 'Aurora Indigo', hex: '#6366F1', role: 'Gradiente de fondo' },
      { token: 'Aurora Purple', hex: '#8B5CF6', role: 'Gradiente de fondo' },
      { token: 'Aurora Pink', hex: '#EC4899', role: 'Gradiente de fondo' },
    ],
    typographyGuideline: 'Plus Jakarta Sans con peso mediano y alto contraste sobre el resplandor.',
    componentDirectives: ['Tarjetas flotantes translúcidas sobre las manchas de luz de fondo.'],
    animationProfile: 'Movimiento lento continuo de las masas de color de fondo.',
  },

  material_design_3: {
    id: 'material_design_3',
    name: 'Material Design 3 (Material You)',
    category: 'Sistemas Nativos',
    philosophy: 'Sistema de diseño oficial de Google con superficies adaptativas gobernadas por color tonal y botones en píldora.',
    cssRules: ['border-radius: 9999px en botones', 'border-radius: 1.5rem en tarjetas'],
    colorTokens: [
      { token: 'M3 Primary', hex: '#6750A4', role: 'Acción principal' },
      { token: 'M3 Container', hex: '#EADDFF', role: 'Contenedor tonal' },
    ],
    typographyGuideline: 'Roboto o Google Sans con pesos reglamentarios de Material 3.',
    componentDirectives: ['Botones en forma de píldora y menús flotantes estandarizados.'],
    animationProfile: 'Ondas expansivas de pulsación (Ripple effect) de 300ms.',
  },

  cupertino_ios: {
    id: 'cupertino_ios',
    name: 'Cupertino (iOS Human Interface Guidelines)',
    category: 'Sistemas Nativos',
    philosophy: 'Directrices oficiales de Apple con curvas continuas (squircles), barras translúcidas de material dinámico y celdas agrupadas.',
    cssRules: ['backdrop-filter: blur(20px)', 'border-radius: 1rem (squircle)', 'border-color: rgba(60,60,67,0.18)'],
    colorTokens: [
      { token: 'iOS Blue', hex: '#007AFF', role: 'Acción' },
      { token: 'iOS System Gray', hex: '#F2F2F7', role: 'Fondo agrupado' },
    ],
    typographyGuideline: 'SF Pro Text y SF Pro Display de Apple.',
    componentDirectives: ['Celdas de lista agrupadas en tarjetas redondeadas y modales flotantes.'],
    animationProfile: 'Curvas de resorte elásticas idénticas a iOS.',
  },

  y2k_aesthetic: {
    id: 'y2k_aesthetic',
    name: 'Y2K Aesthetic (Cromado Retro-Futurista)',
    category: 'Retro & Arcade',
    philosophy: 'Nostalgia futurista del cambio de milenio con brillos cromados, degradados metálicos y tonos rosa chicle y celeste hielo.',
    cssRules: ['background: linear-gradient(180deg, #C0C0C0, #FFFFFF, #C0C0C0)', 'border: 1px solid #7DF9FF'],
    colorTokens: [
      { token: 'Chrome Silver', hex: '#C0C0C0', role: 'Metálico' },
      { token: 'Bubblegum Pink', hex: '#FF69B4', role: 'Acento pop' },
      { token: 'Cyber Ice', hex: '#7DF9FF', role: 'Bordes luminosos' },
    ],
    typographyGuideline: 'Tipografías espaciales y tecno del año 2000.',
    componentDirectives: ['Botones tipo burbuja reflectante con estrellas centelleantes.'],
    animationProfile: 'Destellos centelleantes y rotaciones lúdicas.',
  },

  retro_win95: {
    id: 'retro_win95',
    name: 'Retro Windows 95 / Web 1.0',
    category: 'Retro & Arcade',
    philosophy: 'Nostalgia pura de los años 90 con ventanas clásicas, bordes biselados 3D duros y gris de sistema corporativo.',
    cssRules: [
      'background: #C0C0C0',
      'border-top: 2px solid #FFFFFF',
      'border-left: 2px solid #FFFFFF',
      'border-bottom: 2px solid #000000',
      'border-right: 2px solid #000000',
    ],
    colorTokens: [
      { token: 'Classic Teal', hex: '#008080', role: 'Fondo de escritorio clásico' },
      { token: 'Titlebar Navy', hex: '#000080', role: 'Barra de títulos de ventana' },
      { token: 'System Gray', hex: '#C0C0C0', role: 'Superficie de ventanas y botones' },
    ],
    typographyGuideline: 'MS Sans Serif o Tahoma con renderizado nítido sin antialiasing.',
    componentDirectives: ['Ventanas con botón de cerrar [X], minimizar [_] y barra superior azul marino.'],
    animationProfile: 'Respuesta inmediata sin transiciones suaves.',
  },

  pixel_art: {
    id: 'pixel_art',
    name: 'Pixel Art / Arcade UI (8-bit / 16-bit)',
    category: 'Retro & Arcade',
    philosophy: 'Estética retro de videojuegos arcade de 8 y 16 bits con bordes pixelados escalonados y tipografías bitmap clásicas.',
    cssRules: ['border: 4px solid #000000', 'box-shadow: 4px 4px 0px #000000', 'image-rendering: pixelated'],
    colorTokens: [
      { token: 'Arcade Red', hex: '#E03B24', role: 'Botones y vidas' },
      { token: 'Arcade Gold', hex: '#F2C94C', role: 'Monedas y bordes' },
      { token: 'Arcade Dark', hex: '#101010', role: 'Fondo' },
    ],
    typographyGuideline: 'Press Start 2P o VT323 monoespaciada bitmap.',
    componentDirectives: ['Botones escalonados y marcos con texturas de tablero de juego retro.'],
    animationProfile: 'Animaciones de fotogramas discretos (step-end) a 8 FPS.',
  },

  hand_drawn: {
    id: 'hand_drawn',
    name: 'Hand-Drawn / Doodle UI (Boceto Ilustrado)',
    category: 'Pop & Expresivo',
    philosophy: 'Calidez artesanal con trazos imperfectos estilo lápiz o tinta sobre textura de libreta con bordes orgánicos asimétricos.',
    cssRules: [
      'border: 2px dashed #2D3748',
      'border-radius: 255px 15px 225px 15px/15px 225px 15px 255px',
      'background: #FDFBF7',
    ],
    colorTokens: [
      { token: 'Notebook Cream', hex: '#FDFBF7', role: 'Fondo papel' },
      { token: 'Graphite Pencil', hex: '#2D3748', role: 'Trazos y texto' },
      { token: 'Marker Highlighter', hex: '#F59E0B', role: 'Subrayados' },
    ],
    typographyGuideline: 'Caveat, Patrick Hand o Kalam simulando escritura a mano.',
    componentDirectives: ['Bordes asimétricos irregulares y flechas ilustradas.'],
    animationProfile: 'Ligeras oscilaciones orgánicas estilo stop-motion.',
  },

  papercut_depth: {
    id: 'papercut_depth',
    name: 'Papercut / Layered Depth (Capas de Papel 2.5D)',
    category: 'Táctil & 3D',
    philosophy: 'Sensación física de hojas de cartulina recortadas y superpuestas con sombras paralelas difusas que crean profundidad tridimensional.',
    cssRules: [
      'box-shadow: 0 10px 20px rgba(0,0,0,0.15), 0 6px 6px rgba(0,0,0,0.1)',
      'border-radius: 1.5rem',
      'background: #F4F1DE',
    ],
    colorTokens: [
      { token: 'Sand Paper', hex: '#F4F1DE', role: 'Capa base' },
      { token: 'Terracotta', hex: '#E07A5F', role: 'Capa intermedia' },
      { token: 'Ocean Navy', hex: '#3D405B', role: 'Capa profunda' },
    ],
    typographyGuideline: 'DM Serif Display combinada con Outfit.',
    componentDirectives: ['Capas superpuestas con curvas fluidas recortadas y sombras paralelas.'],
    animationProfile: 'Elevación suave y desacoplada de cada capa.',
  },

  monochrome_pure: {
    id: 'monochrome_pure',
    name: 'Monocromático Puro (High-Contrast B&W)',
    category: 'Editorial & Minimal',
    philosophy: 'Contraste radical absoluto 100% blanco y 100% negro sin escalas de grises intermedias, logrando máxima contundencia visual y legibilidad.',
    cssRules: ['background: #FFFFFF (dark: #000000)', 'border: 1px solid #000000 (dark: #FFFFFF)', 'box-shadow: none'],
    colorTokens: [
      { token: 'Absolute White', hex: '#FFFFFF', role: 'Fondo o texto contrastado' },
      { token: 'Absolute Black', hex: '#000000', role: 'Fondo o texto contrastado' },
    ],
    typographyGuideline: 'Tipografía de alto impacto en pesos Heavy o Black contra Light puro.',
    componentDirectives: ['Inversión total de colores en estados hover (negro sobre blanco -> blanco sobre negro).'],
    animationProfile: 'Cambio de color instantáneo sin interpolación de tonalidades.',
  },
};

// ==========================================
// FUNCIONES AUXILIARES DE BÚSQUEDA
// ==========================================

export function getFrontendTechInfo(frontendName: string): TechDetail {
  if (!frontendName) return FRONTEND_TECH_MAP['React (Vite)'];
  for (const [key, val] of Object.entries(FRONTEND_TECH_MAP)) {
    if (frontendName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(frontendName.toLowerCase())) {
      return val;
    }
  }
  return FRONTEND_TECH_MAP['React (Vite)'];
}

export function getBackendTechInfo(backendName: string): TechDetail {
  if (!backendName) return BACKEND_TECH_MAP['Node.js (NestJS)'];
  for (const [key, val] of Object.entries(BACKEND_TECH_MAP)) {
    if (backendName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(backendName.toLowerCase())) {
      return val;
    }
  }
  return BACKEND_TECH_MAP['Node.js (NestJS)'];
}

export function getDatabaseTechInfo(dbName: string): TechDetail {
  if (!dbName) return DATABASE_TECH_MAP['PostgreSQL'];
  for (const [key, val] of Object.entries(DATABASE_TECH_MAP)) {
    if (dbName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(dbName.toLowerCase())) {
      return val;
    }
  }
  return DATABASE_TECH_MAP['PostgreSQL'];
}

export function getPatternTechInfo(patternName: string): TechDetail {
  if (!patternName) return PATTERN_TECH_MAP['Clean Architecture (Domain-Driven / Use Cases)'];
  for (const [key, val] of Object.entries(PATTERN_TECH_MAP)) {
    if (patternName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(patternName.toLowerCase())) {
      return val;
    }
  }
  return PATTERN_TECH_MAP['Clean Architecture (Domain-Driven / Use Cases)'];
}

export function getStyleTechInfo(styleId: string): StyleDetail {
  if (STYLE_TECH_MAP[styleId]) {
    return STYLE_TECH_MAP[styleId];
  }
  return STYLE_TECH_MAP['bento_grid'];
}
