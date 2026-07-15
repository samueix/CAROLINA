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
import LoadingScreen from './components/LoadingScreen';
import AdminPanel from './components/AdminPanel';
import { PERSONAL_INFO } from './data';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, X, Printer, HelpCircle } from 'lucide-react';

export default function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <>
      {/* Portfólio Principal (Escondido inteiramente durante a impressão de forma limpa) */}
      <div className="portfolio-container min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden print:hidden">
        {/* 1. Premium Loading Preloader */}
        <LoadingScreen />

        {/* 2. Interactive Navigation Bar */}
        <Header 
          onOpenResume={() => setIsResumeOpen(true)} 
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* 3. Portfolio Page Sections */}
        <main>
          {/* Hero Banner with typing effect */}
          <Hero onOpenResume={() => setIsResumeOpen(true)} />

          {/* Professional biography */}
          <About />

          {/* Chronological career track */}
          <Timeline />

          {/* Academic credentials and training courses */}
          <EducationAndCourses />

          {/* Competencies grid with category filter */}
          <Skills />

          {/* Contact form and channels */}
          <Contact />
        </main>

        {/* 4. Footer Section */}
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-900 flex items-center justify-center text-white font-bold text-sm shadow-md">
                AC
              </div>
              <span className="font-display font-semibold text-white tracking-tight text-base">
                {PERSONAL_INFO.displayName}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium text-center">
              &copy; {new Date().getFullYear()} {PERSONAL_INFO.fullName}. Todos os direitos reservados.
            </p>

            <div className="flex gap-4 text-xs font-medium">
              <a href="#sobre" className="hover:text-white transition">Sobre</a>
              <a href="#experiencia" className="hover:text-white transition">Carreira</a>
              <a href="#contato" className="hover:text-white transition">Contato</a>
            </div>
          </div>
        </footer>

        {/* 5. Floating Interactive Action Anchors (WhatsApp, scroll-top) */}
        <FloatingActions />

        {/* 6. CV PDF/Print Preview Overlay Drawer Modal */}
        <AnimatePresence>
          {isResumeOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 overflow-y-auto px-4 py-8 flex justify-center items-start print:p-0 print:bg-white"
            >
              {/* Modal backdrop wrapper click handler */}
              <div className="absolute inset-0 z-0" onClick={() => setIsResumeOpen(false)} />

              {/* Modal content viewport */}
              <motion.div
                initial={{ y: 50, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 50, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                className="relative z-10 w-full max-w-[850px] print:w-full print:max-w-full print:m-0"
              >
                {/* Escape trigger floating outside */}
                <button
                  onClick={() => setIsResumeOpen(false)}
                  className="absolute -top-4 -right-4 sm:top-4 sm:right-4 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition shadow-lg cursor-pointer print:hidden z-20"
                  title="Fechar"
                >
                  <X size={20} />
                </button>

                {/* PDF formatting notice */}
                <div className="bg-blue-50 border border-blue-100 text-blue-900 px-4 py-3 rounded-3xl mb-4 flex items-start gap-3 text-xs print:hidden">
                  <HelpCircle className="text-blue-900 shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="font-bold">Dica de Exportação:</p>
                    <p className="text-slate-600 mt-0.5">
                      Ao abrir a caixa de diálogo de impressão, escolha a opção <strong>"Salvar como PDF"</strong> no campo "Destino". Ative também os gráficos de plano de fundo caso queira manter os detalhes visuais em cinza e azul.
                    </p>
                  </div>
                </div>

                {/* Render the core print template with controls */}
                <PrintResume onClose={() => setIsResumeOpen(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Secret Admin Panel Overlay */}
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

      {/* 7. Under-the-hood direct layout used strictly for system window.print() triggered outside modal */}
      <div className="hidden print:block print-only-container">
        <PrintResume />
      </div>
    </>
  );
}
