# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** hiring managers, design leads and recruiters at US companies (remote roles), skimming portfolios between other tasks. Their job: decide in a few minutes whether Luis is worth an interview for a hybrid product designer / design engineer role.
- **Secondary:** Spanish-speaking recruiters and clients in Latin America (Peru, Panama, Argentina), served by the Spanish version.

## Product Purpose

Luis Ticona's portfolio. Its only goal is to get him interviews (per his mentorship playbook, `(Public) Portfolio Resources.md`). Success means a hiring manager lands, understands what makes him different in seconds, opens a case study, and reaches out.

## Positioning

A senior product designer who also builds. Luis has a Software Engineering degree (UPC) and designs with the development team in mind: his design systems name tokens and components the way code does (Tailwind naming in WIKIVI; Figma DS CORE 2.0 tokens mapped 1:1 to CSS variables in the Izipay panel), and he prototypes in code himself. Target role: hybrid Product Designer + Design Engineer.

## Operating Context

- Visitors arrive from a LinkedIn profile, a job application, a resume link or a cold email, often on a laptop; some on a phone.
- The portfolio is the trailer; the interview deck is the full movie. Case studies show enough to create curiosity, not every artifact.
- English is the primary language (US market). Spanish is the secondary version under `/es/`.

## Capabilities and Constraints

- Astro 5 + Tailwind CSS 4, MDX case studies in `src/content/work/<lang>/<slug>.mdx`, deployed on Vercel from `main`.
- Routing: English at the root (`/work/<slug>`), Spanish at `/es/` (`/es/proyectos/<slug>`). Every page exists in both languages with hreflang links.
- Case studies marked `draft: true` render in dev only.
- Magic UI (github.com/magicuidesign/magicui) is pinned by Luis as the component library. Its components are React + Tailwind + Motion, so they ship as Astro islands (`@astrojs/react`), restyled with the portfolio's own tokens.
- Mentorship rules are binding for content: lead with outcomes, first person, duration instead of year, no generic section titles (Problem/Solution/Research), process images inside the narrative, three strong projects over six average ones, project-type pills and an outcome line on each thumbnail, then "how I work", then testimonials.
- Undecided: custom domain; analytics.

## Brand Commitments

- Name: Luis Ticona (full name Luis Misael Ticona Miranda). Monogram "LT" exists in the current site.
- Voice: first person, plain, story-driven; writes like telling a friend the story, never like a process report.

## Evidence on Hand

- **WIKIVI** case study (EN + ES, published): two-sided video marketplace, 5 months, Luis + 2 designers (Lucía Martos, Lucero Figueroa); idea and work plan were his; delivered to the client, development status unknown. Assets in `src/assets/work/wikivi/`, interactive crop demo in `src/components/case/FormatCropDemo.astro`.
- **Izipay Panel redesign + Panel DS** (10Pearls, client Izipay): prototype of the new merchant panel with an optional "Integra tu web" onboarding (Masificación project), built in HTML/CSS/JS on a design system whose tokens and components mirror Figma DS CORE 2.0. The prototype repo, its hosted URL and the client Figma files are private and stay out of this repo. Case study published (EN + ES; Luis confirmed he has the OK to show it) with a before/after slider (old Transacciones vs new Ventas), redline-marked screens and the Figma→code token map. The process was a round trip, not code-first: new parent components were designed first in Figma (DS | Panel 2026), then adapted and improved in code, and the working flows were brought back into Figma. Facts: 12 days of coded prototype (Oct 2–13, 2026), 23 screens, 277 tokens, 17 parent components, 5-step optional onboarding. Honest framing: the base panel shell and Inicio were built by his lead. Do not mention AI in the case (never confirmed). Never publish: payment-provider or internal system names, internal documents, competitor screenshots, people’s names, client Figma file keys, prototype URLs, or the client’s Figma audit numbers.
- Experience: Product Designer Senior at 10Pearls for Izipay (2025–present); UX/UI at Vide Solutions for Divemotor (Showroom QR, Divepay, brand sites); UX Analyst at Altimea; UX/UI Team Lead at Vide Solutions (WIKIVI, ZoomLion). CV at `public/cv-luis-ticona.pdf`.
- Photo: `src/assets/luis-ticona.png` (outdoor, smiling), shown in About for recruiters. The hero no longer uses it: Luis tried a 3D point portrait of his face and preferred the work itself, so the hero stage rebuilds each case study's real screen in points (`src/components/home/ProjectStage.astro`, data from `scripts/stage/build-projects.mjs`).
- **TuRuta** case study (EN + ES, published): a redesign Luis proposed to the TuRuta team as a contest entry, 2022, solo. Built from his Behance deck; private data (his email, home and work addresses, test participants' names) is covered in every image.
- **Divemotor web portal** (case study published, EN + ES): divemotor.com; Luis handled continuous improvement, created the UI kit himself, and designed new sections of a large portal, in a team of 4 where he designed most of the work. Never use the internal marketing page or other brands’ benchmark screenshots from that Figma file.
- More work (secondary, shown below the featured plates): NexVault (fintech landing + design system page, built in code), GymRat Provisions (meal-prep business case, landing + design system, built in code), Showroom QR · Divemotor (mobile showroom guide opened from a QR code, one template themed for FIAT, Jeep and RAM; cover at src/assets/more/showroom.png; Luis led it per his CV; also designed Divepay; built and partly used; case study in progress). DiveRent was removed by Luis on purpose; keep it out.
- Links: Behance (behance.net/luisticona1), GitHub (github.com/Lutimi), email lutimi19@gmail.com.
- **Testimonials: none yet.** Luis will request them. Never fabricate testimonials, client logos, metrics or launch claims.

## Product Principles

1. Every element earns an interview: if it doesn't help a hiring manager decide, it goes.
2. Show, don't claim: the hybrid profile is proven by what the site does (live, interactive, built-by-him details), not by adjectives.
3. Lead with outcomes and decisions, honestly: no invented numbers, and unknowns stay unknown.
4. English first, Spanish equal in quality, never a literal translation.

## Accessibility & Inclusion

WCAG 2.2 AA as the floor; respect `prefers-reduced-motion` in every animation and interactive demo; keyboard access for all interactive pieces.
