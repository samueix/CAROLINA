import React, { useState } from 'react';
import { useContent } from '../useContent';

interface CategoryConfig {
  id: 'administrative' | 'financial' | 'client-relations' | 'digital' | 'personal';
  num: string;
  title: string;
  label: string;
  defaultSpan: string;
}

const CATEGORIES: CategoryConfig[] = [
  { 
    id: 'administrative', 
    num: '01', 
    title: 'Rotinas Administrativas & Recepção', 
    label: 'Administrativo', 
    defaultSpan: 'lg:col-span-2' 
  },
  { 
    id: 'financial', 
    num: '02', 
    title: 'Rotinas Financeiras & Apoio Fiscal', 
    label: 'Financeiro & Fiscal', 
    defaultSpan: 'lg:col-span-1' 
  },
  { 
    id: 'client-relations', 
    num: '03', 
    title: 'Atendimento & Relacionamento com Clientes', 
    label: 'Relacionamento & Clientes', 
    defaultSpan: 'lg:col-span-1' 
  },
  { 
    id: 'digital', 
    num: '04', 
    title: 'Informática, CRM & Ferramentas Digitais', 
    label: 'Informática & Ferramentas', 
    defaultSpan: 'lg:col-span-1' 
  },
  { 
    id: 'personal', 
    num: '05', 
    title: 'Atitude, Ética & Conduta Corporativa', 
    label: 'Pessoal & Atitude', 
    defaultSpan: 'lg:col-span-1' 
  },
];

export default function Skills() {
  const { skills } = useContent();
  const [activeCategory, setActiveCategory] = useState<'all' | CategoryConfig['id']>('all');

  const visibleCategories = activeCategory === 'all'
    ? CATEGORIES
    : CATEGORIES.filter((c) => c.id === activeCategory);

  return (
    <section
      id="competencias"
      className="py-20 sm:py-28 bg-[#F4EDE4] border-t border-[#E7DFD6] print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="mb-12 text-left">
          <span className="inline-block text-xs font-bold text-[#881337] uppercase tracking-wider px-3.5 py-1 rounded-full border border-[#E7DFD6] mb-3 bg-white">
            04 — Competências
          </span>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold font-display text-[#1C1917] tracking-tight leading-tight">
            Competências & Habilidades
          </h2>
          <p className="text-base text-[#57534E] mt-2">
            O que sei fazer, por área.
          </p>
        </div>

        {/* Filter Categories Bar (Horizontal scroll on mobile without line wrap) */}
        <div className="flex items-center gap-2.5 mb-10 overflow-x-auto pb-2 scrollbar-none whitespace-nowrap">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`min-h-[44px] px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-150 cursor-pointer shrink-0 border ${
              activeCategory === 'all'
                ? 'bg-[#881337] text-white border-[#881337]'
                : 'bg-white text-[#1C1917] border-[#E7DFD6] hover:border-[#1C1917]'
            }`}
          >
            Todas
          </button>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`min-h-[44px] px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-150 cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-[#881337] text-white border-[#881337]'
                    : 'bg-white text-[#1C1917] border-[#E7DFD6] hover:border-[#1C1917]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grouped Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCategories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat.id);
            const isSingle = activeCategory !== 'all';

            return (
              <div
                key={cat.id}
                className={`bg-white p-6 sm:p-7 rounded-[12px] border border-[#E7DFD6] transition-all duration-150 hover:-translate-y-1 hover:border-[#1C1917] hover:shadow-[4px_4px_0_#1C1917] motion-reduce:transform-none motion-reduce:shadow-none flex flex-col justify-between ${
                  isSingle ? 'col-span-full' : cat.defaultSpan
                }`}
              >
                <div>
                  {/* Card Header: Number + Count Pill */}
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="font-display font-extrabold text-2xl text-[#881337]">
                      {cat.num}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border border-[#E7DFD6] text-[#57534E] bg-[#FBF7F2]">
                      {catSkills.length} competências
                    </span>
                  </div>

                  {/* Category Title */}
                  <h3 className="font-display font-bold text-xl text-[#1C1917] mb-5 leading-snug">
                    {cat.title}
                  </h3>

                  {/* Skills tags with 6px solid wine dot */}
                  <div className="flex flex-wrap gap-2.5">
                    {catSkills.map((skill) => (
                      <span
                        key={skill.name}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#E7DFD6] bg-white text-[#1C1917] text-sm font-medium hover:border-[#1C1917] transition-colors"
                      >
                        <span 
                          className="w-1.5 h-1.5 rounded-full bg-[#881337] shrink-0" 
                          aria-hidden="true" 
                        />
                        <span>{skill.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informações Complementares (Garantia de Competência e Dedicação) */}
        <div className="mt-12 bg-white p-6 sm:p-8 rounded-[12px] border border-[#E7DFD6] transition-all duration-150 hover:-translate-y-1 hover:border-[#1C1917] hover:shadow-[4px_4px_0_#1C1917] motion-reduce:translate-y-0 motion-reduce:shadow-none">
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
