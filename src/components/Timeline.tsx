import React from 'react';
import { motion } from 'motion/react';
import { EXPERIENCES } from '../data';
import { Briefcase, MapPin, Calendar, CheckCircle2, Star, Sparkles } from 'lucide-react';

export default function Timeline() {
  return (
    <section
      id="experiencia"
      className="py-20 bg-stone-50/60 border-t border-rose-100 relative overflow-hidden print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-rose-900 uppercase tracking-widest bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200/50">
            Carreira
          </span>
          <h2 className="text-3xl font-bold font-display text-stone-900 mt-3 tracking-tight">
            Experiência Profissional
          </h2>
          <div className="w-12 h-1 bg-rose-800 mx-auto mt-4 rounded-full" />
        </div>

        {/* Timeline Path */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical central line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-rose-200/80 -translate-x-1/2 z-0 hidden sm:block" />
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-rose-200/80 z-0 sm:hidden" />

          <div className="space-y-12">
            {EXPERIENCES.map((exp, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={exp.id} 
                  className={`relative flex flex-col sm:flex-row items-stretch ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  
                  {/* Circle indicator on line */}
                  <div className="absolute left-4 sm:left-1/2 w-8 h-8 rounded-full bg-white border-2 border-rose-800 shadow-md flex items-center justify-center -translate-x-1/2 z-10 top-0 sm:top-6">
                    {exp.isFreelance ? (
                      <Sparkles size={14} className="text-rose-800" />
                    ) : (
                      <Briefcase size={14} className="text-rose-800" />
                    )}
                  </div>

                  {/* Spacer for desktop layout alignment */}
                  <div className="w-full sm:w-1/2 hidden sm:block" />

                  {/* Visual Content Card */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="w-full sm:w-1/2 pl-12 sm:pl-0 sm:px-8"
                  >
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm relative hover:border-rose-200 transition">
                      
                      {/* Triangle pointer for desktop */}
                      <div className={`absolute top-6 w-3 h-3 bg-white border-b border-l border-stone-200 rotate-45 hidden sm:block ${
                        isEven ? '-right-1.5 border-t border-r border-b-0 border-l-0' : '-left-1.5'
                      }`} />

                      {/* Header info */}
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                        <div>
                          <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2 uppercase ${
                            exp.isFreelance 
                              ? 'bg-rose-50 text-rose-900 border border-rose-200' 
                              : 'bg-stone-100 text-stone-800 border border-stone-200'
                          }`}>
                            {exp.isFreelance ? 'Autônoma / Empreendedora' : 'Corporativo'}
                          </span>
                          <h3 className="text-lg font-bold font-display text-stone-900 leading-snug">
                            {exp.role}
                          </h3>
                          <h4 className="text-sm font-semibold text-rose-800 mt-0.5">
                            {exp.company}
                          </h4>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="flex items-center gap-1 text-xs text-stone-400 font-medium">
                            <Calendar size={12} />
                            <span>{exp.period}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-stone-400 font-medium mt-1">
                            <MapPin size={12} />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-px bg-stone-100 my-4" />

                      {/* Activities detail list */}
                      <div className="space-y-2.5">
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                          Atribuições & Conquistas:
                        </p>
                        <ul className="space-y-2">
                          {exp.activities.map((activity, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-stone-600 leading-relaxed">
                              <CheckCircle2 size={14} className="text-rose-800 shrink-0 mt-0.5" />
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </motion.div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
