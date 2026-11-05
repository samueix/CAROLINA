import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PERSONAL_INFO } from '../data';
import { ArrowUp, MessageCircle } from 'lucide-react';

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 print:hidden">
      <AnimatePresence>
        {/* Botão Flutuante do WhatsApp */}
        <motion.a
          key="floating-whatsapp"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          href={PERSONAL_INFO.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-13 h-13 rounded-full border-2 border-[#1C1917] bg-[#047857] text-white flex items-center justify-center [box-shadow:4px_4px_0_#1C1917] hover:translate-x-[2px] hover:translate-y-[2px] hover:[box-shadow:2px_2px_0_#1C1917] active:translate-x-[4px] active:translate-y-[4px] active:[box-shadow:0_0_0_#1C1917] transition-all cursor-pointer"
          title="Falar no WhatsApp"
          aria-label="Falar no WhatsApp"
        >
          <MessageCircle size={24} />
        </motion.a>

        {/* Botão de Retorno ao Topo */}
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="w-11 h-11 rounded-full border-2 border-[#1C1917] bg-[#FFFFFF] text-[#1C1917] flex items-center justify-center [box-shadow:4px_4px_0_#1C1917] hover:translate-x-[2px] hover:translate-y-[2px] hover:[box-shadow:2px_2px_0_#1C1917] active:translate-x-[4px] active:translate-y-[4px] active:[box-shadow:0_0_0_#1C1917] transition-all cursor-pointer"
            title="Voltar ao Topo"
            aria-label="Voltar ao Topo"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
