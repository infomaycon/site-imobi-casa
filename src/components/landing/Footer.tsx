import { useNavigate } from "react-router-dom";
import logo from "@/assets/imobicasa-logo.png";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="py-12 bg-surface-light-alt border-t border-border">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="ImobiCasa" className="h-12" />
        </div>
        <p className="text-body-muted text-sm font-body">
          <span
            onClick={() => navigate("/super-admin-login")}
            className="cursor-default select-none"
            title=""
          >
            ©
          </span>{" "}
          2026 ImobiCasa. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
