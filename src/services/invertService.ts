import {
  StudentPersonaId,
  STUDENT_PERSONAS,
  TeachingMessage,
  KnowledgeReport,
  ReviewFlashcard,
  VirtualStudentProgress,
} from '../types/invert';

const PROGRESS_STORAGE_KEY = 'studyflow_invert_progress_v2';
const REPORTS_STORAGE_KEY = 'studyflow_invert_reports_v1';

const INITIAL_PROGRESS: VirtualStudentProgress = {
  level: 1,
  levelTitle: 'Leigo Curioso',
  currentXP: 80,
  xpToNextLevel: 150,
  totalSessionsCompleted: 1,
  diplomasUnlocked: ['Primeira Aula Ministrada'],
  dailySessionsCount: 1,
  lastSessionDate: new Date().toISOString().split('T')[0],
};

const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Leigo Curioso', maxXP: 150 },
  { level: 2, title: 'Aprendiz Dedicado', maxXP: 350 },
  { level: 3, title: 'Estudante Aplicado', maxXP: 650 },
  { level: 4, title: 'Pensador Crítico', maxXP: 1050 },
  { level: 5, title: 'Mestre da Didática Feynman', maxXP: 2000 },
];

export const InvertService = {
  /**
   * Obtém o progresso de evolução do aluno virtual do localStorage.
   */
  getProgress(): VirtualStudentProgress {
    try {
      const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!raw) {
        this.saveProgress(INITIAL_PROGRESS);
        return INITIAL_PROGRESS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_PROGRESS;
    }
  },

  /**
   * Salva o progresso no localStorage.
   */
  saveProgress(progress: VirtualStudentProgress): void {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (err) {
      console.error('Erro ao salvar progresso do Invert:', err);
    }
  },

  /**
   * Adiciona XP e verifica subida de nível e novos diplomas.
   */
  addXP(amount: number, personaId: StudentPersonaId, score: number): {
    updatedProgress: VirtualStudentProgress;
    leveledUp: boolean;
    newDiploma: string | null;
  } {
    const progress = this.getProgress();
    const newXP = progress.currentXP + amount;
    let newLevel = progress.level;
    let newLevelTitle = progress.levelTitle;
    let leveledUp = false;

    // Verifica evolução de nível
    for (const threshold of LEVEL_THRESHOLDS) {
      if (newXP >= threshold.maxXP && threshold.level >= newLevel && threshold.level < 5) {
        newLevel = threshold.level + 1;
        newLevelTitle = LEVEL_THRESHOLDS.find((l) => l.level === newLevel)?.title || 'Mestre';
        leveledUp = true;
      }
    }

    const currentThreshold = LEVEL_THRESHOLDS.find((l) => l.level === newLevel) || LEVEL_THRESHOLDS[4];

    // Checagem de diplomas
    const unlocked = [...progress.diplomasUnlocked];
    let newDiploma: string | null = null;

    if (score >= 90 && !unlocked.includes('Didática Impecável (Nota 90+)')) {
      newDiploma = 'Didática Impecável (Nota 90+)';
      unlocked.push(newDiploma);
    }
    if (personaId === 'sobrinho' && !unlocked.includes('Domador de Analogias (Sobrinho)')) {
      newDiploma = 'Domador de Analogias (Sobrinho)';
      unlocked.push(newDiploma);
    }
    if (personaId === 'cetico' && !unlocked.includes('Vencedor de Céticos')) {
      newDiploma = 'Vencedor de Céticos';
      unlocked.push(newDiploma);
    }
    if (personaId === 'vestibulando' && !unlocked.includes('Mestre da Precisão ENEM')) {
      newDiploma = 'Mestre da Precisão ENEM';
      unlocked.push(newDiploma);
    }

    const updated: VirtualStudentProgress = {
      level: newLevel,
      levelTitle: newLevelTitle,
      currentXP: newXP,
      xpToNextLevel: currentThreshold.maxXP,
      totalSessionsCompleted: progress.totalSessionsCompleted + 1,
      diplomasUnlocked: unlocked,
      dailySessionsCount: progress.dailySessionsCount + 1,
      lastSessionDate: new Date().toISOString().split('T')[0],
    };

    this.saveProgress(updated);
    return { updatedProgress: updated, leveledUp, newDiploma };
  },

  /**
   * Gera a réplica do aluno virtual baseada na persona e na explicação fornecida.
   */
  async generateStudentReaction(
    topic: string,
    personaId: StudentPersonaId,
    explanation: string,
    history: TeachingMessage[]
  ): Promise<string> {
    const persona = STUDENT_PERSONAS[personaId];
    const explanationLower = explanation.toLowerCase();

    // Simulação com inteligência heurística contextual por persona
    if (personaId === 'sobrinho') {
      const complexTerms = ['algoritmo', 'paradigma', 'polimorfismo', 'mitocôndria', 'hermenêutica', 'complexidade', 'sintaxe', 'abstração'];
      const foundTerm = complexTerms.find((t) => explanationLower.includes(t));

      if (foundTerm) {
        return `Tio(a), você falou "${foundTerm}"... o que isso significa no mundo real? É tipo uma peça de Lego ou um poder de videogame? Me explica como se eu tivesse brincando no recreio!`;
      }
      if (explanation.length < 60) {
        return `Hummm, achei muito curtinho! Me conta mais! Mas se acontecer algo diferente no meio, o que o "${topic}" faz?`;
      }
      return `Ahhh, entendi que ${topic} serve para ajudar as coisas a funcionarem! Mas me explica: por que as pessoas não fazem isso de outro jeito mais fácil?`;
    }

    if (personaId === 'cetico') {
      if (explanation.includes('sempre') || explanation.includes('nunca') || explanation.includes('óbvio') || explanation.includes('com certeza')) {
        return `Você disse que isso "sempre" acontece. Mas qual é a evidência disso? Não existe nenhuma exceção ou caso de borda onde essa teoria falhe completamente? Me prove com um contraexemplo.`;
      }
      if (explanation.length < 80) {
        return `Sua explicação parece superficial. Você descreveu o que é, mas não explicou a CAUSA raiz. Por que esse mecanismo do ${topic} foi desenhado assim e não de outra forma?`;
      }
      return `Entendi o fluxo geral, mas ficou uma contradição no ar: como você garante que o sistema não entra em conflito quando há concorrência ou falha externa?`;
    }

    // Persona 'vestibulando'
    if (explanation.length < 80) {
      return `Professor(a), isso aí é o básico que todo mundo sabe. Se a banca da Fuvest ou do ENEM colocar uma pegadinha teórica cobrando a exceção da regra do ${topic}, como eu respondo para não perder ponto?`;
    }
    return `Show de bola! Mas me diz uma coisa: qual é a terminologia exata ou fórmula/conceito que a banca examinadora mais gosta de cobrar sobre ${topic}? Tem algum caso clássico de pegadinha?`;
  },

  /**
   * Gera o relatório do "Raio-X do Conhecimento" (Técnica Feynman)
   */
  generateKnowledgeReport(
    topic: string,
    personaId: StudentPersonaId,
    allExplanations: string[]
  ): KnowledgeReport {
    const fullText = allExplanations.join(' ');
    const length = fullText.length;

    // Cálculo da nota de clareza com base na densidade e expressividade
    let clarityScore = Math.min(96, Math.max(68, Math.round(72 + (length / 80))));
    if (length > 400) clarityScore = Math.min(98, clarityScore + 8);

    const masteredConcepts: string[] = [
      `Definição central e objetivo prático de ${topic}`,
      'Capacidade de encadear ideias com sequência lógica',
      'Esforço ativo de adaptação da linguagem para a persona escolhida',
    ];

    const blindSpots: string[] = [];
    const conceptualErrors: string[] = [];
    const generatedFlashcards: ReviewFlashcard[] = [];

    if (length < 250) {
      blindSpots.push(`Casos de borda e exceções práticas de ${topic}`);
      blindSpots.push('Fundamentação dos princípios fundamentais por trás da regra');
    } else {
      blindSpots.push(`Análise comparativa de alternativas ou cenários de falha em ${topic}`);
    }

    if (personaId === 'sobrinho' && fullText.length < 300) {
      blindSpots.push('Criação de metáforas mais vívidas para fixação mnemônica');
    }

    if (personaId === 'cetico') {
      conceptualErrors.push('Afirmações categóricas sem explicitar o contexto de validade ou premissas');
    }

    // Criação de flashcards automáticos baseados nas lacunas
    generatedFlashcards.push({
      id: `fc-1-${Date.now()}`,
      topic,
      category: 'ponto_cego',
      question: `Como você explicaria o conceito central de "${topic}" para uma criança de 10 anos sem usar jargões?`,
      answer: `Use analogias do cotidiano (ex: receitas de bolo, peças de Lego ou regras de trânsito) focando na utilidade direta.`,
    });

    generatedFlashcards.push({
      id: `fc-2-${Date.now()}`,
      topic,
      category: 'reforco',
      question: `Qual é a causa e efeito primordial que faz "${topic}" funcionar?`,
      answer: `Identifique a entrada (input), a transformação lógica e o resultado esperado (output) sem pular etapas causais.`,
    });

    if (blindSpots.length > 0) {
      generatedFlashcards.push({
        id: `fc-3-${Date.now()}`,
        topic,
        category: 'erro_conceitual',
        question: `Qual é o principal ponto cego identificado na sua explicação sobre "${topic}"?`,
        answer: blindSpots[0],
      });
    }

    const xpEarned = Math.round(clarityScore * 1.5);

    const report: KnowledgeReport = {
      id: `report_${Date.now()}`,
      topic,
      personaId,
      clarityScore,
      masteredConcepts,
      blindSpots,
      conceptualErrors,
      pedagogicalAdvice:
        clarityScore >= 85
          ? 'Excelente didática! Você demonstrou domínio sólido ao simplificar sem perder a precisão do conteúdo.'
          : 'Boa explicação inicial! Tente enriquecer sua fala com exemplos do mundo real e justificar os "porquês" de cada etapa.',
      generatedFlashcards,
      xpEarned,
      createdAt: new Date().toISOString(),
    };

    // Salva no histórico de relatórios
    this.saveReport(report);

    // Concede XP e atualiza gamificação
    this.addXP(xpEarned, personaId, clarityScore);

    return report;
  },

  /**
   * Salva um relatório no histórico do usuário.
   */
  saveReport(report: KnowledgeReport): void {
    try {
      const existing = this.getSavedReports();
      const updated = [report, ...existing].slice(0, 20); // guarda os últimos 20
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Erro ao salvar relatório Feynman:', err);
    }
  },

  /**
   * Recupera histórico de relatórios salvos.
   */
  getSavedReports(): KnowledgeReport[] {
    try {
      const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Fala em voz alta usando SpeechSynthesis (Modo Caminhada / Áudio)
   */
  speakText(text: string, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Para falas anteriores
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  },

  /**
   * Interrompe qualquer áudio em execução.
   */
  stopSpeaking(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },
};

