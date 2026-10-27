import React from 'react';
import { Plus, Compass, Sparkles, Brain, GraduationCap, Target } from 'lucide-react';

interface HeaderProps {
  activeTab: 'objectives' | 'evolution';
  onTabChange: (tab: 'objectives' | 'evolution') => void;
  onAddNew: () => void;
  onStartInvert: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onAddNew,
  onStartInvert,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zona 1: Marca do Produto (Mesmo Título mantido) */}
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

          {/* Zona 2: Abas de Navegação (Objetivos vs Invert) */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onTabChange('objectives')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'objectives'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Metas &amp; Prazos</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('evolution')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'evolution'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
              <span>Evolução do Aluno IA</span>
            </button>
          </nav>

          {/* Zona 3: Botões de Ação Primária */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Botão Invert / Feynman */}
            <button
              onClick={onStartInvert}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              title="Aprenda Ensinando (Técnica Feynman com IA)"
            >
              <Brain className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Invert (Feynman)</span>
            </button>

            {/* Botão Novo Objetivo */}
            <button
              onClick={onAddNew}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
