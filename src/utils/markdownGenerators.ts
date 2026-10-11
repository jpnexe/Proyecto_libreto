import type { GeneratedFiles, LibretoProject } from '../types/libreto';
import { ANIMATION_LIBRARIES, DESIGN_STYLES, ICON_LIBRARIES } from '../constants/options';
import {
  getFrontendTechInfo,
  getBackendTechInfo,
  getDatabaseTechInfo,
  getPatternTechInfo,
  getStyleTechInfo,
} from '../constants/techDictionary';
import { generateSuggestedTasks, isStaticProject } from './taskGenerator';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 1. PRD.md - Documento de Requerimientos de Producto & Prompt Maestro
 */
export function generatePRD(p: LibretoProject): string {
  const toneDescriptions: Record<string, string> = {
    strict_senior: 'Desarrollador Senior Riguroso: Código limpio, tipado estricto, sin atajos, alta resiliencia y validación defensiva.',
    collaborative_expert: 'Experto Colaborativo: Explicaciones claras, enfoque paso a paso, comunicación proactiva y sugerencias fundamentadas.',
    architect_mentor: 'Arquitecto y Mentor: Enfoque en escalabilidad a largo plazo, patrones de diseño de software y decisiones bien documentadas.',
    minimalist_concise: 'Pragmático y Conciso: Código conciso y directo al grano, sin explicaciones redundantes, máxima eficiencia.',
  };

  const feInfo = getFrontendTechInfo(p.architecture.frontendFramework);
  const beInfo = getBackendTechInfo(p.architecture.backendFramework);
  const dbInfo = getDatabaseTechInfo(p.architecture.database);
  const patInfo = getPatternTechInfo(p.architecture.architecturalPattern);
  const styleInfo = getStyleTechInfo(p.design.style);
  const isStatic = isStaticProject(p);

  const reqList = p.prd.functionalRequirements.length > 0
    ? p.prd.functionalRequirements.map((r, i) => {
        const id = `RF-${String(i + 1).padStart(3, '0')}`;
        return `### ${id}: ${r}
- **Prioridad:** ${i === 0 ? 'Crítica (MVP Bloqueante)' : i < 3 ? 'Alta' : 'Media'}
- **Descripción:** Implementación integral del flujo operativo correspondiente a "${r}".
- **Criterios de Aceptación (BDD):**
  - **Dado que** el usuario se encuentra autenticado con los permisos requeridos (o navega en modo público si aplica),
  - **Cuando** interactúa con los controles de la interfaz para activar esta funcionalidad,
  - **Entonces** el sistema procesa la solicitud con validación estricta de esquemas y responde en menos de 200ms sin errores visuales ni excepciones no controladas.
- **Definición de Terminado (DoD):**
  - [ ] Interfaz reactiva responsiva según los lineamientos de \`DESIGN.md\`.
  - [ ] Validación de entradas en frontera (Zod/DTO) y manejo defensivo de errores.
  - [ ] Pruebas unitarias que validen casos de éxito y de borde (edge cases).`;
      }).join('\n\n')
    : '### RF-001: Requerimientos funcionales base en definición.\n- **Descripción:** Definir las capacidades operativas esenciales del MVP.';

  const nonFuncList = p.prd.nonFunctionalRequirements.length > 0
    ? p.prd.nonFunctionalRequirements.map((r, i) => `#### NFR-${i + 1}: ${r}\n- **Estándar:** Cumplimiento estricto en todos los entornos de despliegue.\n- **Métrica de Verificación:** Verificable mediante auditorías automatizadas y pruebas de carga.`).join('\n\n')
    : `#### NFR-1: Rendimiento y Latencia
- **Estándar:** Time to First Byte (TTFB) < 100ms y First Contentful Paint (FCP) < 1.2s.
- **Métrica:** Puntuación de Google Lighthouse ≥ 95 en producción.

#### NFR-2: Seguridad en Frontera
- **Estándar:** Cero vulnerabilidades críticas en dependencias (npm audit / safety check). Sanitización estricta de entradas y cabeceras CSP.

#### NFR-3: Accesibilidad Universal (A11y)
- **Estándar:** Cumplimiento estricto del estándar WAI-ARIA y WCAG 2.1 nivel AA con ratios de contraste mínimo de 4.5:1.`;

  const storiesList = p.prd.userStories.length > 0
    ? p.prd.userStories.map((s, i) => `### Historia de Usuario US-${String(i + 1).padStart(3, '0')}
> **Enunciado:** "${s}"
- **Actor Principal:** ${p.targetAudience}
- **Valor de Negocio:** Garantiza una experiencia intuitiva, fluida y predecible que incrementa la retención y reduce la tasa de abandono.
- **Condiciones Previas:** La sesión y el estado de la aplicación deben estar sincronizados.
- **Flujo Principal:** El usuario ejecuta la acción prevista recibiendo retroalimentación háptica o visual inmediata (skeletons / spinners / toast notifications).`).join('\n\n')
    : `### Historia de Usuario US-001
> **Enunciado:** "Como ${p.targetAudience}, quiero acceder a una interfaz fluida, rápida y coherente para gestionar mis tareas eficientemente sin fricciones técnicas."
- **Actor Principal:** ${p.targetAudience}
- **Valor de Negocio:** Facilidad de adopción y máxima productividad.`;

  return `# PRD & ESPECIFICACIÓN DE REQUERIMIENTOS: ${p.name.toUpperCase()}

> **Documento:** Product Requirements Document (PRD) & Master Prompt
> **Versión del Producto:** \`${p.version}\` | **Fecha de Emisión:** ${new Date(p.createdAt).toLocaleDateString()} | **Última Revisión:** ${new Date(p.updatedAt).toLocaleDateString()}
> **Público Objetivo:** ${p.targetAudience}
> **Plataforma:** \`${p.architecture.platform.toUpperCase()}\` ${isStatic ? '(⚡ Sitio Estático Jamstack / SSG)' : ''}

---

## 1. RESUMEN EJECUTIVO & PROPÓSITO DEL PRODUCTO

### 1.1 Declaración del Problema y Visión de Solución
${p.description}

### 1.2 Objetivos Estratégicos & Factores Críticos de Éxito
- **Alineación Tecnológica:** Construido sobre la base de **${feInfo.name}**, **${beInfo.name}** y persistencia en **${dbInfo.name}**.
- **Identidad Visual Distintiva:** Interfaz gobernada por el estilo **${styleInfo.name}** (${styleInfo.category}) bajo el framework **${p.design.styleFramework}**.
- **Time-to-Market:** Desarrollo incremental por fases estructuradas en \`TASKS.md\` con verificación continua de calidad.
- **Rendimiento de Clase Mundial:** Cumplimiento de los SLAs de latencia y disponibilidad definidos en los requerimientos no funcionales.

---

## 2. MATRIZ DE REQUERIMIENTOS FUNCIONALES (ALCANCE MVP)

El sistema debe satisfacer sin excepción los siguientes requerimientos funcionales prioritarios:

${reqList}

---

## 3. REQUERIMIENTOS NO FUNCIONALES (NFR) & CRITERIOS DE INGENIERÍA

${nonFuncList}

### 3.1 Directivas de Rendimiento del Stack Tecnológico
- **Frontend (${feInfo.name}):** ${feInfo.performanceDirectives.join(' ')}
- **Backend (${beInfo.name}):** ${beInfo.performanceDirectives.join(' ')}
- **Persistencia (${dbInfo.name}):** ${dbInfo.performanceDirectives.join(' ')}

---

## 4. HISTORIAS DE USUARIO Y ESCENARIOS DE COMPORTAMIENTO (BDD)

${storiesList}

---

## 5. DICCIONARIO TÉCNICO & GLOSARIO DE CONCEPTOS DEL SISTEMA

Para garantizar una comprensión unívoca entre el equipo humano y los asistentes de Inteligencia Artificial, se establecen las siguientes definiciones formales:

- **${feInfo.name}:** ${feInfo.description}
  *Paradigma clave:* \`${feInfo.paradigm}\`.
- **${beInfo.name}:** ${beInfo.description}
  *Paradigma clave:* \`${beInfo.paradigm}\`.
- **${dbInfo.name}:** ${dbInfo.description}
  *Paradigma clave:* \`${dbInfo.paradigm}\`.
- **${patInfo.name}:** ${patInfo.description}
  *Enfoque:* ${patInfo.architectureGuide}
- **${styleInfo.name}:** ${styleInfo.philosophy}

---

## 6. PROMPT MAESTRO DE INICIALIZACIÓN PARA EL ASISTENTE IA

\`\`\`markdown
### INSTRUCCIONES DE IDENTIDAD, ROL Y MISIÓN PARA EL ASISTENTE IA

Actúa como el **Arquitecto de Software Principal y Desarrollador Senior Líder** del proyecto "${p.name}".

#### 1. MISIÓN Y CONTEXTO VINCULANTE:
- **Nombre del Producto:** ${p.name}
- **Descripción:** ${p.description}
- **Audiencia Objetivo:** ${p.targetAudience}
- **Plataforma:** ${p.architecture.platform.toUpperCase()}
- **Pila Tecnológica Ratificada:**
  - Frontend: ${p.architecture.frontendFramework} (${feInfo.paradigm})
  - Backend: ${p.architecture.backendFramework}
  - Base de Datos: ${p.architecture.database}
  - Patrón Arquitectónico: ${p.architecture.architecturalPattern}
  - Conectividad: ${p.architecture.connectionType}
- **Sistema de Diseño:** ${p.design.style} (${p.design.styleFramework}) con paleta: Primario (${p.design.primaryColor}), Secundario (${p.design.secondaryColor})
- **Tono y Filosofía Operativa:** ${toneDescriptions[p.prd.masterPromptTone] || toneDescriptions.strict_senior}

#### 2. CONTRATO DE TRABAJO Y CUMPLIMIENTO DOCUMENTAL OBLIGATORIO:
Antes de generar código, instalar dependencias o proponer cambios, DEBES leer e internalizar los 8 archivos maestros:
1. \`RULES.md\`: **REGLA DE ORO INAMOVIBLE**. Solicitar aprobación explícita antes de ejecutar comandos, crear archivos o instalar librerías.
2. \`ARCHITECTURE.md\`: Obedecer la estructura de carpetas, separación de capas y contratos de API ratificados.
3. \`DESIGN.md\`: Utilizar estrictamente los tokens de color, componentes y librerías visuales autorizadas.
4. \`DECISIONS.md\`: Respetar los registros ADR y abstenerse de proponer tecnologías descartadas.
5. \`SECURITY.md\`: Aplicar validación de esquemas Zod en frontera, mitigación de OWASP y cero secretos en Git.
6. \`TASKS.md\`: Avanzar fase por fase de forma secuencial sin saltar requerimientos ni omitir pruebas.
7. \`MEMORY.md\`: Consultar y actualizar la bitácora tras cada hito completado.

${p.prd.customMasterPromptDirectives ? `#### 3. DIRECTIVAS ESPECIALES DEL USUARIO:\n${p.prd.customMasterPromptDirectives}\n` : ''}
#### 4. PROTOCOLO OBLIGATORIO DE PRIMERA RESPUESTA:
En tu primera interacción, debes:
1. Confirmar la asimilación completa de este PRD y los archivos directivos.
2. Resumir la pila técnica seleccionada y los requerimientos funcionales críticos de la Fase 1 en \`TASKS.md\`.
3. Proponer el plan de acción inmediato y SOLICITAR CONFIRMACIÓN EXPLÍCITA antes de escribir cualquier archivo o ejecutar comandos.
\`\`\`
`;
}

/**
 * 2. ARCHITECTURE.md - Especificación Técnica, Pila y Flujo de Datos
 */
export function generateArchitecture(p: LibretoProject): string {
  const feInfo = getFrontendTechInfo(p.architecture.frontendFramework);
  const beInfo = getBackendTechInfo(p.architecture.backendFramework);
  const dbInfo = getDatabaseTechInfo(p.architecture.database);
  const patInfo = getPatternTechInfo(p.architecture.architecturalPattern);
  const isStatic = isStaticProject(p);

  const techRows = [
    `| **Plataforma Objetivo** | \`${p.architecture.platform.toUpperCase()}\` | ${isStatic ? '⚡ Jamstack / SSG (Cero Servidores Backend)' : 'Web / Móvil Dinámico'} |`,
    `| **Lenguajes** | \`${(p.architecture.languages || []).join(', ') || 'TypeScript'}\` | Tipado estricto sin uso de \`any\` ni conversiones ambiguas |`,
    `| **Capa de Frontend** | \`${p.architecture.frontendFramework}\` | ${feInfo.category} (\`${feInfo.paradigm}\`) |`,
    `| **Capa de Backend** | \`${p.architecture.backendFramework}\` | ${beInfo.category} |`,
    `| **Persistencia / BD** | \`${p.architecture.database}\` | ${dbInfo.category} |`,
    `| **Protocolo de Enlace** | \`${p.architecture.connectionType}\` | ${isStatic ? 'Archivos locales / Build-time fetch' : 'Comunicación cliente-servidor estructurada'} |`,
    `| **Patrón Arquitectónico** | \`${p.architecture.architecturalPattern}\` | ${patInfo.category} |`,
  ];

  if (isStatic && p.architecture.staticHosting) {
    techRows.push(`| **Distribución / CDN** | \`${p.architecture.staticHosting}\` | Red perimetral Edge CDN global con alta disponibilidad |`);
  }

  return `# ESPECIFICACIÓN DE ARQUITECTURA TÉCNICA

> **Proyecto:** ${p.name}
> **Versión:** \`${p.version}\`
> **Plataforma:** \`${p.architecture.platform.toUpperCase()}\` ${isStatic ? '(⚡ Jamstack SSG)' : ''}
> **Patrón Arquitectónico:** \`${p.architecture.architecturalPattern}\`

---

## 1. MATRIZ DE LA PILA TECNOLÓGICA (TECH STACK)

| Dimensión | Tecnología Asignada | Enfoque y Justificación Técnica |
| :--- | :--- | :--- |
${techRows.join('\n')}

---

## 2. FICHAS TÉCNICAS PROFUNDAS DE TECNOLOGÍAS SELECCIONADAS

### 2.1 Frontend: ${feInfo.name}
- **Categoría:** ${feInfo.category}
- **Paradigma Operativo:** \`${feInfo.paradigm}\`
- **Descripción:** ${feInfo.description}
- **Guía de Arquitectura:**
  ${feInfo.architectureGuide}
- **Comandos CLI Esenciales:**
\`\`\`bash
${feInfo.cliCommands.map((c) => `# ${c.label}\n${c.command}`).join('\n\n')}
\`\`\`
- **Librerías Clave del Ecosistema:** ${feInfo.keyLibraries.join(', ')}
- **Directivas de Rendimiento:**
${feInfo.performanceDirectives.map((d) => `  - ${d}`).join('\n')}
- **Buenas Prácticas de Ingeniería:**
${feInfo.bestPractices.map((b) => `  - ${b}`).join('\n')}
- **Errores Comunes y Antipatrones a Evitar:**
${feInfo.commonPitfalls.map((cp) => `  - ⚠️ ${cp}`).join('\n')}

---

### 2.2 Backend: ${beInfo.name}
- **Categoría:** ${beInfo.category}
- **Paradigma Operativo:** \`${beInfo.paradigm}\`
- **Descripción:** ${beInfo.description}
- **Guía de Arquitectura:**
  ${beInfo.architectureGuide}
- **Comandos CLI Esenciales:**
\`\`\`bash
${beInfo.cliCommands.map((c) => `# ${c.label}\n${c.command}`).join('\n\n')}
\`\`\`
- **Librerías Clave:** ${beInfo.keyLibraries.join(', ')}
- **Directivas de Rendimiento:**
${beInfo.performanceDirectives.map((d) => `  - ${d}`).join('\n')}
- **Seguridad en Backend:**
${beInfo.securityConsiderations.map((s) => `  - 🛡️ ${s}`).join('\n')}

---

### 2.3 Persistencia y Datos: ${dbInfo.name}
- **Categoría:** ${dbInfo.category}
- **Paradigma Operativo:** \`${dbInfo.paradigm}\`
- **Descripción:** ${dbInfo.description}
- **Guía de Arquitectura:**
  ${dbInfo.architectureGuide}
- **Comandos CLI Esenciales:**
\`\`\`bash
${dbInfo.cliCommands.map((c) => `# ${c.label}\n${c.command}`).join('\n\n')}
\`\`\`
- **Buenas Prácticas de Datos:**
${dbInfo.bestPractices.map((b) => `  - ${b}`).join('\n')}
- **Directivas de Rendimiento:**
${dbInfo.performanceDirectives.map((d) => `  - ${d}`).join('\n')}

---

## 3. FLUJO DE DATOS DE EXTREMO A EXTREMO (END-TO-END DATA FLOW)

El ciclo de vida de una petición dentro del sistema sigue un flujo unidireccional y predecible:

\`\`\`mermaid
flowchart TD
    A[Usuario / Interfaz Cliente] -->|1. Evento / Petición Tipada| B[Capa de Presentación / UI Components]
    B -->|2. Validación de Entrada Zod| C[Servicios de API / State Store]
    C -->|3. ${p.architecture.connectionType}| D[Controladores / Route Handlers]
    D -->|4. Casos de Uso / Servicios de Negocio| E[Lógica de Dominio Pura]
    E -->|5. Repositorio / Abstracción de Datos| F[${dbInfo.name}]
    F -->|6. Datos Crudos Persistidos| E
    E -->|7. DTOs Sanitizados| D
    D -->|8. Carga Útil Estandarizada| C
    C -->|9. Renderizado Reactivo| B
    B -->|10. Retroalimentación Visual| A
\`\`\`

1. **Interacción del Usuario:** El usuario dispara una acción en un componente visual gobernado por los tokens de \`DESIGN.md\`.
2. **Validación en Frontera:** Los datos del formulario o acción se validan mediante esquemas antes de salir del cliente.
3. **Transporte de Red:** La petición se emite mediante **${p.architecture.connectionType}** con cabeceras de autorización y trazabilidad.
4. **Capa de Control:** El backend (o función serverless/handler) valida la carga útil y la pasa a la capa de servicios.
5. **Dominio Empresarial:** Se ejecutan las reglas invariantes de negocio desacopladas de frameworks.
6. **Persistencia:** Se consulta o muta la base de datos **${dbInfo.name}** utilizando transacciones atómicas si aplica.
7. **Respuesta Serializada:** Se devuelve un payload normalizado con metadatos de paginación y tiempo de procesamiento.

---

## 4. CONTRATO DE RESPUESTAS Y PROTOCOLO DE CONECTIVIDAD

Toda comunicación a través de **${p.architecture.connectionType}** debe cumplir el siguiente formato estándar:

### 4.1 Respuesta Exitosa Estándar (HTTP 200 / 201)
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "attributes": {}
  },
  "error": null,
  "meta": {
    "timestamp": "2026-10-11T00:00:00Z",
    "version": "${p.version}",
    "executionTimeMs": 24
  }
}
\`\`\`

### 4.2 Respuesta de Error Estandarizada (RFC 7807 Problem Details)
\`\`\`json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los parámetros suministrados no cumplen las restricciones del esquema.",
    "details": [
      {
        "field": "email",
        "issue": "Formato de correo electrónico inválido"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-10-11T00:00:00Z",
    "traceId": "req-987654321"
  }
}
\`\`\`

---

## 5. ESTRUCTURA CANÓNICA DE DIRECTORIOS: ${patInfo.name}

La base de código DEBE organizarse estrictamente según el siguiente árbol de carpetas comentado:

\`\`\`
${patInfo.recommendedFolderStructure}
\`\`\`

---

## 6. NORMAS DE NOMENCLATURA & ESTILO DE CÓDIGO

- **Archivos de Componentes:** \`PascalCase.tsx\` (ej. \`UserProfileCard.tsx\`).
- **Archivos de Utilidades y Servicios:** \`camelCase.ts\` (ej. \`authService.ts\`, \`formatCurrency.ts\`).
- **Variables y Funciones:** \`camelCase\` explícito, auto-documentado y libre de abreviaturas crípticas.
- **Tipos, Interfaces y Clases:** \`PascalCase\` sin prefijo "I" húngaro (ej. \`UserProfile\` en lugar de \`IUserProfile\`).
- **Variables de Entorno:** \`SCREAMING_SNAKE_CASE\` (ej. \`DATABASE_URL\`, \`API_SECRET_KEY\`).
- **Tablas y Columnas en Base de Datos:** \`snake_case\` en minúsculas y plural (ej. \`user_profiles\`, \`created_at\`).

---

## 7. DIRECTIVAS ARQUITECTÓNICAS VINCULANTES PARA LA IA

1. **Separación Estricta de Capas:** La capa de presentación visual nunca debe ejecutar consultas directas de base de datos ni contener lógica SQL embebida.
2. **Inyección y Desacoplamiento:** Favorecer contratos e interfaces sobre implementaciones concretas para facilitar la sustitución de componentes y la ejecución de pruebas automatizadas.
3. **Manejo Centralizado de Excepciones:** Todas las fallas de infraestructura deben capturarse y traducirse a excepciones de dominio legibles.
4. **Cero Secretos en el Cliente:** Jamás exponer variables de entorno sensibles en componentes que compilen al navegador del usuario.

${p.architecture.customNotes ? `\n### Directivas Particulares del Proyecto:\n${p.architecture.customNotes}\n` : ''}
`;
}

/**
 * 3. DESIGN.md - Sistema de Diseño, Tokens Visuales & UI/UX
 */
export function generateDesign(p: LibretoProject): string {
  const currentStyle = DESIGN_STYLES.find((s) => s.id === p.design.style) || DESIGN_STYLES[0];
  const activePalette = p.design.styleColors?.[p.design.style] || currentStyle.colors;
  const styleInfo = getStyleTechInfo(p.design.style);

  const animLibrariesDetails = p.design.animationLibraries.length > 0
    ? p.design.animationLibraries.map((libName) => {
        const found = ANIMATION_LIBRARIES.find((l) => l.name.toLowerCase().includes(libName.toLowerCase()) || libName.toLowerCase().includes(l.name.toLowerCase()));
        if (found) {
          return `### 🎬 ${found.name}
- **Descripción:** ${found.description}
- **Repositorio Oficial:** [${found.repoUrl}](${found.repoUrl})
- **Comando de Instalación:**
\`\`\`bash
${found.installCommand}
\`\`\`
- **Ejemplo de Código:**
\`\`\`tsx
${found.sampleCode}
\`\`\`
`;
        }
        return `### 🎬 ${libName}
- **Instalación:** \`npm install ${libName.toLowerCase()}\`
`;
      }).join('\n')
    : 'No se han especificado librerías adicionales; utilizar animaciones nativas CSS / Tailwind.';

  const iconLibrariesDetails = p.design.iconLibraries.length > 0
    ? p.design.iconLibraries.map((iconName) => {
        const found = ICON_LIBRARIES.find((i) => i.name.toLowerCase().includes(iconName.toLowerCase()) || iconName.toLowerCase().includes(i.name.toLowerCase()));
        if (found) {
          return `### 🎨 ${found.name}
- **Descripción:** ${found.description}
- **Repositorio Oficial:** [${found.repoUrl}](${found.repoUrl})
- **Comando de Instalación:**
\`\`\`bash
${found.installCommand}
\`\`\`
- **Ejemplo de Importación:**
\`\`\`tsx
${found.sampleCode}
\`\`\`
`;
        }
        return `### 🎨 ${iconName}
- **Instalación:** \`npm install ${iconName.toLowerCase()}\`
`;
      }).join('\n')
    : 'No se han especificado librerías de iconos.';

  return `# SISTEMA DE DISEÑO & PAUTAS UI/UX: ${styleInfo.name.toUpperCase()}

> **Proyecto:** ${p.name}
> **Estilo Visual Seleccionado:** **${styleInfo.name}** (\`${styleInfo.category}\`)
> **Framework de Estilos:** \`${p.design.styleFramework}\`
> **Tipografía Principal:** \`${p.design.typography}\`
> **Estrategia de Modo Oscuro:** ${p.design.darkModeDefault ? 'Predeterminado en Modo Oscuro (Dark First)' : 'Predeterminado en Modo Claro con conmutador'}

---

## 1. FILOSOFÍA VISUAL Y LENGUAJE DE DISEÑO

### 1.1 Declaración Estética
${styleInfo.philosophy}

### 1.2 Reglas de CSS Mandatorias del Estilo
Para reproducir fielmente la estética **${styleInfo.name}**, la IA y el equipo deben emplear obligatoriamente las siguientes reglas CSS:
\`\`\`css
/* Reglas fundamentales de ${styleInfo.name} */
${styleInfo.cssRules.map((r) => `${r};`).join('\n')}
\`\`\`

---

## 2. ARQUITECTURA DE COLOR & TOKENS SEMÁNTICOS

La interfaz utiliza un sistema de diseño con nombres de tokens semánticos desacoplados de los valores hexadecimales para facilitar temas y coherencia:

| Token Semántico | Código Hexadecimal | Rol de Interfaz y Aplicación |
| :--- | :--- | :--- |
| **Color Primario (Brand)** | \`${p.design.primaryColor}\` | Botones de acción principal (CTA), enlaces activos, estados destacados |
| **Color Secundario / Acento** | \`${p.design.secondaryColor}\` | Badges, indicadores de estado, bordes focales, microdestellos |
${activePalette.map((c, i) => `| **Paleta del Estilo #${i + 1}** | \`${c}\` | Superficie, fondo, contraste o tarjeta de ${styleInfo.name} |`).join('\n')}

### 2.1 Tokens Específicos del Estilo ${styleInfo.name}
| Token Específico | Valor CSS | Función en Componentes |
| :--- | :--- | :--- |
${styleInfo.colorTokens.map((t) => `| **${t.token}** | \`${t.hex}\` | ${t.role} |`).join('\n')}

---

## 3. SISTEMA TIPOGRÁFICO Y ESCALA MODULAR

- **Familia Tipográfica:** \`${p.design.typography}\`
- **Pauta Tipográfica del Estilo:** ${styleInfo.typographyGuideline}

### 3.1 Escala Modular de Texto
| Nivel | Tamaño (rem / px) | Peso (Font Weight) | Tracking / Interletrado | Uso en Interfaz |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | \`3.0rem / 48px\` | 800 (Bold / Black) | \`-0.025em\` | Héroes visuales y grandes cifras |
| **H1** | \`2.25rem / 36px\` | 700 (Bold) | \`-0.02em\` | Título principal de página |
| **H2** | \`1.75rem / 28px\` | 600 (Semibold) | \`-0.015em\` | Títulos de secciones principales |
| **H3** | \`1.25rem / 20px\` | 600 (Semibold) | \`-0.01em\` | Encabezados de tarjetas y modales |
| **Body** | \`1.0rem / 16px\` | 400 (Regular) | \`0em\` | Párrafos de lectura estándar |
| **Small / Caption** | \`0.875rem / 14px\` | 500 (Medium) | \`+0.01em\` | Badges, metadatos y notas |
| **Code / Mono** | \`0.875rem / 14px\` | 500 (Medium) | \`0em\` | Identificadores, comandos y métricas |

---

## 4. ESPECIFICACIÓN DE COMPONENTES ATÓMICOS

Las directivas de maquetación para los componentes clave son:

${styleInfo.componentDirectives.map((d, i) => `### 4.${i + 1} Directiva de Componente: ${d}`).join('\n\n')}

### 4.4 Estados Interactivos Obligatorios
Todo componente accionable (botones, enlaces, filas interactivas) DEBE implementar 4 estados visuales distintos:
1. **Estado Normal (\`default\`):** Cumple los tokens de color y elevación base.
2. **Estado Hover (\`:hover\`):** Cambio sutil de luminosidad (escala 1.02x o desplazamiento -2px según estilo).
3. **Estado Focus-Visible (\`:focus-visible\`):** Anillo de enfoque de 2px con offset de 2px (\`ring-2 ring-primary ring-offset-2\`) para usuarios de teclado.
4. **Estado Activo / Presionado (\`:active\`):** Reducción de elevación o escala (0.98x) para retroalimentación táctil inmediata.
5. **Estado Deshabilitado (\`:disabled\`):** Opacidad reducida al 50%, cursor \`not-allowed\` e interactividad desactivada (\`pointer-events-none\`).

---

## 5. PERFIL DE ANIMACIÓN Y MICROINTERACCIONES

- **Perfil Dinámico del Estilo:** ${styleInfo.animationProfile}
- **Duraciones Estándar:**
  - Microinteracciones rápidas (hovers, tooltips): \`150ms\` a \`200ms\`.
  - Transiciones de componentes (modales, drawers): \`250ms\` a \`350ms\`.
  - Animaciones de entrada de página: \`400ms\` a \`500ms\`.
- **Curva de Atenuación Recomendada:** \`cubic-bezier(0.16, 1, 0.3, 1)\` (curva suave de aceleración inicial y frenado fluido).

---

## 6. LIBRERÍAS DE ANIMACIÓN E ICONOGRAFÍA SELECCIONADAS

${animLibrariesDetails}

---

${iconLibrariesDetails}

---

## 7. CRITERIOS DE ACCESIBILIDAD Y RESPONSIVIDAD (WCAG 2.1 AA)

1. **Ratio de Contraste:** Todo texto debe mantener un ratio de contraste mínimo de 4.5:1 respecto a su fondo (o 3:1 para titulares grandes).
2. **Soporte de Movimiento Reducido:** Respetar la preferencia del sistema \`prefers-reduced-motion: reduce\` suprimiendo traslaciones y rebotes exagerados.
3. **Breakpoints Responsivos (Mobile-First):**
   - \`sm\` (≥ 640px): Teléfonos en orientación horizontal / Phablets.
   - \`md\` (≥ 768px): Tabletas en vertical.
   - \`lg\` (≥ 1024px): Laptops y tabletas en horizontal.
   - \`xl\` (≥ 1280px): Monitores de escritorio estándar.
   - \`2xl\` (≥ 1536px): Pantallas panorámicas (contenedor centrado con \`max-w-7xl\`).

${p.design.customDesignGuidelines ? `\n### Directrices Específicas de Diseño:\n${p.design.customDesignGuidelines}\n` : ''}
`;
}

/**
 * 4. RULES.md - Reglas de Comportamiento de la IA & Regla de Oro
 */
export function generateRules(p: LibretoProject): string {
  const feInfo = getFrontendTechInfo(p.architecture.frontendFramework);
  const beInfo = getBackendTechInfo(p.architecture.backendFramework);
  const dbInfo = getDatabaseTechInfo(p.architecture.database);

  const extraRules = [
    p.rules.atomicModifications && `### Directiva 1: Modificaciones Atómicas y Quirúrgicas
- **Prohibición de Sobrescrituras Masivas:** Queda terminantemente prohibido reescribir archivos enteros cuando solo se requiere modificar un bloque acotado de líneas.
- **Técnica Obligatoria:** Utilizar reemplazos dirigidos y preservar rigurosamente todos los comentarios, documentación y tipos existentes no relacionados con la modificación.`,

    p.rules.strictTyping && `### Directiva 2: Tipado Estricto Sin Excepciones
- **Prohibición de Any:** Queda prohibido el uso de \`any\`, conversiones arbitrarias (\`as unknown as T\`) o tipados implícitos no verificados.
- **Contratos Explícitos:** Cada parámetro de función, valor de retorno, estado reactivo y carga útil de API debe contar con una interfaz o tipo explícito exportado.`,

    p.rules.mandatoryExceptionHandling && `### Directiva 3: Manejo Obligatorio y Defensivo de Excepciones
- **Bloques Try/Catch:** Toda operación asíncrona, llamada a API o mutación de base de datos debe encapsularse en bloques \`try/catch\` estructurados.
- **Códigos Semánticos:** Mapear excepciones a códigos HTTP semánticos (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Error) evitando responder 200 OK con cuerpos que contengan mensajes de falla.`,

    p.rules.strictModularity && `### Directiva 4: Modularidad Estricta y Límite de 50 Líneas Útiles
- **Límite por Función:** Ninguna función, método o componente individual debe exceder las 50 líneas de código útil.
- **Descomposición:** Si una función crece más allá de este límite, DEBE descomponerse en funciones auxiliares puras, custom hooks o subcomponentes desacoplados.`,

    p.rules.gitCommitConventions && `### Directiva 5: Estándar Conventional Commits
- Todo mensaje de commit debe seguir la convención internacional:
  - \`feat:\` Nueva funcionalidad para el usuario.
  - \`fix:\` Corrección de un defecto o error reportado.
  - \`refactor:\` Reestructuración de código sin alterar su comportamiento externo.
  - \`docs:\` Modificaciones exclusivas en documentación.
  - \`test:\` Creación o ajuste de pruebas unitarias o de integración.
  - \`chore:\` Mantenimiento de configuración, dependencias o tooling.`,

    p.rules.testCoverageRequirement && `### Directiva 6: Mandato de Cobertura de Pruebas Automatizadas
- Cada nuevo módulo de lógica empresarial, utilidad matemática o formateador debe acompañarse de su correspondiente archivo de pruebas unitarias (\`*.test.ts\` o \`*.spec.ts\`).`,
  ].filter(Boolean);

  const customRulesList = p.rules.customRules.length > 0
    ? `### Directivas Adicionales Formuladas por el Propietario:\n${p.rules.customRules.map((r, i) => `${i + 1}. **${r}**`).join('\n')}`
    : '';

  return `# REGLAS DE COMPORTAMIENTO VINCULANTES PARA LA INTELIGENCIA ARTIFICIAL

> **Documento Legal y Operativo de Cumplimiento Innegociable**
> **Proyecto:** ${p.name}
> **Stack Ratificado:** ${feInfo.name} + ${beInfo.name} + ${dbInfo.name}

---

## ⚡ REGLA DE ORO OBLIGATORIA (MÁXIMA PRIORIDAD OPERATIVA)

> ### 🛑 REGLA DE ORO INAMOVIBLE:
> **«La Inteligencia Artificial DEBE preguntar siempre y solicitar aprobación explícita al usuario ANTES de instalar dependencias, ejecutar comandos en terminal, crear nuevos archivos o modificar funcionalidad existente. Debe presentar siempre un resumen previo con los archivos afectados y el impacto del cambio antes de tocar el código».**

Cualquier acción unilateral en la que el asistente instale librerías no pactadas, sobreescriba configuraciones de entorno o modifique archivos estructurales sin autorización previa constituye una violación crítica de este protocolo.

---

## 📋 DIRECTIVAS TÉCNICAS OBLIGATORIAS DE INGENIERÍA

${extraRules.join('\n\n')}

${customRulesList ? `\n---\n${customRulesList}\n` : ''}

---

## 🛡️ PROTOCOLO ESTÁNDAR DE INTERACCIÓN ANTES DE CADA ACCIÓN

Antes de sugerir o aplicar cualquier cambio sobre el código fuente, el asistente IA debe emitir una propuesta con la siguiente estructura de 4 puntos:

1. **🎯 Objetivo y Razón del Cambio:**
   Explicación concisa y técnica de qué se va a resolver y por qué es necesario.
2. **📁 Archivos Afectados:**
   Lista explícita de rutas de archivo que se crearán, editarán o eliminarán.
3. **📦 Dependencias / Comandos CLI Requeridos (si aplica):**
   Comando exacto a ejecutar y justificación técnica del paquete solicitado.
4. **❓ Solicitud Formal de Confirmación:**
   *"¿Autorizas la ejecución de estos cambios según lo descrito?"*
`;
}

/**
 * 5. DECISIONS.md - Registros de Decisiones de Arquitectura (ADR)
 */
export function generateDecisions(p: LibretoProject): string {
  const feInfo = getFrontendTechInfo(p.architecture.frontendFramework);
  const beInfo = getBackendTechInfo(p.architecture.backendFramework);
  const dbInfo = getDatabaseTechInfo(p.architecture.database);
  const patInfo = getPatternTechInfo(p.architecture.architecturalPattern);
  const styleInfo = getStyleTechInfo(p.design.style);

  const adrList = [
    {
      id: 'ADR-001',
      title: `Adopción del Framework Frontend: ${feInfo.name}`,
      status: 'Aprobado y Ratificado',
      context: `Se requiere una solución visual de alto rendimiento, excelente experiencia de desarrollo y sólida tipificación para la plataforma ${p.architecture.platform.toUpperCase()}. Se evaluaron alternativas de la industria.`,
      decision: `Se adopta de forma oficial y vinculante **${feInfo.name}** (${feInfo.category}) bajo el paradigma \`${feInfo.paradigm}\`.`,
      consequences: `Todas las vistas, componentes y estados de cliente deben implementarse exclusivamente conforme a las convenciones de este framework. Queda prohibida la introducción de librerías visuales concurrentes que inflen el bundle.`,
      discarded: `Frameworks no consensuados o librerías legacy incompatibles con el stack ratificado.`,
    },
    {
      id: 'ADR-002',
      title: `Estrategia de Backend y Runtime: ${beInfo.name}`,
      status: 'Aprobado y Ratificado',
      context: `La lógica de negocio y persistencia requiere un entorno de procesamiento confiable y escalable que se comunique a través de ${p.architecture.connectionType}.`,
      decision: `Se selecciona **${beInfo.name}** como el motor de backend oficial.`,
      consequences: `Garantiza contratos de API uniformes, validación robusta y cumplimiento de los patrones de desacoplamiento.`,
      discarded: `Monolitos no estructurados, servidores desprovistos de tipado estricto o servicios no pactados.`,
    },
    {
      id: 'ADR-003',
      title: `Motor de Persistencia y Base de Datos: ${dbInfo.name}`,
      status: 'Aprobado y Ratificado',
      context: `El sistema requiere persistencia segura y transaccional acorde a la naturaleza de los requerimientos funcionales del proyecto.`,
      decision: `Se implementa **${dbInfo.name}** (${dbInfo.category}) como la capa de persistencia autorizada.`,
      consequences: `Todas las consultas, migraciones de esquema e índices deben optimizarse específicamente para las capacidades nativas de este motor.`,
      discarded: `Bases de datos no acordadas que requieran infraestructuras o licencias no autorizadas por el equipo.`,
    },
    {
      id: 'ADR-004',
      title: `Sistema de Diseño Visual y Tokens: ${styleInfo.name} con ${p.design.styleFramework}`,
      status: 'Aprobado y Ratificado',
      context: `Para garantizar coherencia estética ejecutiva, accesibilidad y velocidad de maquetación en el equipo.`,
      decision: `Se establece el estilo visual **${styleInfo.name}** complementado con el framework de utilidades **${p.design.styleFramework}** y la tipografía **${p.design.typography}**.`,
      consequences: `Queda terminantemente prohibido escribir CSS en línea desordenado con colores hexadecimales arbitrarios fuera de los tokens semánticos definidos en \`DESIGN.md\`.`,
      discarded: `Librerías pesadas de componentes que impidan la personalización de los tokens visuales del estilo.`,
    },
    {
      id: 'ADR-005',
      title: `Patrón Arquitectónico del Software: ${patInfo.name}`,
      status: 'Aprobado y Ratificado',
      context: `Para evitar la deuda técnica y permitir la evolución desacoplada de la base de código.`,
      decision: `Se ratifica el patrón **${patInfo.name}** como la directiva estructural obligatoria.`,
      consequences: `El código debe segregarse estrictamente por capas funcionales según el árbol canónico de carpetas documentado en \`ARCHITECTURE.md\`.`,
      discarded: `Estructuras planas sin separación de responsabilidades ("Código Espagueti").`,
    },
    {
      id: 'ADR-006',
      title: `Gestión de Seguridad, Variables de Entorno y Secretos`,
      status: 'Aprobado y Ratificado',
      context: `Prevenir filtraciones de credenciales de infraestructura o claves de APIs privadas en repositorios de código abierto o compartidos.`,
      decision: `Se establece una política de cero secretos comiteados en Git, uso obligatorio de \`.env.example\` y almacenamiento de tokens de sesión exclusivamente en cookies HttpOnly o bóvedas nativas.`,
      consequences: `Toda variable requerida debe documentarse y auditarse en revisiones de código previas a la integración.`,
      discarded: `Hardcodear cadenas de conexión o llaves de API directamente en el código fuente.`,
    },
  ];

  const customAdrs = p.decisions.customDecisions.map((c, i) => `
### ADR-${String(adrList.length + i + 1).padStart(3, '0')}: ${c.title}
- **Estado:** ✅ Aprobado y Ratificado
- **Contexto:** ${c.context}
- **Decisión:** ${c.decision}
- **Consecuencias:** ${c.consequences}
- **Alternativas Descartadas:** ${c.discardedAlternatives}
`).join('\n---\n');

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
- **Estado:** ✅ ${adr.status}
- **Contexto:** ${adr.context}
- **Decisión:** ${adr.decision}
- **Consecuencias:** ${adr.consequences}
- **Alternativas Descartadas:** ${adr.discarded}
`).join('\n---\n')}

${customAdrs ? `\n---\n## ADRs ADICIONALES ESPECÍFICOS DEL PROYECTO\n${customAdrs}` : ''}
`;
}

/**
 * 6. SECURITY.md - Directrices de Seguridad Informática & OWASP
 */
export function generateSecurity(p: LibretoProject): string {
  const policies = [
    p.security.envVariablesManagement && `### 1. 🔐 Gestión Estricta de Variables de Entorno y Secretos
- **Cero Credenciales en Código:** Ningún token, API Key, contraseña de base de datos o secreto debe figurar en el código fuente ni en el historial de Git.
- **Plantilla Obligatoria:** Mantener actualizado \`.env.example\` con todas las variables requeridas asignadas a valores descriptivos ficticios.
- **Protección de Git:** Verificar que \`.env\`, \`.env.local\`, \`*.pem\` y \`*.key\` figuren expresamente en el archivo \`.gitignore\`.`,

    p.security.secureAuth && `### 2. 🛡️ Autenticación y Autorización Robusta
- **Almacenamiento Web de Tokens:** Almacenar tokens JWT y cookies de sesión exclusivamente en **cookies con flags \`HttpOnly\`, \`Secure\` y \`SameSite=Strict\`**. Queda prohibido el almacenamiento de tokens sensibles en \`localStorage\` debido a la exposición a ataques XSS.
- **Entornos Móviles:** Utilizar bóvedas de claves cifradas por hardware (\`SecureStore\` en Expo / Keychain en iOS / Keystore en Android).
- **Ciclo de Vida de Tokens:** Configurar Access Tokens de vida corta (15 minutos) combinados con rotación estricta de Refresh Tokens.`,

    p.security.inputSanitization && `### 3. 🧹 Sanitización de Entradas y Validación de Esquemas
- **Validación en Frontera:** Toda solicitud entrante a la API debe validarse mediante esquemas estrictos (Zod, Pydantic, class-validator) antes de que el controlador o servicio ejecute cualquier acción.
- **Defensa contra Asignación Masiva:** Descartar propiedades no declaradas explícitamente en los esquemas (whitelist) para prevenir inyecciones de campos protegidos (ej. \`isAdmin: true\`).`,

    p.security.sqlInjectionAndXssProtection && `### 4. 🛑 Protección contra Inyección SQL y Cross-Site Scripting (XSS)
- **Consultas Parametrizadas:** Queda prohibida la interpolación directa de cadenas de texto para construir sentencias SQL. Utilizar siempre consultas preparadas o el query builder del ORM.
- **Escape Automático:** Escapar todo contenido dinámico renderizado en el navegador. Prohibido el uso de \`dangerouslySetInnerHTML\` salvo sanitización previa obligatoria mediante librerías como \`DOMPurify\`.`,

    p.security.corsAndSecurityHeaders && `### 5. 🌐 Políticas de CORS y Cabeceras de Seguridad HTTP
- **CORS Restrictivo:** Configurar una lista blanca explícita de dominios autorizados. Prohibido el uso de comodines (\`Access-Control-Allow-Origin: *\`) en rutas autenticadas.
- **Cabeceras Defensivas:** Implementar cabeceras estándar:
  - \`Content-Security-Policy (CSP)\`
  - \`X-Frame-Options: DENY\`
  - \`X-Content-Type-Options: nosniff\`
  - \`Strict-Transport-Security (HSTS)\`
  - \`Referrer-Policy: strict-origin-when-cross-origin\``,

    p.security.rateLimiting && `### 6. ⏱️ Limitación de Tasa (Rate Limiting) y Protección contra Fuerza Bruta
- Aplicar limitadores de tasa (ej. Redis sliding window o express-rate-limit) en endpoints críticos: login, registro, recuperación de contraseñas y transacciones financieras.`,

    p.security.csrfProtection && `### 7. 🔒 Protección contra Falsificación de Peticiones en Sitios Cruzados (CSRF)
- Validar tokens antifalsificación CSRF o confiar en el aislamiento estricto de cookies \`SameSite=Strict\` para todas las mutaciones HTTP (POST, PUT, PATCH, DELETE).`,
  ].filter(Boolean);

  const customSec = p.security.customSecurityPolicies.length > 0
    ? `### 8. Políticas Adicionales Formuladas por el Propietario\n${p.security.customSecurityPolicies.map((s) => `- ${s}`).join('\n')}`
    : '';

  return `# MANUAL Y DIRECTRICES DE SEGURIDAD INFORMÁTICA

> **Proyecto:** ${p.name}
> **Nivel de Exigencia:** Máximo / Grado de Producción
> **Marco de Referencia:** OWASP Top 10 & CWE Top 25

---

## 🛡️ DIRECTIVAS DE SEGURIDAD DEFENSIVA

${policies.join('\n\n')}

${customSec ? `\n---\n${customSec}\n` : ''}

---

## 📋 CHECKLIST EXHAUSTIVO DE AUDITORÍA PREVIO A DESPLIEGUE

Antes de promover la aplicación a entornos de producción, se debe verificar el 100% de los siguientes puntos:

- [ ] **Secretos:** Verificación mediante \`git log\` de que no existen credenciales hardcodeadas en ningún commit.
- [ ] **Variables de Entorno:** Comprobación de que todas las variables en \`.env.example\` cuentan con valores configurados en el host de producción.
- [ ] **Validación de Esquemas:** Cobertura de validación activa en el 100% de los endpoints públicos y privados.
- [ ] **Auditoría de Vulnerabilidades:** Ejecución limpia de \`npm audit\` / \`safety check\` con 0 alertas críticas o altas.
- [ ] **Cabeceras HTTP:** Verificación de calificación "A+" en escáneres de seguridad (ej. securityheaders.com).
- [ ] **Manejo de Errores:** Confirmación de que las trazas de error (stack traces) internas están ocultas al usuario final en producción.
`;
}

/**
 * 7. TASKS.md - Hoja de Ruta Secuencial de Ejecución
 */
export function generateTasks(p: LibretoProject): string {
  const feInfo = getFrontendTechInfo(p.architecture.frontendFramework);
  const beInfo = getBackendTechInfo(p.architecture.backendFramework);
  const patInfo = getPatternTechInfo(p.architecture.architecturalPattern);
  const styleInfo = getStyleTechInfo(p.design.style);

  // Asegurar que usamos las fases dinámicas si están disponibles
  const phases = p.tasks.phases && p.tasks.phases.length > 0
    ? p.tasks.phases
    : generateSuggestedTasks(p);

  const phasesOutput = phases.map((phase, idx) => {
    const taskItems = phase.tasks.map((t) => `- [ ] ${t}`).join('\n');
    return `### Fase ${idx + 1}: ${phase.name}
${taskItems}

#### Criterios de Aceptación y Definición de Terminado (DoD) de la Fase ${idx + 1}:
- [ ] Todas las tareas de esta fase cuentan con pruebas unitarias o de integración operativas.
- [ ] No existen errores de tipado en TypeScript (\`npx tsc --noEmit\` exitoso).
- [ ] Los componentes construidos respetan los tokens y estética de \`${styleInfo.name}\`.
- [ ] El usuario ha confirmado la revisión satisfactoria de este hito antes de iniciar la siguiente fase.
`;
  }).join('\n---\n\n');

  return `# HOJA DE RUTA SECUENCIAL DE EJECUCIÓN (TASKS)

> **Proyecto:** ${p.name}
> **Ecosistema:** ${feInfo.name} | ${beInfo.name} | ${p.architecture.database}
> **Patrón Arquitectónico:** ${patInfo.name} (\`${patInfo.category}\`)
> **Metodología:** Desarrollo Iterativo e Incremental Asistido por Inteligencia Artificial

---

## 📌 INSTRUCCIONES OPERATIVAS VINCULANTES PARA LA IA

1. **Secuencialidad Estricta:** Abordar las tareas en estricto orden secuencial fase por fase. Queda prohibido avanzar a fases posteriores si la fase activa presenta tareas pendientes o pruebas fallidas.
2. **Protocolo de Aprobación:** Solicitar confirmación al usuario antes de modificar el estado de cada tarea a \`- [x]\`.
3. **Comandos Recomendados del Stack:**
\`\`\`bash
# Servidor de Desarrollo
${feInfo.cliCommands[0]?.command || 'npm run dev'}

# Verificación de Tipos y Linter
npx tsc --noEmit && npm run lint

# Compilación de Producción
${feInfo.cliCommands[1]?.command || 'npm run build'}
\`\`\`

---

${phasesOutput}
`;
}

/**
 * 8. MEMORY.md - Bitácora Viva de Estado y Memoria de Sesiones
 */
export function generateMemory(p: LibretoProject): string {
  const feInfo = getFrontendTechInfo(p.architecture.frontendFramework);
  const beInfo = getBackendTechInfo(p.architecture.backendFramework);

  const completedList = p.memory.completedMilestones.length > 0
    ? p.memory.completedMilestones.map((m) => `- [x] ${m}`).join('\n')
    : `- [x] Inicialización del libreto de directivas para "${p.name}".\n- [x] Ratificación de la arquitectura técnica y sistema de diseño.`;

  const inProgressList = p.memory.inProgressMilestones.length > 0
    ? p.memory.inProgressMilestones.map((m) => `- [ ] ⏳ **${m}**`).join('\n')
    : '- [ ] ⏳ **Fase 1: Configuración inicial del entorno y componentes base.**';

  const blockersList = p.memory.blockers.length > 0
    ? p.memory.blockers.map((b) => `- ⚠️ ${b}`).join('\n')
    : '- Ninguno identificado al momento. El entorno de trabajo se encuentra despejado.';

  return `# BITÁCORA VIVA DE ESTADO & MEMORIA DEL PROYECTO (MEMORY)

> **Proyecto:** ${p.name}
> **Archivo de Persistencia de Contexto para Sesiones de IA**
> **Última Actualización:** ${new Date().toLocaleString()}

---

## 1. ESTADO ACTUAL DEL PROYECTO & RESUMEN EJECUTIVO

${p.memory.currentState}

- **Hito / Sprint Activo:** \`${p.memory.activeSprintOrMilestone}\`
- **Pila en Ejecución:** ${feInfo.name} + ${beInfo.name} + ${p.architecture.database}
- **Estilo Visual:** ${p.design.style} (${p.design.styleFramework})

---

## 2. HITOS COMPLETADOS & VALIDADOS

${completedList}

---

## 3. HITOS EN PROGRESO ACTIVO (FOCO ACTUAL)

${inProgressList}

---

## 4. BLOQUEOS, RIESGOS Y DEUDA TÉCNICA

${blockersList}

---

## 5. PROTOCOLO DE TRASPASO ENTRE SESIONES DE IA

Al iniciar una nueva sesión de desarrollo asistido por IA, el asistente DEBE:
1. Leer \`MEMORY.md\` para conocer el último sprint completado y las tareas en curso.
2. Leer \`TASKS.md\` para ubicar la fase actual.
3. Informar al usuario: *"Contexto recuperado de MEMORY.md: Nos encontramos en ${p.memory.activeSprintOrMilestone}. ¿Continuamos con las tareas pendientes de esta fase?"*
4. Tras finalizar una intervención significativa, actualizar este archivo con las nuevas tareas completadas.

---

## 6. HISTORIAL DE VERSIONES Y CAMBIOS (CHANGELOG)

### [Sesión 0: Inicialización del Libreto] - ${new Date().toLocaleDateString()}
- **Autor:** Sistema "Construcción de Libreto"
- **Acciones Realizadas:**
  - Generación de los 8 archivos maestros: PRD, ARCHITECTURE, DESIGN, RULES, DECISIONS, SECURITY, TASKS y MEMORY.
  - Ratificación formal de la pila tecnológica: ${feInfo.name} + ${beInfo.name} + ${p.architecture.database}.
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
