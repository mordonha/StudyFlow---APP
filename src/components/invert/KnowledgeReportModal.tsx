import React, { useState } from 'react';
import {
  KnowledgeReport,
  STUDENT_PERSONAS,
  ReviewFlashcard,
} from '../../types/invert';
import {
  X,
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Zap,
  ArrowRight,
  RotateCw,
  Sparkles,
} from 'lucide-react';

interface KnowledgeReportModalProps {
  report: KnowledgeReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeReportModal: React.FC<KnowledgeReportModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!isOpen || !report) return null;

  const persona = STUDENT_PERSONAS[report.personaId];
  const flashcards = report.generatedFlashcards;
  const currentCard = flashcards[activeFlashcardIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com Banner de Score */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-medium mb-2 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Raio-X do Conhecimento • Técnica Feynman</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {report.topic}
              </h2>
              <p className="text-xs text-indigo-200 mt-1">
                Aluno avaliador: {persona.avatar} {persona.name} ({persona.badge})
              </p>
            </div>

            {/* Score e XP */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 shrink-0">
              <div className="text-center px-2">
                <span className="block text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                  {report.clarityScore}
                </span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                  Didática
                </span>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center px-2">
                <span className="flex items-center justify-center gap-1 text-lg sm:text-xl font-bold text-emerald-400 font-mono">
                  <Zap className="w-4 h-4 fill-emerald-400" /> +{report.xpEarned}
                </span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                  XP Ganho
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Corpo do Relatório */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Parecer do Aluno */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>{persona.avatar}</span> Parecer de {persona.name}:
            </h4>
            <p className="text-sm text-slate-700 italic leading-relaxed">
              &quot;{report.pedagogicalAdvice}&quot;
            </p>
          </div>

          {/* Grid: Domina vs Pontos Cegos vs Erros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* O que você domina */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
              <div className="flex items-center gap-2 text-emerald-800 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  O que você domina
                </h4>
              </div>
              <ul className="space-y-1.5">
                {report.masteredConcepts.map((item, idx) => (
                  <li key={idx} className="text-xs text-emerald-950 flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pontos Cegos */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center gap-2 text-amber-800 mb-2.5">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Pontos Cegos Detectados
                </h4>
              </div>
              <ul className="space-y-1.5">
                {report.blindSpots.map((item, idx) => (
                  <li key={idx} className="text-xs text-amber-950 flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Erros Conceituais (se houver) */}
          {report.conceptualErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80">
              <div className="flex items-center gap-2 text-rose-800 mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Erros Conceituais &amp; Falhas Lógicas
                </h4>
              </div>
              <ul className="space-y-1.5">
                {report.conceptualErrors.map((item, idx) => (
                  <li key={idx} className="text-xs text-rose-950 flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Flashcards Automáticos de Revisão Ativa */}
          {flashcards.length > 0 && currentCard && (
            <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                    Cartões de Revisão Automáticos ({activeFlashcardIndex + 1}/{flashcards.length})
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Gerados a partir das suas lacunas
                </span>
              </div>

              {/* Flashcard Interativo */}
              <div
                onClick={() => setShowAnswer(!showAnswer)}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs cursor-pointer hover:border-indigo-300 transition-all min-h-[110px] flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 mb-2 inline-block">
                    {showAnswer ? 'Resposta Sugerida' : 'Pergunta de Recuperação Ativa'}
                  </span>
                  <p className="text-sm font-semibold text-slate-900">
                    {showAnswer ? currentCard.answer : currentCard.question}
                  </p>
                </div>
                <span className="text-[11px] text-indigo-600 font-medium mt-3 flex items-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  {showAnswer ? 'Clique para ver a pergunta' : 'Clique para virar o cartão e ver a resposta'}
                </span>
              </div>

              {/* Controles de Navegação do Flashcard */}
              <div className="flex items-center justify-between mt-3 pt-2">
                <button
                  type="button"
                  disabled={activeFlashcardIndex === 0}
                  onClick={() => {
                    setShowAnswer(false);
                    setActiveFlashcardIndex((prev) => Math.max(0, prev - 1));
                  }}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Anterior
                </button>
                <div className="flex gap-1.5">
                  {flashcards.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === activeFlashcardIndex ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  disabled={activeFlashcardIndex === flashcards.length - 1}
                  onClick={() => {
                    setShowAnswer(false);
                    setActiveFlashcardIndex((prev) => Math.min(flashcards.length - 1, prev + 1));
                  }}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Relatório salvo permanentemente no seu histórico local.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer transition-colors"
          >
            Concluir Revisão
          </button>
        </div>
      </div>
    </div>
  );
};
