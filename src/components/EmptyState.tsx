import React from 'react';
import { BookOpen, Plus, RefreshCw, Search } from 'lucide-react';

interface EmptyStateProps {
  isFiltered?: boolean;
  onAddNew: () => void;
  onResetSamples?: () => void;
  onClearFilter?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered = false,
  onAddNew,
  onResetSamples,
  onClearFilter,
}) => {
  if (isFiltered) {
    return (
      <div className="w-full text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          Nenhum objetivo encontrado com esse filtro
        </h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          Tente alterar o termo de busca ou selecionar outro status na barra acima.
        </p>
        {onClearFilter && (
          <button
            onClick={onClearFilter}
            className="mt-4 px-4 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
          >
            Limpar filtros e ver todos
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-indigo-200">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
        <BookOpen className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900">
        Sua rotina de estudos começa aqui
      </h3>
      <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
        Você ainda não cadastrou nenhum objetivo de estudo. Organize suas metas, defina prazos claros e acompanhe seu aprendizado passo a passo.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onAddNew}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Primeiro Objetivo</span>
        </button>

        {onResetSamples && (
          <button
            onClick={onResetSamples}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Carregar Metas de Exemplo</span>
          </button>
        )}
      </div>
    </div>
  );
};
