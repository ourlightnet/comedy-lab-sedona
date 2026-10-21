# The Comedy Lab Sedona

The website for **What on Earth!?**, the Comedy Lab's 9-month comedy clip contest in Sedona. A Dream Machine project.

Live at https://comedylabsedona.com

## How it publishes
Everything in `site/` is published to GitHub Pages on every push to `main` (see `.github/workflows/pages.yml`), the same setup as fashion-lab-sedona.

## Forms
- **Vote and join** and **Want a seat in the house?** post to Brevo forms. Paste each Brevo form's URL into the form's `action` attribute in `site/index.html`. The fields use Brevo attribute names: `EMAIL`, `FIRSTNAME`, `CITY`, `VOTES`, `SUGGESTION`, `ROLE`, `WEBSITE`.
- **Submit a clip** links to a hosted upload form. Put its link in `CLIP_FORM_URL` in `site/assets/js/main.js`.

## Opening Lines page (lines.html)

People add opening lines and vote them up or down. Until a database is
connected the page runs in preview mode (saved only in each visitor's browser).

To make it shared (free Supabase project):
1. Create a project at supabase.com.
2. SQL Editor → New query → paste `supabase/lines.sql` → Run.
3. Project Settings → API: copy the Project URL and the `anon` public key into
   `site/assets/js/lines-config.js`, then push.

To hide a line, set `hidden` to true on it in Table Editor → lines.
