import React from 'react';
import { Plus, Compass, Sparkles } from 'lucide-react';

interface HeaderProps {
  onAddNew: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddNew }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zona 1: Marca do Produto */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
                Study<span className="text-indigo-600">Flow</span>
              </span>
            </div>
          </div>

          {/* Zona 2: Mensagem de apoio ao estudante */}
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Foco e disciplina: aprenda um passo de cada vez</span>
          </div>

          {/* Zona 3: Botão de Ação Primária */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onAddNew}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span className="whitespace-nowrap">Novo Objetivo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
