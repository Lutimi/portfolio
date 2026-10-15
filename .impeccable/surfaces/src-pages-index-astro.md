---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/es/index.astro","src/layouts/CaseStudyLayout.astro"]
---

# Portfolio home and case studies

Scope: home (`/` English, `/es/` Spanish) and the case study template (`/work/<slug>`, `/es/proyectos/<slug>`). Visitor mode: Experience — the work leads from the first viewport.

Audience and job: US hiring managers and design leads deciding in minutes whether to interview Luis for a hybrid product designer / design engineer role. Action: open a case study, then email. Proof: the WIKIVI case (built), the Izipay Panel DS story (case pending, no client screens until visibility is confirmed), real components rebuilt in code. Constraints: mentorship playbook rules, no photo, nothing corporate or cold, Magic UI as the component library (React islands), English first.

## Direction contract

THESIS: The portfolio is the spec sheet. Every piece arrives measured, named and buildable, and the visitor inspects real work instead of reading claims. It refuses the category default of a big intro line over a grid of equal project cards.

OWN-WORLD: Drafting-vellum paper ground (#F3F3EF) with a measuring grid only under spec canvases, carbon ink (#151515), one redline red (#D3203A) for design annotations and one code blue (#2448C9) for token names. One 1.5px stroke for every redline; red is spent only on the measurement the story needs. Archivo variable (expanded heavy for display, normal width for text) and Fragment Mono strictly for measurements, tokens and code. Flat surfaces, 12–16px radii, no glass, no glow. The site footer is a drawing title block.

STORY: In one viewport the visitor sees a real component Luis designed, inspects it, and flips Design ↔ Code to watch the same values change names. They believe he designs with the build in mind, open WIKIVI, read a story told in first person, and email him.

FIRST VIEWPORT: Left third: name and nav at top; headline "I design it. Then I build it." in expanded Archivo at display scale; one line of context; the Design/Code switch. Right two thirds: the WIKIVI "Request a video" component at monumental scale on its own grid canvas, working controls, live redlines and token callouts around it. Bottom edge: the first project plate's top already in view.

FORM: Redline spec sheet, position 5 of 7 on the ordered list. seed:53df17e53064032c. Signature interaction: hovering or focusing any part of the component draws its redlines (stroke draw, exponential ease-out) and names its token; the newest annotation is darkest ink while earlier ones fade to pencil. Outcome numbers own fixed tabular positions and count once. Every project carries its band: duration, role, team — never year.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Izipay case study and public visibility of client material.
- Testimonials: Luis is requesting them; the section stays out until real ones exist.
