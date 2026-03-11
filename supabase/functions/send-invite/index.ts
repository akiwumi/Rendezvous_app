import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid or missing email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const code = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    const { data, error } = await supabase
      .from("invites")
      .insert({ email, code, expires_at: expiresAt })
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Create auth user (pre-verified, can set password on first login)
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { invited_by: "system", invite_code: data.code },
    });
    if (authError) {
      // User may already exist — log and continue (invite still created)
      console.error("Auth createUser:", authError.message);
    }

    // Send invite email via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const appUrl = Deno.env.get("APP_URL") || "https://rendezvous-app.vercel.app";
    const inviteUrl = `${appUrl}/register?invite=${code}`;

    if (resendKey) {
      const fromEmail = Deno.env.get("RESEND_FROM") || "Rendezvous <onboarding@resend.dev>";
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: "You're invited to Rendezvous",
          html: `
            <p>Hello,</p>
            <p>You've been invited to join Rendezvous Social Club.</p>
            <p>Click below to accept your invitation:</p>
            <p><a href="${inviteUrl}">Accept Invitation</a></p>
            <p>If the link doesn't work, use this code when registering: <b>${code}</b></p>
          `,
        }),
      });

      if (!resendRes.ok) {
        const err = await resendRes.text();
        console.error("Resend error:", err);
      }
    }

    return new Response(
      JSON.stringify({ success: true, code: data.code, email: data.email }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
