// Cloudflare Worker entry point for zyvibe.me.
//
// The ASSETS binding (declared in wrangler.toml) serves everything in
// ./public as static files. Add API route branches here — e.g., /api/lead
// for form submissions, /api/og for dynamic OG images.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Lead-capture form handler
    if (url.pathname === "/api/lead" && request.method === "POST") {
      return handleLeadForm(request, env);
    }

    // Default: serve static assets from ./public
    return env.ASSETS.fetch(request);
  },
};

/**
 * POST /api/lead
 *   body: { name, email, segment, context }
 * Sends an email to moh@zyvibe.com via Resend.
 * Requires RESEND_API_KEY to be set with `wrangler secret put RESEND_API_KEY`.
 */
async function handleLeadForm(request, env) {
  try {
    const body = await request.json();
    const { name, email, segment, context } = body;

    if (!name || !email) {
      return json({ error: "name and email are required" }, 400);
    }

    if (!env.RESEND_API_KEY) {
      return json({ error: "server missing RESEND_API_KEY" }, 500);
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "lead@zyvibe.me",
        to: "moh@zyvibe.com",
        reply_to: email,
        subject: `[zyvibe.me] New lead — ${segment || "unspecified"} — ${name}`,
        text: [
          `Name:    ${name}`,
          `Email:   ${email}`,
          `Segment: ${segment || "—"}`,
          "",
          "Context:",
          context || "—",
        ].join("\n"),
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text().catch(() => "");
      return json({ error: "email delivery failed", detail }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    return json({ error: err.message || "unknown error" }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
