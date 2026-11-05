import React from 'react';
import { useContent } from '../useContent';

export default function About() {
  const { personal } = useContent();

  const values = [
    {
      num: "01",
      title: "Organização Rigorosa",
      desc: "Gestão impecável de documentos administrativos, conferência de notas fiscais, controle de arquivos e lançamentos em CRM."
    },
    {
      num: "02",
      title: "Comprometimento e Ética",
      desc: "Atuação profissional pautada na responsabilidade, pontualidade britânica, discrição corporativa e proatividade contínua."
    },
    {
      num: "03",
      title: "Gestão de Agenda & Fluxo",
      desc: "Habilidade na administração de agendas corporativas e de clínicas, controle de insumos e organização de salas de atendimento."
    },
    {
      num: "04",
      title: "Relações Humanas & Empatia",
      desc: "Atendimento caloroso, escuta atenta, comunicação corporativa fluida e foco genuíno no encantamento e fidelização de clientes."
    }
  ];

  return (
    <section
      id="sobre"
      className="py-20 sm:py-28 bg-[#FBF7F2] border-t border-[#E7DFD6] print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Standard Section Title (Left-aligned, numbered pill, no centered dash) */}
        <div className="mb-14 text-left">
          <span className="inline-block text-xs font-bold text-[#881337] uppercase tracking-wider px-3 py-1 rounded-full border border-[#E7DFD6] bg-transparent">
            01 — Sobre
          </span>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold font-display text-[#1C1917] mt-3 tracking-tight leading-tight">
            Perfil Profissional e Trajetória
          </h2>
          <p className="text-base text-[#57534E] mt-2">
            Quem sou e como trabalho.
          </p>
        </div>

        {/* Dedicated Objetivo Profissional Card */}
        <div className="mb-12 bg-white rounded-[12px] p-6 sm:p-8 border border-[#E7DFD6] transition-all duration-150 hover:-translate-y-1 hover:border-[#1C1917] hover:shadow-[4px_4px_0_#1C1917] motion-reduce:transform-none motion-reduce:shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold text-[#881337] uppercase tracking-wider">
              Objetivo Profissional
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#047857] text-[#047857] bg-white">
                Disponibilidade total de horário
              </span>
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#881337] text-[#881337] bg-white">
                Início imediato
              </span>
            </div>
          </div>
          <p className="text-base sm:text-lg text-[#1C1917] font-medium leading-relaxed">
            Busco uma oportunidade nas áreas de Recepção, Atendimento ao Cliente ou Administrativo, contribuindo com organização, responsabilidade, agilidade e comprometimento com os resultados da empresa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Block (Text and bio) */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#1C1917] leading-snug">
              Minha missão é simplificar rotinas administrativas e acolher clientes com excelência e organização.
            </h3>
            
            <div className="text-[17px] text-[#57534E] leading-[1.7] max-w-[65ch] space-y-5">
              <p>
                Atuo em múltiplos pilares que exigem agilidade, disciplina e relacionamento interpessoal de alto nível. Na multinacional <strong className="text-[#1C1917] font-semibold">Solistica</strong>, adquiri vivência direta no ambiente corporativo, gerenciando atendimento telefônico via central, recepção de visitantes, cadastro rigoroso em CRM, emissão e conferência de Notas Fiscais (NF-e/Danfe) e suporte a rotinas financeiras.
              </p>
              <p>
                Como <strong className="text-[#1C1917] font-semibold">empreendedora autônoma na área da beleza</strong> (design de sobrancelhas e lash designer), consolidei valores fundamentais de autogestão: organização estratégica de agendas, negociação via WhatsApp Business, controle rigoroso de insumos, fluxo de caixa e fidelização personalizada de público.
              </p>
              <p>
                Esta convergência singular de competências me confere perfil versátil, facilidade para operar novos sistemas informatizados e dedicação exemplar em colaborar para o sucesso de equipes e clínicas.
              </p>
            </div>

            {/* City Card */}
            <div className="pt-2">
              <div className="bg-white rounded-[12px] p-5 border border-[#E7DFD6] transition-all duration-150 hover:-translate-y-1 hover:border-[#1C1917] hover:shadow-[4px_4px_0_#1C1917] motion-reduce:transform-none motion-reduce:shadow-none inline-block min-w-[240px]">
                <span className="text-xl sm:text-2xl font-bold text-[#881337] font-display block">
                  {personal.city}
                </span>
                <p className="text-sm text-[#57534E] font-medium mt-1">
                  Ceará, Brasil
                </p>
              </div>
            </div>
          </div>

          {/* Right Block (Key values cards grid) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((item) => (
              <div
                key={item.num}
                className="bg-white p-6 rounded-[12px] border border-[#E7DFD6] transition-all duration-150 hover:-translate-y-1 hover:border-[#1C1917] hover:shadow-[4px_4px_0_#1C1917] motion-reduce:transform-none motion-reduce:shadow-none flex flex-col"
              >
                <span className="font-display font-extrabold text-2xl text-[#881337] mb-3 block">
                  {item.num}
                </span>
                <h4 className="text-base font-bold text-[#1C1917] mb-2 font-display">
                  {item.title}
                </h4>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
