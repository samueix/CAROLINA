import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SKILLS_LIST } from '../data';
import { Star, Shield, Briefcase, FileText, CheckCircle, Users, Sparkles } from 'lucide-react';

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

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'administrative':
        return 'Administrativo';
      case 'financial':
        return 'Financeiro';
      case 'client-relations':
        return 'Atendimento';
      case 'digital':
        return 'Informática';
      case 'personal':
        return 'Comportamental';
      default:
        return 'Competência';
    }
  };

  const filteredSkills = activeCategory === 'all' 
    ? SKILLS_LIST 
    : SKILLS_LIST.filter(skill => skill.category === activeCategory);

  return (
    <section
      id="competencias"
      className="py-20 bg-stone-50/60 border-t border-rose-100 relative overflow-hidden print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title & Animated Counter */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-rose-900 uppercase tracking-widest bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200/50">
            Qualificações
          </span>
          <h2 className="text-3xl font-bold font-display text-stone-900 mt-3 tracking-tight">
            Competências & Habilidades
          </h2>
          <div className="w-12 h-1 bg-rose-800 mx-auto mt-4 rounded-full" />
          
          {/* Skills Counter Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-800/5 border border-rose-800/10 rounded-2xl mt-6 text-rose-900 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-rose-800 text-white flex items-center justify-center text-xs">
              {SKILLS_LIST.length}
            </span>
            <span>Habilidades Profissionais Mapeadas</span>
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-3xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-rose-800 text-white shadow-md shadow-rose-900/15'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-rose-50/50 hover:text-rose-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <motion.div
                layout
                key={skill.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between gap-3 hover:border-rose-300 hover:shadow-md transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 border border-rose-200/60 group-hover:bg-rose-800 group-hover:text-white transition-colors">
                    <CheckCircle size={16} />
                  </div>
                  <span className="text-sm font-semibold text-stone-800 font-display leading-snug">
                    {skill.name}
                  </span>
                </div>
                
                {/* Category Badge - No percentages */}
                <span className="text-[10px] font-bold text-rose-900 uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-50/70 border border-rose-200/50 shrink-0">
                  {getCategoryBadge(skill.category)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Skills Quality Guarantee Card */}
        <div className="max-w-3xl mx-auto mt-16 bg-gradient-to-br from-rose-950 via-rose-900 to-stone-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-rose-900/15 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10">
            <CheckCircle className="text-rose-200" size={28} />
          </div>
          <div>
            <h4 className="font-display font-bold text-lg text-rose-200">
              Garantia de Competência e Dedicação
            </h4>
            <p className="text-xs text-rose-100/80 leading-relaxed mt-1">
              Habilidades refinadas através de treinamentos especializados ministrados pelo IEP (Instituto de Educação Profissional) combinados com experiência corporativa prática na Solistica e autogestão autônoma no setor de beleza.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
