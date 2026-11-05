import React, { useState } from 'react';
import { SKILLS_LIST } from '../data';

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'administrative' | 'financial' | 'client-relations' | 'digital' | 'personal'>('all');

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'administrative', label: 'Administrativo' },
    { id: 'financial', label: 'Financeiro & Fiscal' },
    { id: 'client-relations', label: 'Relacionamento & Clientes' },
    { id: 'digital', label: 'Informática & Ferramentas' },
    { id: 'personal', label: 'Pessoal & Atitude' },
  ] as const;

  const filteredSkills = activeCategory === 'all' 
    ? SKILLS_LIST 
    : SKILLS_LIST.filter(skill => skill.category === activeCategory);

  return (
    <section
      id="competencias"
      className="py-20 bg-white border-t border-[#E7DFD6] print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title (Padrão das fases) */}
        <div className="mb-8">
          <span className="inline-block text-sm font-semibold text-[#881337] border border-[#E7DFD6] px-3.5 py-1 rounded-full mb-3">
            04 — Competências
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#1C1917] tracking-tight">
            Competências & Habilidades
          </h2>
          <p className="text-base text-[#57534E] mt-2">
            O que sei fazer, por área.
          </p>
          <p className="text-sm font-medium text-[#57534E] mt-2">
            {SKILLS_LIST.length} competências
          </p>
        </div>

        {/* Filter Categories Bar (Pílulas com alvo de toque >= 44px) */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`min-h-[44px] px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-150 cursor-pointer flex items-center justify-center ${
                  isActive
                    ? 'bg-[#881337] text-white'
                    : 'bg-white text-[#1C1917] border border-[#E7DFD6] hover:border-[#881337]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Skills as Pills Tags */}
        <div className="flex flex-wrap gap-3">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="px-5 py-3 rounded-full border border-[#E7DFD6] bg-white text-[#1C1917] text-base font-medium transition-all duration-150 hover:-translate-y-0.5 hover:border-[#881337] hover:shadow-[2px_2px_0px_#881337] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
            >
              {skill.name}
            </div>
          ))}
        </div>

        {/* Garantia de Competência e Dedicação (Padrão de cartão sem gradiente/blur/ícone em caixa) */}
        <div className="mt-12 bg-white p-6 sm:p-8 rounded-[12px] border border-[#E7DFD6]">
          <h4 className="font-display font-bold text-lg text-[#1C1917] mb-2">
            Garantia de Competência e Dedicação
          </h4>
          <p className="text-base text-[#57534E] leading-relaxed">
            Habilidades refinadas através de treinamentos especializados ministrados pelo IEP (Instituto de Educação Profissional) combinados com experiência corporativa prática na Solistica e autogestão autônoma no setor de beleza.
          </p>
        </div>

      </div>
    </section>
  );
}
