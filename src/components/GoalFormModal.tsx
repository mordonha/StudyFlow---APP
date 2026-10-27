import React, { useState, useEffect } from 'react';
import { X, Calendar, BookOpen, FileText, CheckCircle2 } from 'lucide-react';
import { StudyObjective, ObjectiveFormData, ObjectiveStatus, STATUS_LABELS } from '../types/objective';

interface GoalFormModalProps {
  isOpen: boolean;
  objectiveToEdit: StudyObjective | null;
  onClose: () => void;
  onSave: (data: ObjectiveFormData) => void;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  objectiveToEdit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ObjectiveStatus>('nao_iniciado');
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  useEffect(() => {
    if (objectiveToEdit) {
      setTitle(objectiveToEdit.title);
      setDescription(objectiveToEdit.description);
      setDeadline(objectiveToEdit.deadline);
      setStatus(objectiveToEdit.status);
    } else {
      // Valor padrão para novo objetivo: daqui a 7 dias
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setTitle('');
      setDescription('');
      setDeadline(defaultDate.toISOString().split('T')[0]);
      setStatus('nao_iniciado');
    }
    setErrors({});
  }, [objectiveToEdit, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, informe o título do seu objetivo de estudo.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres.';
    }

    if (!deadline) {
      newErrors.deadline = 'Informe uma data limite para este objetivo.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-7 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="goal-form-title" className="text-xl font-semibold text-slate-900">
                {objectiveToEdit ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {objectiveToEdit
                  ? 'Atualize os detalhes e o progresso da sua meta.'
                  : 'Defina o que você quer aprender e estabeleça seu foco.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar formulário"
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Campo Título */}
          <div>
            <label htmlFor="goal-title" className="block text-sm font-medium text-slate-800 mb-1">
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="goal-title"
                type="text"
                placeholder="Ex: Aprender funções e escopo em JavaScript"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                maxLength={100}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.title
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
                }`}
                autoFocus
              />
            </div>
            {errors.title ? (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.title}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">
                Seja específico. Exemplo: "Resolver 20 exercícios de Cinemática".
              </p>
            )}
          </div>

          {/* Campo Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-sm font-medium text-slate-800 mb-1">
              Descrição e Anotações
            </label>
            <div className="relative">
              <textarea
                id="goal-description"
                rows={3}
                placeholder="Liste os materiais, capítulos, vídeos ou tópicos principais para este objetivo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={400}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-slate-400">Opcional, mas ajuda a manter o foco no que fazer.</span>
              <span className="text-xs text-slate-400 tabular-nums">{description.length}/400</span>
            </div>
          </div>

          {/* Grid com Prazo e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo Prazo */}
            <div>
              <label htmlFor="goal-deadline" className="block text-sm font-medium text-slate-800 mb-1">
                Data Limite (Prazo) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="goal-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.deadline
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.deadline && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.deadline}</p>
              )}
            </div>

            {/* Campo Status */}
            <div>
              <label htmlFor="goal-status" className="block text-sm font-medium text-slate-800 mb-1">
                Status Atual
              </label>
              <select
                id="goal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ObjectiveStatus)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                <option value="nao_iniciado">Não iniciado (A Fazer)</option>
                <option value="em_andamento">Em andamento (Estudando)</option>
                <option value="concluido">Concluído (Finalizado)</option>
              </select>
            </div>
          </div>

          {/* Guia Visual do Status Selecionado */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <span className="font-semibold text-slate-700">Situação:</span>
            <span>
              {status === 'nao_iniciado' && 'Meta planejada, aguardando início dos estudos.'}
              {status === 'em_andamento' && 'Você está dedicando tempo e energia neste tópico agora.'}
              {status === 'concluido' && 'Objetivo atingido com sucesso! Parabéns pela dedicação.'}
            </span>
          </div>

          {/* Ações do Formulário */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{objectiveToEdit ? 'Salvar Alterações' : 'Cadastrar Objetivo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
