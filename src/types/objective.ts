export type ObjectiveStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyObjective {
  id: string;
  title: string;
  description: string;
  deadline: string; // Formato YYYY-MM-DD
  status: ObjectiveStatus;
  createdAt: string; // ISO String
  updatedAt?: string;
}

export type ObjectiveFormData = {
  title: string;
  description: string;
  deadline: string;
  status: ObjectiveStatus;
};

export const STATUS_LABELS: Record<ObjectiveStatus, string> = {
  nao_iniciado: 'Não iniciado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
};

export const STATUS_DESCRIPTIONS: Record<ObjectiveStatus, string> = {
  nao_iniciado: 'Planejado para começar em breve',
  em_andamento: 'Estudos atualmente em foco',
  concluido: 'Conteúdo finalizado com sucesso',
};
