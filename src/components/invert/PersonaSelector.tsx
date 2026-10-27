import React from 'react';
import { STUDENT_PERSONAS, StudentPersonaId } from '../../types/invert';
import { Sparkles, Check } from 'lucide-react';

interface PersonaSelectorProps {
  selectedPersona: StudentPersonaId;
  onSelectPersona: (id: StudentPersonaId) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersona,
  onSelectPersona,
}) => {
  const personas = Object.values(STUDENT_PERSONAS);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Escolha o Perfil do seu Aluno IA
        </label>
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Cada perfil desafia seu cérebro de forma diferente
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {personas.map((persona) => {
          const isSelected = selectedPersona === persona.id;
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => onSelectPersona(persona.id)}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl" role="img" aria-label={persona.name}>
                    {persona.avatar}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {persona.name}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-500">
                      {persona.age} • {persona.badge}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                  {persona.tagline}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="inline-block text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Foco: {persona.challengeFocus}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
