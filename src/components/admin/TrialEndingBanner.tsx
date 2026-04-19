import { useTestProfile } from "@/hooks/useTestProfile";
import { Clock, Crown } from "lucide-react";

const TrialEndingBanner = () => {
  const { profile, isFree } = useTestProfile();

  if (!isFree || !profile?.trial || !profile?.trial_end) return null;

  const end = new Date(profile.trial_end).getTime();
  const now = Date.now();
  const msLeft = end - now;
  const dayMs = 24 * 60 * 60 * 1000;

  // Mostrar se falta 1 dia ou menos (inclui já expirado)
  if (msLeft > dayMs) return null;

  return (
    <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 flex items-center gap-3 shadow-soft">
      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
        <Clock className="w-5 h-5 text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-amber-900 text-sm">
          ⏳ Seu teste termina hoje.
        </p>
        <p className="text-xs font-body text-amber-800/80">
          Escolha um plano para continuar.
        </p>
      </div>
      <a
        href="/admin/account"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-display font-semibold hover:bg-amber-700 transition-colors shrink-0"
      >
        <Crown className="w-4 h-4" />
        Ver planos
      </a>
    </div>
  );
};

export default TrialEndingBanner;
