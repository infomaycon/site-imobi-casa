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