// Stripe Checkout for the Fund the Research cart (site/fund.html).
// The browser sends item ids and quantities; prices come from the table
// below, never from the browser. Keep it in step with site/assets/js/fund-config.js.
//
// Secrets (Supabase dashboard → Edge Functions → Secrets):
//   STRIPE_SECRET_KEY   sk_live_... from Stripe → Developers → API keys
// Deploy with "Verify JWT" turned off so the public site can call it.

const SITE = "https://comedylabsedona.com";

const PRICES: Record<string, { name: string; cents: number; max: number }> = {
  all: { name: "Fund the entire Comedy Lab experiment", cents: 732511, max: 1 },
  tags: { name: "Opening and closing clip tags", cents: 50000, max: 1 },
  comedian: { name: "Comedian stipend", cents: 40000, max: 9 },
  editor: { name: "Crew stipend", cents: 40000, max: 3 },
  bounty: { name: "Quarterly bounty prize", cents: 30000, max: 4 },
  boost: { name: "Quarter of social boosting", cents: 30000, max: 4 },
};

const cors = {
  "Access-Control-Allow-Origin": SITE,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

function reply(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return reply({ error: "POST only" }, 405);

  let cart: Record<string, number>;
  try {
    cart = (await req.json()).cart ?? {};
  } catch {
    return reply({ error: "Bad request" }, 400);
  }

  const form = new URLSearchParams();
  let n = 0;
  for (const [id, raw] of Object.entries(cart)) {
    if (id === "gift") {
      const cents = Math.round(Number(raw) * 100);
      if (!(cents >= 100 && cents <= 10_000_000)) continue;
      form.append(`line_items[${n}][price_data][currency]`, "usd");
      form.append(`line_items[${n}][price_data][unit_amount]`, String(cents));
      form.append(`line_items[${n}][price_data][product_data][name]`, "Gift to the Comedy Lab");
      form.append(`line_items[${n}][quantity]`, "1");
      n++;
      continue;
    }
    const p = PRICES[id];
    const qty = Math.floor(Number(raw));
    if (!p || !(qty >= 1 && qty <= p.max)) continue;
    form.append(`line_items[${n}][price_data][currency]`, "usd");
    form.append(`line_items[${n}][price_data][unit_amount]`, String(p.cents));
    form.append(`line_items[${n}][price_data][product_data][name]`, p.name);
    form.append(`line_items[${n}][quantity]`, String(qty));
    n++;
  }
  if (!n) return reply({ error: "Cart is empty" }, 400);

  form.append("mode", "payment");
  form.append("submit_type", "donate");
  // Shows on the donor's Stripe receipt, which Stripe emails when
  // Settings > Customer emails > "Successful payments" is on.
  form.append("payment_intent_data[description]", "Donation to LightNet for the Comedy Lab. No goods or services were provided in exchange.");
  form.append("customer_creation", "always");
  form.append("success_url", `${SITE}/fund.html?thanks=1`);
  form.append("cancel_url", `${SITE}/fund.html`);

  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("STRIPE_SECRET_KEY")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });
  const s = await r.json();
  if (!r.ok) return reply({ error: s.error?.message ?? "Stripe error" }, 502);
  return reply({ url: s.url });
});
