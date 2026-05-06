import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSuperAdmin } from "@/hooks/useSuperAdmin";
import { useState } from "react";
import { UserPlus, Trash2, Shield, Crown, X } from "lucide-react";
import { toast } from "sonner";

const UsersPage = () => {
  const { isOwner } = useSuperAdmin();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { data: roles = [] } = useQuery({
    queryKey: ["super-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });

  const addAdmin = useMutation({
    mutationFn: async () => {
      // Create user via edge function or sign up
      const { data, error } = await supabase.auth.signUp({
        email: newEmail,
        password: newPassword,
        options: { data: { full_name: newName } },
      });
      if (error) throw error;
      if (!data.user) throw new Error("Erro ao criar usuário");

      // Add admin role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: data.user.id,
        role: "admin" as any,
      });
      if (roleError) throw roleError;
    },
    onSuccess: () => {
      toast.success("Administrador criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["super-user-roles"] });
      setShowAdd(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
    },
    onError: (err: any) => toast.error(err.message || "Erro ao criar admin"),
  });

  const removeRole = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Usuário removido");
      queryClient.invalidateQueries({ queryKey: ["super-user-roles"] });
    },
    onError: () => toast.error("Erro ao remover usuário"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Usuários</h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie administradores da plataforma</p>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium hover:bg-emerald-500/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Novo Admin
          </button>
        )}
      </div>

      {/* Add admin modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 p-6 space-y-4" style={{ background: "#0d0d0d" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Criar Administrador</h3>
              <button onClick={() => setShowAdd(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome"
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
            />
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
            />
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Senha"
              type="password"
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
            />
            <button
              onClick={() => addAdmin.mutate()}
              disabled={addAdmin.isPending || !newEmail || !newPassword}
              className="w-full py-2.5 rounded-lg bg-emerald-500 text-black font-semibold text-sm hover:bg-emerald-400 transition-all disabled:opacity-50"
            >
              {addAdmin.isPending ? "Criando..." : "Criar Administrador"}
            </button>
          </div>
        </div>
      )}

      {/* Users list */}
      <div className="rounded-xl border border-zinc-800/60 overflow-hidden" style={{ background: "#0d0d0d" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800/60">
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Usuário</th>
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Função</th>
                {isOwner && (
                  <th className="text-right px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Ações</th>
                )}
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-zinc-600">Nenhum usuário encontrado</td>
                </tr>
              ) : (
                roles.map((r) => (
                  <tr key={r.id} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-5 py-3.5 text-white font-medium">{r.user_id}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                        r.role === "owner"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {r.role === "owner" ? <Crown className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {r.role === "owner" ? "Owner" : "Admin"}
                      </span>
                    </td>
                    {isOwner && (
                      <td className="px-5 py-3.5 text-right">
                        {r.role !== "owner" && (
                          <button
                            onClick={() => removeRole.mutate(r.id)}
                            className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
