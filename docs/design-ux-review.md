# ST ÉLITE PROJECTS — design and UX review

Reviewed 3 October 2026. Reference: published GitHub commit `6a164a1368a15f254aacf6a8c37c278150a1dc7a`. Proposed changes are isolated on the `design-review` branch/worktree. This review does not activate email sending or publish a deployment.

## Decision

Keep the current design direction and refine it. The charcoal, warm ivory and restrained gold fit the approved Signature logo and communicate a careful technical service. The typography, seven service categories, method section and repeated contact actions already support the business well. A wholesale redesign would add work without addressing the clearest problems found in this review.

There is no evidence to call any design the absolute best or to predict conversion gains. These recommendations follow observable friction in this site, relevant competitors and published accessibility guidance. Actual customer behaviour should guide future iterations.

## The visitors and their tasks

| Visitor | Main task | Suitable experience |
| --- | --- | --- |
| Someone with a plumbing/electrical problem | Identify the service and contact a person quickly | Prominent phone link, seven clear categories, visible region; avoid requiring a form first |
| Someone planning installation or renovation | Understand scope, process and request a quote | Service details, the existing three-step method, contextual quote links |
| A business/property manager | Check coverage, company identity and discuss work | Named Île-de-France departments, company details and direct contact |
| An English-speaking client | Complete the same tasks | Equivalent navigation, page-preserving language switch and matching service options |

Artur's exact main headline, installation/renovation/repair line, hero service order, lower slogan, free-quote wording and seven-service order remain unchanged. The translation dictionary, company data and service copy have no changes in the design proposal.

## Competitor research

Reviewed current publicly accessible page content and information architecture. This was not a timed usability study of those businesses and their marketing claims have not been independently verified.

| Reference | Observed pattern | Relevant lesson for ST ÉLITE PROJECTS |
| --- | --- | --- |
| [MesDépanneurs.fr](https://www.mesdepanneurs.fr/) | Prominent telephone/contact route, service families, process explanations and substantial proof | Keep direct contact prominent and make services easy to identify |
| [MesDépanneurs Montreuil](https://www.mesdepanneurs.fr/plombier/montreuil) | City-specific heading, recognisable plumbing problems and process section | State the region clearly; existing service lists should help visitors recognise their task |
| [Les Bons Artisans](https://www.lesbonsartisans.fr/) | Visible phone and quote actions, trade categories and a sequential process | Use predictable contact routes and concise navigation |
| [Les Bons Artisans Montreuil](https://www.lesbonsartisans.fr/plombier-ile-de-france-93/montreuil/) | Local service context and detailed work descriptions | Existing coverage information and practical descriptions are useful; a large local-directory navigation would be excessive here |
| [IZI by EDF](https://izi-by-edf.fr/) | Product/service category selection, a three-step process and phone or form contact | Heating, solar and charging enquiries benefit from clear categories and contextual contact links |

These are adjacent competitors and national networks offering relevant services, including Montreuil. ST ÉLITE PROJECTS should retain its smaller company's direct and personal feel. Competitor response times, availability, prices, guarantees, ratings and qualifications must not become ST ÉLITE PROJECTS claims without Artur's evidence. Proxiserve was attempted but returned HTTP 403, so it was excluded from the findings.

## Improvements prepared in the preview

| Priority | Finding | Proposed UI change | Evidence |
| --- | --- | --- | --- |
| High | The repeated hero logo delays the immediate service overview on narrow phones | Keep the approved logo in the mobile header/footer; keep the hero panel on larger screens | At 390px wide, the French overview starts at approximately 780px before and 580px after; at 320px, 919px before and 719px after |
| High | The approved PNG is about 776 KB and is loaded on first visit | Generate a high-quality WebP derivative through Astro's image pipeline; preserve the original master | Build output: 82,838 bytes, about 90% smaller than the PNG; geometry and visual palette retained |
| High | Visitors can fill an unavailable form before discovering they cannot submit | While sending is disabled, show the existing explanatory message and direct call/email buttons; reveal the fields when sending becomes enabled | No time spent filling a form that cannot currently send; public company email unchanged |
| Medium | Service-card quotation links sit at different heights in adjacent cards | Align actions at the bottom of equal-height cards | Clearer scanning and a more consistent desktop layout |
| Medium | Phone access could be more immediate on a large screen | Add the existing telephone number to the desktop header at widths >=1280px | Direct calling remains visible beside the quote route without crowding smaller headers |
| Medium | Repeated quote links lack service context for assistive technology | Add the existing service name to each quote link's accessible label | Visible wording is unchanged; service-specific quote selection is preserved |
| Medium | Mobile navigation lacks an active-page marker and Escape does not restore focus | Mark the current page and return focus to the menu button on Escape | A predictable keyboard/mobile-navigation state |
| Medium | Some footer contact/legal links have small clickable heights | Increase interactive heights and reserve bottom scroll space | Footer phone/email targets are >=44px; legal links >=36px |
| Low | CSS imports the Google Fonts stylesheet through an extra discovery step | Discover the font stylesheet in the document head and preconnect to font origins | Removes the CSS @import dependency; same font families and weights |

No parallax, autoplay media, sliders, generated worksite images or additional trackers are proposed. Existing restrained motion and reduced-motion support are retained.

## Brand system to retain

- Charcoal `#252522`: headings, dark sections and strong text.
- Ivory `#faf9f5` and warm neutral `#f0eee7`: page and service backgrounds.
- Muted gold `#c6ad69`: primary buttons, lines and selected accents.
- Dark bronze `#786126`: readable links/icons on light backgrounds.
- Manrope headings and DM Sans body copy; consistent technical line icons.

Gold should remain an accent with dark text, rather than small gold text on ivory. Existing rounded contrast checks are charcoal/gold 7.01:1, bronze/ivory 5.64:1 and muted/ivory 5.67:1. Original selected artwork is not recoloured or redrawn. Large headings and balanced whitespace suit installation and renovation work as well as repairs.

## The highest-value addition after this polish

Add genuine, approved project photographs once Artur supplies them. Three to six clear photographs covering relevant work would make the business more tangible than further decorative styling. Useful examples are a neat electrical installation, plumbing work and a water-heater/heat-pump/charging installation actually completed by the team. Each should use an accurate caption, appropriate permission and optimised delivery. Keep the current truthful Projects placeholder until material is supplied.

Real customer reviews and verified qualifications can strengthen trust later, but require permission/evidence. Business hours or response promises would require Artur's confirmation. These are future content decisions, outside this UI-only proposal.

## Verification and limits

- Astro and TypeScript checks pass; production build passes.
- 304 route/viewport combinations checked across 16 HTML routes and 19 viewport configurations from 320px to 1920px, plus landscape; no horizontal/heading/control overflow or uncaught JavaScript errors.
- Representative 200% text enlargement passed.
- French/English language switches keep the matching page; seven service options and eight coverage departments remain present.
- Sixteen axe-core scans across French/English home, services, contact and about pages at 390px/1440px reported zero automatically detectable WCAG A/AA violations. Automated results are not a complete accessibility certification.
- Sixty keyboard Tab steps on the mobile home page found no fully obscured focused controls after scrolling settled. Escape from the expanded menu returns focus to the menu button. Persistent mobile actions and contextual quote selection were reviewed separately from automated scanning.
- Actual French mobile screenshots were inspected before/after and desktop/contact previews reviewed.
- Eight enabled-form UI checks covered French/English at 320, 390, 768 and 1440px, including contextual service selection, form visibility, reset and success messages. API submission and challenge loading were mocked; no real email was sent or delivery validation implied.
- PNG and imported master have identical source bytes; WebP is a build-generated high-quality derivative.
- This is Chromium browser verification; physical Safari/Firefox testing and customer usability testing remain useful before a broad launch.
- No live Core Web Vitals or conversion uplift is claimed. The image byte reduction and overview position are measured; a production speed gain needs deployment measurements.

## Guidance consulted

- [W3C: Contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C: Target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): 24x24 CSS pixels or applicable spacing/exemptions; the primary controls here target 44px height.
- [W3C: Focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html): sticky UI must not fully hide the focused control.
- [web.dev: Font best practices](https://web.dev/articles/font-best-practices): avoid unnecessary font discovery chains and retain readable fallback text.

The current production site remains unchanged. Email activation and account-plan verification are a separate unfinished task; this design work does not bypass that gate.
