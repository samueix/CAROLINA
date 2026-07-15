import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SKILLS_LIST } from '../data';
import { Star, Shield, Briefcase, FileText, CheckCircle, Users } from 'lucide-react';

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'administrative' | 'financial' | 'client-relations' | 'personal'>('all');

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'administrative', label: 'Administrativo' },
    { id: 'financial', label: 'Financeiro' },
    { id: 'client-relations', label: 'Relacionamento' },
    { id: 'personal', label: 'Pessoal / Atitude' },
  ] as const;

  const filteredSkills = activeCategory === 'all' 
    ? SKILLS_LIST 
    : SKILLS_LIST.filter(skill => skill.category === activeCategory);

  return (
    <section
      id="competencias"
      className="py-20 bg-slate-50/50 border-t border-slate-200 relative overflow-hidden print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title & Animated Counter */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Qualificações
          </span>
          <h2 className="text-3xl font-bold font-display text-slate-900 mt-3 tracking-tight">
            Competências & Habilidades
          </h2>
          <div className="w-12 h-1 bg-blue-900 mx-auto mt-4 rounded-full" />
          
          {/* Skills Counter Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/5 border border-blue-900/10 rounded-2xl mt-6 text-blue-900 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs">
              {SKILLS_LIST.length}
            </span>
            <span>Habilidades Mapeadas Profissionalmente</span>
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-2xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/10'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
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
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-800 font-display">
                    {skill.name}
                  </span>
                  
                  {/* Skill Badge Icon */}
                  <span className="text-[10px] font-bold text-blue-900 uppercase tracking-widest px-2 py-0.5 rounded bg-blue-50">
                    {skill.level}%
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-blue-900 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Skills Quality Guarantee Card */}
        <div className="max-w-3xl mx-auto mt-16 bg-gradient-to-br from-blue-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-blue-900/10 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10">
            <CheckCircle className="text-blue-200" size={28} />
          </div>
          <div>
            <h4 className="font-display font-bold text-lg text-blue-200">
              Garantia de Competência e Dedicação
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              Habilidades refinadas através de treinamentos especializados ministrados pelo IEP (Instituto de Educação Profissional) combinados com experiência corporativa prática de rotinas em empresa multinacional (Solistica).
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
