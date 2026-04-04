import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  const user = users?.users?.find(u => u.email === "maycon.russinholy@gmail.com");

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: "4545#0810",
  });

  return new Response(JSON.stringify({ success: !error, error: error?.message }));
});
