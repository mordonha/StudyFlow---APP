import { StudyObjective, ObjectiveFormData } from '../types/objective';

const STORAGE_KEY = 'studyflow_objectives_v1';

/**
 * Objetivos iniciais para demonstrar a plataforma a um estudante iniciante
 * caso o armazenamento esteja vazio na primeira visita.
 */
const DEFAULT_SAMPLE_OBJECTIVES: StudyObjective[] = [
  {
    id: 'demo-obj-1',
    title: 'Fundamentos de Lógica e Algoritmos',
    description: 'Entender variáveis, estruturas condicionais e laços de repetição com exercícios práticos.',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-obj-2',
    title: 'Revisão de Biologia: Fotossíntese e Respiração Celular',
    description: 'Fazer resumos visuais e resolver 15 questões de provas anteriores.',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-obj-3',
    title: 'Vocabulário Básico de Inglês para Leitura Técnica',
    description: 'Praticar 50 palavras essenciais para artigos científicos e documentação técnica.',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Serviço responsável por gerenciar a persistência dos objetivos de estudo no localStorage.
 */
export const StorageService = {
  /**
   * Obtém todos os objetivos salvos no localStorage.
   */
  getAll(): StudyObjective[] {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        // Inicializa com dados de amostra para estudantes iniciantes não encontrarem a tela vazia na 1ª visita
        this.saveAll(DEFAULT_SAMPLE_OBJECTIVES);
        return DEFAULT_SAMPLE_OBJECTIVES;
      }
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage.
   */
  saveAll(objectives: StudyObjective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria e salva um novo objetivo.
   */
  create(data: ObjectiveFormData): StudyObjective {
    const newObjective: StudyObjective = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `obj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: new Date().toISOString(),
    };

    const currentList = this.getAll();
    const updatedList = [newObjective, ...currentList];
    this.saveAll(updatedList);
    return newObjective;
  },

  /**
   * Atualiza os dados de um objetivo existente pelo ID.
   */
  update(id: string, data: Partial<ObjectiveFormData>): StudyObjective | null {
    const currentList = this.getAll();
    const index = currentList.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedItem: StudyObjective = {
      ...currentList[index],
      ...data,
      title: data.title !== undefined ? data.title.trim() : currentList[index].title,
      description: data.description !== undefined ? data.description.trim() : currentList[index].description,
      updatedAt: new Date().toISOString(),
    };

    currentList[index] = updatedItem;
    this.saveAll(currentList);
    return updatedItem;
  },

  /**
   * Remove um objetivo pelo ID.
   */
  delete(id: string): boolean {
    const currentList = this.getAll();
    const filtered = currentList.filter((item) => item.id !== id);
    if (filtered.length === currentList.length) {
      return false;
    }
    this.saveAll(filtered);
    return true;
  },

  /**
   * Carrega os objetivos de demonstração novamente (útil para testes).
   */
  resetToSamples(): StudyObjective[] {
    this.saveAll(DEFAULT_SAMPLE_OBJECTIVES);
    return DEFAULT_SAMPLE_OBJECTIVES;
  },

  /**
   * Limpa todos os objetivos.
   */
  clearAll(): void {
    this.saveAll([]);
  },
};
