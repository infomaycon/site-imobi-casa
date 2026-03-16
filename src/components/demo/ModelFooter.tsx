import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import type { DemoModel } from "@/data/models";
import ModelLogo from "./ModelLogo";

const ModelFooter = ({
  model,
  onNavigate,
}: {
  model: DemoModel;
  onNavigate?: (target: string, sectionId?: string) => void;
}) => {
  const c = model.colors;

  const navItems = [
    { label: "Início", target: "home" },
    { label: "Imóveis", target: "listing" },
    { label: "Sobre", target: "about" },
    { label: "Contato", target: "contact" },
  ];

  return (
    <footer
      className="border-t"
      style={{ borderColor: c.text + "10", backgroundColor: c.text + "04" }}
    >
      <div className="container mx-auto px-6 max-w-6xl py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <ModelLogo model={model} size="default" />
            </div>
            <p
              className="text-sm leading-relaxed font-body mb-4"
              style={{ color: c.text + "77" }}
            >
              {model.tagline}
            </p>
            <p
              className="text-xs font-body"
              style={{ color: c.text + "55" }}
            >
              Especialistas em imóveis de alto padrão com atendimento personalizado e exclusivo.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="font-display font-bold text-xs uppercase tracking-widest mb-5"
              style={{ color: c.text + "99" }}
            >
              Navegação
            </h4>
            <div className="space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onNavigate?.(item.target)}
                  className="block text-sm font-body transition-all hover:translate-x-1"
                  style={{ color: c.text + "77" }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact & CRECI */}
          <div>
            <h4
              className="font-display font-bold text-xs uppercase tracking-widest mb-5"
              style={{ color: c.text + "99" }}
            >
              Contato
            </h4>
            <div className="space-y-3">
              <a
                href="tel:+5511999990000"
                className="flex items-center gap-2.5 text-sm font-body transition-colors hover:opacity-80"
                style={{ color: c.text + "77" }}
              >
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: c.primary }} />
                (11) 99999-0000
              </a>
              <a
                href={`mailto:contato@${model.id}.com.br`}
                className="flex items-center gap-2.5 text-sm font-body transition-colors hover:opacity-80"
                style={{ color: c.text + "77" }}
              >
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: c.primary }} />
                contato@{model.id}.com.br
              </a>
              <div
                className="flex items-center gap-2.5 text-sm font-body"
                style={{ color: c.text + "77" }}
              >
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: c.primary }} />
                Av. Paulista, 1000 - São Paulo, SP
              </div>
            </div>
            <div className="mt-5 pt-4 border-t" style={{ borderColor: c.text + "0a" }}>
              <p className="text-xs font-display font-semibold" style={{ color: c.text + "55" }}>
                CRECI 123.456-J
              </p>
              <p className="text-[11px] font-body mt-1" style={{ color: c.text + "44" }}>
                Conselho Regional de Corretores de Imóveis
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4
              className="font-display font-bold text-xs uppercase tracking-widest mb-5"
              style={{ color: c.text + "99" }}
            >
              Redes Sociais
            </h4>
            <div className="flex gap-3 mb-6">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Youtube, href: "#", label: "YouTube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    backgroundColor: c.primary + "12",
                    color: c.primary,
                  }}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div>
              <h4
                className="font-display font-bold text-xs uppercase tracking-widest mb-3"
                style={{ color: c.text + "99" }}
              >
                Horário
              </h4>
              <p className="text-sm font-body" style={{ color: c.text + "66" }}>
                Seg - Sex: 9h às 18h
              </p>
              <p className="text-sm font-body" style={{ color: c.text + "66" }}>
                Sáb: 9h às 13h
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: c.text + "10" }}
        >
          <p className="text-xs font-body" style={{ color: c.text + "44" }}>
            © 2026 {model.name}. Todos os direitos reservados.
          </p>
          <p className="text-xs font-body" style={{ color: c.text + "44" }}>
            Site demonstrativo · Desenvolvido por{" "}
            <span className="font-semibold" style={{ color: c.primary + "88" }}>
              ImobiCasa
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ModelFooter;
