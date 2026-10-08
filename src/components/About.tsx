import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data';
import { Sparkles, Shield, Bookmark, Calendar, Briefcase, FileCheck, CheckCircle2 } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <FileCheck className="text-rose-800" size={20} />,
      title: "Organização Rigorosa",
      desc: "Gestão impecável de documentos administrativos, conferência de notas fiscais, controle de arquivos e lançamentos em CRM."
    },
    {
      icon: <Shield className="text-rose-800" size={20} />,
      title: "Comprometimento e Ética",
      desc: "Atuação profissional pautada na responsabilidade, pontualidade britânica, discrição corporativa e proatividade contínua."
    },
    {
      icon: <Calendar className="text-rose-800" size={20} />,
      title: "Gestão de Agenda & Fluxo",
      desc: "Habilidade na administração de agendas corporativas e de clínicas, controle de insumos e organização de salas de atendimento."
    },
    {
      icon: <Sparkles className="text-rose-800" size={20} />,
      title: "Relações Humanas & Empatia",
      desc: "Atendimento caloroso, escuta atenta, comunicação corporativa fluida e foco genuíno no encantamento e fidelização de clientes."
    }
  ];

  return (
    <section
      id="sobre"
      className="py-20 bg-white border-t border-rose-100 relative overflow-hidden print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-rose-900 uppercase tracking-widest bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200/50">
            Sobre Mim
          </span>
          <h2 className="text-3xl font-bold font-display text-stone-900 mt-3 tracking-tight">
            Perfil Profissional e Trajetória
          </h2>
          <div className="w-12 h-1 bg-rose-800 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Block (Text and bio) */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xl font-bold font-display text-rose-950">
              Minha missão é simplificar rotinas administrativas e acolher clientes com excelência e organização.
            </h3>
            
            <div className="text-stone-600 text-sm leading-relaxed space-y-4">
              <p>
                Atuo em múltiplos pilares que exigem agilidade, disciplina e relacionamento interpessoal de alto nível. Na multinacional <strong className="text-stone-900 font-semibold">Solistica</strong>, adquiri vivência direta no ambiente corporativo, gerenciando atendimento telefônico via central, recepção de visitantes, cadastro rigoroso em CRM, emissão e conferência de Notas Fiscais (NF-e/Danfe) e suporte a rotinas financeiras.
              </p>
              <p>
                Como <strong className="text-stone-900 font-semibold">empreendedora autônoma na área da beleza</strong> (design de sobrancelhas e lash designer), consolidei valores fundamentais de autogestão: organização estratégica de agendas, negociação via WhatsApp Business, controle rigoroso de insumos, fluxo de caixa e fidelização personalizada de público.
              </p>
              <p>
                Esta convergência singular de competências me confere perfil versátil, facilidade para operar novos sistemas informatizados e dedicação exemplar em colaborar para o sucesso de equipes e clínicas.
              </p>
            </div>

            {/* Micro-stats cards */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-stone-50 rounded-3xl p-5 border border-stone-200 shadow-sm">
                <span className="text-2xl font-bold text-rose-900 font-display">100%</span>
                <p className="text-xs text-stone-500 font-medium mt-1">Dedicação & Compromisso</p>
              </div>
              <div className="bg-stone-50 rounded-3xl p-5 border border-stone-200 shadow-sm">
                <span className="text-xl sm:text-2xl font-bold text-rose-900 font-display">Fortaleza e Região</span>
                <p className="text-xs text-stone-500 font-medium mt-1">Ceará, Brasil</p>
              </div>
            </div>
          </div>

          {/* Right Block (Key values cards grid) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:border-rose-200 hover:shadow-md transition duration-300 flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h4 className="text-sm font-bold text-stone-900 mb-2 font-display">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
