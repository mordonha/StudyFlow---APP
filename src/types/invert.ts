export type StudentPersonaId = 'sobrinho' | 'cetico' | 'vestibulando';

export interface StudentPersona {
  id: StudentPersonaId;
  name: string;
  age: string;
  badge: string;
  avatar: string;
  tagline: string;
  description: string;
  promptDirective: string;
  challengeFocus: string;
  colorClass: string;
  bgLightClass: string;
  borderColorClass: string;
}

export interface TeachingMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isAudio?: boolean;
}

export interface ReviewFlashcard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  category: 'ponto_cego' | 'erro_conceitual' | 'reforco';
}

export interface KnowledgeReport {
  id: string;
  topic: string;
  personaId: StudentPersonaId;
  clarityScore: number; // 0 a 100
  masteredConcepts: string[];
  blindSpots: string[];
  conceptualErrors: string[];
  pedagogicalAdvice: string;
  generatedFlashcards: ReviewFlashcard[];
  xpEarned: number;
  createdAt: string;
}

export interface VirtualStudentProgress {
  level: number;
  levelTitle: string;
  currentXP: number;
  xpToNextLevel: number;
  totalSessionsCompleted: number;
  diplomasUnlocked: string[];
  dailySessionsCount: number;
  lastSessionDate: string;
}

export const STUDENT_PERSONAS: Record<StudentPersonaId, StudentPersona> = {
  sobrinho: {
    id: 'sobrinho',
    name: 'Arthur',
    age: '10 anos',
    badge: 'O Sobrinho Curioso',
    avatar: '👦',
    tagline: 'Obriga você a usar analogias e simplificar ao máximo.',
    description: 'Não conhece termos técnicos nem jargões. Se você usar palavras difíceis, ele vai pedir exemplos práticos de brinquedos, desenhos ou situações cotidianas.',
    promptDirective: 'Você é Arthur, um menino de 10 anos super curioso. Responda em português simples, com entusiasmo de criança, fazendo perguntas sobre palavras difíceis e pedindo metáforas divertidas.',
    challengeFocus: 'Eliminação de Jargões & Criação de Analogias',
    colorClass: 'text-amber-600',
    bgLightClass: 'bg-amber-50',
    borderColorClass: 'border-amber-200',
  },
  cetico: {
    id: 'cetico',
    name: 'Beatriz',
    age: '22 anos',
    badge: 'A Colega Cética',
    avatar: '🧐',
    tagline: 'Questiona suas fontes, aponta contradições e pede provas.',
    description: 'Duvida de afirmações vagas e quer entender os porquês profundos de cada etapa. Desafia o usuário a fundamentar e demonstrar causa e efeito.',
    promptDirective: 'Você é Beatriz, uma estudante universitária perspicaz e cética. Questione com respeito mas firmeza: "Mas por que exatamente isso acontece?", buscando inconsistências lógicas.',
    challengeFocus: 'Rigor Lógico & Causalidade',
    colorClass: 'text-indigo-600',
    bgLightClass: 'bg-indigo-50',
    borderColorClass: 'border-indigo-200',
  },
  vestibulando: {
    id: 'vestibulando',
    name: 'Carlos',
    age: '18 anos',
    badge: 'O Aluno Pré-Vestibular / Concurseiro',
    avatar: '🎯',
    tagline: 'Focado em pegadinhas, critérios técnicos e detalhes de prova.',
    description: 'Quer saber como esse assunto cai no ENEM ou em bancas examinadoras. Pede definições precisas, fórmulas e exceções às regras.',
    promptDirective: 'Você é Carlos, focado em passar em medicina ou concurso de ponta. Responda procurando pegadinhas clássicas e detalhes técnicos que costumam derrubar candidatos.',
    challengeFocus: 'Precisão Técnica & Detalhes de Prova',
    colorClass: 'text-emerald-600',
    bgLightClass: 'bg-emerald-50',
    borderColorClass: 'border-emerald-200',
  },
};

