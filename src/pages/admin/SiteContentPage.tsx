import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, CheckCircle2, Facebook, Instagram, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SiteContentPage = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    broker_name: "", creci: "", phone: "", whatsapp: "", email: "",
    about_title: "Sobre", about_description: "",
    footer_text: "", footer_rights: "", footer_extra_info: "",
    facebook_url: "", instagram_url: "",
    show_rental_highlight: true,
  });

  useEffect(() => {
    if (!user) return;
    supabase.from("site_settings").select("*").single().then(({ data }) => {
      if (data) {
        setForm({
          broker_name: data.broker_name || "",
          creci: data.creci || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          email: data.email || "",
          about_title: data.about_title || "Sobre",
          about_description: data.about_description || "",
          footer_text: data.footer_text || "",
          footer_rights: data.footer_rights || "",
          footer_extra_info: (data as any).footer_extra_info || "",
          facebook_url: (data as any).facebook_url || "",
          instagram_url: (data as any).instagram_url || "",
        });
      }
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { data: existing } = await supabase.from("site_settings").select("id").single();
    if (existing) {
      await supabase.from("site_settings").update(form as any).eq("id", existing.id);
    } else {
      await supabase.from("site_settings").insert({ ...form, user_id: user.id } as any);
    }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const Field = ({ label, field, textarea, icon }: { label: string; field: keyof typeof form; textarea?: boolean; icon?: React.ReactNode }) => (
    <div className="space-y-2">
      <Label className="font-body text-foreground flex items-center gap-2">{icon}{label}</Label>
      {textarea ? (
        <Textarea value={form[field]} onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))} rows={3} />
      ) : (
        <Input value={form[field]} onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))} className="h-11" />
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Conteúdo do Site</h1>
        <p className="text-muted-foreground text-sm font-body mt-1">Gerencie as informações exibidas no seu site</p>
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
          <h2 className="font-display font-semibold text-foreground text-lg">Informações do Corretor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nome" field="broker_name" />
            <Field label="CRECI" field="creci" />
            <Field label="Telefone" field="phone" />
            <Field label="WhatsApp" field="whatsapp" />
            <Field label="Email" field="email" />
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
          <h2 className="font-display font-semibold text-foreground text-lg">Seção Sobre</h2>
          <Field label="Título" field="about_title" />
          <Field label="Descrição" field="about_description" textarea />
        </div>

        <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
          <h2 className="font-display font-semibold text-foreground text-lg">Rodapé</h2>
          <Field label="Texto do rodapé" field="footer_text" />
          <Field label="Direitos" field="footer_rights" />
          <Field label="Informações adicionais" field="footer_extra_info" textarea />
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground font-body mb-3">Redes sociais (aparecerão no rodapé do site)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Facebook" field="facebook_url" icon={<Facebook className="w-4 h-4 text-blue-600" />} />
              <Field label="Instagram" field="instagram_url" icon={<Instagram className="w-4 h-4 text-pink-500" />} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handleSave} disabled={saving} className="h-12 px-8 font-display font-semibold">
            <Save className="w-5 h-5 mr-2" />
            {saving ? "Salvando..." : "Salvar Conteúdo"}
          </Button>
          <AnimatePresence>
            {saved && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-primary font-body text-sm">
                <CheckCircle2 className="w-5 h-5" />Alterações salvas!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SiteContentPage;
