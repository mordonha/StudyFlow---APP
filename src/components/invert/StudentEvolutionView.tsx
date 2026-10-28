import React, { useState, useEffect } from 'react';
import {
  VirtualStudentProgress,
  KnowledgeReport,
  STUDENT_PERSONAS,
} from '../../types/invert';
import { InvertService } from '../../services/invertService';
import {
  Award,
  Zap,
  BookOpen,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Plus,
  Calendar,
} from 'lucide-react';

interface StudentEvolutionViewProps {
  onStartNewSession: () => void;
  onOpenReport: (report: KnowledgeReport) => void;
}

export const StudentEvolutionView: React.FC<StudentEvolutionViewProps> = ({
  onStartNewSession,
  onOpenReport,
}) => {
  const [progress, setProgress] = useState<VirtualStudentProgress>(InvertService.getProgress());
  const [pastReports, setPastReports] = useState<KnowledgeReport[]>([]);

  useEffect(() => {
    setProgress(InvertService.getProgress());
    setPastReports(InvertService.getSavedReports());
  }, []);

  const percentage = Math.min(
    100,
    Math.round((progress.currentXP / progress.xpToNextLevel) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Banner Principal de Gamificação */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-indigo-700/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Gamificação: Evolua seu Aluno IA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Nível {progress.level}: {progress.levelTitle}
            </h2>
            <p className="text-sm text-indigo-200 max-w-lg mt-2 leading-relaxed">
              Quanto melhor você ensina e simplifica temas complexos, mais o seu aluno virtual evolui,
              sobe de nível e desbloqueia diplomas acadêmicos!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={onStartNewSession}
              className="w-full sm:w-auto px-5 py-3 text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>Ensinar Agora (Feynman)</span>
              <span>🧠</span>
            </button>
          </div>
        </div>

        {/* Barra de Progresso de XP */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-indigo-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              Experiência do Aluno: {progress.currentXP} / {progress.xpToNextLevel} XP
            </span>
            <span className="text-amber-300">{percentage}% para o próximo nível</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/15">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Diplomas e Conquistas */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Diplomas e Conquistas Desbloqueadas
            </h3>
          </div>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
            {progress.diplomasUnlocked.length} conquistados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {progress.diplomasUnlocked.map((diploma, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/50 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200 text-lg">
                🎓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {diploma}
                </h4>
                <span className="text-[10px] text-amber-800 font-medium">
                  Reconhecimento Didático
                </span>
              </div>
            </div>
          ))}

          {/* Diplomas bloqueados demonstrativos */}
          {progress.diplomasUnlocked.length < 5 && (
            <div className="p-3.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex items-start gap-3 opacity-60">
              <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 text-base">
                🔒
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-700">Mestre da Didática</h4>
                <span className="text-[10px] text-slate-500">
                  Alcance 1000 XP ensinando
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Histórico de Aulas & Raio-X do Conhecimento */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Histórico de Sessões Feynman Realizadas
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {pastReports.length} relatórios gerados
          </span>
        </div>

        {pastReports.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Nenhuma sessão realizada ainda. Clique em "Ensinar Agora" para começar sua primeira aula!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pastReports.map((report) => {
              const persona = STUDENT_PERSONAS[report.personaId];
              return (
                <div
                  key={report.id}
                  onClick={() => onOpenReport(report)}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{persona.avatar}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {report.topic}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Aluno: {persona.name}</span>
                        <span>•</span>
                        <span>
                          {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="block text-sm font-bold text-emerald-600 font-mono">
                        {report.clarityScore} pts
                      </span>
                      <span className="text-[10px] text-slate-400">
                        +{report.xpEarned} XP
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

