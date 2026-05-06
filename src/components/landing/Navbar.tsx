import { Menu, LogIn } from "lucide-react";
import logo from "@/assets/imobicasa-logo.webp";

const Navbar = () => {  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <span className="flex items-center cursor-default">
          <img src={logo} alt="ImobiCasa" className="w-[180px] md:w-[280px]" />
        </span>

        <div className="hidden md:flex items-center gap-8">
          <span className="text-body-muted cursor-default text-sm font-body">Modelos</span>
          <span className="flex items-center gap-1.5 text-body-muted cursor-default text-sm font-body">
            <LogIn className="w-4 h-4" />
            Entrar
          </span>
        </div>

        <span className="md:hidden text-heading cursor-default" aria-hidden="true">
          <Menu className="w-6 h-6" />
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
