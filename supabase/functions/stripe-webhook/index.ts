// Stripe webhook: when a Fund the Research checkout completes and the donor
// ticked "Keep me updated" on the Stripe page, add them to the Brevo list.
//
// Secrets (Supabase dashboard → Edge Functions → Secrets):
//   STRIPE_WEBHOOK_SECRET  whsec_... from Stripe → Developers → Webhooks → this endpoint
//   BREVO_API_KEY          from Brevo → SMTP & API → API keys
//   BREVO_LIST_ID          the number of the updates list in Brevo → Contacts → Lists
// Deploy with "Verify JWT" turned off: Stripe signs its calls instead.

// true: only donors who tick the box join the list. false: every donor joins.
const OPT_IN_ONLY = true;

async function hmacHex(secret: string, text: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Checks the Stripe-Signature header so nobody else can post fake events.
async function verified(body: string, header: string, secret: string) {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 600) return false;
  const want = await hmacHex(secret, `${parts.t}.${body}`);
  return header.split(",").some((p) => p === `v1=${want}`);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });
  const body = await req.text();
  const ok = await verified(body, req.headers.get("stripe-signature") ?? "", Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "");
  if (!ok) return new Response("Bad signature", { status: 400 });

  const event = JSON.parse(body);
  if (event.type !== "checkout.session.completed") return new Response("ignored");

  const s = event.data.object;
  const email = s.customer_details?.email;
  const optedIn = s.consent?.promotions === "opt_in";
  if (!email || (OPT_IN_ONLY && !optedIn)) return new Response("not added");

  const name = String(s.customer_details?.name ?? "").trim();
  const r = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": Deno.env.get("BREVO_API_KEY") ?? "", "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      email,
      listIds: [Number(Deno.env.get("BREVO_LIST_ID"))],
      updateEnabled: true,
      attributes: name ? { FIRSTNAME: name.split(/\s+/)[0], LASTNAME: name.split(/\s+/).slice(1).join(" ") } : {},
    }),
  });
  // Brevo answers 201 for a new contact and 204 for an updated one.
  if (!r.ok) {
    console.error("Brevo error", r.status, await r.text());
    return new Response("Brevo error", { status: 502 });
  }
  return new Response("added");
});
