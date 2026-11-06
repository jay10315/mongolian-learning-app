// アプリケーション型定義

export type PriorityLevel = '★★★' | '★★' | '★';

export type PosType = 
  | '名詞' 
  | '動詞' 
  | '形容詞' 
  | '副詞' 
  | '代名詞' 
  | '助詞' 
  | 'あいさつ' 
  | '数詞' 
  | '名詞句' 
  | '動詞句' 
  | '間投詞' 
  | '接続詞' 
  | '疑問詞' 
  | '後置詞';

export interface VocabularyItem {
  id: string;
  mongolian: string;
  japanese: string;
  pronunciation?: string;
  root?: string; // 動詞の語幹
  pos?: PosType | string;
  category: string;
  lesson?: number;
  priority?: PriorityLevel;
  exampleMn?: string;
  exampleJa?: string;
  note?: string;
  wrongCount?: number;
  srsLevel?: number; // 0~5
  isMastered?: boolean;
  lastStudied?: string;
  createdAt?: string;
}

export interface GrammarItem {
  id: string;
  lesson: number;
  title: string;
  importance: PriorityLevel;
  type: '理解' | '暗記' | '応用';
  pattern: string;
  meaning: string;
  rules: string;
  caseRequirement?: string;
  contrast?: string;
  forKids?: string;
  examples: Array<{
    mn: string;
    ja: string;
    note?: string;
  }>;
}

export interface GrammarQuizItem {
  id: string;
  lessonGroup: string;
  type: 'choice' | 'fill' | 'reorder' | 'correction' | 'translation';
  question: string;
  options?: string[];
  tokens?: string[];
  answer: string;
  acceptableAnswers?: string[];
  category: string;
  explanation: string;
  hint?: string;
}

export interface DeclensionQuizItem {
  id: string;
  type: 'declension' | 'conjugation';
  kind: 'noun' | 'verb';
  baseWord: string;
  baseMeaning: string;
  targetCase?: string;
  targetForm?: string;
  prompt: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  rule?: string;
  root?: string;
}

export interface MistakeItem {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  type: 'word' | 'grammar' | 'declension' | 'flashcard';
  category: string;
  explanation?: string;
  wrongCount: number;
  lastWrongDate: string;
  resolved: boolean;
}

export interface StudyHistoryEntry {
  id: string;
  timestamp: string;
  type: 'word' | 'grammar' | 'declension' | 'flashcard';
  total: number;
  correct: number;
  category?: string;
  mode?: string;
}

export interface AppSettings {
  dailyGoal: number;
  soundEffects: boolean;
  showPronunciation: boolean;
  useVirtualKeyboard: boolean;
  theme: 'light' | 'dark';
}
