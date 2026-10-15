---
name: Luis Ticona Portfolio
description: A redline spec sheet. Real work sits on measuring canvases, and every value is drawn, dimensioned and named in both Figma and code.
colors:
  paper: "#F3F3EF"
  paper-deep: "#E9E9E3"
  sheet: "#FFFFFF"
  rule: "#D6D6CF"
  grid: "#E1E1DA"
  ink: "#151515"
  ink-2: "#4A4C50"
  ink-3: "#6A6D72"
  pencil: "#A2A5A9"
  redline: "#D3203A"
  redline-deep: "#AE1830"
  code: "#2448C9"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(3rem, 1.1rem + 4.6vw, 5.25rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 118"
  display-plate:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.2rem + 3.6vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 1.6vw, 2.5rem)"
    fontWeight: 750
    lineHeight: 1.05
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  chapter:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 1.2rem + 1.9vw, 2.75rem)"
    fontWeight: 750
    lineHeight: 1.08
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 750
    lineHeight: 1.05
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  title-small:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 650
    lineHeight: 1.6
  figure:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 1.8vw, 3rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 125"
  lead:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.7
  outcome:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.375
  body:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  ui:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1
  pill:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 550
    lineHeight: 1
  label:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: "0.02em"
  caption:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  measure:
    fontFamily: "Fragment Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0"
rounded:
  mark: "4px"
  callout: "6px"
  shot: "12px"
  canvas: "16px"
  pill: "999px"
spacing:
  unit: "4px"
  gutter: "20px"
  gutter-wide: "40px"
  grid-cell: "24px"
  rule-to-heading: "20px"
  block: "40px"
  figure: "64px"
  figure-wide: "80px"
  plate: "96px"
  section: "128px"
  header: "64px"
  prose: "44rem"
  aside: "46.5rem"
  container: "1360px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.redline}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-compact:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
  pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.pill}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "28px"
  pill-project:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.pill}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "28px"
  switch:
    backgroundColor: "transparent"
    rounded: "{rounded.pill}"
    padding: "3px"
  switch-segment:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "36px"
  switch-segment-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "40px"
  nav-link-hover:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
  link:
    textColor: "{colors.ink}"
  link-hover:
    textColor: "{colors.redline-deep}"
  canvas:
    backgroundColor: "{colors.paper-deep}"
    rounded: "{rounded.canvas}"
  image-frame:
    rounded: "{rounded.canvas}"
  spec-dimension:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.redline}"
    typography: "{typography.measure}"
    padding: "0 4px"
  spec-token:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.redline}"
    typography: "{typography.measure}"
    rounded: "{rounded.callout}"
    padding: "4px 8px"
  spec-token-code:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.code}"
    typography: "{typography.measure}"
    rounded: "{rounded.callout}"
    padding: "4px 8px"
  spec-token-old:
    textColor: "{colors.ink-3}"
  title-block-cell:
    textColor: "{colors.ink}"
    padding: "16px 20px"
  band-cell:
    textColor: "{colors.ink}"
    padding: "12px 0"
---

# Design System: Luis Ticona Portfolio

## Overview

**Creative North Star: "The Redline Spec Sheet"**

The site is a drawing sheet. The ground is drafting vellum, the type is carbon ink, and two annotation inks carry fixed meanings. Real work is laid on gridded canvases and drawn around: dimension lines with end ticks, dashed extension lines and dashed token callouts sit outside the object, the way they would on an engineering drawing. The footer is the drawing's title block. Nothing on the page claims anything. It shows the measurement instead.

Density is editorial and generous. Expanded heavy display type, a wide 1360px sheet and 128px between sections, but every block is held together by 1px rules, like cells on a drawing: an ink rule opens a structure, a hairline gray rule subdivides it. The palette is near-monochrome and warm-neutral. Color carries meaning, not mood: red names design values and marks the one thing a story is about, and blue names code values and draws the keyboard focus.

Surfaces are flat paper. Depth appears only when an object rests on a canvas, such as a screenshot or a device. There is no glass, no glow, no blur material and no dark neon. Motion uses one curve, an exponential ease-out, so lines draw quickly and settle precisely. Every transition collapses under reduced motion.

**Key Characteristics:**
- Warm drafting-paper ground with carbon-ink text; near-monochrome by default.
- Two annotation inks with fixed meanings: redline for design, code blue for code and focus.
- Archivo's width axis carries hierarchy; Fragment Mono sets only measured values.
- Gridded canvases (24px cell) appear only where something is being measured.
- 1px rules give the structure: ink to open, hairline gray to subdivide.
- Everything pressable is fully round; surfaces are 16px.
- One easing curve, exponential ease-out, for every transition.

## Colors

A warm off-white drawing sheet, near-black ink in three strengths, and two technical annotation inks that never decorate.

### Primary
- **Redline** (#D3203A): The design annotation ink. It draws dimension lines, measurement boxes and token callouts in Design mode, the case-prose list ticks and the dimension tick above an Insight. It also sets the hero's last line, link underlines, the text selection, the caret and the reading-progress bar, and it fills a primary button on hover.
- **Deep Redline** (#AE1830): A text link's hover color. It is the one red that stays legible as small text on any paper.

### Secondary
- **Code Blue** (#2448C9): The code annotation ink. In Code mode it replaces redline on every spec mark, and it sets code names beside their Figma names. It also draws the 2px keyboard focus ring and the dashed frame of authoring placeholders.

### Neutral
- **Drafting Vellum** (#F3F3EF): The page ground, the sticky header and the fill behind token callouts and measurement labels. It also sets the text on ink buttons and the browser theme color.
- **Canvas Board** (#E9E9E3): The measuring surface. Spec canvases, project plates and framed figures sit on it, and so does the hover fill of a nav link. Dimension labels knock out the grid with it.
- **Clean Sheet** (#FFFFFF): Reserved. It sets selection text on redline and the fill of draft-only placeholders.
- **Hairline Gray** (#D6D6CF): Subdividing rules: band cells, timeline rows, the tops of process notes, image frames and the header's scrolled underline.
- **Grid Line** (#E1E1DA): The 24px measuring grid, and nothing else.
- **Carbon Ink** (#151515): Primary text, primary button fills, structural rules (section openers, the title block, the closing sheet) and the monogram tile.
- **Graphite** (#4A4C50): Secondary text: leads, body copy in case prose, organization names, inactive switch segments and nav links.
- **Soft Graphite** (#6A6D72): Tertiary text on paper: labels in bands, facts and the title block, and captions and hints. An earlier annotation fades to it.
- **Pencil** (#A2A5A9): Non-text marks only: the scrollbar thumb and the strokes of the earlier annotation.

### Named Rules
**The Two Languages Rule.** Redline speaks design, code blue speaks code. When the Design/Code switch flips, every mark changes hue with its name. Blue's only other job is the focus ring. Neither color is ever used for decoration.

**The Red Is a Line Rule.** Redline appears as strokes, underlines, type and marks no bigger than a dot or a grip. A resting surface is never filled red. The only red field is a primary button under the pointer.

**The Canvas Contrast Rule.** Small text on Canvas Board must clear 4.5:1. Carbon Ink, Graphite, Code Blue and Deep Redline do. Redline (4.27:1) and Soft Graphite (4.26:1) do not, so they set small text on Drafting Vellum only. Pencil never sets text (2.2:1).

## Typography

**Display Font:** Archivo Variable (with Archivo, system-ui, sans-serif)
**Body Font:** Archivo Variable, the same family at normal width
**Label/Mono Font:** Fragment Mono (with ui-monospace, SFMono-Regular, monospace)

**Character:** One grotesque does everything. Its width axis does the ranking: wide and heavy for the lettering on a drawing's title block, normal width for reading. Fragment Mono is the draftsman's annotation hand and appears only beside a measured value.

### Hierarchy
- **Display** (800, clamp(3rem → 5.25rem), 0.95, -0.03em, width 118–125%): The hero headline at 118% width, and outcome-led case titles at full 125% width with a 22ch measure. On phones, case titles narrow to 106% width with a line height of 1, so long titles stay on the sheet. Closing statements reach up to 6rem.
- **Display Plate** (800, clamp(2.5rem → 4.5rem), 0.95, width 125%): Project names on plates.
- **Figure** (800, clamp(2rem → 3rem), tabular numerals, width 125%): Outcome numbers in Metrics. Each one holds a fixed column and counts up once.
- **Headline** (750, clamp(1.75rem → 2.5rem), 1.05, -0.025em, width 112%): Home section headings, set 20px below a 1px ink rule.
- **Chapter** (750, clamp(1.875rem → 2.75rem), 1.08, width 112%): Case study chapter titles, which carry the story as a sentence. They have 128px of air above.
- **Title** (750, 1.5rem, width 112%): Process note titles, and the name in the title block at 1.75rem. The Insight quote uses the same face at clamp(1.625rem → 2.375rem) and 1.15.
- **Title Small** (650, 1.25rem): Case prose subheads.
- **Lead** (400, 1.1875rem, 1.625–1.7): The hero intro, about bio, closing bodies and case prose in Graphite, capped at 34–36rem, or 44rem in case prose.
- **Outcome** (400, 1.25rem, 1.375): The one-line outcome under a project name, capped at 36rem.
- **Body** (400, 1.0625rem, 1.6): Base text.
- **UI** (600, 0.9375rem): Button labels. Nav links use the same size at 500, and switch segments use 0.875rem at 600.
- **Pill** (550, 0.8125rem): Project-type pills.
- **Label** (600, 0.75–0.8125rem, Soft Graphite): The name half of a label/value pair: band cells, case facts, timeline group names and title-block cells (+0.02em tracking).
- **Caption** (400, 0.8125–0.875rem, 1.625, Soft Graphite): Figure captions and hero hints.
- **Measure** (Fragment Mono 400, 0.8125rem, 1.35, 0 tracking): Dimensions, token names and code. On spec canvases it steps up to 0.9375rem at 1024px and above. On annotated screenshots it runs from 0.75rem to 0.875rem.

### Named Rules
**The Width Is Rank Rule.** Archivo's width axis carries hierarchy: 125% for display, 118% for the hero, 112% for headings and 100% for reading text. Weight follows: 800, then 750, then 650 for emphasis, then 400.

**The Mono Means Measured Rule.** Fragment Mono sets only a value that exists in a spec: a pixel or rem dimension, a token name, a class name. Prose, headings, labels and navigation are never set in mono.

## Layout

The sheet is a centered 1360px container with 20px side gutters, widening to 40px at 640px and above. Compositions are asymmetric two-column splits on a 12-part feel. The hero and the About section split 5fr / 7fr, with the text column on the left. Project plates and the case context split 7fr / 5fr, with the outcome on the left and the pills, band and link on the right. Process notes sit in a 2-up grid from 768px.

Vertical rhythm comes from Tailwind's 4px unit, used in large steps. Sections are 128px apart. Project plates are 96px apart, or 128px from 640px. Figures take 64px of vertical margin, or 80px from 640px. Heading blocks open with a 1px ink rule, the heading sits 20px below it and the content starts 40px after the heading. Case prose sits in a 44rem reading column. Insight, Metrics and placeholder blocks sit in a 46.5rem column. Figures choose a width: text (46rem), wide (1360px) or full bleed.

The header is sticky and 64px tall on solid paper. In-page anchors offset by 80px. Canvases pad generously so annotations have room outside the object: the hero canvas pads 72px vertically, and plate canvases pad 40–64px at the top and 64–96px at the bottom. The hero is sized so the first project plate's canvas edge shows at the bottom of the first viewport.

Breakpoints are Tailwind's defaults: 640px (gutters, two-column title block), 768px (nav links, process grid, crop-demo side-by-side) and 1024px (column splits, the hero specimens at 1.2× scale, larger annotation type). Touch devices (`hover: none`) swap hover hints for tap hints.

## Elevation & Depth

The system is flat. Depth comes from tone, with Canvas Board recessed under Drafting Vellum, and from 1px rules, not from lift. A shadow appears only where a physical object rests on a canvas, like a print laid on the drafting table. The header gains a hairline only once the page scrolls.

### Shadow Vocabulary
- **Resting print** (`box-shadow: 0 18px 40px -20px rgb(21 21 21 / 0.35)`): Rounded screenshots laid on a canvas.
- **Resting device** (`box-shadow: 0 18px 40px -20px rgb(21 21 21 / 0.45)`): The phone or laptop frame in the format-crop demo.
- **Scrolled header rule** (`box-shadow: 0 1px 0 var(--color-rule)`): The header's bottom edge after 8px of scroll. It is transparent at the top of the page.
- **Hairline outline** (`box-shadow: inset 0 0 0 1px var(--color-ink)`): The ghost button and switch outline, drawn inset so it never shifts the layout.
- **Crop scrim** (`box-shadow: 0 0 0 9999px rgb(21 21 21 / 0.55)`): Dims everything outside the crop window in the interactive demo.

The WIKIVI specimen card carries its own product shadow (`0 18px 40px -18px rgb(17 24 39 / 0.28), 0 2px 6px rgb(17 24 39 / 0.06)`). That shadow belongs to the specimen, not to this system.

### Named Rules
**The Resting Object Rule.** Page surfaces never cast shadows. Only an object placed on a canvas (a screenshot or a device) casts one soft, downward shadow.

**The Ink Opens, Gray Divides Rule.** A 1px Carbon Ink rule opens or frames a structure: section tops, the title block, the closing sheet, the first fact row and the top of a metrics table. A 1px Hairline Gray rule subdivides within it.

## Shapes

The form language has two families. Anything you can press is fully round (999px): buttons, pills, switch segments and nav links. Surfaces have gently rounded 16px corners: canvases and image frames. Screenshots placed on a canvas use 12px. Annotation pieces are small and near-square: token callouts and the monogram tile use 6px, and measurement boxes use 4px. The focus ring is also rounded at 4px.

Lines are the other shape. A redline is a 1.5px stroke: dimension lines, measurement boxes, leaders, the crop window and the dimension tick that sits above an Insight or under the closing email. Each tick ends in short perpendicular serifs, 10px tall. Extension lines are 1px, dashed 3/3 at 70% opacity. Token callouts are framed with a 1px dashed border in the active ink. Case-prose bullets are 10px × 1.5px redline dashes. Arrows are drawn as inline 1.5px SVG strokes.

## Components

### Buttons
Confident ink pills that blush red under the pointer.
- **Shape:** Fully round (999px), 44px tall, 20px horizontal padding, 8px icon gap.
- **Primary:** A Carbon Ink fill with Drafting Vellum UI text (600, 0.9375rem).
- **Hover / Active:** On hover the fill turns Redline over 0.2s with expo-out. On press it scales to 0.97.
- **Ghost:** Transparent with an inset 1px ink outline and ink text. On hover it fills ink with paper text. Ghost buttons are for secondary destinations (resume, GitHub, Behance, back to work) placed beside one primary.
- **Compact:** The header's "Email me" is 40px tall with 16px padding.
- **Focus:** The global ring is 2px Code Blue with a 3px offset.

### Pills
- **Style:** A 28px-tall, fully round chip with a 1px Carbon Ink border, Pill type (550, 0.8125rem) and 12px padding, all on one line.
- **Project pill:** On a case title, the first pill names the project and is filled ink with paper text. The rest are outlined. Pills are labels, not filters, and have no interactive state.

### Design / Code Switch
A segmented control that renames the world.
- **Shape:** A fully round track with an inset 1px ink outline and a 3px inner padding. Each segment is 36px tall with 16px padding, at 0.875rem and 600.
- **States:** The pressed segment (`aria-pressed`) is filled ink with paper text. Unpressed segments are Graphite and turn ink on hover. Transitions take 0.25s with expo-out.
- **Use:** The hero's Design | Code toggle, and the format-crop demo's Mobile 9:16 | Original 16:9 toggle.

### Navigation
- **Header:** Sticky, 64px, solid Drafting Vellum, no blur. On the left is a 32px Carbon Ink monogram tile ("LT", 800 at 125% width, 6px radius) with the full name from 640px. On the right are nav links, the language switch and a compact primary button.
- **Nav links:** 40px tall with 12px padding, fully round, Graphite at 500 and 0.9375rem. On hover the text turns ink over a Canvas Board fill. The section links show from 768px. On phones only the language switch and the button remain.
- **Reading progress:** On case studies, a 2px Redline bar fixed to the top edge scales with scroll.

### Links
- **Inline link:** Ink text with a 1.5px Redline underline offset 0.2em. On hover the text turns Deep Redline.
- **Plate link:** "Read the case study" is semibold with a Redline underline and a 16px drawn arrow that slides 3px right on hover.

### Canvas
- **Corner Style:** 16px.
- **Background:** Canvas Board with overflow clipped.
- **Grid:** A 24px Grid Line pattern (Magic UI GridPattern, rendered statically on the server). It is drawn only when the canvas holds something being measured: the hero specimen, a project plate with a marked screenshot, the Izipay name map, the crop demo or a framed figure that carries a mark. A framed figure without a mark gets a plain canvas.
- **Shadow Strategy:** None on the canvas itself. Objects on it follow the Resting Object Rule.

### Spec Canvas (signature)
Real components from three projects (WIKIVI, NexVault, GymRat) rendered on one canvas at 1.2× scale from 1024px, switched by a project tablist that sits above the Design | Code switch. All three specimens share one grid cell, so the canvas keeps the tallest one's height and switching never shifts the page; the outgoing specimen crossfades out over 0.35s and the incoming one is measured on arrival. Hovering, focusing or tapping any part draws that part's redlines and names its token. Annotations sit outside the object, as on a drawing. A width dimension goes on the nearest card edge, a height dimension goes to the right when there is room, and the token callout sits past the width line, kept inside the canvas.
- **Draw:** Dimension strokes animate in with `stroke-dashoffset` over 0.55s with expo-out. Extension lines fade in. Labels arrive from 4px below, unblurring from 4px over 0.35s. A redraw after a resize snaps into place instead of replaying.
- **History:** Only two annotations live on the sheet. The newest is in the active ink. The previous one turns Pencil (strokes) and Soft Graphite (labels), and any of its labels that collide with the newest are hidden. A third is removed.
- **Switch:** In Design mode, dimensions read in px and tokens use Figma names, in Redline. In Code mode, dimensions read in rem and tokens use class names, in Code Blue. Values always report the component's 1× size.
- **Arrival:** On load, the card is measured, then its primary action is measured after 650ms, so one pencil annotation and one ink annotation rest on the sheet.
- **Accessibility:** Measurement layers are `aria-hidden`. A polite live region announces each token name.
- Each specimen keeps its own product's type and palette: WIKIVI in Poppins and #F24452; NexVault in Space Grotesk and Inter on #11151E with its #6366F1→#4F46E5 button gradient; GymRat in Inter with #00D26A and #FF6B35. Those values are exhibits scoped to the specimen, not part of this system, and design-detector findings on them (overused fonts, off-palette colors and radii) are expected. Where an original failed contrast, the specimen fixes the label and its caption says so (GymRat's button label is set in #1A1A1A).

### Annotated Shot
A screenshot with exactly one redline on it: the element its caption or outcome line is about. The element gets a 1.5px Redline box with a 4px radius and a dimension tick above it. An 18px leader drops to a dashed callout below, in Fragment Mono on paper. Positions are percentages, so the mark scales with the image. The callout wraps to the room on its side, using container query units.

### Project Plate
A full-width thumbnail. A marked screenshot sits on a gridded canvas (or a cover sits in a 16px frame with a hairline rule) and lifts 4px over 0.9s on hover. Below, at 7fr / 5fr, are the project name in Display Plate, the outcome line, pills and the **band**: three ruled cells for Duration, Role and Team, with labels above values and Hairline Gray rules between and around them. A plate's band never carries a year. A plate without a public case shows a status line led by an 8px Redline dot.

### Fact Tables
- **Case facts:** A definition list with a 7.5rem label column. The first row opens with an ink rule and the rows below are divided by gray rules. Outcome comes first, then Role, Team, Duration and Tools.
- **Timeline:** The role (600) sits over its organization (400, Graphite), with the period right-aligned in tabular numerals. Gray rules sit top and bottom.

### Insight
The turning point of a chapter. A full-width Redline dimension tick (1.5px, serifed ends) sits above a large statement set in the headline face, at clamp(1.625rem → 2.375rem), 1.15, in a 46.5rem column.

### Metrics
Outcome numbers as a measured table, opened by an ink rule. The figure comes first, in Figure type with tabular numerals, followed by its label in Graphite. Plain numbers count once on entering view over 1.2s with expo-out (Magic UI NumberTicker). The final value is server-rendered, and the count is skipped under reduced motion.

### Figure
Figures are text-width, wide or full-bleed. A bare image sits in a 16px frame with a 1px Hairline Gray border. A UI screenshot can be framed on a canvas (16–40px padding). Captions run below in Caption type, Soft Graphite, at a 44rem measure.

### Format Crop Demo
An interactive reconstruction of a product step. A Redline-bordered 9:16 window is dragged, or moved with the arrow keys as an ARIA slider, over a landscape frame dimmed by the crop scrim. Beside it, an ink device frame (28px radius, Resting device shadow) previews the result. The switch morphs the device between phone and laptop over 0.45s with expo-out.

### Title Block (footer)
The footer is the title block in the corner of a drawing sheet. A 1px Carbon Ink frame holds cells ruled in ink: "Drawn and built by" with the name in Title type, then Location, Built with, Sheet (the current page) and Contact links. Each cell is a label (0.75rem, 600, +0.02em, Soft Graphite) over a value at 0.875rem, with 16px × 20px padding. The cells stack on phones, sit two-up from 640px and become a four-column block from 1024px.

### Closing Sheet
The home page ends inside a 1px ink-framed sheet. A display statement leads to the email address set in display type (110% width). Beneath the address runs a single Redline dimension tick, the only red at rest in the block. Then a row of one primary button and three ghost buttons.

### Placeholder (authoring only)
A dashed Code Blue frame (12px) on Clean Sheet with a small Code Blue "Pending" tag, for facts only the author can provide. Case studies that contain one stay in draft and never ship.

## Do's and Don'ts

### Do:
- **Do** open every home section with a 1px Carbon Ink rule, put the heading 20px below it and start the content 40px later.
- **Do** draw annotations as a drawing would: 1.5px dimension strokes with serifed ends, 1px dashed extension lines, a dashed callout in Fragment Mono, all placed outside the object.
- **Do** switch annotation hue with the language: Redline (#D3203A) for design names in px, Code Blue (#2448C9) for code names in rem.
- **Do** make anything pressable fully round (999px) and any surface 16px; keep screenshots on canvases at 12px.
- **Do** give every project its band of Duration, Role and Team in three Hairline Gray-ruled cells.
- **Do** set numbers that line up (periods, metrics) in tabular numerals.
- **Do** use `cubic-bezier(0.16, 1, 0.3, 1)` for every transition: 0.2s for color, 0.25–0.3s for state, 0.55s for line draws, 0.9s for plate lifts. Collapse every transition under `prefers-reduced-motion`.
- **Do** draw keyboard focus as a 2px Code Blue outline with a 3px offset.

### Don't:
- **Don't** draw the measuring grid on a surface where nothing is being measured.
- **Don't** fill a resting surface with Redline. Red is a line, a letterform or a dot.
- **Don't** set small Redline or Soft Graphite text on Canvas Board, and never set text in Pencil.
- **Don't** set prose, headings, labels or navigation in Fragment Mono.
- **Don't** use glass, backdrop blur, glow or neon. The header is solid paper.
- **Don't** cast a shadow from a page surface, card or section. Only an object resting on a canvas casts one.
- **Don't** carry the specimen's product type (Poppins) or palette outside the specimen.
- **Don't** put a small label above a headline. Small labels only name a value: in a band, a fact table, a timeline or the title block.
- **Don't** put a year on a project.
