import type { GeneratedFiles, LibretoProject } from '../types/libreto';
import { ANIMATION_LIBRARIES, DESIGN_STYLES, ICON_LIBRARIES } from '../constants/options';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 1. PRD.md - Product Requirements Document & Prompt Maestro
 */
export function generatePRD(p: LibretoProject): string {
  const toneDescriptions: Record<string, string> = {
    strict_senior: 'Desarrollador Senior Riguroso: Código limpio, tipado estricto, sin atajos, alta resiliencia y validación defensiva.',
    collaborative_expert: 'Experto Colaborativo: Explicaciones claras, enfoque paso a paso, comunicación proactiva y sugerencias fundamentadas.',
    architect_mentor: 'Arquitecto y Mentor: Enfoque en escalabilidad a largo plazo, patrones de diseño de software y decisiones bien documentadas.',
    minimalist_concise: 'Pragmático y Conciso: Código conciso y directo al grano, sin explicaciones redundantes, máxima eficiencia.',
  };

  const reqList = p.prd.functionalRequirements.length > 0
    ? p.prd.functionalRequirements.map((r, i) => `${i + 1}. **${r}**`).join('\n')
    : '1. Requerimientos funcionales en definición.';

  const nonFuncList = p.prd.nonFunctionalRequirements.length > 0
    ? p.prd.nonFunctionalRequirements.map((r) => `- ${r}`).join('\n')
    : '- Rendimiento óptimo y alta disponibilidad.';

  const storiesList = p.prd.userStories.length > 0
    ? p.prd.userStories.map((s) => `> - *${s}*`).join('\n')
    : '> - *Como usuario, quiero una experiencia fluida y consistente.*';

  return `# PRD & PROMPT MAESTRO: ${p.name.toUpperCase()}

> **Versión:** ${p.version} | **Fecha de Emisión:** ${new Date(p.createdAt).toLocaleDateString()} | **Última Actualización:** ${new Date(p.updatedAt).toLocaleDateString()}
> **Público Objetivo:** ${p.targetAudience}

---

## 1. RESUMEN EJECUTIVO DEL PRODUCTO
${p.description}

---

## 2. REQUERIMIENTOS FUNCIONALES CLAVE (MVP)
${reqList}

---

## 3. REQUERIMIENTOS NO FUNCIONALES (NFR)
${nonFuncList}

---

## 4. HISTORIAS DE USUARIO PRINCIPALES
${storiesList}

---

## 5. PROMPT MAESTRO DE INICIALIZACIÓN PARA EL ASISTENTE IA

\`\`\`markdown
### INSTRUCCIONES DE IDENTIDAD Y MISIÓN PARA EL ASISTENTE IA

Actúa como el **Desarrollador Principal y Arquitecto de Software Senior** responsable del proyecto "${p.name}".

#### CONTEXTO Y MISIÓN:
- **Producto:** ${p.name} (${p.description})
- **Plataforma:** ${p.architecture.platform.toUpperCase()}
- **Stack:** ${p.architecture.frontendFramework} | ${p.architecture.backendFramework} | ${p.architecture.database}
- **Estilo de Interfaz:** ${p.design.style} (${p.design.styleFramework})
- **Tono Operativo:** ${toneDescriptions[p.prd.masterPromptTone] || toneDescriptions.strict_senior}

#### CONTRATO DE TRABAJO Y DOCUMENTOS VINCULANTES:
Debes leer y respetar escrupulosamente los siguientes archivos directivos ubicados en la raíz del proyecto antes de escribir código:
1. \`RULES.md\`: Obedecer la **REGLA DE ORO OBLIGATORIA** y las restricciones de tipado y modularidad.
2. \`ARCHITECTURE.md\`: Ceñirte a la arquitectura y patrones designados sin desviaciones.
3. \`DESIGN.md\`: Usar la paleta de colores, frameworks y librerías de componentes prescritas.
4. \`DECISIONS.md\`: Respetar los ADRs y abstenerte de proponer tecnologías descartadas.
5. \`SECURITY.md\`: Implementar validación defensiva, auth segura y cero secretos hardcodeados.
6. \`TASKS.md\`: Avanzar secuencialmente resolviendo los hitos de la hoja de ruta.
7. \`MEMORY.md\`: Consultar y actualizar el estado de progreso tras cada sesión.

${p.prd.customMasterPromptDirectives ? `#### DIRECTIVAS ESPECIALES DEL PROPIETARIO:\n${p.prd.customMasterPromptDirectives}\n` : ''}
#### PRIMERA RESPUESTA REQUERIDA:
Confirma la lectura de este PRD y los archivos directivos complementarios. Desglosa los pasos inmediatos a ejecutar para la Fase 1 definida en \`TASKS.md\` y solicita confirmación antes de iniciar cualquier acción en el código.
\`\`\`
`;
}

/**
 * 2. ARCHITECTURE.md - Pila tecnológica, conectividad y patrones
 */
export function generateArchitecture(p: LibretoProject): string {
  const isStatic =
    p.architecture.platform === 'static' ||
    Boolean(p.architecture.isStaticSite) ||
    Boolean(p.architecture.database?.includes('Ninguna')) ||
    Boolean(p.architecture.backendFramework?.includes('Ninguno'));

  const getPatternDetails = (pattern: string) => {
    if (pattern.includes('SSG') || pattern.includes('Jamstack')) {
      return `
\`\`\`
src/
├── content/           # Documentos y colecciones Markdown / MDX / JSON
│   ├── blog/          # Artículos y publicaciones
│   └── docs/          # Documentación técnica
├── components/        # Componentes UI reutilizables e interactivos
├── layouts/           # Maquetaciones base (HTML shell, cabeceras, SEO, meta tags)
├── pages/             # Enrutamiento estático por archivos (File-based routing)
├── styles/            # Estilos globales, variables y temas CSS
└── public/            # Favicon, robots.txt y assets estáticos no procesados
\`\`\``;
    }
    if (pattern.includes('Islas') || pattern.includes('Islands')) {
      return `
\`\`\`
src/
├── components/
│   ├── static/        # Componentes cero-JS renderizados a HTML puro
│   └── islands/       # Islas interactivas hidratadas client-side (client:visible/load)
├── content/           # Colecciones tipadas con esquemas de validación
├── layouts/           # Plantillas base de página y layouts maestros
├── pages/             # Generación de rutas estáticas
└── styles/            # Sistema de tokens de diseño
\`\`\``;
    }
    if (pattern.includes('SPA Estática')) {
      return `
\`\`\`
src/
├── components/        # Componentes atómicos y vistas modulares
├── views/             # Páginas principales del SPA
├── hooks/             # Custom hooks y estado reactivo cliente
├── services/          # Integraciones HTTP / llamadas API cliente
├── assets/            # SVGs, imágenes y recursos estáticos
└── types/             # Definiciones TypeScript
\`\`\``;
    }
    if (pattern.includes('Colecciones')) {
      return `
\`\`\`
src/
├── content/           # Colecciones de contenido tipadas y esquemas Zod
│   └── config.ts      # Definición de colecciones y metadatos
├── components/        # Componentes visuales de renderizado
├── layouts/           # Plantillas base
└── pages/             # Páginas estáticas generadas dinámicamente
\`\`\``;
    }
    if (pattern.includes('Clean')) {
      return `
\`\`\`
src/
├── domain/            # Entidades de negocio puras, reglas empresariales
│   ├── entities/
│   └── value-objects/
├── application/       # Casos de uso, interfaces/puertos (Ports)
│   ├── use-cases/
│   └── dtos/
├── infrastructure/    # Adaptadores de BD, APIs externas, ORM, clientes
│   ├── database/
│   └── http/
└── presentation/      # Controladores, vistas, componentes UI, rutas
    ├── components/
    └── controllers/
\`\`\``;
    }
    if (pattern.includes('MVVM')) {
      return `
\`\`\`
src/
├── models/            # Estructuras de datos y esquemas
├── viewmodels/        # Lógica de estado reactivo y comandos
├── views/             # Componentes visuales y pantallas
└── services/          # Conexión con APIs y persistencia local
\`\`\``;
    }
    if (pattern.includes('Hexagonal')) {
      return `
\`\`\`
src/
├── core/
│   ├── domain/        # Lógica pura desacoplada
│   └── ports/         # Interfaces de entrada y salida
└── adapters/
    ├── in/            # Web, REST controllers, listeners
    └── out/           # Repositorios SQL, mensajería, storage
\`\`\``;
    }
    return `
\`\`\`
src/
├── controllers/       # Puntos de entrada HTTP y enrutamiento
├── services/          # Lógica de negocio y orquestación
├── repositories/      # Acceso a datos y consultas de base de datos
├── models/            # Esquemas y tipados
└── ui/                # Componentes de interfaz de usuario
\`\`\``;
  };

  const techRows = [
    `| **Plataforma** | ${p.architecture.platform} | ${isStatic ? 'Sitio Web Estático (SSG / Jamstack)' : 'Web / Móvil según directiva'} |`,
    `| **Lenguajes** | ${(p.architecture.languages || []).join(', ') || 'TypeScript'} | Tipado estricto sin \`any\` |`,
    `| **Frontend** | ${p.architecture.frontendFramework || 'No definido'} | UI interactiva y responsiva |`,
    `| **Backend / API** | ${p.architecture.backendFramework || 'Ninguno'} | ${isStatic ? 'Sin servidor de backend (Frontend Estático)' : 'Servicios y lógica de negocio'} |`,
    `| **Base de Datos** | ${p.architecture.database || 'Ninguna'} | ${isStatic ? 'Sin Base de Datos / Archivos Estáticos' : 'Persistencia principal'} |`,
    `| **Conectividad** | ${p.architecture.connectionType || 'Archivos Estáticos Locales'} | ${isStatic ? 'Archivos locales compilados en build' : 'Comunicación Cliente-Servidor'} |`,
    `| **Patrón Base** | ${p.architecture.architecturalPattern || 'SSG'} | Separación estricta de responsabilidades |`,
  ];

  if (isStatic && p.architecture.staticHosting) {
    techRows.push(`| **Hosting / CDN** | ${p.architecture.staticHosting} | Despliegue global en Edge CDN ($0 costo de servidor) |`);
  }

  const connectivitySection = isStatic
    ? `## 2. FUENTES DE CONTENIDO & DISTRIBUCIÓN ESTÁTICA (JAMSTACK)
- **Tipo de Enlace:** ${p.architecture.connectionType || 'Archivos Estáticos Locales (Markdown / MDX / JSON)'}
- **Estrategia de Renderizado:** Pre-renderizado completo en compilación (Static Site Generation - SSG).
- **Cero Llamadas a Base de Datos en Runtime:** No existen conexiones directas a bases de datos en producción. Todo el contenido reside en archivos versionados en Git o APIs sin estado consumidas durante el build.
- **Plataforma de Despliegue Sugerida:** ${p.architecture.staticHosting || 'Edge CDN (Vercel / Cloudflare Pages / Netlify)'}.
- **Caché y Distribución:** Distribución atómica instantánea a través de red CDN distribuida globalmente.`
    : `## 2. PROTOCOLO DE CONECTIVIDAD Y COMUNICACIÓN
- **Tipo de Enlace:** ${p.architecture.connectionType || 'REST API (JSON)'}
- **Formato de Carga Útil:** JSON con esquemas estandarizados para respuestas exitosas y errores.
- **Estructura Estándar de Respuesta API:**
\`\`\`json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": { "timestamp": "2026-10-11T00:00:00Z" }
}
\`\`\`
- **Respuesta de Error Estándar:**
\`\`\`json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Descripción clara del problema",
    "details": []
  }
}
\`\`\``;

  const bindingDirectives = isStatic
    ? `1. **Cero Dependencias de Servidor Dinámico:** La IA no debe generar controladores de backend ni scripts que asuman bases de datos SQL/NoSQL en ejecución continua.
2. **Optimización de Assets en Build:** Todas las imágenes deben procesarse en formatos modernos (WebP/AVIF) y el CSS debe purgarse exhaustivamente.
3. **Islas Interactivas Mínimas:** Mantener el JavaScript de cliente al mínimo indispensable; usar hidratación parcial únicamente en componentes que requieran interactividad reactiva.
4. **Validación de Schemas de Contenido:** Garantizar que los archivos Markdown/MDX cumplan esquemas tipados (ej. Zod o frontmatter estricto).`
    : `1. **Desacoplamiento Estricto:** La capa de presentación nunca debe importar directamente consultas SQL ni llamadas de bajo nivel a la base de datos.
2. **Inyección de Dependencias / Inversión de Control:** Favorecer contratos e interfaces sobre implementaciones concretas para permitir pruebas unitarias sin dependencias externas.
3. **Manejo Centralizado de Estado:** Mantener el estado global limpio, predictible e inmutable.`;

  return `# ESPECIFICACIÓN DE ARQUITECTURA TÉCNICA

> **Proyecto:** ${p.name}
> **Plataforma Objetivo:** ${p.architecture.platform.toUpperCase()}
> **Patrón Arquitectónico:** ${p.architecture.architecturalPattern}
${isStatic ? '> **Modo de Infraestructura:** ⚡ Sitio Web Estático Jamstack (SSG / Sin Base de Datos)\n' : ''}
---

## 1. RESUMEN DE LA PILA TECNOLÓGICA (TECH STACK)

| Componente | Tecnología Seleccionada | Detalle / Versión |
| :--- | :--- | :--- |
${techRows.join('\n')}

---

${connectivitySection}

---

## 3. ESTRUCTURA Y PATRÓN ARQUITECTÓNICO: ${p.architecture.architecturalPattern}

Separación de capas obligatoria:
${getPatternDetails(p.architecture.architecturalPattern)}

---

## 4. DIRECTIVAS ARQUITECTÓNICAS VINCULANTES
${bindingDirectives}
${p.architecture.customNotes ? `\n### Notas Específicas del Proyecto:\n${p.architecture.customNotes}\n` : ''}
`;
}

/**
 * 3. DESIGN.md - Sistema de diseño, librerías visuales y de animación
 */
export function generateDesign(p: LibretoProject): string {
  const currentStyle = DESIGN_STYLES.find((s) => s.id === p.design.style) || DESIGN_STYLES[0];
  const activePalette = p.design.styleColors?.[p.design.style] || currentStyle.colors;

  const animLibrariesDetails = p.design.animationLibraries.map((libName) => {
    const found = ANIMATION_LIBRARIES.find((l) => l.name.toLowerCase().includes(libName.toLowerCase()) || libName.toLowerCase().includes(l.name.toLowerCase()));
    if (found) {
      return `### 🎬 ${found.name}
- **Descripción:** ${found.description}
- **Repositorio Oficial:** [${found.repoUrl}](${found.repoUrl})
- **Comando de Instalación:**
\`\`\`bash
${found.installCommand}
\`\`\`
- **Ejemplo de Uso:**
\`\`\`tsx
${found.sampleCode}
\`\`\`
`;
    }
    return `### 🎬 ${libName}
- **Comando de Instalación:** \`npm install ${libName.toLowerCase()}\`
`;
  }).join('\n');

  const iconLibrariesDetails = p.design.iconLibraries.map((iconName) => {
    const found = ICON_LIBRARIES.find((i) => i.name.toLowerCase().includes(iconName.toLowerCase()) || iconName.toLowerCase().includes(i.name.toLowerCase()));
    if (found) {
      return `### 🎨 ${found.name}
- **Descripción:** ${found.description}
- **Repositorio Oficial:** [${found.repoUrl}](${found.repoUrl})
- **Comando de Instalación:**
\`\`\`bash
${found.installCommand}
\`\`\`
- **Ejemplo:**
\`\`\`tsx
${found.sampleCode}
\`\`\`
`;
    }
    return `### 🎨 ${iconName}
- **Comando de Instalación:** \`npm install ${iconName.toLowerCase()}\`
`;
  }).join('\n');

  return `# SISTEMA DE DISEÑO & PAUTAS UI/UX

> **Proyecto:** ${p.name}
> **Estilo Visual:** ${currentStyle.name}
> **Framework Base:** ${p.design.styleFramework}
> **Modo Oscuro Predeterminado:** ${p.design.darkModeDefault ? 'Sí (Dark First)' : 'No (Light First con toggle)'}

---

## 1. ESTILO VISUAL: ${currentStyle.name.toUpperCase()}

- **Concepto:** ${currentStyle.subtitle}
- **Rasgos Visuales Obligatorios:** ${currentStyle.visualFeatures || currentStyle.description}
- **Pautas de Paleta:** ${currentStyle.paletteDescription || currentStyle.description}
- **Uso Ideal en el Proyecto:** ${currentStyle.idealUse || 'Todo tipo de interfaces modernas'}
- **Tipografía Base:** \`${p.design.typography}\`

### Tokens de Color Principales y Paleta del Estilo
| Token | Código Hexadecimal | Propósito |
| :--- | :--- | :--- |
| **Color Primario** | \`${p.design.primaryColor}\` | Botones de acción principal (CTA), estados activos, enlaces destacados |
| **Color Secundario / Acento** | \`${p.design.secondaryColor}\` | Badges, indicadores visuales, gradientes complementarios |
${activePalette.map((c, i) => `| **Color de Paleta #${i + 1}** | \`${c}\` | Fondo, bordes, tarjetas o contrastes de ${currentStyle.name} |`).join('\n')}

---

## 2. FRAMEWORK DE ESTILOS: ${p.design.styleFramework}
Toda la interfaz debe seguir de forma estricta las convenciones de clases utilitarias y componentes prescritas por **${p.design.styleFramework}**.

---

## 3. LIBRERÍAS DE ANIMACIÓN Y MICROINTERACCIONES
${animLibrariesDetails || 'No se han seleccionado librerías adicionales de animación.'}

---

## 4. LIBRERÍAS DE ICONOGRAFÍA
${iconLibrariesDetails || 'No se han seleccionado librerías de iconos.'}

---

## 5. DIRECTRICES DE ACCESIBILIDAD Y RESPONSIVIDAD (UI/UX)
1. **Contraste de Colores:** Debe cumplir el estándar WCAG 2.1 nivel AA (ratio de contraste mínimo 4.5:1 para texto estándar).
2. **Diseño Mobile-First:** Todos los componentes deben contemplar breakpoints responsivos (\`sm\`, \`md\`, \`lg\`, \`xl\`).
3. **Estados Interactivos Claros:** Cada botón, input y tarjeta interactiva debe implementar estados visuales diferenciados para:
   - \`:hover\` (elevación sutil o cambio de luminosidad)
   - \`:focus-visible\` (anillo de foco visible de 2px para navegación por teclado)
   - \`:active\` (escala o presión sutil)
   - \`:disabled\` (opacidad reducida al 50% y cursor \`not-allowed\`)
${p.design.customDesignGuidelines ? `\n### Pautas Particulares:\n${p.design.customDesignGuidelines}\n` : ''}
`;
}

/**
 * 4. RULES.md - Reglas de comportamiento de la IA y Regla de Oro
 */
export function generateRules(p: LibretoProject): string {
  const extraRules = [
    p.rules.atomicModifications && '1. **Modificaciones Atómicas y Quirúrgicas:** Queda terminantemente prohibido reescribir archivos enteros cuando solo se modifican unas pocas líneas. Emplear reemplazos dirigidos y preservar comentarios existentes.',
    p.rules.strictTyping && '2. **Tipado Estricto Sin Excepciones:** Prohibido el uso de `any`, conversiones ambiguas (`as unknown as T`) o tipado dinámico no validado. Cada parámetro, retorno y estado debe contar con su interfaz o tipo explícito.',
    p.rules.mandatoryExceptionHandling && '3. **Manejo Obligatorio de Excepciones:** Cada endpoint, función asíncrona o mutación debe contar con bloques `try/catch` estructurados, registrando errores y respondiendo con códigos de estado HTTP semánticos (400, 401, 403, 404, 409, 500).',
    p.rules.strictModularity && '4. **Modularidad Estricta (Límite 50 Líneas):** Ninguna función o método debe superar las 50 líneas de código útil. Si una función crece más allá, DEBE descomponerse en funciones auxiliares o hooks reutilizables desacoplados.',
    p.rules.gitCommitConventions && '5. **Convenciones de Mensajes de Commit:** Seguir el estándar Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`).',
    p.rules.testCoverageRequirement && '6. **Cobertura de Pruebas Unitarias:** Cada nueva utilidad de lógica de negocio o cálculo debe acompañarse de su correspondiente archivo de prueba unitaria.',
  ].filter(Boolean);

  const customRulesList = p.rules.customRules.length > 0
    ? p.rules.customRules.map((r, i) => `${extraRules.length + i + 1}. **${r}**`).join('\n')
    : '';

  return `# REGLAS DE COMPORTAMIENTO PARA LA INTELIGENCIA ARTIFICIAL

> **Documento de Cumplimiento Obligatorio e Innegociable**
> **Proyecto:** ${p.name}

---

## ⚡ REGLA DE ORO OBLIGATORIA (MÁXIMA PRIORIDAD)

> ### 🛑 REGLA DE ORO INAMOVIBLE:
> **«La Inteligencia Artificial DEBE preguntar siempre y solicitar aprobación explícita al usuario ANTES de instalar dependencias, ejecutar comandos, crear nuevos archivos o implementar cualquier funcionalidad crítica. Debe desglosar los archivos afectados y el impacto antes de tocar el código».**

Cualquier acción unilateral que instale paquetes no autorizados, modifique archivos estructurales o ejecute scripts destructivos sin la venia previa del usuario se considerará una violación crítica de este libreto.

---

## 📋 DIRECTIVAS TÉCNICAS OBLIGATORIAS

${extraRules.join('\n\n')}

${customRulesList ? `\n### DIRECTIVAS ADICIONALES ESPECÍFICAS DEL PROYECTO:\n${customRulesList}\n` : ''}
---

## 🛡️ PROTOCOLO DE INTERACCIÓN ANTES DE CADA CAMBIO

Antes de proponer o ejecutar código, el asistente IA debe presentar una respuesta con el siguiente formato:

1. **Objetivo del cambio:** Breve resumen de lo que se va a solucionar o construir.
2. **Archivos afectados:** Lista de rutas absolutas o relativas que se crearán o editarán.
3. **Nuevas dependencias (si aplica):** Justificación y comando exacto a ejecutar.
4. **Solicitud de aprobación:** *"¿Deseas que proceda con estos cambios?"*
`;
}

/**
 * 5. DECISIONS.md - ADRs (Architecture Decision Records)
 */
export function generateDecisions(p: LibretoProject): string {
  const adrList = [
    {
      id: 'ADR-001',
      title: `Selección de Frontend: ${p.architecture.frontendFramework}`,
      context: `Se requiere una interfaz de usuario moderna para la plataforma ${p.architecture.platform}, garantizando alto rendimiento y experiencia de desarrollo óptima.`,
      decision: `Se adopta **${p.architecture.frontendFramework}** como el framework estándar para la capa visual.`,
      consequences: `Alineación de todo el equipo y directivas de componentes en torno a este framework. Prohibido mezclar con librerías incompatibles.`,
      discarded: `Angular, jQuery, frameworks legacy no acordados.`,
    },
    {
      id: 'ADR-002',
      title: `Estrategia de Backend y API: ${p.architecture.backendFramework}`,
      context: `La lógica de negocio y persistencia requiere un entorno robusto con conexión ${p.architecture.connectionType}.`,
      decision: `Se implementa **${p.architecture.backendFramework}** como el servicio principal de backend.`,
      consequences: `Garantiza contratos de API consistentes y tipado sincronizado.`,
      discarded: `Monolitos no estructurados, lenguajes no consensuados.`,
    },
    {
      id: 'ADR-003',
      title: `Motor de Base de Datos: ${p.architecture.database}`,
      context: `Se necesita un almacén de datos fiable, escalable y con soporte para las entidades del modelo de negocio.`,
      decision: `Se selecciona **${p.architecture.database}** como la base de datos oficial.`,
      consequences: `Todas las consultas, migraciones y esquemas deben optimizarse específicamente para las características de este motor.`,
      discarded: `Soluciones NoSQL sin esquema cuando se requiera integridad referencial estricta, o bases de datos no acordadas.`,
    },
    {
      id: 'ADR-004',
      title: `Sistema de Estilos y Diseño: ${p.design.styleFramework} con estilo ${p.design.style}`,
      context: `Se busca una experiencia de usuario coherente con el estilo ${p.design.style}.`,
      decision: `Se prescribe **${p.design.styleFramework}** y componentes consistentes con los tokens definidos en \`DESIGN.md\`.`,
      consequences: `Prohibido introducir CSS inline desordenado o librerías de estilos concurrentes que contaminen el bundle.`,
      discarded: `CSS Vanilla desorganizado, librerías pesadas redundantes.`,
    },
    {
      id: 'ADR-005',
      title: `Patrón de Diseño de Software: ${p.architecture.architecturalPattern}`,
      context: `Para evitar el acoplamiento y facilitar el mantenimiento a largo plazo.`,
      decision: `Toda la base de código debe estructurarse conforme a **${p.architecture.architecturalPattern}**.`,
      consequences: `El código debe dividirse en capas con responsabilidades independientes.`,
      discarded: `Estructura plana sin separación de responsabilidades ("Spaghetti Code").`,
    },
  ];

  const customAdrs = p.decisions.customDecisions.map((c, i) => `
### ADR-${String(adrList.length + i + 1).padStart(3, '0')}: ${c.title}
- **Estado:** Aprobado / Vigente
- **Contexto:** ${c.context}
- **Decisión:** ${c.decision}
- **Consecuencias:** ${c.consequences}
- **Alternativas Descartadas:** ${c.discardedAlternatives}
`).join('\n');

  return `# REGISTRO DE DECISIONES DE ARQUITECTURA (ADR)

> **Proyecto:** ${p.name}
> **Propósito:** Documentar formalmente las elecciones tecnológicas fundamentales y prevenir desviaciones no autorizadas en el desarrollo asistido por IA.

---

## 🚫 DIRECTIVA VINCULANTE A LA INTELIGENCIA ARTIFICIAL

> **PROHIBICIÓN ESTRICTA DE MIGRACIÓN:**
> La IA tiene **estrictamente prohibido** sugerir, iniciar o ejecutar migraciones a tecnologías, frameworks, gestores de estado o librerías alternativas distintas a las ratificadas en este documento, a menos que el usuario lo solicite de forma explícita y documentada.

---

${adrList.map((adr) => `
### ${adr.id}: ${adr.title}
- **Estado:** ✅ Aprobado / Vigente
- **Contexto:** ${adr.context}
- **Decisión:** ${adr.decision}
- **Consecuencias:** ${adr.consequences}
- **Alternativas Terminantemente Descartadas:** ${adr.discarded}
`).join('\n---\n')}

${customAdrs ? `\n---\n## ADRs ESPECÍFICOS ADICIONALES\n${customAdrs}` : ''}
`;
}

/**
 * 6. SECURITY.md - Pautas estrictas de sanitización, auth y secretos
 */
export function generateSecurity(p: LibretoProject): string {
  const policies = [
    p.security.envVariablesManagement && `### 1. 🔐 Gestión Estricta de Variables de Entorno y Secretos
- **Cero Credenciales Hardcodeadas:** Ningún token, API Key, contraseña de base de datos o secreto debe comitearse en el repositorio bajo ninguna circunstancia.
- **Plantilla Obligatoria:** Mantener actualizado el archivo \`.env.example\` con todas las variables requeridas y valores vacíos o ficticios.
- **Auditoría de Git:** Verificar que \`.env\`, \`.env.local\` y archivos de claves estén incluidos en \`.gitignore\`.`,

    p.security.secureAuth && `### 2. 🛡️ Autenticación y Autorización Segura
- **Almacenamiento de Tokens:** En aplicaciones Web, almacenar tokens JWT y de sesión exclusivamente en **cookies \`HttpOnly\`, \`Secure\` y \`SameSite=Strict\`**.
- **Entornos Móviles:** En aplicaciones móviles, utilizar bóvedas nativas cifradas (\`SecureStore\` en Expo / Keychain en iOS / Keystore en Android). Prohibido guardar credenciales en AsyncStorage en texto plano.
- **Expiración y Rotación:** Implementar tiempo de vida corto para Access Tokens y rotación segura de Refresh Tokens.`,

    p.security.inputSanitization && `### 3. 🧹 Sanitización de Entradas y Validación de Esquemas
- **Validación en Frontera:** Toda petición entrante a la API debe validarse contra esquemas estrictos (ej. **Zod**, **Joi**, **Pydantic**) antes de ser procesada por los controladores o servicios.
- **Rechazo de Parámetros Desconocidos:** Descartar propiedades que no figuren en el esquema esperado para prevenir inyecciones de asignación masiva (Mass Assignment).`,

    p.security.sqlInjectionAndXssProtection && `### 4. 🛑 Protección Contra Inyección SQL y XSS
- **Consultas Parametrizadas:** Queda prohibida la concatenación directa de cadenas de texto para generar sentencias SQL. Utilizar siempre consultas preparadas o el query builder del ORM.
- **Escape de Salidas:** Escapar todo contenido dinámico renderizado en el navegador para mitigar Cross-Site Scripting (XSS). No utilizar \`dangerouslySetInnerHTML\` salvo sanitización previa comprobada con DOMPurify.`,

    p.security.corsAndSecurityHeaders && `### 5. 🌐 Políticas de CORS y Cabeceras de Seguridad HTTP
- **CORS Restrictivo:** Configurar una lista blanca explícita de dominios autorizados. Prohibido el uso de comodines (\`Access-Control-Allow-Origin: *\`) en endpoints protegidos o autenticados.
- **Cabeceras de Protección:** Incluir cabeceras estándar como \`Content-Security-Policy (CSP)\`, \`X-Frame-Options: DENY\`, \`X-Content-Type-Options: nosniff\` y \`Strict-Transport-Security (HSTS)\`.`,

    p.security.rateLimiting && `### 6. ⏱️ Limitación de Tasa (Rate Limiting) y Protección contra Ataques de Fuerza Bruta
- Aplicar limitadores de tasa (ej. \`express-rate-limit\`, Redis sliding window) en rutas sensibles: login, registro, recuperación de contraseña y endpoints de pago.`,

    p.security.csrfProtection && `### 7. 🔒 Protección contra Falsificación de Peticiones (CSRF)
- Validar tokens CSRF o aprovechar el aislamiento de cookies \`SameSite=Strict\` para todas las peticiones con métodos mutables (POST, PUT, PATCH, DELETE).`,
  ].filter(Boolean);

  const customSec = p.security.customSecurityPolicies.length > 0
    ? `### 8. Políticas Adicionales de Seguridad del Proyecto\n${p.security.customSecurityPolicies.map((s) => `- ${s}`).join('\n')}`
    : '';

  return `# MANUAL Y DIRECTRICES DE SEGURIDAD INFORMÁTICA

> **Proyecto:** ${p.name}
> **Nivel de Exigencia:** Máximo / Producción Segura

---

## RESUMEN DE MANDATOS DE SEGURIDAD

${policies.join('\n\n')}

${customSec}

---

## CHECKLIST DE REVISIÓN ANTES DE DESPLIEGUE A PRODUCCIÓN
- [ ] Ningún secreto expuesto en el historial de Git (\`git log\`).
- [ ] Variables de entorno comprobadas contra \`.env.example\`.
- [ ] Validación de esquemas activa en el 100% de los endpoints públicos y privados.
- [ ] Escaneo de dependencias ejecutado con cero vulnerabilidades críticas o altas (\`npm audit\` / \`safety check\`).
- [ ] Cabeceras de seguridad activadas y verificadas en escáneres SSL/SecurityHeaders.
`;
}

/**
 * 7. TASKS.md - Hoja de ruta secuencial de ejecución
 */
export function generateTasks(p: LibretoProject): string {
  const phasesOutput = p.tasks.phases.map((phase) => {
    const taskItems = phase.tasks.map((t) => `- [ ] ${t}`).join('\n');
    return `### ${phase.name}\n${taskItems}\n`;
  }).join('\n');

  return `# HOJA DE RUTA SECUENCIAL DE EJECUCIÓN (TASKS)

> **Proyecto:** ${p.name}
> **Metodología:** Desarrollo Iterativo e Incremental Asistido por IA

---

## 📌 INSTRUCCIÓN OPERATIVA PARA LA IA
1. Abordar las tareas en estricto orden secuencial por fases.
2. No pasar a la fase siguiente sin antes verificar el correcto funcionamiento y pruebas de la fase actual.
3. Marcar con \`- [x]\` cada tarea verificada en este archivo tras recibir confirmación del usuario.

---

${phasesOutput}
`;
}

/**
 * 8. MEMORY.md - Bitácora viva de estado y progreso
 */
export function generateMemory(p: LibretoProject): string {
  const completedList = p.memory.completedMilestones.length > 0
    ? p.memory.completedMilestones.map((m) => `- [x] ${m}`).join('\n')
    : '- [x] Creación del libreto maestro de directivas';

  const inProgressList = p.memory.inProgressMilestones.length > 0
    ? p.memory.inProgressMilestones.map((m) => `- [ ] ⏳ **${m}**`).join('\n')
    : '- [ ] ⏳ **Fase 1: Configuración inicial del entorno**';

  const blockersList = p.memory.blockers.length > 0
    ? p.memory.blockers.map((b) => `- ⚠️ ${b}`).join('\n')
    : '- Ninguno identificado al momento.';

  return `# BITÁCORA VIVA DE ESTADO & MEMORIA DEL PROYECTO (MEMORY)

> **Proyecto:** ${p.name}
> **Archivo de Persistencia de Contexto para Sesiones de IA**
> **Última Actualización:** ${new Date().toLocaleString()}

---

## 1. ESTADO ACTUAL DEL PROYECTO
${p.memory.currentState}

**Hito / Sprint Activo:** \`${p.memory.activeSprintOrMilestone}\`

---

## 2. HITOS COMPLETADOS
${completedList}

---

## 3. HITOS EN PROGRESO ACTIVO
${inProgressList}

---

## 4. BLOQUEOS Y RIESGOS ACTIVOS
${blockersList}

---

## 5. BITÁCORA DE CAMBIOS Y SESIONES RECIENTES (CHANGELOG)

### [Sesión 0: Inicialización del Libreto] - ${new Date().toLocaleDateString()}
- **Autor:** Sistema "Construcción de Libreto"
- **Acciones Realizadas:**
  - Generación de los 8 archivos maestros: PRD, ARCHITECTURE, DESIGN, RULES, DECISIONS, SECURITY, TASKS y MEMORY.
  - Ratificación de la pila tecnológica: ${p.architecture.frontendFramework} + ${p.architecture.backendFramework} + ${p.architecture.database}.
  - Establecimiento de la Regla de Oro obligatoria de solicitud de aprobación previa.
`;
}

/**
 * Genera el paquete completo de los 8 archivos .md
 */
export function generateAllMarkdownFiles(project: LibretoProject): GeneratedFiles {
  return {
    'PRD.md': generatePRD(project),
    'ARCHITECTURE.md': generateArchitecture(project),
    'DESIGN.md': generateDesign(project),
    'RULES.md': generateRules(project),
    'DECISIONS.md': generateDecisions(project),
    'SECURITY.md': generateSecurity(project),
    'TASKS.md': generateTasks(project),
    'MEMORY.md': generateMemory(project),
  };
}
