import React from 'react';
import {
  Calendar,
  Clock,
  Edit3,
  Trash2,
  CheckCircle,
  PlayCircle,
  Circle,
  AlertCircle,
  Brain,
} from 'lucide-react';
import { StudyObjective, ObjectiveStatus, STATUS_LABELS } from '../types/objective';

interface GoalCardProps {
  objective: StudyObjective;
  onEdit: (objective: StudyObjective) => void;
  onDelete: (objective: StudyObjective) => void;
  onStatusChange: (id: string, newStatus: ObjectiveStatus) => void;
  onTeachTopic?: (topic: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  objective,
  onEdit,
  onDelete,
  onStatusChange,
  onTeachTopic,
}) => {
  // Cálculo do prazo relativo
  const getDeadlineInfo = (deadlineStr: string, isCompleted: boolean) => {
    if (!deadlineStr) return null;

    // Converte YYYY-MM-DD para objeto Date em horário local
    const [year, month, day] = deadlineStr.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = deadlineDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    if (isCompleted) {
      return {
        text: `Prazo: ${formattedDate}`,
        tag: 'Finalizado',
        urgencyClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      };
    }

    if (diffDays < 0) {
      return {
        text: `Prazo: ${formattedDate}`,
        tag: `Atrasado há ${Math.abs(diffDays)} dia(s)`,
        urgencyClass: 'text-rose-700 bg-rose-50 border-rose-200',
      };
    } else if (diffDays === 0) {
      return {
        text: `Prazo: ${formattedDate}`,
        tag: 'Vence hoje!',
        urgencyClass: 'text-amber-700 bg-amber-50 border-amber-200 font-medium',
      };
    } else if (diffDays === 1) {
      return {
        text: `Prazo: ${formattedDate}`,
        tag: 'Vence amanhã',
        urgencyClass: 'text-amber-700 bg-amber-50 border-amber-200',
      };
    } else if (diffDays <= 3) {
      return {
        text: `Prazo: ${formattedDate}`,
        tag: `Em ${diffDays} dias`,
        urgencyClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      };
    } else {
      return {
        text: `Prazo: ${formattedDate}`,
        tag: `Em ${diffDays} dias`,
        urgencyClass: 'text-slate-600 bg-slate-50 border-slate-200',
      };
    }
  };

  const deadlineInfo = getDeadlineInfo(objective.deadline, objective.status === 'concluido');

  // Metadados visuais de status
  const getStatusDisplay = (status: ObjectiveStatus) => {
    switch (status) {
      case 'concluido':
        return {
          icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
          label: STATUS_LABELS.concluido,
          colorClass: 'text-emerald-800 bg-emerald-50/80 border-emerald-200',
        };
      case 'em_andamento':
        return {
          icon: <PlayCircle className="w-4 h-4 text-amber-600" />,
          label: STATUS_LABELS.em_andamento,
          colorClass: 'text-amber-800 bg-amber-50/80 border-amber-200',
        };
      case 'nao_iniciado':
      default:
        return {
          icon: <Circle className="w-4 h-4 text-slate-400" />,
          label: STATUS_LABELS.nao_iniciado,
          colorClass: 'text-slate-700 bg-slate-50 border-slate-200',
        };
    }
  };

  const statusDisplay = getStatusDisplay(objective.status);

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between p-5">
      {/* Topo do Cartão: Status e Ações Rápidas */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Seletor rápido de status */}
          <div className="relative inline-flex items-center">
            <select
              value={objective.status}
              onChange={(e) => onStatusChange(objective.id, e.target.value as ObjectiveStatus)}
              aria-label={`Alterar status do objetivo ${objective.title}`}
              className={`text-xs font-medium py-1.5 pl-2.5 pr-7 rounded-lg border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${statusDisplay.colorClass}`}
            >
              <option value="nao_iniciado">Não iniciado</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluido">Concluído</option>
            </select>
            <div className="pointer-events-none absolute right-2 text-current opacity-70">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Botões de Ação: Editar, Excluir e Ensinar */}
          <div className="flex items-center gap-1">
            {onTeachTopic && (
              <button
                type="button"
                onClick={() => onTeachTopic(objective.title)}
                title="Ensinar este tema no Laboratório Feynman (Invert)"
                aria-label={`Ensinar ${objective.title} com Técnica Feynman`}
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              >
                <Brain className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onEdit(objective)}
              title="Editar este objetivo"
              aria-label={`Editar objetivo ${objective.title}`}
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(objective)}
              title="Excluir este objetivo"
              aria-label={`Excluir objetivo ${objective.title}`}
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-semibold text-slate-900 leading-snug break-words ${
            objective.status === 'concluido' ? 'line-through text-slate-500' : ''
          }`}
        >
          {objective.title}
        </h3>

        {/* Descrição do Objetivo */}
        {objective.description ? (
          <p className="mt-2 text-sm text-slate-600 leading-relaxed break-words whitespace-pre-line line-clamp-3">
            {objective.description}
          </p>
        ) : (
          <p className="mt-2 text-xs text-slate-400 italic">Sem notas ou descrição adicional.</p>
        )}
      </div>

      {/* Rodapé do Cartão: Prazo, Tags e Atalho Feynman */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        {deadlineInfo && (
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{deadlineInfo.text}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {deadlineInfo?.tag && (
            <span
              className={`px-2 py-0.5 rounded-md border text-xs tabular-nums ${deadlineInfo.urgencyClass}`}
            >
              {deadlineInfo.tag}
            </span>
          )}

          {onTeachTopic && (
            <button
              type="button"
              onClick={() => onTeachTopic(objective.title)}
              className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
            >
              <Brain className="w-3 h-3" />
              <span>Ensinar (Feynman)</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
