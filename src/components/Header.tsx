import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useContent } from '../useContent';
import { FileText, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenResume: () => void;
}

export default function Header({ onOpenResume }: HeaderProps) {
  const { personal } = useContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clickTimestampsRef = useRef<number[]>([]);

  const navItems = [
    { label: 'Início', href: '#inicio' },
    { label: 'Sobre Mim', href: '#sobre' },
    { label: 'Experiência', href: '#experiencia' },
    { label: 'Formação & Cursos', href: '#formacao' },
    { label: 'Competências', href: '#competencias' },
    { label: 'Contato', href: '#contato' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Gatilho invisível no próprio nome: 5 cliques rápidos (< 3s) disparam 'open_admin_secret'
  const handleNameClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const now = Date.now();
    const timestamps = clickTimestampsRef.current.filter((t) => now - t < 3000);
    timestamps.push(now);
    clickTimestampsRef.current = timestamps;

    if (timestamps.length >= 5) {
      clickTimestampsRef.current = [];
      window.dispatchEvent(new CustomEvent('open_admin_secret'));
    }

    // Mantém a rolagem suave para #inicio
    const target = document.querySelector('#inicio');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="header"
      className="sticky top-0 z-40 bg-[#FBF7F2] border-b border-[#E7DFD6] py-3.5 print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Nome como link para #inicio em Bricolage, sem ícone nem monograma */}
        <div className="flex items-center">
          <a 
            href="#inicio" 
            onClick={handleNameClick}
            className="font-display font-bold text-[#1C1917] text-xl tracking-tight hover:text-[#881337] transition cursor-pointer select-none"
            title="Ir para o início"
          >
            {personal.displayName}
          </a>
        </div>

        {/* Desktop Navigation - links de 15px e mais espaço entre eles */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-[15px] font-medium text-[#1C1917] py-1 border-b-2 border-transparent hover:border-[#881337] hover:text-[#881337] transition-all duration-150"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Call To Action - Visualizar Currículo */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenResume}
            className="flex items-center gap-2 px-5 py-2 bg-[#881337] text-white rounded-full text-sm font-semibold hover:bg-[#70102e] transition cursor-pointer border border-[#881337]"
          >
            <FileText size={16} />
            <span>Visualizar Currículo</span>
          </button>
        </div>

        {/* Mobile Menu Buttons */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={onOpenResume}
            className="p-2 text-[#1C1917] hover:text-[#881337] transition"
            title="Visualizar Currículo"
            aria-label="Visualizar Currículo"
          >
            <FileText size={20} />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1C1917] hover:text-[#881337] transition cursor-pointer"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#FFFFFF] border-b border-[#E7DFD6] overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block py-2 text-sm font-medium text-[#1C1917] hover:text-[#881337] px-3 rounded-[12px] hover:bg-stone-100 transition"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 border-t border-[#E7DFD6] px-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenResume();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#881337] text-white rounded-full text-sm font-semibold hover:bg-[#70102e] transition"
                >
                  <FileText size={16} />
                  <span>Visualizar Currículo</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
