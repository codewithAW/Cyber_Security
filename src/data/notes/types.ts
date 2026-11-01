export type CalloutType = 'definition' | 'concept' | 'example' | 'warning' | 'formula' | 'exam';

export interface NoteDefinition {
  term: string;
  pronunciation?: string;
  definition: string;
  keyTakeaway?: string;
}

export interface NoteExample {
  title: string;
  scenario: string;
  breakdown?: { label: string; detail: string }[];
  outcome?: string;
}

export interface FlowNode {
  label: string;
  sublabel?: string;
  highlight?: boolean;
}

export interface DiagramFlow {
  title: string;
  caption?: string;
  steps: FlowNode[];
  orientation?: 'horizontal' | 'vertical';
}

export interface CodeSnippet {
  language: string;
  title: string;
  caption?: string;
  vulnerableCode?: string;
  secureCode?: string;
  singleCode?: string;
  explanation: string;
}

export interface TableColumn {
  key: string;
  header: string;
}

export interface TableData {
  title: string;
  columns: TableColumn[];
  rows: Record<string, string>[];
}

export interface SubTopic {
  id: string;
  number: string;
  title: string;
  content: string[];
  definitions?: NoteDefinition[];
  examples?: NoteExample[];
  diagrams?: DiagramFlow[];
  codeSnippets?: CodeSnippet[];
  tables?: TableData[];
  keyPoints?: string[];
  supplementaryNotes?: string;
}

/* ----------------- PHASE 4.1 VISUAL & PRACTICAL LEARNING TYPES ----------------- */

export type AttackComponentColor = 'blue' | 'orange' | 'red' | 'green' | 'gray';

export interface AttackStage {
  step: number;
  title: string;
  actor: string;
  action: string;
  technicalDetail: string;
  color: AttackComponentColor;
  payload?: string;
}

export interface AttackVisualization {
  id: string;
  title: string;
  attackName: string;
  overview: string;
  targetVulnerability: string;
  stages: AttackStage[];
  mitigation: {
    title: string;
    rules: string[];
    codeComparison?: {
      vulnerableTitle: string;
      vulnerableCode: string;
      secureTitle: string;
      secureCode: string;
      explanation: string;
    };
  };
}

export interface PracticalStep {
  stepNumber: number;
  instruction: string;
  command?: string;
  commandExplanation?: string;
  codeSnippet?: {
    language: string;
    code: string;
    title: string;
  };
  expectedOutput?: string;
}

export interface HandsOnPractical {
  id: string;
  title: string;
  learningObjective: string;
  requiredTools: string[];
  environmentSetup: string;
  steps: PracticalStep[];
  whatHappened: string;
  securityLessons: string[];
  prevention: string[];
}

export interface BeforeAfterComparison {
  title: string;
  vulnerable: {
    label: string;
    codeOrConfig: string;
    explanation: string;
  };
  secure: {
    label: string;
    codeOrConfig: string;
    explanation: string;
  };
  keyTakeaway: string;
}

export interface TechnicalVisualInfo {
  type:
    | 'cia-triad'
    | 'client-server-firewall'
    | 'osi-vs-tcpip'
    | 'mitm-attack'
    | 'phishing-flow'
    | 'cloud-shared-responsibility'
    | 'iot-botnet-swarm'
    | 'wpa3-dragonfly';
  title: string;
  caption: string;
}

export interface Chapter {
  id: string;
  number: number;
  romanNumeral: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  summary: string;
  introParagraphs: string[];
  topics: SubTopic[];
  quickRevision: { topic: string; summary: string }[];
  rememberPoints: string[];
  examQuestions: { question: string; answerGuidance: string }[];
  // Phase 4.1 Extensions:
  technicalVisual?: TechnicalVisualInfo;
  attackVisualizations?: AttackVisualization[];
  handsOnPracticals?: HandsOnPractical[];
  beforeAfterComparisons?: BeforeAfterComparison[];
}

export interface MasterQuickRevisionItem {
  topic: string;
  simpleMeaning: string;
  chapterNumber: number;
  chapterId: string;
}

export interface CoreRuleItem {
  title: string;
  formula: string[];
  explanation: string;
}

export interface SearchResult {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  topicId?: string;
  topicTitle?: string;
  matchType: 'chapter' | 'topic' | 'definition' | 'content';
  snippet: string;
}
