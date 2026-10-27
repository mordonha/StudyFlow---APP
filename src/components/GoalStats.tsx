import React from 'react';
import { Target, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { StudyObjective } from '../types/objective';

interface GoalStatsProps {
  objectives: StudyObjective[];
}

export const GoalStats: React.FC<GoalStatsProps> = ({ objectives }) => {
  const total = objectives.length;
  const completed = objectives.filter((item) => item.status === 'concluido').length;
  const inProgress = objectives.filter((item) => item.status === 'em_andamento').length;
  const notStarted = objectives.filter((item) => item.status === 'nao_iniciado').length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Painel do Estudante
          </span>
          <h2 className="text-lg font-semibold text-slate-900 mt-0.5">
            Visão Geral dos Estudos
          </h2>
        </div>

        {/* Progresso Geral */}
        {total > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-36 sm:w-44 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 tabular-nums">
              {percentage}% concluído
            </span>
          </div>
        )}
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        {/* Total Cadastrado */}
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total de Objetivos</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums font-mono">
            {total}
          </div>
          <span className="text-[11px] text-slate-500">
            {total === 1 ? 'meta registrada' : 'metas registradas'}
          </span>
        </div>

        {/* Em Andamento */}
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-xs font-medium">Em Andamento</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-900 tabular-nums font-mono">
            {inProgress}
          </div>
          <span className="text-[11px] text-amber-700/90">Em foco no momento</span>
        </div>

        {/* Não Iniciados */}
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-medium">Não Iniciados</span>
            <BookOpen className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 tabular-nums font-mono">
            {notStarted}
          </div>
          <span className="text-[11px] text-slate-500">Prontos para começar</span>
        </div>

        {/* Concluídos */}
        <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-medium">Concluídos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-900 tabular-nums font-mono">
            {completed}
          </div>
          <span className="text-[11px] text-emerald-700/90">Objetivos alcançados</span>
        </div>
      </div>
    </div>
  );
};
