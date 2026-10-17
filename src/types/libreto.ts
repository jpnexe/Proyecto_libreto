export type TargetPlatform = 'web' | 'static' | 'mobile' | 'dual' | 'headless';

export type DesignStyleId =
  // Compatibilidad con proyectos previos
  | 'minimalist'
  | 'dark_cyberpunk'
  // Los 21 estilos maestros de diseño
  | 'glassmorphism'
  | 'neumorphism'
  | 'neo_brutalism'
  | 'pure_brutalism'
  | 'bento_grid'
  | 'dark_tech'
  | 'cyberpunk_neon'
  | 'minimalist_flat'
  | 'claymorphism'
  | 'skeuomorphism'
  | 'swiss_editorial'
  | 'aurora_ui'
  | 'terminal_cli'
  | 'material_design_3'
  | 'cupertino_ios'
  | 'y2k_aesthetic'
  | 'retro_win95'
  | 'pixel_art'
  | 'hand_drawn'
  | 'papercut_depth'
  | 'monochrome_pure';

export type MasterPromptTone =
  | 'strict_senior'
  | 'collaborative_expert'
  | 'architect_mentor'
  | 'minimalist_concise';

export interface CustomADR {
  id: string;
  title: string;
  context: string;
  decision: string;
  consequences: string;
  discardedAlternatives: string;
}

export interface TaskPhase {
  id: string;
  name: string;
  tasks: string[];
}

export interface LibretoProject {
  id: string;
  name: string;
  slug: string;
  description: string;
  targetAudience: string;
  version: string;
  createdAt: string;
  updatedAt: string;

  // MÓDULO A: ARCHITECTURE
  architecture: {
    platform: TargetPlatform;
    languages: string[];
    frontendFramework: string;
    backendFramework: string;
    database: string;
    connectionType: string;
    architecturalPattern: string;
    customNotes: string;
    isStaticSite?: boolean;
    staticHosting?: string;
    isHeadless?: boolean;
  };

  // MÓDULO B: DESIGN
  design: {
    style: DesignStyleId;
    styleFramework: string;
    animationLibraries: string[];
    iconLibraries: string[];
    primaryColor: string;
    secondaryColor: string;
    darkModeDefault: boolean;
    typography: string;
    customDesignGuidelines: string;
    customObservations?: string[];
    writtenNotes?: string;
    isNoInterface?: boolean;
    styleColors?: Record<string, string[]>;
  };

  // MÓDULO C: RULES (Reglas de la IA)
  rules: {
    goldenRule: boolean; // Siempre true
    atomicModifications: boolean;
    strictTyping: boolean;
    mandatoryExceptionHandling: boolean;
    strictModularity: boolean; // máx 50 líneas por función
    gitCommitConventions: boolean;
    testCoverageRequirement: boolean;
    customRules: string[];
    customNotes?: string;
  };

  // MÓDULO D: DECISIONS (ADRs)
  decisions: {
    strictlyForbidAlternativeStacks: boolean;
    customDecisions: CustomADR[];
    customNotes?: string;
  };

  // MÓDULO E: SECURITY
  security: {
    envVariablesManagement: boolean;
    secureAuth: boolean;
    inputSanitization: boolean;
    sqlInjectionAndXssProtection: boolean;
    corsAndSecurityHeaders: boolean;
    rateLimiting: boolean;
    csrfProtection: boolean;
    customSecurityPolicies: string[];
    customNotes?: string;
  };

  // MÓDULO F: PRD & MASTER PROMPT
  prd: {
    functionalRequirements: string[];
    nonFunctionalRequirements: string[];
    userStories: string[];
    masterPromptTone: MasterPromptTone;
    customMasterPromptDirectives: string;
    customNotes?: string;
  };

  // MÓDULO G: TASKS & MEMORY
  tasks: {
    phases: TaskPhase[];
    autoSync?: boolean;
    customEdited?: boolean;
    customNotes?: string;
  };
  memory: {
    currentState: string;
    activeSprintOrMilestone: string;
    completedMilestones: string[];
    inProgressMilestones: string[];
    blockers: string[];
    customNotes?: string;
  };
}

export type MarkdownFileKey =
  | 'PRD.md'
  | 'ARCHITECTURE.md'
  | 'DESIGN.md'
  | 'RULES.md'
  | 'DECISIONS.md'
  | 'SECURITY.md'
  | 'TASKS.md'
  | 'MEMORY.md';

export interface GeneratedFiles {
  'PRD.md': string;
  'ARCHITECTURE.md': string;
  'DESIGN.md': string;
  'RULES.md': string;
  'DECISIONS.md': string;
  'SECURITY.md': string;
  'TASKS.md': string;
  'MEMORY.md': string;
}
