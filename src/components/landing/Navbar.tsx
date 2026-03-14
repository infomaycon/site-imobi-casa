import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-dark/80 backdrop-blur-xl border-b border-border/10">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-display font-bold text-xl text-on-dark">
          Sites<span className="text-primary">Premium</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#modelos" className="text-on-dark-muted hover:text-primary transition-colors text-sm font-body">Modelos</a>
          <a href="#planos" className="text-on-dark-muted hover:text-primary transition-colors text-sm font-body">Planos</a>
          <a
            href="#planos"
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:brightness-110 transition-all"
          >
            Começar Agora
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-on-dark">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-surface-dark border-t border-border/10 p-6 space-y-4">
          <a href="#modelos" onClick={() => setOpen(false)} className="block text-on-dark-muted hover:text-primary text-sm font-body">Modelos</a>
          <a href="#planos" onClick={() => setOpen(false)} className="block text-on-dark-muted hover:text-primary text-sm font-body">Planos</a>
          <a
            href="#planos"
            onClick={() => setOpen(false)}
            className="block text-center px-5 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm"
          >
            Começar Agora
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
