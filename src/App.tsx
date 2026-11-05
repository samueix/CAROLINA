import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Timeline from './components/Timeline';
import EducationAndCourses from './components/EducationAndCourses';
import Skills from './components/Skills';
import Contact from './components/Contact';
import PrintResume from './components/PrintResume';
import FloatingActions from './components/FloatingActions';
import AdminPanel from './components/AdminPanel';
import { PERSONAL_INFO } from './data';
import { ResumeConfig } from './types';
import { AnimatePresence } from 'motion/react';
import { X, HelpCircle } from 'lucide-react';

export default function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [resumeConfig, setResumeConfig] = useState<ResumeConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('carol_resume_config');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
      showPhoto: true,
      photoShape: 'circle',
      showQrCode: true,
      showPortfolioLink: true
    };
  });

  return (
    <>
      {/* Portfólio Principal */}
      <div className="portfolio-container min-h-screen bg-[#FBF7F2] text-[#1C1917] font-sans overflow-x-hidden print:hidden">
        {/* Barra de Navegação */}
        <Header 
          onOpenResume={() => setIsResumeOpen(true)} 
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Seções da Página */}
        <main>
          {/* Hero */}
          <Hero onOpenResume={() => setIsResumeOpen(true)} />

          {/* Sobre Mim */}
          <About />

          {/* Trajetória Profissional */}
          <Timeline />

          {/* Formação e Cursos */}
          <EducationAndCourses />

          {/* Competências */}
          <Skills />

          {/* Contato */}
          <Contact />
        </main>

        {/* Rodapé: bloco escuro #1C1917 com raio superior de 12px */}
        <footer className="bg-[#1C1917] text-stone-300 py-12 rounded-t-[12px] border-t border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-stone-800/80">
              <div className="text-center md:text-left">
                <span className="font-display font-bold text-white tracking-tight text-xl block">
                  {PERSONAL_INFO.displayName}
                </span>
                <p className="text-sm text-stone-400 mt-1">
                  Vamos conversar?
                </p>
              </div>

              <div>
                <a
                  href="#contato"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-stone-600 bg-transparent text-white text-sm font-semibold hover:bg-stone-800 hover:border-stone-400 transition"
                >
                  Entrar em contato
                </a>
              </div>
            </div>

            <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-400">
              <p className="text-center md:text-left">
                &copy; {new Date().getFullYear()} {PERSONAL_INFO.fullName}. Todos os direitos reservados.
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
                <a href="#sobre" className="hover:text-white transition">Sobre</a>
                <a href="#experiencia" className="hover:text-white transition">Carreira</a>
                <a href="#formacao" className="hover:text-white transition">Cursos</a>
                <a href="#contato" className="hover:text-white transition">Contato</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Ações Flutuantes */}
        <FloatingActions />

        {/* Modal de Pré-visualização do Currículo (sem blur, sem spring, fundo 70% opaco) */}
        {isResumeOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-8 flex justify-center items-start print:p-0 print:bg-white">
            {/* Backdrop com 70% opacidade sem blur */}
            <div 
              className="fixed inset-0 bg-[#1C1917]/70 transition-opacity" 
              onClick={() => setIsResumeOpen(false)} 
            />

            {/* Conteúdo do Modal */}
            <div className="relative z-10 w-full max-w-[850px] print:w-full print:max-w-full print:m-0 my-4">
              {/* Botão de fechar em pílula com borda */}
              <div className="flex justify-end mb-2 print:hidden">
                <button
                  onClick={() => setIsResumeOpen(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-600 bg-[#1C1917] text-white hover:bg-stone-800 transition text-sm font-medium cursor-pointer"
                  title="Fechar visualização"
                >
                  <X size={16} />
                  <span>Fechar</span>
                </button>
              </div>

              {/* Dica de exportação */}
              <div className="bg-[#FFFFFF] border border-[#E7DFD6] text-[#1C1917] px-4 py-3 rounded-[12px] mb-4 flex items-start gap-3 text-sm print:hidden">
                <HelpCircle className="text-[#881337] shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-bold">Dica de Exportação do Currículo:</p>
                  <p className="text-[#57534E] mt-0.5 text-xs">
                    Ao abrir a caixa de impressão, escolha a opção <strong>"Salvar como PDF"</strong> no campo "Destino". Para imprimir os detalhes gráficos, certifique-se de marcar <strong>"Gráficos de plano de fundo"</strong>.
                  </p>
                </div>
              </div>

              {/* Componente de impressão */}
              <PrintResume 
                initialConfig={resumeConfig}
                onConfigChange={(newCfg) => setResumeConfig(newCfg)}
                onClose={() => setIsResumeOpen(false)} 
              />
            </div>
          </div>
        )}

        {/* Painel Administrativo */}
        <AnimatePresence>
          {isAdminOpen && (
            <AdminPanel 
              isOpen={isAdminOpen} 
              onClose={() => setIsAdminOpen(false)} 
              onOpenResume={() => setIsResumeOpen(true)} 
            />
          )}
        </AnimatePresence>
      </div>

      {/* Impressão direta do sistema window.print() */}
      <div className="hidden print:block print-only-container">
        <PrintResume initialConfig={resumeConfig} />
      </div>
    </>
  );
}
