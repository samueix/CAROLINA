import React, { useState } from 'react';
import { useContent } from '../useContent';

export default function Skills() {
  const { skills } = useContent();
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
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <section
      id="competencias"
      className="py-20 sm:py-28 bg-[#F4EDE4] border-t border-[#E7DFD6] print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="mb-14 text-left">
          <span className="inline-block text-xs font-bold text-[#881337] uppercase tracking-wider px-3.5 py-1 rounded-full border border-[#E7DFD6] mb-3 bg-white">
            04 — Competências
          </span>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold font-display text-[#1C1917] tracking-tight leading-tight">
            Competências & Habilidades
          </h2>
          <p className="text-base text-[#57534E] mt-2">
            O que sei fazer, por área.
          </p>
          <p className="text-sm font-medium text-[#57534E] mt-2">
            {skills.length} competências
          </p>
        </div>

        {/* Filter Categories Bar */}
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
                    : 'bg-white text-[#1C1917] border border-[#E7DFD6] hover:border-[#1C1917]'
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
              className="px-5 py-3 rounded-full border border-[#E7DFD6] bg-white text-[#1C1917] text-base font-medium transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1C1917] hover:shadow-[2px_2px_0px_#1C1917] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
            >
              {skill.name}
            </div>
          ))}
        </div>

        {/* Informações Complementares */}
        <div className="mt-12 bg-white p-6 sm:p-8 rounded-[12px] border border-[#E7DFD6] transition-all duration-150 hover:-translate-y-1 hover:border-[#1C1917] hover:shadow-[4px_4px_0_#1C1917] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none">
          <h4 className="font-display font-bold text-lg text-[#1C1917] mb-2">
            Garantia de Competência e Dedicação
          </h4>
          <p className="text-[17px] leading-[1.7] text-[#57534E]">
            Habilidades refinadas através de treinamentos especializados ministrados pelo IEP (Instituto de Educação Profissional) combinados com experiência corporativa prática na Solistica e autogestão autônoma no setor de beleza.
          </p>
        </div>

      </div>
    </section>
  );
}
