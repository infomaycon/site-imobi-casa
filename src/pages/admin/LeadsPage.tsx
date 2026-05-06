import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MessageSquare } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  property_title: string | null;
  created_at: string;
}

const LeadsPage = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // TODO: fetch from new backend
    setLeads([]);
    setLoading(false);
  }, [user]);

  if (loading) return <div className="text-muted-foreground font-body text-center py-12">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Leads</h1>
        <p className="text-muted-foreground text-sm font-body mt-1">{leads.length} contatos recebidos</p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-card rounded-xl p-12 shadow-soft text-center">
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-body">Nenhum lead recebido ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-card rounded-xl p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground">{lead.name}</h3>
                  <p className="text-muted-foreground text-sm font-body">{lead.phone} · {lead.email}</p>
                  {lead.property_title && (
                    <p className="text-sm text-primary font-body mt-1">Imóvel: {lead.property_title}</p>
                  )}
                  {lead.message && (
                    <p className="text-sm text-muted-foreground font-body mt-2 bg-muted/50 p-3 rounded-lg">{lead.message}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground font-body flex-shrink-0">
                  {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
