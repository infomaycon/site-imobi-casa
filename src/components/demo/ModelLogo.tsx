import { Building2, Home, Crown, Gem, Star, Landmark, TowerControl, Castle, Sparkles } from "lucide-react";
import type { DemoModel } from "@/data/models";

const modelIcons: Record<string, any> = {
  "aurora-prime": Sparkles,
  "skyline-urban": TowerControl,
  "metropolitan-elite": Gem,
  "villa-capital": Castle,
  "urban-signature": Star,
  "infinity-city": Building2,
  "empire-urban": Landmark,
  "prime-district": Home,
  "crown-city": Crown,
};

const ModelLogo = ({
  model,
  size = "default",
}: {
  model: DemoModel;
  size?: "default" | "small" | "large";
}) => {
  const Icon = modelIcons[model.id] || Building2;
  const c = model.colors;

  const sizes = {
    small: { icon: "w-4 h-4", text: "text-sm", gap: "gap-1.5" },
    default: { icon: "w-5 h-5", text: "text-lg", gap: "gap-2" },
    large: { icon: "w-6 h-6", text: "text-xl", gap: "gap-2.5" },
  };

  const s = sizes[size];

  // Split name into highlight (first word) + rest
  const words = model.name.split(" ");
  const first = words[0];
  const rest = words.slice(1).join(" ");

  return (
    <span className={`inline-flex items-center ${s.gap}`}>
      <span
        className={`${s.icon} flex-shrink-0`}
        style={{ color: c.primary }}
      >
        <Icon className="w-full h-full" />
      </span>
      <span className={`font-display font-black ${s.text} tracking-tight leading-none`}>
        <span style={{ color: c.primary }}>{first}</span>
        {rest && <span style={{ color: c.text }}> {rest}</span>}
      </span>
    </span>
  );
};

export default ModelLogo;
