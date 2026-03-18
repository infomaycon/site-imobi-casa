import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, UserPlus, Crown, ArrowUpCircle, XCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PLANS = [
  { id: "basic", name: "Básico", price: "R$ 49,90/mês", level: 1 },
  { id: "pro", name: "Profissional", price: "R$ 89,90/mês", level: 2 },
  { id: "premium", name: "Premium", price: "R$ 149,90/mês", level: 3 },
];

const MAX_COLLABORATORS = 2;

const AccountPage = () => {
  const { user } = useAuth();
  const [currentPlan] = useState("basic");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const currentPlanObj = PLANS.find((p) => p.id === currentPlan);
  const upgradePlans = PLANS.filter((p) => p.level > (currentPlanObj?.level || 0));
  const isOwner = true; // assinante principal

  const addCollaborator = () => {
    if (!collaboratorEmail.trim() || collaborators.length >= MAX_COLLABORATORS) return;
    setCollaborators((prev) => [...prev, collaboratorEmail.trim()]);
    setCollaboratorEmail("");
  };

  const removeCollaborator = (index: number) => {
    setCollaborators((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Minha Conta</h1>
        <p className="text-muted-foreground text-sm font-body mt-1">Gerencie sua conta e assinatura</p>
      </div>

      {/* Profile */}
      <div className="bg-card rounded-xl p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">{user?.email}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-body text-muted-foreground">Plano {currentPlanObj?.name} · {currentPlanObj?.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Management */}
      {isOwner && (
        <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
          <h2 className="font-display font-semibold text-foreground text-lg">Gerenciar Plano</h2>

          <div className="flex gap-3">
            {upgradePlans.length > 0 && (
              <Button variant="outline" onClick={() => setShowUpgrade(!showUpgrade)} className="h-11 font-body">
                <ArrowUpCircle className="w-4 h-4 mr-2" />Upgrade de Plano
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowCancelConfirm(!showCancelConfirm)} className="h-11 font-body text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30">
              <XCircle className="w-4 h-4 mr-2" />Cancelar Plano
            </Button>
          </div>

          <AnimatePresence>
            {showUpgrade && upgradePlans.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                <p className="text-sm text-muted-foreground font-body">Escolha um plano superior:</p>
                {upgradePlans.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/40 transition-colors">
                    <div>
                      <p className="font-display font-semibold text-foreground">{plan.name}</p>
                      <p className="text-sm text-muted-foreground font-body">{plan.price}</p>
                    </div>
                    <Button size="sm" className="font-body">Selecionar</Button>
                  </div>
                ))}
              </motion.div>
            )}
            {showCancelConfirm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <p className="text-sm text-foreground font-body mb-3">Tem certeza que deseja cancelar seu plano? Você perderá acesso aos recursos ao final do período.</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" className="font-body">Confirmar Cancelamento</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowCancelConfirm(false)} className="font-body">Voltar</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Collaborators */}
      <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-foreground text-lg">Colaboradores</h2>
          <span className="text-xs text-muted-foreground font-body">{collaborators.length}/{MAX_COLLABORATORS}</span>
        </div>
        <p className="text-sm text-muted-foreground font-body">
          Colaboradores podem gerenciar imóveis e conteúdo, mas não podem cancelar, fazer upgrade ou remover o assinante principal.
        </p>

        {collaborators.length < MAX_COLLABORATORS && (
          <div className="flex gap-2">
            <Input value={collaboratorEmail} onChange={(e) => setCollaboratorEmail(e.target.value)} placeholder="email@colaborador.com" className="h-11" />
            <Button onClick={addCollaborator} className="h-11 px-4 font-body shrink-0">
              <UserPlus className="w-4 h-4 mr-2" />Adicionar
            </Button>
          </div>
        )}

        {collaborators.length > 0 && (
          <div className="space-y-2">
            {collaborators.map((email, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-body text-foreground">{email}</span>
                </div>
                <button onClick={() => removeCollaborator(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
