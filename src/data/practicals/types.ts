export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type PracticalStatus = 'not-started' | 'in-progress' | 'completed';

export type SimulationType =
  | 'sqli'
  | 'xss'
  | 'phishing'
  | 'password-cracking'
  | 'firewall'
  | 'network-scan'
  | 'crypto'
  | 'mitm'
  | 'osint'
  | 'malware-analysis'
  | 'ddos'
  | 'idor'
  | 'cloud-security'
  | 'iot-mqtt';

export interface StepItem {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  expectedResult?: string;
}

export interface HintTier {
  tier: 1 | 2 | 3;
  title: string;
  content: string;
}

export interface KnowledgeCheck {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticalSolution {
  answer: string;
  detailedExplanation: string;
  codeSnippet?: {
    language: string;
    code: string;
    filename?: string;
  };
}

export interface PracticalExercise {
  id: string;
  slug: string; // e.g. "sql-injection"
  title: string;
  chapterNumber: number;
  chapterId: string;
  chapterSlug: string; // e.g. "chapter-3"
  chapterTitle: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  icon: string;
  summary: string;
  learningObjectives: string[];
  scenario: string;
  toolsAndConcepts: string[];
  steps: StepItem[];
  hints: HintTier[];
  solution: PracticalSolution;
  whatHappened: string;
  vulnerabilityExplanation: string;
  detectionMethods: string[];
  preventionAndMitigation: string[];
  knowledgeCheck: KnowledgeCheck;
  simulationType: SimulationType;
  badgeAwarded: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
}

export interface PracticalProgressRecord {
  completedAt?: string;
  usedHints: number;
  revealedSolution: boolean;
  pointsEarned: number;
  status: PracticalStatus;
  currentStep: number;
  checkedSteps: string[];
  quizCompleted?: boolean;
}

export interface UserPracticalsState {
  records: Record<string, PracticalProgressRecord>;
  totalPoints: number;
  badges: string[];
  lastActiveDate: string;
  streakDays: number;
}

