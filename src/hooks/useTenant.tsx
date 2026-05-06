import { useEffect, useState } from "react";

export interface TenantData {
  id: string;
  user_id: string;
  subdominio: string | null;
  dominio_custom: string | null;
  nome: string | null;
  email: string | null;
}

/**
 * Extrai o subdomínio do hostname atual.
 * Só funciona para *.imobicasa.com
 * Retorna null para qualquer outro domínio.
 */
function extractSubdomain(hostname: string): string | null {
  // Só ativar para *.imobicasa.com
  const match = hostname.match(/^([^.]+)\.imobicasa\.com$/i);
  if (!match) return null;

  const sub = match[1];
  if (sub === "www") return null;

  return sub;
}

export const useTenant = () => {
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(false);

  // TODO: fetch from new backend

  return { tenant, loading };
};
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubdomainAccess, setIsSubdomainAccess] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = extractSubdomain(hostname);

    console.log("[Tenant] hostname:", hostname);
    console.log("[Tenant] subdomínio extraído:", subdomain);

    // Se não há subdomínio, estamos no domínio principal
    if (!subdomain) {
      console.log("[Tenant] Acesso pelo domínio principal, sem tenant.");
      setLoading(false);
      return;
    }

    setIsSubdomainAccess(true);

    const fetchTenant = async () => {
      try {
        // Busca por subdomínio OU domínio customizado
        const { data, error } = await supabase
          .from("perfis")
          .select("*")
          .or(`subdominio.eq.${subdomain},dominio_custom.eq.${hostname}`)
          .maybeSingle();

        if (error) {
          console.error("[Tenant] Erro ao buscar perfil:", error);
          setNotFound(true);
        } else if (data) {
          console.log("[Tenant] Cliente encontrado:", data);
          setTenant(data as TenantData);
        } else {
          console.log("[Tenant] Cliente não encontrado para:", subdomain);
          setNotFound(true);
        }
      } catch (err) {
        console.error("[Tenant] Erro inesperado:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, []);

  return { tenant, loading, notFound, isSubdomainAccess };
};