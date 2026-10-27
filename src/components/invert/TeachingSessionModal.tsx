import React, { useState, useEffect, useRef } from 'react';
import {
  StudentPersonaId,
  STUDENT_PERSONAS,
  TeachingMessage,
  KnowledgeReport,
} from '../../types/invert';
import { InvertService } from '../../services/invertService';
import { PersonaSelector } from './PersonaSelector';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  FileText,
  RotateCcw,
  Headphones,
} from 'lucide-react';

interface TeachingSessionModalProps {
  isOpen: boolean;
  initialTopic?: string;
  onClose: () => void;
  onSessionComplete: (report: KnowledgeReport) => void;
}

export const TeachingSessionModal: React.FC<TeachingSessionModalProps> = ({
  isOpen,
  initialTopic = '',
  onClose,
  onSessionComplete,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [selectedPersona, setSelectedPersona] = useState<StudentPersonaId>('sobrinho');
  const [step, setStep] = useState<'setup' | 'teaching'>('setup');
  const [messages, setMessages] = useState<TeachingMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isWalkingMode, setIsWalkingMode] = useState(false); // Modo Caminhada (Áudio Hands-Free)
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
      setStep('setup');
    }
  }, [initialTopic, isOpen]);

  // Inicializa suporte a reconhecimento de voz no navegador
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'pt-BR';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Rolagem automática do chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiResponding]);

  // Para o áudio quando fechar o modal
  useEffect(() => {
    if (!isOpen) {
      InvertService.stopSpeaking();
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    }
  }, [isOpen, isListening]);

  if (!isOpen) return null;

  const currentPersona = STUDENT_PERSONAS[selectedPersona];

  // Iniciar aula
  const handleStartTeaching = () => {
    if (!topic.trim()) return;

    const initialAiMessage: TeachingMessage = {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text:
        selectedPersona === 'sobrinho'
          ? `Opa! Ouvi dizer que você vai me ensinar sobre "${topic}" hoje! Mas ó, me explica bem fácil porque sou uma criança e quero entender direitinho, tá bom? Por onde começamos?`
          : selectedPersona === 'cetico'
          ? `Olá. Disseram que você vai me explicar "${topic}". Estou pronto para ouvir, mas vou questionar qualquer ponto que parecer vago ou sem fundamentação. Pode começar.`
          : `E aí professor(a)! Preciso dominar "${topic}" com foco total em prova e sem enrolação. Me explica aí a ideia central e o que é mais importante saber!`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initialAiMessage]);
    setStep('teaching');

    // Se modo caminhada estiver ativado, fala a mensagem inicial
    if (isWalkingMode) {
      InvertService.speakText(initialAiMessage.text);
    }
  };

  // Alternar gravação de voz
  const handleToggleVoice = () => {
    if (!speechSupported || !recognitionRef.current) {
      // Simulação rápida se a API não estiver habilitada
      setIsListening(!isListening);
      if (!isListening) {
        setTimeout(() => {
          setInputText((prev) =>
            prev ? `${prev} [Voz detectada: explicando o mecanismo]` : 'O conceito central funciona da seguinte forma...'
          );
          setIsListening(false);
        }, 3000);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Enviar explicação do usuário para o aluno IA
  const handleSendMessage = async () => {
    if (!inputText.trim() || isAiResponding) return;

    const userMessage: TeachingMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsAiResponding(true);

    // Resposta simulada ou via Gemini
    try {
      const aiReply = await InvertService.generateStudentReaction(
        topic,
        selectedPersona,
        userMessage.text,
        newHistory
      );

      const aiMessage: TeachingMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (isWalkingMode) {
        InvertService.speakText(aiReply);
      }
    } finally {
      setIsAiResponding(false);
    }
  };

  // Concluir sessão e gerar Raio-X
  const handleFinishSession = () => {
    InvertService.stopSpeaking();
    const userExplanations = messages.filter((m) => m.sender === 'user').map((m) => m.text);

    if (userExplanations.length === 0) {
      alert('Envie ao menos uma explicação para que o aluno possa avaliar seu domínio.');
      return;
    }

    const report = InvertService.generateKnowledgeReport(topic, selectedPersona, userExplanations);
    onClose();
    onSessionComplete(report);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header da Sala de Aula Invert */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl border border-white/15">
              🧠
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Laboratório Feynman
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-indigo-200 font-mono">
                  Invert
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {step === 'setup' ? 'Configure sua Sessão de Ensino' : `Ensinando: ${topic}`}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === 'teaching' && (
              <button
                type="button"
                onClick={() => {
                  const newMode = !isWalkingMode;
                  setIsWalkingMode(newMode);
                  if (!newMode) InvertService.stopSpeaking();
                }}
                title={isWalkingMode ? 'Desativar Modo Caminhada' : 'Ativar Modo Caminhada (Áudio Hands-Free)'}
                className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  isWalkingMode
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span className="hidden sm:inline">Modo Caminhada</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo: Passo 1 - Setup */}
        {step === 'setup' && (
          <div className="p-6 space-y-5 overflow-y-auto">
            {/* Campo do Tema */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Qual tema você vai ensinar hoje?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Fotossíntese, Estruturas de Repetição, Segunda Guerra..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Pode ser um de seus objetivos cadastrados no StudyFlow ou qualquer assunto novo.
              </span>
            </div>

            {/* Seletor de Persona */}
            <PersonaSelector
              selectedPersona={selectedPersona}
              onSelectPersona={(id) => setSelectedPersona(id)}
            />

            {/* Banner Neurociência */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <p className="leading-relaxed">
                <strong>Por que funciona?</strong> Ler e assistir aulas cria a <em>ilusão de competência</em>.
                Ao tentar explicar um assunto com suas próprias palavras para um aluno fictício, seu cérebro faz
                <strong> recuperação ativa</strong>, consolidando o conhecimento na memória de longo prazo.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={!topic.trim()}
                onClick={handleStartTeaching}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <span>Entrar na Sala &amp; Ensinar</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo: Passo 2 - Sala de Aula Interativa */}
        {step === 'teaching' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Banner de Status do Aluno */}
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentPersona.avatar}</span>
                <span className="font-semibold text-slate-800">{currentPersona.name}</span>
                <span className="text-slate-500">({currentPersona.badge})</span>
              </div>
              <button
                type="button"
                onClick={handleFinishSession}
                className="px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Finalizar Aula &amp; Gerar Raio-X</span>
              </button>
            </div>

            {/* Chat com as mensagens */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-100/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                        {msg.sender === 'user' ? 'Você (Professor)' : `${currentPersona.name} (Aluno IA)`}
                      </span>
                      <span className="text-[10px] opacity-60 tabular-nums">
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isAiResponding && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
                    <span className="animate-spin">⏳</span>
                    <span>{currentPersona.name} está pensando na sua explicação...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input de Explicação */}
            <div className="p-3 bg-white border-t border-slate-200">
              <div className="flex items-center gap-2">
                {/* Botão de Microfone */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  title={isListening ? 'Parar gravação' : 'Falar por áudio (Voz)'}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                    isListening
                      ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Textarea */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    isListening
                      ? 'Ouvindo sua voz... fale agora!'
                      : 'Explique o conteúdo com suas próprias palavras (Enter para enviar)...'
                  }
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />

                {/* Botão de Enviar */}
                <button
                  type="button"
                  disabled={!inputText.trim() || isAiResponding}
                  onClick={handleSendMessage}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Dicas Rápidas */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
                <span>Dica: Use analogias e evite jargões para pontuar alto no Raio-X.</span>
                {isWalkingMode && (
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> Modo Caminhada ativo (áudio ligado)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
