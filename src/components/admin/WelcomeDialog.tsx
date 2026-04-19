import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useTestProfile } from "@/hooks/useTestProfile";

const WelcomeDialog = () => {
  const { profile, markFirstLoginSeen } = useTestProfile();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (profile?.first_login === true) setOpen(true);
  }, [profile?.first_login]);

  const handleClose = async () => {
    setOpen(false);
    await markFirstLoginSeen();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-display">Bem-vindo! 🎉</DialogTitle>
          <DialogDescription className="text-base font-body pt-2">
            Você está no período de teste gratuito por <strong>7 dias</strong>.
            Aproveite todos os recursos!
          </DialogDescription>
        </DialogHeader>
        <Button onClick={handleClose} className="w-full h-11 font-display font-semibold mt-2">
          Começar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
