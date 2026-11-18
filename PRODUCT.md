# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two groups use this product:
- **Leads**: decision-makers at client companies (HR leadership, directors, founders) who arrive from Instagram, WhatsApp, LinkedIn or calirh.com and fill the service briefing (`servico.html`) to request a proposal from one of CALI's 9 services. Split evenly between mobile and desktop — design must work fully at both.
- **Patrícia Lima**, CALI's founder, the sole practitioner. She personally reads every briefing response (`admin/`), writes observations, and drives proposal generation (`proposta.html`).

## Product Purpose

Portal CALI (portal.calirh.com) captures structured briefings for CALI's 9 HR-advisory services (Assessoria Estratégica, CALI Build, Mentoria RH, Diagnóstico Executivo, Cultura e Direção, Shadowing de Liderança, Treinamentos & Palestras, Marca Empregadora, Solução Personalizada), so Patrícia can scope, price and send a commercial proposal without a live intake call for every lead. Success is a complete, honest briefing that lets her price confidently and reduces back-and-forth before the first real conversation.

## Positioning

Unlike a generic lead-capture form, every answer feeds a per-service pricing calculator (`calculateProposal` in `js/services.js`) and Patrícia reads and replies to each submission personally — the form's tone ("Eu vou ler cada resposta pessoalmente," signed by her) is part of the product, not decoration.

## Operating Context

Flow: lead opens a service via `servico.html?tipo=<slug>` → welcome letter → multi-step wizard (currently grouped fields per step; being redesigned to one question per screen) → LGPD consent → submit → Supabase (`portal-submit` edge function) → Patrícia reviews in `admin/`, calculates/edits the proposal, sends `proposta.html` as a PDF.

The Portal is one of three CALI web properties: calirh.com (institutional, repo `sitecali`), portal.calirh.com (this repo), mapa.calirh.com (repo `mapa-de-people`, a free diagnostic lead magnet with an existing Typeform-style one-question-per-screen wizard that Patrícia already likes and references as a model). All three share the CALI brand but are moving toward a more "tech" visual direction, piloted first on this Portal briefing form.

## Capabilities and Constraints

- Static HTML/CSS/vanilla JS, no build step, deployed on Vercel. Backend is Supabase (schema + edge functions in `supabase/`).
- **Field IDs/names sent to Supabase must not change** — the admin panel, pricing calculator and proposal generator all key off the exact field ids defined in `js/services.js` (e.g. `colaboradores`, `rh_interno`, `frentes`). Any redesign must keep these ids and the shape of `collectAnswers()` intact; only the interface and interaction model change.
- Existing conditional-field engine (`showWhen` declarative rules in `js/services.js` + a training-specific JS engine in `js/form.js`) must keep working; a handful of missing conditionals were identified separately and will be added field-by-field, not as part of the visual rebuild.
- LGPD consent checkbox and its exact legal copy must be preserved.
- 9 services, each with 20-30 fields across multiple sections — the new one-question-per-screen model must scale to this without feeling endless (needs section grouping/progress cues, not just a flat counter).

## Brand Commitments

- CALI brand: bordô `#5A1E2D` as the dominant, confident brand color (not a timid accent); marfim `#F7F3EE` background; dourado `#B58C52` as a secondary accent. Documented in `sitecali/CALI_VISUAL_ID.md`.
- The Portal's documented direction (vs. the institutional site) is: ivory/light-gold hero with a soft bordô gradient, bordô in details — this visually tells visitors they've left calirh.com and entered a product.
- Moving away from Playfair Display as part of the "mais tech" direction Patrícia asked for (2026-11-17) — typography must visibly change, not just layout.
- The personal-letter welcome screen, signed by Patrícia, and the "não gosto de clichê de UI" stance (e.g. rejected a generic circle-checkmark success screen) are both binding brand/voice commitments for this surface.
- Reference moodboards given: a "SuperHi"-style guide (playful oversized grotesk, primary-color geometric blocks) and a "Titan"-style guide (institutional cinematic, ivory/near-black, restrained grotesk, pill buttons). Patrícia wants these applied boldly, filtered through CALI's own bordô/marfim/dourado palette — not SuperHi's primary-color palette, not a watered-down compromise.

## Evidence on Hand

- Current implementation: `servico.html`, `js/form.js`, `js/services.js`, `styles.css` (existing design tokens: `--bordo`, `--bordo-escuro`, `--marfim`, `--taupe`, `--dourado`).
- CALI brand reference: `/Users/oiazumi/CALI/sitecali/CALI_VISUAL_ID.md`.
- Model to beat/reference for the one-question-per-screen interaction: `mapa-de-people` repo's `index.html` wizard.
- A first mockup round was rejected (2026-11-17) for keeping Playfair/DM Sans and a too-timid bordô — treat it as anti-reference, not a starting point.

## Product Principles

- Keep Patrícia's personal, senior-advisor voice legible in the interface, not just the copy.
- One question per screen, at mobile and desktop width equally — no desktop-first compromise.
- Bordô leads; dourado accents; never default to a generic SaaS-form look.
- Never touch the field ids/payload shape — redesign the surface, not the data contract.
- No recycled UI clichés (stock success screens, generic form chrome) on a brand this specific.
