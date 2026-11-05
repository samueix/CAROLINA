import React from 'react';
import { EXPERIENCES } from '../data';
import { Calendar, MapPin } from 'lucide-react';

export default function Timeline() {
  return (
    <section
      id="experiencia"
      className="py-24 sm:py-32 bg-[#FBF7F2] border-t border-[#E7DFD6] print:hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Standard Section Title (Left-aligned, numbered pill, no centered dash) */}
        <div className="mb-14 text-left">
          <span className="inline-block text-xs font-bold text-[#881337] uppercase tracking-wider px-3 py-1 rounded-full border border-[#E7DFD6] bg-transparent">
            02 — Carreira
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#1C1917] mt-3 tracking-tight">
            Experiência Profissional
          </h2>
          <p className="text-base text-[#57534E] mt-2">
            Por onde passei até aqui.
          </p>
        </div>

        {/* Timeline Container: Single vertical line on the left for ALL widths */}
        <div className="relative pl-8 sm:pl-10">
          
          {/* Vertical line: 2px #E7DFD6 on the left */}
          <div
            className="absolute left-2.5 sm:left-3 top-3 bottom-3 w-[2px] bg-[#E7DFD6]"
            aria-hidden="true"
          />

          <div className="space-y-10">
            {EXPERIENCES.map((exp) => {
              const isCurrent = exp.period.includes('Atualmente');

              return (
                <div key={exp.id} className="relative">
                  
                  {/* Small solid marker (12px solid wine circle) positioned over line */}
                  <div
                    className="absolute -left-8 sm:-left-10 top-7 w-3 h-3 rounded-full bg-[#881337] translate-x-[4px] sm:translate-x-[6px]"
                    aria-hidden="true"
                  />

                  {/* Experience Card */}
                  <div className="bg-white p-6 sm:p-8 rounded-[12px] border border-[#E7DFD6] transition-all duration-150 hover:-translate-y-1 hover:shadow-[4px_4px_0_#881337] motion-reduce:transform-none motion-reduce:shadow-none">
                    
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2.5">
                          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#E7DFD6] text-[#57534E] bg-transparent">
                            {exp.isFreelance ? 'Autônoma / Empreendedora' : 'Corporativo'}
                          </span>
                          
                          {isCurrent && (
                            <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#881337] text-white">
                              Atual
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold font-display text-[#1C1917] leading-snug">
                          {exp.role}
                        </h3>
                        
                        <h4 className="text-base font-semibold text-[#881337] mt-1">
                          {exp.company}
                        </h4>
                      </div>

                      <div className="flex flex-col sm:items-end gap-1.5 shrink-0 text-sm text-[#57534E] font-medium">
                        <div className="inline-flex items-center gap-1.5">
                          <Calendar size={14} className="text-[#881337]" />
                          <span>{exp.period}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5">
                          <MapPin size={14} className="text-[#881337]" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-[#E7DFD6] my-5" />

                    {/* Activities detail list */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-[#57534E] uppercase tracking-wider">
                        Atribuições & Conquistas:
                      </p>
                      <ul className="space-y-2.5">
                        {exp.activities.map((activity, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-base text-[#57534E] leading-[1.65]"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-[#881337] shrink-0 mt-2.5"
                              aria-hidden="true"
                            />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
