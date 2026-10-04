# SEO review — 4 October 2026

## Published improvements

- Unique French and English search titles and descriptions for all 14 canonical pages. Homepage titles identify the actual trade and Île-de-France service area. No keyword stuffing or invented location landing pages.
- Canonical and reciprocal fr/en/x-default language links on public pages; correct French default at /. Open Graph and Twitter previews include localized titles, descriptions, locales, image alt text and branded 1200×630 images using the approved logo. A 96×96 brand favicon is included.
- Local-business JSON-LD uses Electrician and Plumber subtypes, published company name, business address, telephone, email and the visible Île-de-France service area. WebSite, localized WebPage/AboutPage/ContactPage/CollectionPage, seven Service entries and BreadcrumbList complete the graph. No fabricated reviews, star ratings, coordinates, prices, opening hours, certifications or social profiles.
- Visible breadcrumb navigation mirrors breadcrumb markup. Service headings use h2 on the services page and h3 under the homepage section heading. Commercial text and service order stay unchanged.
- XML sitemap contains the 14 canonical URLs, reciprocal language alternates and the seven real gallery images for each localized projects page. No fictional last-modified dates or ineffective priority/changefreq fields.
- Public pages allow indexing and large image previews; the genuine 404 response stays noindex and has no homepage canonical or business structured data. robots.txt continues to permit crawling and advertise the sitemap.
- Workers assets redirect /fr and /fr/ permanently to /. Cloudflare Always Use HTTPS changed from off to on; verified HTTP redirects preserve the path. A www custom-domain alias and a single redirect rule now send www requests to the canonical HTTPS root domain while preserving path and query. The technical Worker address continues to identify the public-domain canonical.
- Existing static HTML, responsive image sizes, lazy gallery images, font-display:swap and mobile layout retained.
- npm run check:seo checks generated metadata, structured data, local link/fragment targets, social image files and sitemap image targets. It runs automatically after Astro build.

## Validation

Build, Astro/Worker type checks, generated-page SEO checks, real Workers-assets redirects and responsive/accessibility browser checks. 32 responsive page checks and eight WCAG scans passed with no violations. WWW redirect was verified to preserve /en/contact/?service=plumbing. The generated-page validator checked all 14 canonical pages and 462 internal links. Google Rich Results Test was attempted with the generated homepage HTML, but the service responded “Something went wrong — Log in and try again”; no official Google validation result is claimed. Local graph checks alone do not establish Google's rich-result eligibility or indexing.

## Remaining external work

The owner should verify https://steliteprojects.com in Google Search Console and submit https://steliteprojects.com/sitemap.xml, then maintain a genuine Google Business Profile with confirmed business details. These account actions have not been performed. Search indexing and ranking are decided by search engines, with no promised ranking or timeline. VAT status and consumer mediation details remain pending Artur's confirmation; the previous legal/privacy approval workflow still applies.

## Primary guidance consulted

- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/appearance/google-images
- https://developers.cloudflare.com/workers/static-assets/redirects/
