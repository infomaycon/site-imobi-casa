import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SettingsPage = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ domain: "", subdominio: "", site_name: "", whatsapp: "" });

  useEffect(() => {
    if (!user) return;
    supabase.from("site_settings").select("domain, site_name, whatsapp").single().then(async ({ data }) => {
      if (data) setForm(prev => ({ ...prev, domain: data.domain || "", site_name: data.site_name || "", whatsapp: data.whatsapp || "" }));
      // Load subdominio from perfis
      const { data: perfil } = await supabase.from("perfis").select("subdominio").eq("user_id", user!.id).maybeSingle();
      if (perfil) setForm(prev => ({ ...prev, subdominio: perfil.subdominio || "" }));
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { data: existing } = await supabase.from("site_settings").select("id").single();
    if (existing) {
      await supabase.from("site_settings").update({ domain: form.domain, site_name: form.site_name, whatsapp: form.whatsapp }).eq("id", existing.id);
    } else {
      await supabase.from("site_settings").insert({ domain: form.domain, site_name: form.site_name, whatsapp: form.whatsapp, user_id: user.id });
    }
    // Save subdominio to perfis
    const { data: existingPerfil } = await supabase.from("perfis").select("id").eq("user_id", user.id).maybeSingle();
    if (existingPerfil) {
      await supabase.from("perfis").update({ subdominio: form.subdominio }).eq("user_id", user.id);
    } else {
      await supabase.from("perfis").insert({ user_id: user.id, subdominio: form.subdominio });
    }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground text-sm font-body mt-1">Configurações gerais do site</p>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
        <div className="space-y-2">
          <Label className="font-body text-foreground">Nome do Site</Label>
          <Input value={form.site_name} onChange={(e) => setForm((p) => ({ ...p, site_name: e.target.value }))} className="h-11" placeholder="Meu Site Imobiliário" />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-foreground">Domínio</Label>
          <Input value={form.domain} onChange={(e) => setForm((p) => ({ ...p, domain: e.target.value }))} className="h-11" placeholder="meusitecorretor.com.br" />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-foreground">Subdomínio</Label>
          <div className="flex items-center gap-2">
            <Input value={form.subdominio} onChange={(e) => setForm((p) => ({ ...p, subdominio: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))} className="h-11" placeholder="meusite" />
            <span className="text-muted-foreground text-sm whitespace-nowrap">.imobicasa.com</span>
          </div>
          <p className="text-xs text-muted-foreground">Seu site ficará acessível em <strong>{form.subdominio || "meusite"}.imobicasa.com</strong></p>
        </div>
        <div className="space-y-2">
          <Label className="font-body text-foreground">WhatsApp</Label>
          <Input value={form.whatsapp} onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))} className="h-11" placeholder="(11) 99999-9999" />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <Button onClick={handleSave} disabled={saving} className="h-12 px-8 font-display font-semibold">
          <Save className="w-5 h-5 mr-2" />
          {saving ? "Salvando..." : "Salvar"}
        </Button>
        <AnimatePresence>
          {saved && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-primary font-body text-sm">
              <CheckCircle2 className="w-5 h-5" />Salvo!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SettingsPage;
