import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, BookOpen, Check, AlertCircle } from 'lucide-react';
import { StudyObjective, ObjectiveFormData, ObjectiveStatus } from './types/objective';
import { StorageService } from './services/storageService';
import { Header } from './components/Header';
import { GoalStats } from './components/GoalStats';
import { GoalCard } from './components/GoalCard';
import { GoalFormModal } from './components/GoalFormModal';
import { ConfirmModal } from './components/ConfirmModal';
import { EmptyState } from './components/EmptyState';

export default function App() {
  const [objectives, setObjectives] = useState<StudyObjective[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<StudyObjective | null>(null);
  const [deletingObjective, setDeletingObjective] = useState<StudyObjective | null>(null);
  const [filterStatus, setFilterStatus] = useState<ObjectiveStatus | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carrega os dados do localStorage na inicialização
  useEffect(() => {
    const loaded = StorageService.getAll();
    setObjectives(loaded);
  }, []);

  // Exibe mensagem temporária de feedback
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3000);
  };

  // Abrir modal para novo objetivo
  const handleOpenNew = () => {
    setEditingObjective(null);
    setIsFormOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (objective: StudyObjective) => {
    setEditingObjective(objective);
    setIsFormOpen(true);
  };

  // Salvar (Criar ou Atualizar)
  const handleSaveObjective = (formData: ObjectiveFormData) => {
    if (editingObjective) {
      const updated = StorageService.update(editingObjective.id, formData);
      if (updated) {
        setObjectives((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      const created = StorageService.create(formData);
      setObjectives((prev) => [created, ...prev]);
      showToast('Novo objetivo de estudo cadastrado!');
    }
  };

  // Solicitar exclusão (abre confirmação)
  const handleRequestDelete = (objective: StudyObjective) => {
    setDeletingObjective(objective);
  };

  // Confirmar exclusão após modal
  const handleConfirmDelete = () => {
    if (!deletingObjective) return;
    const success = StorageService.delete(deletingObjective.id);
    if (success) {
      setObjectives((prev) => prev.filter((item) => item.id !== deletingObjective.id));
      showToast('Objetivo de estudo excluído.');
    }
    setDeletingObjective(null);
  };

  // Cancelar exclusão
  const handleCancelDelete = () => {
    setDeletingObjective(null);
  };

  // Mudança rápida de status diretamente no cartão
  const handleStatusChange = (id: string, newStatus: ObjectiveStatus) => {
    const updated = StorageService.update(id, { status: newStatus });
    if (updated) {
      setObjectives((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (newStatus === 'concluido') {
        showToast('Parabéns! Mais um objetivo concluído! 🎉');
      }
    }
  };

  // Restaurar dados de exemplo
  const handleResetSamples = () => {
    const samples = StorageService.resetToSamples();
    setObjectives(samples);
    showToast('Exemplos de estudo carregados com sucesso!');
  };

  // Filtros combinados: por status e por busca textual
  const filteredObjectives = useMemo(() => {
    return objectives.filter((item) => {
      const matchesStatus = filterStatus === 'todos' || item.status === filterStatus;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [objectives, filterStatus, searchQuery]);

  // Contagens para os botões de filtro
  const counts = useMemo(() => {
    return {
      todos: objectives.length,
      nao_iniciado: objectives.filter((o) => o.status === 'nao_iniciado').length,
      em_andamento: objectives.filter((o) => o.status === 'em_andamento').length,
      concluido: objectives.filter((o) => o.status === 'concluido').length,
    };
  }, [objectives]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Barra de Navegação Superior */}
      <Header onAddNew={handleOpenNew} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Banner de Boas-vindas para Estudantes Iniciantes */}
        <section className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 text-indigo-100 backdrop-blur-xs mb-3">
              Organização para Estudantes
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Transforme seus estudos em metas claras e alcançáveis.
            </h1>
            <p className="mt-2 text-sm sm:text-base text-indigo-100 leading-relaxed">
              O StudyFlow ajuda você a planejar o que aprender, acompanhar o progresso diário e não perder prazos importantes.
            </p>
          </div>
        </section>

        {/* Painel de Estatísticas e Progresso */}
        <GoalStats objectives={objectives} />

        {/* Barra de Ferramentas: Filtros por Status e Pesquisa */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Abas de Filtro de Status */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setFilterStatus('todos')}
                className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  filterStatus === 'todos'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Todos</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 tabular-nums">
                  {counts.todos}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('nao_iniciado')}
                className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  filterStatus === 'nao_iniciado'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Não iniciados</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/60 tabular-nums">
                  {counts.nao_iniciado}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('em_andamento')}
                className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  filterStatus === 'em_andamento'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Em andamento</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/60 tabular-nums">
                  {counts.em_andamento}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('concluido')}
                className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  filterStatus === 'concluido'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Concluídos</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/60 tabular-nums">
                  {counts.concluido}
                </span>
              </button>
            </div>

            {/* Campo de Pesquisa */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar objetivo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpar busca"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Listagem de Objetivos em Cartões */}
        <section aria-label="Objetivos de Estudo">
          {objectives.length === 0 ? (
            <EmptyState
              onAddNew={handleOpenNew}
              onResetSamples={handleResetSamples}
            />
          ) : filteredObjectives.length === 0 ? (
            <EmptyState
              isFiltered
              onAddNew={handleOpenNew}
              onClearFilter={() => {
                setFilterStatus('todos');
                setSearchQuery('');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredObjectives.map((obj) => (
                <GoalCard
                  key={obj.id}
                  objective={obj}
                  onEdit={handleOpenEdit}
                  onDelete={handleRequestDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Rodapé Simples e Acolhedor */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© StudyFlow · Construído para apoiar a rotina de estudantes iniciantes.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Dados salvos automaticamente no navegador</span>
            <span>·</span>
            <button
              onClick={handleResetSamples}
              className="hover:text-indigo-600 underline cursor-pointer"
            >
              Recarregar exemplos
            </button>
          </div>
        </div>
      </footer>

      {/* Modal de Formulário (Criação e Edição) */}
      <GoalFormModal
        isOpen={isFormOpen}
        objectiveToEdit={editingObjective}
        onClose={() => {
          setIsFormOpen(false);
          setEditingObjective(null);
        }}
        onSave={handleSaveObjective}
      />

      {/* Modal de Confirmação para Exclusão */}
      <ConfirmModal
        isOpen={!!deletingObjective}
        title="Excluir Objetivo de Estudo?"
        message="Esta ação removerá o objetivo permanentemente da sua lista. Tem certeza de que deseja continuar?"
        itemTitle={deletingObjective?.title}
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Notificação Toast Flutuante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-lg border border-slate-800 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
