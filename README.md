# ST ÉLITE PROJECTS

Bilingual French/English Astro + TypeScript website for ST ÉLITE PROJECTS, Montreuil. Includes the approved charcoal, ivory and muted gold design, responsive navigation, mobile call/quote bar, seven service categories, project gallery support, contact form, and draft legal pages.

**This is a standalone GitHub/Cloudflare project.** It contains no ChatGPT Sites identity, repository credentials, account IDs, or API keys. The downloadable project can be deployed independently of the ChatGPT Sites preview.

## Stack

- Astro 7, static output: `/fr/` and `/en/`, with `/` serving the French homepage directly.
- TypeScript and custom responsive CSS, shared Astro layouts/components.
- Cloudflare Worker for `/api/quote`; static pages served through Workers Static Assets.
- Cloudflare Turnstile, validated server-side, and Cloudflare Email Service for transactional email.
- Photos delivered as private email attachments to the company, not stored publicly or in R2. Maximum 5, JPEG/PNG/WebP, 2 MiB each, 8 MiB total. R2 is unnecessary for this initial workflow.
- No enquiry database, CMS, analytics, advertising scripts or admin login. A daily SQLite Durable Object stores only quota counters and daily IP-derived identifiers.

## 1. Run locally

Install Node.js 24 LTS and use these commands in this folder:

```sh
npm ci
cp .env.example .env
npm run dev
```

Open the URL printed by Astro. `npm run dev` serves the website only; it does not run the Worker API. Enquiry submission is disabled by default.

For the built site and Worker together:

```sh
cp .dev.vars.example .dev.vars
npm run preview
```

Use the local address printed by Wrangler. Local email testing requires valid test credentials and matching Turnstile localhost configuration. Tests use mocked providers and send no email.

```sh
npm run check
npm test
npm run build
```

The dependency versions are pinned and `package-lock.json` is included. Use `npm ci` for reproducible installs.

## 2. Push to your GitHub repository

Create an empty private or public GitHub repository, then run:

```sh
git init
git add .
git commit -m "Initial Astro website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Replace the URL with your repository. No `.git` directory is included. `.env`, `.dev.vars`, `node_modules`, generated output and local Cloudflare state are ignored. Commit source and `package-lock.json`.

## 3. Deploy to Cloudflare now, without a custom domain

### CLI

```sh
npx wrangler login
npm run deploy
```

Wrangler will print a `workers.dev` URL. If the Worker name is already used in your account, change `name` in `wrangler.jsonc` first.

Set `PUBLIC_SITE_URL` in `.env` to that exact URL, then rebuild/deploy so canonical and alternate links use the correct origin. Keep `PUBLIC_INDEXABLE=false` for the temporary preview. No domain purchase is needed. Hosting/API usage is subject to the plans and limits of your accounts.

### Automatic deployment from GitHub (recommended)

In Cloudflare Workers & Pages, create/import a Worker from your GitHub repository:

- Production branch: `main`
- Root directory: this project root
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Set build environment `NODE_VERSION=24`
- Set the `PUBLIC_*` build variables listed below in Cloudflare's build settings.

Do not choose an SPA fallback. This is a pre-rendered multi-page website; `wrangler.jsonc` provides the correct static-asset configuration. The included GitHub workflow checks types, tests, builds and dry-runs the Worker; deployment is handled by Cloudflare's Git integration.

## 4. Configure the quote form

The production form uses native Cloudflare Email Service with a fixed verified destination, Cloudflare Turnstile, and a SQLite Durable Object quota ledger. No Resend account or API key is required.

- Current temporary recipient: `cristian.sandu.connect@gmail.com`. Public contact links continue to use `steliteprojects@gmail.com`.
- Sender: `devis@forms.steliteprojects.com`; Email Routing is enabled on the dedicated forms subdomain.
- Workers Free is confirmed by the account owner's dashboard screenshot. Cloudflare documents sending to verified destinations as free on all plans. Do not upgrade Workers or enable arbitrary-recipient sending for this form.
- Limit: 50 reserved email attempts per UTC day globally; three per IP per day, at least ten minutes apart. Failed provider sends consume a slot conservatively. Quota outages reject submission. Daily identifiers are purged by an alarm 48 hours after the day's start.
- Turnstile must return success, action `quote`, and the exact runtime `TURNSTILE_HOSTNAME`. Tokens are single-use. `TURNSTILE_SECRET_KEY` lives only in the Worker's secret store.
- Build variables: `PUBLIC_ENABLE_QUOTES=true`, `PUBLIC_TURNSTILE_SITE_KEY` set to the production public key. `PUBLIC_SITE_URL` and `PUBLIC_INDEXABLE` keep their existing deployment meanings.
- Runtime bindings: `EMAIL` restricted to the fixed recipient/sender, `QUOTE_LIMITS`, `ASSETS`, and the variables in `wrangler.jsonc`. Generate binding types with `npx wrangler types worker/env.d.ts --include-runtime false` after changing configuration.
- To switch recipients, first verify the new address in Cloudflare, then update the handler's fixed recipient, `CONTACT_TO`, and the `send_email.destination_address` restriction together. Validate delivery before retiring the temporary recipient.
- Direct phone and email actions remain visible above the form, including when sending is enabled. Failed/limited submissions also offer contact links.

The owner explicitly requested activation while holding all legal/privacy-page changes pending Artur's confirmation. Those published pages remain drafts; this implementation does not claim that they are complete or update them silently.

## 5. Add the company content

| File | What to edit |
|---|---|
| `src/data/company.ts` | Phone, email, address, legal fields, logo and hero image |
| `src/data/services.ts` | Service descriptions and `enabled` switches |
| `src/data/copy.json` | French/English marketing copy |
| `src/data/projects.ts` | Real projects and bilingual image descriptions |
| `src/styles/global.css` | Colours, typography, spacing, responsive styles |
| `src/pages/[lang]/[...page].astro` | Main page structure and draft legal/privacy text |
| `src/components/Contact.astro` | Contact form and translated status messages |

A service switch removes it from service cards, footer, hero list and contact options, hides associated projects, and rejects that service on the backend. Rebuild and deploy after changing it.

Place approved original photographs in `src/assets/projects/` and import them in `src/data/projects.ts`. Astro generates responsive WebP versions and a larger version for opening in a new tab. Images reserve their dimensions and galleries load lazily. Each entry describes visible equipment without assuming that different photographs are from the same job.

Example entry:

```ts
import photo from '../assets/projects/electrical-panel.jpg';
// In the projects array:
{
  slug: 'electrical-panel',
  service: 'electricity',
  title: {fr: 'Tableau électrique', en: 'Electrical panel'},
  description: {fr: 'Description vérifiée de la photo.', en: 'Verified description of the photograph.'},
  image: photo,
}
```

The gallery currently includes seven supplied photographs. Enlarged images open in a new tab. Portrait and landscape photographs remain fully visible.

The selected logo is included unchanged at `public/images/st-elite-projects-signature.png`, displayed in the header, footer and homepage. CSS isolates the main black-and-gold logo from its presentation board. The selected 02 — Signature logo is displayed from its original presentation artwork through a CSS viewport. Google Fonts supplies Manrope and DM Sans, with system-font fallbacks. If you prefer no third-party font requests, self-host the licensed font files and replace the CSS import.

## 6. Connect the domain and launch

Add your chosen domain as a Custom Domain for the Worker in Cloudflare. Configure the zone/DNS as directed by Cloudflare; the registrar and hosting provider can be different. Update `PUBLIC_SITE_URL`, allowed Turnstile hostname and runtime `TURNSTILE_HOSTNAME`, rebuild, and verify HTTPS.

Before enabling search indexing and enquiries:

- Confirm published services are insured and offered.
- Confirm contact details and official company registration data.
- Complete SIRET, VAT, hosting and mediator details, and finalise the privacy policy with retention and processing details.
- Replace the empty portfolio with real project photos when ready.
- Test navigation, FR/EN switching, keyboard use, mobile layout, phone/email links, quote delivery and attachments on real devices.
- Set `PUBLIC_INDEXABLE=true` and submit `/sitemap.xml` to Search Console.

The legal/privacy pages are explicitly marked drafts, not a completed legal compliance review. They must be finalised before accepting enquiries. The site has no automatic content refresh or third-party review imports.

## Backup and ownership

Keep the repository and Cloudflare account under the company's control, with separate collaborator access. Git stores source/version history; retain a separate copy of original photography. Quote messages/attachments live in the receiving mailbox and email provider according to those services' retention settings. Agree a retention period and mailbox backup policy with the company; there is no hidden database backup or storage service in this project.

## Verification supplied

Type checking, static production build, seven API tests with mocked providers, and a Wrangler deployment dry-run were run during preparation. Real-provider email delivery and browser/device visual QA must be completed in your configured environment. No deployment to your Cloudflare account has been made.

## Company update — Kbis dated 22 September 2026

Updated against the supplied Kbis: company name, SAS status, capital, registered address, SIREN/RCS, EUID, president, registration date and business start date. The supplied logo confirms the existing phone/email. The source Kbis itself is intentionally not bundled or published; personal birth details are not used.

The Kbis does not provide the SIRET, VAT number, opening hours, qualifications, insurance coverage or a personal biography. It records additional activities (photovoltaic, heat pumps/HVAC and interior renovation/finishing), but registration does not confirm current insurance or a decision to advertise them. The later website content brief and Artur’s messages request electricity, plumbing, repairs, water heaters, heat pumps, photovoltaics and charging points. These are now advertised without unsupported certification claims. Legal hosting/mediator details and the privacy policy still need finalisation.

## Artur’s October content refinements

The Romanian website brief supplies the SIRET, French company/about/contact copy and heating/air-conditioning services. Later Messenger messages take precedence for the homepage headline, free quotations, the lower slogan, hero service summary and seven-category service overview. English content follows the French changes. The Kbis confirms company registration details; no personal birth information is published. VAT and unsupported RGE/QualiPAC/IRVE/refrigerant certifications are not invented. The form remains disabled until its provider configuration is complete.

## Logo colour refinement

The site uses charcoal, warm ivory and muted gold, with dark bronze links for readable contrast. The design keeps Artur’s requested headline, hero summary, seven-service overview and lower slogan. See `docs/artur-content-review.md` for the source-by-source review, remaining content/configuration items and design references. Production metadata defaults to `https://steliteprojects.com`. `PUBLIC_INDEXABLE=false` is an explicit override for previews; the public deployment sets it to `true`.

## SEO verification

See `docs/seo-review.md`. Search metadata lives in `src/data/seo.ts`; sitemap language and photo entries are generated in `src/pages/sitemap.xml.ts`. `npm run build` now runs generated-page SEO validation automatically. Use `npm run check:seo` to repeat it for an existing build. Configure `PUBLIC_SITE_URL` consistently when overriding the public origin; `PUBLIC_INDEXABLE=false` is the explicit preview override.
