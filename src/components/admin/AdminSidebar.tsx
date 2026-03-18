import { PlusCircle, List, Palette, FileText, MessageSquare, Settings, User, ExternalLink, LogOut, HelpCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import logo from "@/assets/imobicasa-logo.png";

const menuItems = [
  { title: "Adicionar Imóvel", url: "/admin", icon: PlusCircle },
  { title: "Lista de Imóveis", url: "/admin/properties", icon: List },
  { title: "Aparência do Site", url: "/admin/appearance", icon: Palette },
  { title: "Conteúdo do Site", url: "/admin/content", icon: FileText },
  { title: "Leads", url: "/admin/leads", icon: MessageSquare },
  { title: "Configurações", url: "/admin/settings", icon: Settings },
  { title: "Conta", url: "/admin/account", icon: User },
  { title: "Ajuda", url: "/admin/help", icon: HelpCircle },
];

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="p-5 border-b border-border">
        <a href="/" className="flex items-center">
          <img src={logo} alt="ImobiCasa" className="h-8" />
        </a>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink
                      to={item.url}
                      end
                      className="text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg px-3 font-body text-sm transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="mr-3 h-[18px] w-[18px]" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border space-y-1">
        <a
          href="/demo/model1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-body text-primary hover:bg-primary/10 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Ver meu site
        </a>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-body text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
