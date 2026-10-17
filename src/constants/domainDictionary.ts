/**
 * DICCIONARIO ROBUSTO DE DOMINIOS, ARQUETIPOS Y REGLAS DE COHERENCIA
 * Base de conocimiento estructurada para inferir proyectos, stacks tecnológicos,
 * requerimientos y estilos visuales 100% coherentes y libres de contradicciones.
 */

import type { DesignStyleId, MasterPromptTone, TargetPlatform } from '../types/libreto';

export interface DomainBlueprint {
  id: string;
  name: string;
  tag: string;
  description: string;
  keywords: string[];
  suggestedPlatform: TargetPlatform;
  isHeadless: boolean;
  isStaticSite: boolean;
  languages: string[];
  frontendFramework: string;
  backendFramework: string;
  database: string;
  connectionType: string;
  architecturalPattern: string;
  style: DesignStyleId;
  styleFramework: string;
  primaryColor: string;
  secondaryColor: string;
  darkModeDefault: boolean;
  typography: string;
  writtenDesignNotes: string;
  customObservations: string[];
  suggestedFunctionalRequirements: string[];
  suggestedNonFunctionalRequirements: string[];
  suggestedUserStories: string[];
  suggestedADRs: {
    title: string;
    context: string;
    decision: string;
    consequences: string;
    discardedAlternatives: string;
  }[];
  customRules: string[];
  customSecurityPolicies: string[];
  masterPromptTone: MasterPromptTone;
}

export const DOMAIN_BLUEPRINTS: Record<string, DomainBlueprint> = {
  // 1. ANÁLISIS DE DATOS Y CIENCIA DE DATOS EN PYTHON (HEADLESS)
  python_data: {
    id: 'python_data',
    name: 'Análisis de Datos & Ciencia de Datos con Python',
    tag: 'Ciencia de Datos / EDA / ML',
    description: 'Pipeline de datos para ingesta, limpieza vectorizada, análisis exploratorio (EDA), KPIs estadísticos y visualizaciones científicas sin interfaz web.',
    keywords: [
      'datos', 'analisis', 'dataset', 'datasets', 'pandas', 'numpy', 'scikit', 'machine learning',
      'eda', 'csv', 'parquet', 'excel', 'polars', 'estadistica', 'regresion', 'clustering',
      'limpieza de datos', 'metricas', 'graficos', 'visualizacion', 'matplotlib', 'seaborn', 'plotly'
    ],
    suggestedPlatform: 'headless',
    isHeadless: true,
    isStaticSite: false,
    languages: ['Python', 'SQL'],
    frontendFramework: 'Ninguno (Sin Interfaz Gráfica / Script / CLI / Notebooks)',
    backendFramework: 'Python Data Science (Pandas / Polars / NumPy / Scikit-Learn)',
    database: 'Datasets Locales (CSV / Parquet / Excel / JSON)',
    connectionType: 'Ejecución Local por Consola / CLI / Notebooks (Sin Red)',
    architecturalPattern: 'Pipeline de Datos / ETL (Extract - Transform - Load)',
    style: 'terminal_cli',
    styleFramework: 'Sin Interfaz Web (Gráficos Matplotlib / Seaborn / Plotly / Terminal)',
    primaryColor: '#2563EB',
    secondaryColor: '#F59E0B',
    darkModeDefault: false,
    typography: 'Inter & JetBrains Mono',
    writtenDesignNotes: '• Este proyecto NO tiene interfaz gráfica web (sin HTML/CSS/DOM).\n• Todas las visualizaciones deben exportarse en 300 DPI a reports/figures/ usando estilo seaborn whitegrid y paleta consistente.\n• Mostrar tablas resumen de datos y métricas en terminal con formato de la librería Rich.',
    customObservations: [
      'Incluir título descriptivo, unidades explícitas en ejes y tamaño de muestra (n) en cada figura generada.',
      'Suprimir bordes superior y derecho (sns.despine) para maximizar el data-ink ratio.',
    ],
    suggestedFunctionalRequirements: [
      'Carga segura y validación estricta de esquemas y tipos de datos para archivos CSV, Excel y Parquet.',
      'Tratamiento reproducible de valores faltantes (imputación/filtrado) y detección automatizada de outliers (IQR / Z-score).',
      'Cálculo de estadísticas descriptivas, matriz de correlaciones e indicadores clave (KPIs) del negocio.',
      'Generación programática de gráficos de alta resolución (distribuciones, comparativas temporales, correlaciones).',
      'Exportación de datasets procesados y limpios en data/processed/ y reporte ejecutivo de resultados.',
    ],
    suggestedNonFunctionalRequirements: [
      'Reproducibilidad determinista del 100% fijando semillas aleatorias (RANDOM_SEED = 42).',
      'Operaciones 100% vectorizadas evitando bucles lentos en Python sobre filas de datos.',
      'Cobertura de pruebas unitarias con pytest para todas las funciones puras de transformación.',
    ],
    suggestedUserStories: [
      'Como analista de datos, quiero ejecutar el pipeline con un solo comando para procesar los datos crudos y actualizar todos los gráficos del informe.',
      'Como científico de datos, quiero que las funciones de limpieza residan en src/ para reutilizarlas en notebooks sin duplicar código.',
    ],
    suggestedADRs: [
      {
        title: 'Ejecución Headless y Formato Columnar Parquet',
        context: 'El proyecto se enfoca en procesamiento y análisis cuantitativo de datos, donde una interfaz web agregaría complejidad innecesaria.',
        decision: 'Adoptar arquitectura modular en Python con Pandas/Polars y persistencia intermedia en Parquet.',
        consequences: 'Reducción drástica del consumo de memoria RAM, lectura 10x más rápida y tipado estricto preservado.',
        discardedAlternatives: 'Crear una SPA web con backend monolítico para ejecutar scripts locales.',
      },
    ],
    customRules: [
      'Prohibido iterar sobre DataFrames con .iterrows() cuando exista una operación vectorizada.',
      'Fijar Type Hints de Python en el 100% de las funciones de src/.',
      'Mantener los datasets en data/raw/ estrictamente inmutables.',
    ],
    customSecurityPolicies: [
      'Nunca subir datasets con Información Personal Identificable (PII) al repositorio Git (.gitignore estricto).',
      'No utilizar deserialización con pickle de archivos no confiables (usar Parquet o safetensors).',
    ],
    masterPromptTone: 'strict_senior',
  },

  // 2. AUTOMATIZACIÓN, SCRAPING, ETL Y SCRIPTS CLI (HEADLESS)
  python_cli: {
    id: 'python_cli',
    name: 'Automatización, ETL & Herramientas CLI',
    tag: 'Scripts / ETL / Terminal CLI',
    description: 'Herramientas de línea de comandos, pipelines ETL periódicos, bots de automatización o web scraping ético sin interfaz web.',
    keywords: [
      'cli', 'consola', 'terminal', 'script', 'scripts', 'automatizacion', 'etl', 'scraping',
      'scraper', 'cron', 'cronjob', 'batch', 'lotes', 'typer', 'click', 'rich', 'loguru'
    ],
    suggestedPlatform: 'headless',
    isHeadless: true,
    isStaticSite: false,
    languages: ['Python', 'Bash / Shell'],
    frontendFramework: 'CLI Interactiva en Terminal (Rich / Typer / Click)',
    backendFramework: 'Scripts de Automatización / ETL / Cron Jobs (Python)',
    database: 'DuckDB (Analítica SQL In-Process / Olap)',
    connectionType: 'Ejecución Local por Consola / CLI / Notebooks (Sin Red)',
    architecturalPattern: 'CLI Modular por Comandos (Command Pattern)',
    style: 'terminal_cli',
    styleFramework: 'Sin Interfaz Web (Gráficos Matplotlib / Seaborn / Plotly / Terminal)',
    primaryColor: '#10B981',
    secondaryColor: '#6366F1',
    darkModeDefault: true,
    typography: 'Inter & JetBrains Mono',
    writtenDesignNotes: '• Interfaz por consola atractiva y estructurada con colores ANSI, paneles informativos y tablas de Rich.\n• Barras de progreso interactivas para tareas de procesamiento por lotes que tarden más de 500ms.\n• Manejo limpio de errores sin imprimir stack traces intimidantes al usuario común.',
    customObservations: [
      'Incluir flag --help detallado con ejemplos de uso para cada subcomando.',
      'Soportar flag --json o --quiet para permitir la ejecución silenciosa dentro de pipelines de CI/CD.',
    ],
    suggestedFunctionalRequirements: [
      'Parser de argumentos y subcomandos tipados con validación automática y mensajes de ayuda interactivos.',
      'Ejecución atómica e idempotente del flujo de trabajo por lotes.',
      'Sistema de logging con rotación diaria de archivos en logs/ y niveles INFO/WARNING/ERROR.',
      'Gestión automática de reintentos con retroceso exponencial ante caídas temporales de red.',
      'Mecanismo de simulación (--dry-run) que valide entradas sin aplicar cambios destructivos.',
    ],
    suggestedNonFunctionalRequirements: [
      'Códigos de salida estándar POSIX (0 para éxito, distinto de 0 para errores controlados).',
      'Uso de memoria constante O(1) mediante generadores en flujos de datos grandes.',
      'Arranque del comando --help en menos de 100ms mediante importaciones perezosas (lazy imports).',
    ],
    suggestedUserStories: [
      'Como operador de sistemas, quiero ejecutar el script con el parámetro --dry-run para anticipar los cambios antes de procesar archivos reales.',
      'Como desarrollador, quiero ver una barra de progreso informativa durante tareas largas para saber el tiempo estimado restante.',
    ],
    suggestedADRs: [
      {
        title: 'Arquitectura CLI con Typer y Rich',
        context: 'Se requiere una herramienta de consola profesional, mantenible y con tipado estricto.',
        decision: 'Utilizar Typer basado en Type Hints de Python junto con Rich para salida gráfica en terminal.',
        consequences: 'Código limpio sin boilerplate manual de argumentos y presentación visual de alto nivel.',
        discardedAlternatives: 'Argparse crudo (mucho código repetitivo y salida de texto plano árida).',
      },
    ],
    customRules: [
      'Toda acción destructiva debe solicitar confirmación o requerir un flag explícito --yes.',
      'No silenciar excepciones con bloques try/except pass vacíos.',
    ],
    customSecurityPolicies: [
      'Cargar tokens y credenciales exclusivamente desde variables de entorno (.env).',
      'Enmascarar datos sensibles (contraseñas, tokens) en prompts de terminal.',
    ],
    masterPromptTone: 'strict_senior',
  },

  // 3. SAAS B2B, DASHBOARDS & PANELES DE CONTROL
  saas_b2b: {
    id: 'saas_b2b',
    name: 'SaaS B2B & Dashboards Administrativos',
    tag: 'Next.js + Postgres / Supabase',
    description: 'Plataforma web multi-usuario con autenticación segura, control de acceso por roles (RBAC), dashboards analíticos y reportes.',
    keywords: [
      'saas', 'dashboard', 'panel', 'admin', 'b2b', 'plataforma', 'metricas', 'kpi', 'usuarios',
      'roles', 'permisos', 'suscripcion', 'stripe', 'multitenant', 'empresa', 'gestion'
    ],
    suggestedPlatform: 'web',
    isHeadless: false,
    isStaticSite: false,
    languages: ['TypeScript', 'SQL'],
    frontendFramework: 'Next.js (App Router - Fullstack)',
    backendFramework: 'Node.js (NestJS)',
    database: 'PostgreSQL',
    connectionType: 'REST API (JSON)',
    architecturalPattern: 'Clean Architecture (Domain-Driven / Use Cases)',
    style: 'bento_grid',
    styleFramework: 'Shadcn UI + Radix UI',
    primaryColor: '#0EA5E9',
    secondaryColor: '#6366F1',
    darkModeDefault: true,
    typography: 'Inter & JetBrains Mono',
    writtenDesignNotes: '• Layout en Bento Grid con tarjetas de bordes sutiles (1px) y esquinas redondeadas (12px/16px).\n• Navegación lateral colapsable con estado activo destacado.\n• Tablas de datos enriquecidas con filtros rápidos, paginación y skeletons en estados de carga.',
    customObservations: [
      'Los indicadores clave (KPIs) deben mostrar porcentaje de variación respecto al periodo anterior.',
      'Paleta oscura profesional estilo Linear/Vercel con acentos de color limitados a llamadas de acción.',
    ],
    suggestedFunctionalRequirements: [
      'Autenticación robusta con control de acceso basado en roles (Admin, Editor, Visor) y sesiones seguras.',
      'Dashboard principal con tarjetas de métricas en tiempo real y gráficos interactivos.',
      'Módulo de gestión de usuarios, invitaciones por correo electrónico y auditoría de accesos.',
      'Exportación de reportes tabulares en formatos CSV y PDF con filtros parametrizados.',
      'Configuración de preferencias de perfil, seguridad y tema claro/oscuro por usuario.',
    ],
    suggestedNonFunctionalRequirements: [
      'Tiempo de respuesta de endpoints de lectura inferior a 150ms bajo carga concurrente.',
      'Cumplimiento de estándares de accesibilidad WCAG 2.1 AA con ratio de contraste mínimo 4.5:1.',
      'Puntaje Google Lighthouse superior a 90 en Rendimiento, Accesibilidad y Mejores Prácticas.',
    ],
    suggestedUserStories: [
      'Como administrador, quiero asignar roles a los miembros de mi equipo para restringir el acceso a configuraciones críticas.',
      'Como usuario analista, quiero filtrar el dashboard por rangos de fecha para evaluar el rendimiento mensual.',
    ],
    suggestedADRs: [
      {
        title: 'Persistencia Relacional en PostgreSQL con ORM Tipado',
        context: 'Los datos de la plataforma son altamente relacionales (organizaciones, usuarios, permisos, auditoría).',
        decision: 'Emplear PostgreSQL con transacciones ACID y cliente tipado estricto (Prisma / Drizzle).',
        consequences: 'Integridad referencial garantizada y tipado de extremo a extremo sin discrepancias de esquema.',
        discardedAlternatives: 'Bases de datos no relacionales sin validación de esquema transaccional.',
      },
    ],
    customRules: [
      'Validar el 100% de entradas y parámetros con esquemas tipados (Zod) antes de llegar a la lógica de negocio.',
      'Desacoplar la lógica de dominio en casos de uso puros independientes del framework web.',
    ],
    customSecurityPolicies: [
      'Tokens de sesión en cookies seguras HttpOnly con banderas Secure y SameSite=Strict.',
      'Protección contra ataques CSRF, Rate Limiting en endpoints sensibles y cabeceras CSP estrictas.',
    ],
    masterPromptTone: 'strict_senior',
  },

  // 4. TIENDA ONLINE, E-COMMERCE & PAGOS
  ecommerce: {
    id: 'ecommerce',
    name: 'E-Commerce, Catálogo & Pasarela de Pagos',
    tag: 'Next.js + Stripe + SQL',
    description: 'Tienda en línea completa con catálogo de productos, carrito de compras reactivo, pasarela de pagos segura y seguimiento de órdenes.',
    keywords: [
      'tienda', 'ecommerce', 'e-commerce', 'carrito', 'catalogo', 'productos', 'pagos', 'stripe',
      'checkout', 'ordenes', 'pedidos', 'compras', 'venta', 'inventario', 'precio', 'descuento'
    ],
    suggestedPlatform: 'web',
    isHeadless: false,
    isStaticSite: false,
    languages: ['TypeScript', 'SQL'],
    frontendFramework: 'Next.js (App Router - Fullstack)',
    backendFramework: 'Node.js (Express)',
    database: 'PostgreSQL',
    connectionType: 'REST API (JSON)',
    architecturalPattern: 'MVC (Model-View-Controller)',
    style: 'minimalist_flat',
    styleFramework: 'Tailwind CSS v4 / v3',
    primaryColor: '#16A34A',
    secondaryColor: '#EA580C',
    darkModeDefault: false,
    typography: 'Inter, system-ui, sans-serif',
    writtenDesignNotes: '• Enfoque de catálogo limpio con tarjetas de producto de imagen grande y llamada a la acción clara ("Añadir al carrito").\n• Carrito deslizante (drawer) accesible sin abandonar la navegación actual.\n• Flujo de checkout sin distracciones en un máximo de 3 pasos.',
    customObservations: [
      'Las imágenes de productos deben optimizarse con carga perezosa y dimensiones fijas para evitar layout shifts.',
      'Badges claros de estado de inventario ("En stock", "Últimas unidades", "Agotado").',
    ],
    suggestedFunctionalRequirements: [
      'Catálogo navegable con búsqueda instantánea, filtrado por categorías, rango de precios y ordenamiento.',
      'Carrito de compras persistente con cálculo automático de subtotales, impuestos y costos de envío.',
      'Integración con pasarela de pagos (Stripe / MercadoPago) mediante webhooks verificados criptográficamente.',
      'Generación de comprobantes de compra digitales y envío automático de confirmaciones por correo.',
      'Panel de consulta de pedidos con historial de estados (Pendiente, Pagado, Enviado, Entregado).',
    ],
    suggestedNonFunctionalRequirements: [
      'Carga inicial del catálogo de productos en menos de 1 segundo (FCP < 1.0s).',
      'Cumplimiento con directrices PCI-DSS: nunca procesar ni almacenar números de tarjeta en servidores propios.',
      'Manejo de concurrencia e inventario atómico para prevenir ventas de productos agotados.',
    ],
    suggestedUserStories: [
      'Como cliente, quiero filtrar los productos por precio y categoría para encontrar rápidamente lo que necesito.',
      'Como comprador, quiero recibir una confirmación inmediata al pagar para tener constancia de mi compra.',
    ],
    suggestedADRs: [
      {
        title: 'Procesamiento de Pagos Desacoplado con Webhooks Idempotentes',
        context: 'Se requiere procesar transacciones financieras sin riesgo de dobles cobros ni almacenamiento de tarjetas.',
        decision: 'Delegar la captura a Stripe Elements y actualizar el estado de órdenes mediante webhooks con firma HMAC e idempotencia.',
        consequences: 'Cero responsabilidad sobre datos de tarjetas bancarias y resiliencia ante cortes de conexión.',
        discardedAlternatives: 'Procesamiento directo de tarjetas en el backend de la aplicación.',
      },
    ],
    customRules: [
      'Las mutaciones de inventario deben ejecutarse dentro de transacciones SQL atómicas con bloqueos pesimistas u optimistas.',
      'Todos los precios y cálculos monetarios deben almacenarse en enteros (centavos) para evitar errores de coma flotante.',
    ],
    customSecurityPolicies: [
      'Verificación obligatoria de la firma secreta del webhook de pagos antes de procesar.',
      'Rate limiting estricto en el endpoint de checkout para evitar ataques de carding.',
    ],
    masterPromptTone: 'strict_senior',
  },

  // 5. SITIO WEB ESTÁTICO, BLOG O PORTAFOLIO EDITORIAL (JAMSTACK / SSG)
  static_blog: {
    id: 'static_blog',
    name: 'Sitio Web Estático, Blog o Documentación Jamstack',
    tag: 'Astro SSG / Jamstack (Sin BD)',
    description: 'Sitio web ultra-rápido basado en archivos Markdown/MDX, optimizado para posicionamiento en motores de búsqueda (SEO) y coste $0 en servidores.',
    keywords: [
      'blog', 'sitio estatico', 'landing', 'landing page', 'portafolio', 'portfolio', 'documentacion',
      'docs', 'jamstack', 'ssg', 'astro', 'markdown', 'mdx', 'seo', 'articulos', 'estatico'
    ],
    suggestedPlatform: 'static',
    isHeadless: false,
    isStaticSite: true,
    languages: ['TypeScript', 'HTML5 / CSS3'],
    frontendFramework: 'Astro (SSG / Islands Architecture)',
    backendFramework: 'Ninguno (Solo Frontend Estático / Jamstack)',
    database: 'Archivos Locales (Markdown / MDX / JSON)',
    connectionType: 'Archivos Estáticos Locales (Markdown / MDX / JSON)',
    architecturalPattern: 'SSG (Static Site Generation / Jamstack)',
    style: 'swiss_editorial',
    styleFramework: 'Tailwind CSS v4 / v3',
    primaryColor: '#0F172A',
    secondaryColor: '#475569',
    darkModeDefault: false,
    typography: 'Playfair Display & Source Sans 3',
    writtenDesignNotes: '• Tipografía editorial de alta legibilidad con excelente ritmo vertical y espaciado de lectura confortable.\n• Marcado semántico HTML5 accesible y metadatos Open Graph completos para previsualizaciones en redes sociales.\n• Cero JavaScript invasivo en el cliente; hidratación diferida únicamente para componentes interactivos necesarios.',
    customObservations: [
      'Tiempo de lectura estimado y fecha de publicación formateada en cada artículo.',
      'Buscador client-side ultra-ligero con indexación estática (Pagefind).',
    ],
    suggestedFunctionalRequirements: [
      'Generación estática completa en compilación (SSG) de todas las rutas y artículos Markdown/MDX.',
      'Colecciones de contenido tipadas y validadas con esquemas Zod en tiempo de build.',
      'Generación automática de sitemap.xml, archivo robots.txt y feed RSS para lectores de noticias.',
      'Optimizador de imágenes integrado que genere formatos modernos AVIF y WebP automáticamente.',
      'Conmutador de tema claro/oscuro persistente en LocalStorage sin salto visual (FOUC).',
    ],
    suggestedNonFunctionalRequirements: [
      'Puntuación de Google Lighthouse de 100/100 en Rendimiento, Accesibilidad, SEO y Mejores Prácticas.',
      'Time to First Byte (TTFB) inferior a 50ms servido desde nodos CDN globales en Edge.',
      'Cero dependencias de servidores backend ni bases de datos activas en runtime.',
    ],
    suggestedUserStories: [
      'Como lector, quiero que los artículos carguen al instante incluso con conexiones móviles lentas.',
      'Como autor, quiero redactar contenido en Markdown con frontmatter estructurado sin tocar código de maquetación.',
    ],
    suggestedADRs: [
      {
        title: 'Arquitectura de Islas con Astro para Cero JS por Defecto',
        context: 'Se busca máxima velocidad de carga y posicionamiento SEO con contenido estático.',
        decision: 'Adoptar Astro con Static Site Generation y Content Collections.',
        consequences: 'Eliminación del 90% del JavaScript enviado al cliente y compilación determinista.',
        discardedAlternatives: 'Single Page Application (React SPA) pesada que retrasa el First Contentful Paint.',
      },
    ],
    customRules: [
      'Prohibido usar client:load a menos que el componente sea estrictamente crítico para el hero visual.',
      'Todo contenido editorial debe residir en archivos Markdown con frontmatter validado.',
    ],
    customSecurityPolicies: [
      'Configurar cabeceras de Content-Security-Policy (CSP) estrictas en el proveedor de hosting CDN.',
      'Impenetrable a inyecciones SQL o exploits de servidor dinámico por naturaleza estática.',
    ],
    masterPromptTone: 'minimalist_concise',
  },

  // 6. APLICACIÓN MÓVIL NATIVA O HÍBRIDA (OFFLINE-FIRST)
  mobile_app: {
    id: 'mobile_app',
    name: 'Aplicación Móvil Nativa / Híbrida (iOS & Android)',
    tag: 'React Native / Expo + Offline',
    description: 'App para smartphones y tablets con soporte offline, almacenamiento local cifrado, notificaciones push y gestos táctiles.',
    keywords: [
      'movil', 'mobile', 'app movil', 'ios', 'android', 'react native', 'expo', 'flutter',
      'smartphone', 'tactil', 'offline', 'sensores', 'camara', 'notificaciones push'
    ],
    suggestedPlatform: 'mobile',
    isHeadless: false,
    isStaticSite: false,
    languages: ['TypeScript'],
    frontendFramework: 'React Native / Expo',
    backendFramework: 'FastAPI (Python)',
    database: 'SQLite / Turso',
    connectionType: 'REST API (JSON)',
    architecturalPattern: 'MVVM (Model-View-ViewModel)',
    style: 'cupertino_ios',
    styleFramework: 'Tailwind CSS v4 / v3',
    primaryColor: '#007AFF',
    secondaryColor: '#5856D6',
    darkModeDefault: false,
    typography: 'System Font (San Francisco / Roboto)',
    writtenDesignNotes: '• Componentes táctiles adaptados con áreas de toque mínimas de 44x44 px.\n• Soporte nativo de gestos táctiles (swipe para borrar, pull to refresh, modales de hoja inferior).\n• Adaptación respetuosa a notches, islas dinámicas y barras de navegación del sistema operativo.',
    customObservations: [
      'Estados de carga con esqueletos visuales (skeletons) y retroalimentación háptica en botones de acción.',
      'Sincronización suave en segundo plano cuando se restablece la conexión a internet.',
    ],
    suggestedFunctionalRequirements: [
      'Navegación fluida por pilas nativas, pestañas inferiores (tab bar) y modales.',
      'Modo Offline-First con persistencia local en SQLite cifrada y sincronización en segundo plano.',
      'Autenticación biométrica (Face ID / Huella dactilar) con almacenamiento seguro en Keychain/Keystore.',
      'Recepción y gestión de notificaciones push locales y remotas.',
      'Captura e integración de fotos o documentos mediante la cámara del dispositivo con compresión local.',
    ],
    suggestedNonFunctionalRequirements: [
      'Tasa de refresco constante de 60 FPS en animaciones y transiciones de pantalla.',
      'Consumo optimizado de batería y memoria RAM en segundo plano.',
      'Tamaño de binario optimizado para descargas rápidas en tiendas de aplicaciones.',
    ],
    suggestedUserStories: [
      'Como usuario móvil, quiero acceder a mis datos guardados aunque esté en modo avión sin conexión a internet.',
      'Como usuario, quiero autenticarme con mi huella dactilar en un solo toque sin escribir mi contraseña cada vez.',
    ],
    suggestedADRs: [
      {
        title: 'Adopción de Expo y React Native con Almacenamiento Local',
        context: 'Se requiere publicar para iOS y Android con una base de código unificada y soporte offline.',
        decision: 'Utilizar React Native con Expo Router y SQLite local.',
        consequences: 'Desarrollo acelerado, acceso nativo a APIs del dispositivo y compatibilidad multiplataforma.',
        discardedAlternatives: 'Desarrollo nativo duplicado por separado en Swift y Kotlin.',
      },
    ],
    customRules: [
      'Nunca realizar bloqueos síncronos en el hilo principal de renderizado de la UI.',
      'Manejar siempre los estados de desconexión de red de forma transparente para el usuario.',
    ],
    customSecurityPolicies: [
      'Guardar tokens JWT y claves privadas exclusivamente en SecureStore (Keychain en iOS / KeyStore en Android).',
      'Implementar SSL Pinning en peticiones de red críticas.',
    ],
    masterPromptTone: 'collaborative_expert',
  },

  // 7. SISTEMA DE GESTIÓN, INVENTARIO, FACTURACIÓN & POS
  erp_inventory: {
    id: 'erp_inventory',
    name: 'Sistema de Gestión, Inventario, Facturación & POS',
    tag: 'PostgreSQL + Transacciones ACID',
    description: 'Software de gestión comercial para control de inventario, registro de ventas, emisión de facturas y trazabilidad de productos.',
    keywords: [
      'inventario', 'gestion', 'erp', 'pos', 'facturacion', 'caja', 'ventas', 'compras',
      'proveedores', 'stock', 'almacen', 'bodega', 'codigo de barras', 'recibo', 'ticket'
    ],
    suggestedPlatform: 'web',
    isHeadless: false,
    isStaticSite: false,
    languages: ['TypeScript', 'SQL'],
    frontendFramework: 'React (Vite)',
    backendFramework: 'Node.js (NestJS)',
    database: 'PostgreSQL',
    connectionType: 'REST API (JSON)',
    architecturalPattern: 'Clean Architecture (Domain-Driven / Use Cases)',
    style: 'swiss_editorial',
    styleFramework: 'Tailwind CSS v4 / v3',
    primaryColor: '#047857',
    secondaryColor: '#D97706',
    darkModeDefault: false,
    typography: 'Inter & JetBrains Mono',
    writtenDesignNotes: '• Interfaz de alta densidad de datos optimizada para teclado y lector de código de barras.\n• Accesos rápidos con teclas de función (ej. F2 buscar producto, F4 cobrar).\n• Modales rápidos de confirmación para evitar cierres accidentales de caja.',
    customObservations: [
      'Tablas de datos compactas con ordenamiento instantáneo y exportación directa a Excel.',
      'Alertas visuales claras en color naranja/rojo para productos que alcancen el stock mínimo de seguridad.',
    ],
    suggestedFunctionalRequirements: [
      'Control de catálogo de productos con código de barras, SKU, categorías, costos y precios con cálculo de márgenes.',
      'Registro de compras y entradas a almacén con actualización automática de stock y costos promedio.',
      'Módulo de punto de venta (POS) para emisión de tickets y facturas con múltiples métodos de pago.',
      'Alertas automáticas de existencias mínimas y productos por vencer.',
      'Cierre de caja diario (arqueo de caja) con desglose de ventas por método de pago y reporte de descuadres.',
    ],
    suggestedNonFunctionalRequirements: [
      'Garantía absoluta de consistencia transaccional (ACID): cero discrepancias en saldos de inventario.',
      'Impresión de tickets térmicos en menos de 500ms tras confirmar la venta.',
      'Copia de seguridad (backup) automatizada diaria con retención programada.',
    ],
    suggestedUserStories: [
      'Como cajero, quiero escanear productos con código de barras para cobrar rápidamente sin buscar manualmente.',
      'Como encargado de compras, quiero un reporte de productos bajo stock mínimo para emitir órdenes a proveedores a tiempo.',
    ],
    suggestedADRs: [
      {
        title: 'Transacciones Aisladas en PostgreSQL con Bloqueo de Filas (SELECT FOR UPDATE)',
        context: 'En un punto de venta con múltiples terminales, dos cajeros pueden intentar vender la última unidad al mismo tiempo.',
        decision: 'Ejecutar transacciones de venta con bloqueo de filas sobre el inventario disponible.',
        consequences: 'Eliminación total del riesgo de sobreventa (overselling) o inventarios negativos.',
        discardedAlternatives: 'Actualizaciones optimistas sin bloqueo en bases de datos no transaccionales.',
      },
    ],
    customRules: [
      'Prohibido permitir movimientos de stock sin un registro de auditoría (kardex) asociado.',
      'Todos los montos monetarios deben procesarse con tipos Decimal de precisión exacta.',
    ],
    customSecurityPolicies: [
      'Autenticación individual por cajero con registro de fecha, hora y terminal en cada transacción.',
      'Separación de privilegios: solo administradores pueden anular ventas o aplicar descuentos mayores.',
    ],
    masterPromptTone: 'strict_senior',
  },

  // 8. TIEMPO REAL, CHAT & HERRAMIENTAS COLABORATIVAS
  realtime_chat: {
    id: 'realtime_chat',
    name: 'Chat en Tiempo Real & Herramientas Colaborativas',
    tag: 'WebSockets + Redis / Socket.io',
    description: 'Aplicación de mensajería instantánea, salas de chat, presencia de usuarios online y sincronización colaborativa en vivo.',
    keywords: [
      'chat', 'mensajeria', 'tiempo real', 'realtime', 'websockets', 'socket', 'socket.io',
      'mensajes', 'presencia', 'colaboracion', 'canales', 'conversacion', 'notificaciones en vivo'
    ],
    suggestedPlatform: 'web',
    isHeadless: false,
    isStaticSite: false,
    languages: ['TypeScript'],
    frontendFramework: 'React (Vite)',
    backendFramework: 'Node.js (Express)',
    database: 'Redis (Cache / KV)',
    connectionType: 'WebSockets (Tiempo Real / Socket.io)',
    architecturalPattern: 'Microservicios Event-Driven',
    style: 'glassmorphism',
    styleFramework: 'Tailwind CSS v4 / v3',
    primaryColor: '#6366F1',
    secondaryColor: '#EC4899',
    darkModeDefault: true,
    typography: 'Inter, system-ui, sans-serif',
    writtenDesignNotes: '• Lista de canales a la izquierda, conversación activa al centro y panel de participantes a la derecha.\n• Burbujas de mensajes con diferenciación clara entre emisor y receptor.\n• Indicador de escritura en vivo ("Usuario está escribiendo...") y confirmaciones de lectura.',
    customObservations: [
      'Scroll automático suave al recibir mensajes nuevos, con botón flotante para saltar al final si se hace scroll hacia arriba.',
      'Carga paginada infinita de historial de mensajes al hacer scroll hacia el pasado.',
    ],
    suggestedFunctionalRequirements: [
      'Conexión WebSocket persistente con autenticación por token y reconexión automática transparente.',
      'Envío y recepción instantánea de mensajes de texto, emojis y archivos multimedia.',
      'Indicadores de presencia en vivo (Online, Ausente, Desconectado) e indicador de digitación.',
      'Gestión de canales públicos, canales privados y mensajes directos 1 a 1.',
      'Almacenamiento y sincronización de mensajes no leídos con contador de insignias.',
    ],
    suggestedNonFunctionalRequirements: [
      'Latencia de entrega de mensajes inferior a 100ms entre clientes activos.',
      'Escalabilidad horizontal mediante Redis Pub/Sub para distribuir eventos entre múltiples instancias de servidor.',
      'Uso eficiente de memoria en el navegador limitando el DOM de mensajes renderizados.',
    ],
    suggestedUserStories: [
      'Como usuario del chat, quiero ver si la otra persona está escribiendo para no enviar mensajes cruzados.',
      'Como participante, quiero recibir notificaciones instantáneas de mensajes nuevos aunque esté en otra pestaña.',
    ],
    suggestedADRs: [
      {
        title: 'Arquitectura de Mensajería Bidireccional con WebSockets y Redis Pub/Sub',
        context: 'Se requiere baja latencia y sincronización instantánea sin sobrecargar el servidor con sondeo HTTP continuo (polling).',
        decision: 'Implementar WebSockets con Socket.io respaldado por Redis Adapter para escalabilidad horizontal.',
        consequences: 'Conexión bidireccional continua con latencia de milisegundos y soporte para múltiples réplicas.',
        discardedAlternatives: 'Short polling o Long polling HTTP tradicional (ineficiente y saturador de conexiones).',
      },
    ],
    customRules: [
      'Sanitizar obligatoriamente el contenido de todos los mensajes antes de emitirlos para evitar inyecciones XSS.',
      'Gestionar la limpieza de listeners de WebSockets en el desmontaje de componentes para evitar fugas de memoria.',
    ],
    customSecurityPolicies: [
      'Autenticar la conexión inicial del WebSocket validando el token de sesión en el handshake.',
      'Rate limiting de emisión de mensajes para prevenir spam o ataques de denegación de servicio.',
    ],
    masterPromptTone: 'collaborative_expert',
  },

  // 9. SISTEMA DE CITAS, RESERVAS MÉDICAS / SERVICIOS & CALENDARIO
  booking_health: {
    id: 'booking_health',
    name: 'Sistema de Citas, Reservas Médicas / Servicios & Calendario',
    tag: 'Reservas / Calendario / Turnos',
    description: 'Plataforma para agendamiento de turnos, gestión de agendas de profesionales, confirmación por SMS/Email y prevención de solapamientos.',
    keywords: [
      'citas', 'reservas', 'reserva', 'turnos', 'calendario', 'agenda', 'medico', 'clinica',
      'pacientes', 'horarios', 'disponibilidad', 'servicios', 'doctor', 'peluqueria', 'consultorio'
    ],
    suggestedPlatform: 'web',
    isHeadless: false,
    isStaticSite: false,
    languages: ['TypeScript', 'SQL'],
    frontendFramework: 'Next.js (App Router - Fullstack)',
    backendFramework: 'Node.js (NestJS)',
    database: 'PostgreSQL',
    connectionType: 'REST API (JSON)',
    architecturalPattern: 'Clean Architecture (Domain-Driven / Use Cases)',
    style: 'minimalist_flat',
    styleFramework: 'Tailwind CSS v4 / v3',
    primaryColor: '#0284C7',
    secondaryColor: '#10B981',
    darkModeDefault: false,
    typography: 'Inter, system-ui, sans-serif',
    writtenDesignNotes: '• Vista de calendario mensual y semanal limpia con bloques horarios claramente diferenciados.\n• Selector interactivo de fecha y hora que deshabilite automáticamente franjas no disponibles.\n• Formulario de confirmación de reserva en un solo modal con resumen de costos y políticas de cancelación.',
    customObservations: [
      'Indicadores de color por estado de cita (Pendiente = amarillo, Confirmada = verde, Cancelada = gris).',
      'Avisos visuales claros de zona horaria local.',
    ],
    suggestedFunctionalRequirements: [
      'Definición de horarios de atención, descansos y duración por servicio o profesional.',
      'Flujo de reserva interactivo para clientes con selección de servicio, fecha y hora disponible.',
      'Prevención estricta de doble reserva (double booking) mediante transacciones atómicas.',
      'Envío automático de notificaciones de confirmación y recordatorios antes de la cita.',
      'Panel del profesional para visualizar su agenda del día, marcar asistencia o reagendar.',
    ],
    suggestedNonFunctionalRequirements: [
      'Cálculo de slots disponibles en menos de 100ms considerando reservas existentes.',
      'Manejo estricto de zonas horarias en formato UTC con conversión local en cliente.',
      'Privacidad médica y protección de datos conforme a regulaciones vigentes.',
    ],
    suggestedUserStories: [
      'Como paciente, quiero elegir el horario que mejor me convenga viendo solo los turnos libres reales.',
      'Como profesional, quiero bloquear días u horas específicas de mi agenda sin afectar las citas ya pactadas.',
    ],
    suggestedADRs: [
      {
        title: 'Restricción de Exclusión de Rangos Temporales en PostgreSQL (tsrange)',
        context: 'Se debe impedir absolutamente que dos clientes agenden al mismo profesional a la misma hora.',
        decision: 'Utilizar el tipo tsrange con restricción EXCLUDE USING GIST en PostgreSQL para solapamientos de tiempo.',
        consequences: 'Imposibilidad matemática de crear citas solapadas a nivel de motor de base de datos.',
        discardedAlternatives: 'Validaciones puramente en código de backend susceptibles a condiciones de carrera concurrentes.',
      },
    ],
    customRules: [
      'Todas las fechas deben almacenarse en base de datos en formato UTC ISO 8601.',
      'Validar solapamientos de rango de tiempo antes de confirmar cualquier reserva.',
    ],
    customSecurityPolicies: [
      'Anonimizar o cifrar datos sensibles de salud o notas privadas de consulta.',
      'Enlaces de cancelación o reprogramación con tokens criptográficos de un solo uso.',
    ],
    masterPromptTone: 'architect_mentor',
  },

  // 10. PLATAFORMA EDUCATIVA, LMS & CURSOS ONLINE
  education_lms: {
    id: 'education_lms',
    name: 'Plataforma Educativa, Cursos Online & LMS',
    tag: 'Next.js + Video + Progreso',
    description: 'Portal de aprendizaje virtual con reproducción de lecciones en video, seguimiento de progreso, cuestionarios y emisión de certificados.',
    keywords: [
      'cursos', 'educacion', 'lms', 'estudiantes', 'lecciones', 'profesores', 'aprendizaje',
      'video', 'evaluaciones', 'quizzes', 'certificados', 'academia', 'escuela', 'alumnos'
    ],
    suggestedPlatform: 'web',
    isHeadless: false,
    isStaticSite: false,
    languages: ['TypeScript', 'SQL'],
    frontendFramework: 'Next.js (App Router - Fullstack)',
    backendFramework: 'Node.js (Express)',
    database: 'PostgreSQL',
    connectionType: 'REST API (JSON)',
    architecturalPattern: 'Capas Clásicas (Controller - Service - Repository)',
    style: 'bento_grid',
    styleFramework: 'Tailwind CSS v4 / v3',
    primaryColor: '#7C3AED',
    secondaryColor: '#06B6D4',
    darkModeDefault: false,
    typography: 'Plus Jakarta Sans & Fira Code',
    writtenDesignNotes: '• Reproductor de lecciones con índice de contenidos lateral colapsable y barra de progreso porcentual visible.\n• Módulos colapsables (acordeón) con iconos de estado (completado, en curso, bloqueado).\n• Vista de aula sin distracciones con modo cine para visualización de video.',
    customObservations: [
      'Marcadores automáticos de última lección vista para reanudar con un solo clic.',
      'Certificados de finalización exportables en PDF de alta fidelidad.',
    ],
    suggestedFunctionalRequirements: [
      'Estructura jerárquica de cursos: módulos, lecciones, recursos descargables y evaluaciones.',
      'Seguimiento automático de progreso por estudiante con actualización inmediata al completar cada lección.',
      'Módulo de cuestionarios interactivos con retroalimentación automática y límite de intentos.',
      'Generación automática de certificados digitales con código de verificación QR único.',
      'Panel de control del instructor para consultar métricas de finalización y estudiantes activos.',
    ],
    suggestedNonFunctionalRequirements: [
      'Streaming de video optimizado sin cortes con adaptación de calidad.',
      'Persistencia de la posición del reproductor en milisegundos para reanudar donde se dejó.',
      'Compatibilidad total con dispositivos móviles y tabletas.',
    ],
    suggestedUserStories: [
      'Como alumno, quiero marcar lecciones como completadas y ver mi porcentaje de avance en el curso.',
      'Como instructor, quiero ver qué lecciones tienen mayor tasa de abandono para mejorar el contenido.',
    ],
    suggestedADRs: [
      {
        title: 'Gestión de Progreso con Eventos Optimistas y Persistencia Batch',
        context: 'Los estudiantes avanzan frecuentemente entre lecciones cortas generando muchas escrituras.',
        decision: 'Actualizar la UI optimísticamente y consolidar el progreso en el backend con debounce.',
        consequences: 'Experiencia de usuario instantánea y menor sobrecarga en la base de datos.',
        discardedAlternatives: 'Bloquear la navegación del estudiante esperando confirmación de red.',
      },
    ],
    customRules: [
      'Validar que el estudiante cumpla el 100% de los requisitos antes de emitir un certificado.',
      'Nunca permitir descargas directas no autorizadas de videos de pago.',
    ],
    customSecurityPolicies: [
      'Firmar URLs de video con expiración corta (Signed URLs) para prevenir filtración de contenido protegido.',
      'Control de sesión única para evitar compartir credenciales entre múltiples personas simultáneamente.',
    ],
    masterPromptTone: 'collaborative_expert',
  },

  // 11. API REST / GRAPHQL PURA PARA MICROSERVICIOS (BACKEND PURO)
  api_backend: {
    id: 'api_backend',
    name: 'API REST / GraphQL Pura para Microservicios',
    tag: 'FastAPI / NestJS + Swagger',
    description: 'Servicio backend desacoplado de alto rendimiento con documentación Swagger/OpenAPI automática, autenticación JWT y contratos tipados.',
    keywords: [
      'api', 'backend', 'microservicio', 'rest', 'graphql', 'endpoints', 'servicio',
      'swagger', 'openapi', 'fastapi', 'nestjs', 'json', 'jwt', 'sin frontend'
    ],
    suggestedPlatform: 'headless',
    isHeadless: true,
    isStaticSite: false,
    languages: ['TypeScript', 'SQL'],
    frontendFramework: 'Ninguno (Sin Interfaz Gráfica / Script / CLI / Notebooks)',
    backendFramework: 'Node.js (NestJS)',
    database: 'PostgreSQL',
    connectionType: 'REST API (JSON)',
    architecturalPattern: 'Clean Architecture (Domain-Driven / Use Cases)',
    style: 'terminal_cli',
    styleFramework: 'Sin Interfaz Web (Gráficos Matplotlib / Seaborn / Plotly / Terminal)',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    darkModeDefault: true,
    typography: 'Geist Sans & Geist Mono',
    writtenDesignNotes: '• Este proyecto es un servicio de Backend / API puro sin interfaz web.\n• Toda la documentación interactiva debe exponerse en Swagger UI (/docs) y OpenAPI JSON.\n• Respuestas formateadas estrictamente bajo especificación JSON:API o RFC 7807 (Problem Details).',
    customObservations: [
      'Códigos de estado HTTP semánticos estrictos (200, 201, 204, 400, 401, 403, 404, 422, 500).',
      'Headers de trazabilidad X-Request-ID en cada respuesta para seguimiento de logs.',
    ],
    suggestedFunctionalRequirements: [
      'Diseño de endpoints RESTful o esquemas GraphQL con versionado de API (v1/v2).',
      'Generación automática de documentación Swagger / OpenAPI con modelos tipados y ejemplos interactivos.',
      'Autenticación mediante JWT stateless con rotación segura de Refresh Tokens.',
      'Filtros, paginación por cursor y ordenamiento en todas las listas de recursos.',
      'Middleware de salud (/health y /ready) para balanceadores de carga y Kubernetes.',
    ],
    suggestedNonFunctionalRequirements: [
      'Throughput superior a 5,000 req/sec con latencia p99 inferior a 50ms.',
      'Manejo global de excepciones sin fugas de stack traces en entornos de producción.',
      'Logs estructurados en formato JSON con niveles estándar para agregadores (Datadog / CloudWatch).',
    ],
    suggestedUserStories: [
      'Como desarrollador cliente, quiero probar los endpoints desde Swagger UI para integrar mi aplicación sin adivinar parámetros.',
      'Como devops, quiero consultar el endpoint /health para automatizar el reinicio de instancias con fallos.',
    ],
    suggestedADRs: [
      {
        title: 'Arquitectura Limpia con DTOs y Validación de Entrada en Frontera',
        context: 'Se requiere una API extensible que no filtre detalles de base de datos a los clientes.',
        decision: 'Aislar las entidades de dominio de los DTOs de transporte con validación class-validator.',
        consequences: 'Protección absoluta contra asignación masiva y contratos de API estables.',
        discardedAlternatives: 'Retornar directamente entidades de base de datos en controladores.',
      },
    ],
    customRules: [
      'Validar el 100% de los DTOs entrantes rechazando propiedades no declaradas (whitelist: true).',
      'Todo endpoint debe tener pruebas de integración automatizadas con Supertest o Pytest.',
    ],
    customSecurityPolicies: [
      'Helmet activado, CORS restringido a orígenes autorizados y Rate Limiting por IP/Token.',
      'Cifrado de datos sensibles en reposo y en tránsito (TLS obligatorio).',
    ],
    masterPromptTone: 'strict_senior',
  },

  // 12. APLICACIÓN DE INTELIGENCIA ARTIFICIAL, RAG & AGENTES
  ai_chatbot: {
    id: 'ai_chatbot',
    name: 'Aplicación de Inteligencia Artificial, RAG & Agentes',
    tag: 'Python / LangChain + Vector DB',
    description: 'Sistema inteligente con procesamiento de lenguaje natural, recuperación aumentada de información (RAG), embeddings y asistentes conversacionales.',
    keywords: [
      'ia', 'inteligencia artificial', 'ai', 'chatbot', 'llm', 'rag', 'embeddings',
      'vector', 'langchain', 'openai', 'gemini', 'groq', 'agente', 'prompt', 'semantica'
    ],
    suggestedPlatform: 'web',
    isHeadless: false,
    isStaticSite: false,
    languages: ['Python', 'TypeScript'],
    frontendFramework: 'React (Vite)',
    backendFramework: 'FastAPI (Python)',
    database: 'PostgreSQL',
    connectionType: 'Server-Sent Events (SSE)',
    architecturalPattern: 'Clean Architecture (Domain-Driven / Use Cases)',
    style: 'dark_tech',
    styleFramework: 'Tailwind CSS v4 / v3',
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    darkModeDefault: true,
    typography: 'Geist Sans & Geist Mono',
    writtenDesignNotes: '• Interfaz conversacional limpia con streaming de texto palabra por palabra en tiempo real (efecto máquina de escribir).\n• Renderizado de respuestas ricas con Markdown formateado, bloques de código con botón de copiar y fórmulas matemáticas LaTeX.\n• Citas y fuentes referenciadas visibles en tarjetas colapsables al pie de cada respuesta.',
    customObservations: [
      'Burbujas de mensaje diferenciadas y estado de pensamiento del agente ("Analizando documentos...").',
      'Botones de retroalimentación (pulgar arriba / abajo) y reintentar respuesta.',
    ],
    suggestedFunctionalRequirements: [
      'Streaming de respuestas en tiempo real mediante Server-Sent Events (SSE).',
      'Pipeline de ingesta de documentos (PDF, DOCX, TXT) con particionado en chunks y generación de embeddings vectoriales.',
      'Búsqueda semántica por similitud de coseno en base de datos vectorial (pgvector / Chroma).',
      'Gestión de memoria conversacional para mantener el contexto de los últimos turnos de diálogo.',
      'Sistema de evaluación de respuestas y mitigación de alucinaciones con prompt guardrails.',
    ],
    suggestedNonFunctionalRequirements: [
      'Latencia de primer token emitido (Time to First Token) inferior a 800ms.',
      'Manejo robusto de límites de cuota de API (rate limit) con fallback automático entre modelos.',
      'Control de costos y auditoría de tokens consumidos por usuario.',
    ],
    suggestedUserStories: [
      'Como usuario, quiero ver cómo la IA va escribiendo su respuesta en vivo para no esperar segundos frente a una pantalla congelada.',
      'Como investigador, quiero ver las fuentes exactas de las que el asistente extrajo la información para validar su veracidad.',
    ],
    suggestedADRs: [
      {
        title: 'Búsqueda Vectorial Integrada con PostgreSQL y Extensión pgvector',
        context: 'Se requiere almacenar metadatos relacionales junto a los vectores de embeddings de documentos sin añadir otro servicio de base de datos.',
        decision: 'Utilizar pgvector sobre la misma instancia de PostgreSQL del proyecto.',
        consequences: 'Consultas híbridas (vectoriales + filtros relacionales) en una sola base de datos transaccional.',
        discardedAlternatives: 'Instalar una base de datos vectorial separada (aumenta costes y complejidad de sincronización).',
      },
    ],
    customRules: [
      'Sanitizar las entradas del usuario antes de concatenarlas en los prompts para evitar inyecciones de prompt (Prompt Injection).',
      'Estructurar las salidas de los agentes con validación de esquemas JSON (Pydantic / Zod).',
    ],
    customSecurityPolicies: [
      'Cero almacenamiento de claves de API de LLM en el cliente frontend; todas las llamadas deben pasar por el backend.',
      'Filtrado de datos personales o credenciales antes de enviar prompts a proveedores externos.',
    ],
    masterPromptTone: 'architect_mentor',
  },

  // 13. RED SOCIAL, COMUNIDAD & FEED DE CONTENIDOS
  social_community: {
    id: 'social_community',
    name: 'Red Social, Foro Comunitario & Feed Interactivo',
    tag: 'Next.js + Feed + Multimedia',
    description: 'Plataforma comunitaria con muro de publicaciones, sistema de votos/likes, comentarios anidados, perfiles de usuario y menciones.',
    keywords: [
      'red social', 'comunidad', 'foro', 'feed', 'muro', 'publicaciones', 'posts', 'likes',
      'comentarios', 'perfiles', 'seguidores', 'menciones', 'notificaciones', 'amigos'
    ],
    suggestedPlatform: 'web',
    isHeadless: false,
    isStaticSite: false,
    languages: ['TypeScript', 'SQL'],
    frontendFramework: 'Next.js (App Router - Fullstack)',
    backendFramework: 'Node.js (NestJS)',
    database: 'PostgreSQL',
    connectionType: 'REST API (JSON)',
    architecturalPattern: 'Capas Clásicas (Controller - Service - Repository)',
    style: 'bento_grid',
    styleFramework: 'Tailwind CSS v4 / v3',
    primaryColor: '#3B82F6',
    secondaryColor: '#EF4444',
    darkModeDefault: false,
    typography: 'Inter, system-ui, sans-serif',
    writtenDesignNotes: '• Feed central de publicaciones con desplazamiento infinito fluido y tarjetas de interacción inmediata.\n• Barra lateral derecha con tendencias, temas destacados y usuarios sugeridos.\n• Modales ligeros para creación de posts con soporte de previsualización de enlaces y carga de fotos.',
    customObservations: [
      'Mutaciones optimistas inmediatas al dar like o guardar publicación sin esperar confirmación del servidor.',
      'Estructura de comentarios anidados con líneas de guía visuales para facilitar lectura de hilos.',
    ],
    suggestedFunctionalRequirements: [
      'Feed de publicaciones con ordenamiento algorítmico (Más recientes, Populares, Siguiendo).',
      'Creación de publicaciones con texto enriquecido, menciones de usuarios (@usuario) y hashtags (#tema).',
      'Sistema de reacciones (likes/votos) y comentarios con respuestas anidadas en árbol.',
      'Perfiles de usuario personalizables con biografía, foto de avatar y pestañas de actividad.',
      'Centro de notificaciones en tiempo real sobre menciones, likes y nuevos comentarios.',
    ],
    suggestedNonFunctionalRequirements: [
      'Renderizado del feed en menos de 1 segundo con paginación por cursor infinita.',
      'Optimización de imágenes subidas por usuarios con redimensionamiento automático en múltiples resoluciones.',
      'Protección contra spam y abuso mediante algoritmos de limitación de tasa.',
    ],
    suggestedUserStories: [
      'Como usuario de la comunidad, quiero responder a un comentario específico dentro de un hilo para mantener ordenada la conversación.',
      'Como creador, quiero recibir una notificación inmediata cuando alguien comente mi publicación.',
    ],
    suggestedADRs: [
      {
        title: 'Paginación por Cursor para Feeds de Datos en Tiempo Real',
        context: 'En un feed activo donde entran publicaciones constantemente, la paginación tradicional (OFFSET/LIMIT) produce duplicados o saltos de publicaciones.',
        decision: 'Implementar paginación por cursor basada en timestamp e ID de publicación.',
        consequences: 'Navegación estable sin duplicaciones y consultas SQL ultra-rápidas indexadas.',
        discardedAlternatives: 'Paginación por OFFSET (se vuelve lenta con millones de registros y rompe el feed dinámico).',
      },
    ],
    customRules: [
      'Sanitizar y escapar todo contenido HTML generado por el usuario con librerías comprobadas (DOMPurify).',
      'Usar mutaciones optimistas en el frontend acompañadas de rollback si falla la red.',
    ],
    customSecurityPolicies: [
      'Validar tipos MIME reales y tamaño de archivo en todas las subidas de imágenes.',
      'Moderar automáticamente contenido con filtros de palabras prohibidas o reporte de usuarios.',
    ],
    masterPromptTone: 'collaborative_expert',
  },

  // 14. FINANZAS PERSONALES, CONTROL DE GASTOS & CRIPTO
  fintech_crypto: {
    id: 'fintech_crypto',
    name: 'Finanzas Personales, Control de Gastos & Cripto',
    tag: 'Next.js + Gráficos Financieros + SQL',
    description: 'Gestor financiero personal con seguimiento de ingresos/gastos, presupuestos por categoría, cálculo de patrimonio neto y gráficos de evolución.',
    keywords: [
      'finanzas', 'gastos', 'ingresos', 'presupuesto', 'dinero', 'billetera', 'patrimonio',
      'ahorro', 'inversiones', 'cripto', 'criptomonedas', 'cartera', 'transacciones', 'fintech'
    ],
    suggestedPlatform: 'web',
    isHeadless: false,
    isStaticSite: false,
    languages: ['TypeScript', 'SQL'],
    frontendFramework: 'Next.js (App Router - Fullstack)',
    backendFramework: 'Node.js (NestJS)',
    database: 'PostgreSQL',
    connectionType: 'REST API (JSON)',
    architecturalPattern: 'Clean Architecture (Domain-Driven / Use Cases)',
    style: 'swiss_editorial',
    styleFramework: 'Tailwind CSS v4 / v3',
    primaryColor: '#059669',
    secondaryColor: '#D97706',
    darkModeDefault: true,
    typography: 'Inter & JetBrains Mono',
    writtenDesignNotes: '• Visualización de balances principales en tipografía monoespaciada grande con selector de privacidad (ocultar saldos con asteriscos).\n• Gráficos de dona/torta para desglose de gastos por categoría y gráficos de área para evolución patrimonial.\n• Diferenciación cromática estricta: verde para ingresos, rojo para egresos y neutro para transferencias internas.',
    customObservations: [
      'Formulario rápido de inserción de transacciones accesible con atajo de teclado en cualquier pantalla.',
      'Soporte multimoneda con conversión visual de tipo de cambio.',
    ],
    suggestedFunctionalRequirements: [
      'Registro categorizado de transacciones (ingresos, gastos fijos/variables, transferencias entre cuentas).',
      'Definición de presupuestos mensuales por categoría con barra de progreso y alertas de sobregasto.',
      'Módulo de gráficos financieros: flujo de caja mensual, distribución de gastos y proyección de ahorros.',
      'Gestión de múltiples cuentas o billeteras (banco, efectivo, ahorros, inversiones).',
      'Exportación completa de movimientos contables a hojas de cálculo en formato Excel y CSV.',
    ],
    suggestedNonFunctionalRequirements: [
      'Precisión matemática absoluta en todos los balances (cero inconsistencias de centavos).',
      'Bloqueo automático de pantalla por inactividad tras 5 minutos.',
      'Cumplimiento de estándares de privacidad bancaria sin venta ni compartición de datos financieros.',
    ],
    suggestedUserStories: [
      'Como usuario, quiero ver un gráfico claro de mis gastos del mes para identificar en qué categoría estoy gastando de más.',
      'Como ahorrador, quiero fijar un presupuesto máximo para ocio y recibir una alerta cuando alcance el 80% del límite.',
    ],
    suggestedADRs: [
      {
        title: 'Manejo de Monedas con Tipo NUMERIC(15,2) y Principio de Partida Doble',
        context: 'Los cálculos financieros no pueden sufrir errores de aproximación por coma flotante (IEEE 754).',
        decision: 'Almacenar valores monetarios en tipo NUMERIC de PostgreSQL y modelar transacciones con cuentas de origen y destino.',
        consequences: 'Integridad contable estricta y cuadre exacto de balances.',
        discardedAlternatives: 'Usar tipo float o number nativo de JavaScript para cálculos financieros.',
      },
    ],
    customRules: [
      'Prohibido realizar redondeos prematuros durante la sumatoria de partidas financieras.',
      'Todas las transacciones financieras deben ser inmutables una vez confirmadas (para correcciones, crear contra-asiento).',
    ],
    customSecurityPolicies: [
      'Cifrado en base de datos para balances y números de cuenta.',
      'Cierre automático de sesión y requerimiento de re-autenticación para operaciones críticas.',
    ],
    masterPromptTone: 'strict_senior',
  },
};

