// Fig 1 · One name, two places — a bench name press.
//   node scripts/figures/name-press/build.mjs                 writes src/components/figures/NamePress.astro
//   node scripts/figures/name-press/build.mjs --preview <dir>  also writes <dir>/name-press.html (standalone, EN + ES)
//   node scripts/figures/name-press/build.mjs --audit          proves the geometry (kit/audit.mjs)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as k from "../kit/iso-kit.mjs";
import * as G from "../kit/lathe.mjs";
import * as A from "../kit/audit.mjs";
import { PAIRS, TOTAL, TIME, cellsOf, poseAt } from "./model.mjs";
import { coilPaths, stackOf } from "./shared.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");
const argv = process.argv.slice(2);
const previewAt = argv.includes("--preview") ? resolve(argv[argv.indexOf("--preview") + 1]) : null;

// ---------------------------------------------------------------- world (units ≈ px of the real thing; z up)
const AZ = 58;
const EL = 30;
const W = 640;

const BASE = { x: -164, y: -46, w: 344, d: 84, r: 8 };
const BASE_H = 12;
const FOOT_H = 5;

const X_LOAD = -112; // card centre under the magazine
const TRAVEL = -X_LOAD; // to the press, card centre at x = 0
const RAIL_Y = 14;
const RAIL_X0 = X_LOAD - 25;
const RAIL_X1 = 25;
const CAR_Z = 3;
const CAR_TOP = 7;
const CARD_TOP = 8.2;

const TAPE_Z = 9; // tape bottom; top at 9.6
const TAPE_T = 0.6;
const TAPE_TOP = TAPE_Z + TAPE_T;
const TAPE_HALF = 4.5;
const PITCH = 40;

const ROLLER = { x: -34, z: TAPE_TOP + 2.2, r: 2.2 };
const SUPPLY = { x: ROLLER.x - ROLLER.r - TAPE_T - 12.5, z: 50, roll: 12.5, flange: 15.5 };
const TAKEUP = { x: 150, roll: 9, flange: 13 };
TAKEUP.z = TAPE_TOP + TAKEUP.roll;

const STROKE = 16;
const PLATEN_Z = TAPE_TOP + STROKE; // platen bottom at rest
const HEAD_Z = PLATEN_Z + 5;
const HEAD_TOP = HEAD_Z + 7;
const COLLAR_TOP = HEAD_TOP + 2.4;
const ARM_Z = 46;
const ARM_TOP = 56;
const GLAND_LO = ARM_Z - 3.4;
const GLAND_HI = ARM_TOP + 3.4;
const SPRING_LEN = 24;
const KNOB_Z = GLAND_HI + SPRING_LEN;

const MOVE = { carriage: [TRAVEL, 0, 0], head: [0, 0, -STROKE] };
// the first frame (also the reduced-motion frame): token 0 just stamped as no. 3, its card riding home
const INITIAL = { count: 3, card: 0, slots: [null, 0, 5, 4] };
const COIL = { cx: 0, cy: 0, r: 5, turns: 7, phase: -2.2 };

// ---------------------------------------------------------------- camera
const ext = [
  ...k.boxCorners(BASE, -BASE_H - FOOT_H, 0),
  [0, 0, KNOB_Z + 10.4],
  [SUPPLY.x, 0, SUPPLY.z + SUPPLY.flange],
  [SUPPLY.x - SUPPLY.flange, -6, SUPPLY.z],
];
const unitP = { origin: [0, 0], scale: 1, azimuth: AZ, elevation: EL };
const flats = ext.map((p) => k.iso(p, unitP));
const spanX = Math.max(...flats.map((p) => p[0])) - Math.min(...flats.map((p) => p[0]));
const spanY = Math.max(...flats.map((p) => p[1])) - Math.min(...flats.map((p) => p[1]));
const PAD = 14;
const H = Math.round(((W - PAD * 2) * spanY) / spanX + PAD * 2);
const P = k.fitProjection(ext, W, H, { pad: PAD, azimuth: AZ, elevation: EL });
const V = G.viewOf(P);
const KS = G.scaleOf(P);
const at = (p) => k.iso(p, P);
const f2 = (v) => Math.round(v * 100) / 100;

// ---------------------------------------------------------------- recorder and drawing helpers
const R = A.recorder(P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);

function put(name, ref, svg, shapes, { piece = "", bias = 0 } = {}) {
  shapes.forEach((shape) => R.solid(shape));
  return R.put({ name, at: ref, bias, svg, shapes, piece, move: piece ? MOVE[piece] : [0, 0, 0] });
}
const centreOf = (plan, z, h) => [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2];

function slabPart(name, plan, z, h, { tone = "mid", steps = 3, bevel = 0, lit, crease, inner = "", flat } = {}) {
  return { svg: S(k.slabOf(plan, z, h, P, steps, bevel), { tone, lit, crease, inner, flat }), shape: A.slab(plan, z, h, { name }, steps) };
}
function cylPart(name, cx, cy, r, z, h, { tone = "mid", steps = 32, bevel = 0, lit, crease, inner = "" } = {}) {
  return { svg: S(k.cylinder(cx, cy, r, z, h, P, steps, bevel), { tone, lit, crease, inner }), shape: A.cylinder(cx, cy, r, z, h, { name }) };
}
const frameY = (x, z) => G.frameOf([x, 0, z], [0, 1, 0], [0, 0, 1], [1, 0, 0]);
function discY(name, x, z, y0, y1, r, { tone = "mid", lit, crease, inner = "" } = {}) {
  const F = frameY(x, z);
  return { svg: S(G.disc(y0, y1, r, F, P), { tone, lit, crease, inner }), shape: A.disc(F, y0, y1, r, { name }) };
}
function item(name, ref, parts, { piece = "", bias = 0, before = "", after = "" } = {}) {
  return put(name, ref, before + parts.map((p) => p.svg).join("") + after, parts.map((p) => p.shape), { piece, bias });
}
const screws = (points, z, ring = 1.6) =>
  Ln(points.map(([x, y]) => k.ring(x, y, ring, z, P, 16)).join(""), { tone: "lo" }) + Dots(points.map(([x, y]) => at([x, y, z])), { size: 0.45 });

// ---------------------------------------------------------------- marks: the same name, as the card prints it and as the tape is embossed
const CELL_CARD = 0.7;
const CELL_TAPE = 0.75;
function marksOf(text, cell, { cx, cy, z, half }) {
  const cells = cellsOf(text);
  const start = cx - (cells.length * cell) / 2 + cell / 2;
  let d = "";
  cells.forEach((kind, index) => {
    const x = start + index * cell;
    if (kind === "type") d += k.pathOf([at([x, cy - half, z]), at([x, cy + half, z])]);
    else if (kind === "slash") d += k.pathOf([at([x - cell * 0.42, cy + half, z]), at([x + cell * 0.42, cy - half, z])]);
    else if (kind === "dash") d += k.pathOf([at([x - cell * 0.36, cy, z]), at([x + cell * 0.36, cy, z])]);
  });
  return d;
}
const CARD_MARKS = PAIRS.map(([figma]) => marksOf(figma, CELL_CARD, { cx: X_LOAD + 2.6, cy: 7.4, z: CARD_TOP + 0.01, half: 1.6 }));
const TAPE_MARKS = PAIRS.map(([, code]) => marksOf(code, CELL_TAPE, { cx: 0, cy: 0, z: TAPE_TOP + 0.01, half: 1.9 }));

// ---------------------------------------------------------------- base
{
  const feet = k.corners(BASE, 22).sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  feet.forEach(([x, y], index) => {
    item(`stand.foot${index}`, [x, y, -BASE_H - FOOT_H], [
      cylPart(`stand.foot${index}.flange`, x, y, 7, -BASE_H - FOOT_H, 1.6, { tone: "lo", steps: 28 }),
      cylPart(`stand.foot${index}.pad`, x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, { tone: "mid", steps: 28 }),
    ]);
  });
  const plate = slabPart("stand.base", BASE, -BASE_H, BASE_H, { tone: "mid", steps: 8, bevel: 1.6 });
  const strip = { x: RAIL_X0 - 5, y: 25, w: RAIL_X1 + 10 - RAIL_X0, d: 5.5, r: 1 };
  const ruler = slabPart("stand.ruler", strip, 0, 0.6, { tone: "lo", crease: "none" });
  const ticks = k.topTicks(strip.x + 3, strip.x + strip.w - 3, 4, 5, strip.y + 0.6, 0.6, [1.5, 2.8], P);
  const label = { x: 56, y: 19, w: 42, d: 12, r: 1.2 };
  const plaque = slabPart("stand.label", label, 0, 0.8, { tone: "lo" });
  const rules = [
    [label.x + 6, label.x + 30, label.y + 3.6],
    [label.x + 6, label.x + 36, label.y + 6.2],
    [label.x + 6, label.x + 22, label.y + 8.8],
  ];
  const svg = [
    plate.svg,
    Ln(k.planOutline(k.insetPlan(BASE, 5), 0, P), { tone: "lo" }),
    screws(k.corners(BASE, 10), 0, 2.2),
    ruler.svg,
    Ln(ticks.minor, { tone: "lo" }),
    Ln(ticks.major, { tone: "mid" }),
    Dots([at([strip.x + 1.6, strip.y + 2.75, 0.6]), at([strip.x + strip.w - 1.6, strip.y + 2.75, 0.6])], { size: 0.4 }),
    plaque.svg,
    Ln(k.planOutline(k.insetPlan(label, 1.4), 0.8, P), { tone: "faint" }),
    Ln(rules.map(([x0, x1, y]) => k.lineOnTop([x0, y], [x1, y], 0.8, P)).join(""), { tone: "lo", free: true }),
    Dots([at([label.x + 2.6, label.y + label.d / 2, 0.8]), at([label.x + label.w - 2.6, label.y + label.d / 2, 0.8])], { size: 0.45 }),
  ].join("");
  put("stand.base", [0, 0, -BASE_H / 2], svg, [plate.shape, ruler.shape, plaque.shape], { bias: -50 });
}

// ---------------------------------------------------------------- rails and end stops
for (const y of [-RAIL_Y, RAIL_Y]) {
  const plan = { x: RAIL_X0, y: y - 2.5, w: RAIL_X1 - RAIL_X0, d: 5, r: 1 };
  const p = slabPart(`rail${y > 0 ? "F" : "B"}`, plan, 0, 3, { tone: "mid", steps: 3, bevel: 0.4 });
  item(`rail${y > 0 ? "F" : "B"}`, centreOf(plan, 0, 3), [p], {
    after: Dots([RAIL_X0 + 6, (RAIL_X0 + RAIL_X1) / 2, RAIL_X1 - 6].map((x) => at([x, y, 3])), { size: 0.4 }),
  });
}
for (const [name, x] of [
  ["stopL", RAIL_X0 - 5],
  ["stopR", RAIL_X1],
]) {
  const plan = { x, y: -19.5, w: 5, d: 39, r: 1.2 };
  item(name, centreOf(plan, 0, 6.5), [slabPart(name, plan, 0, 6.5, { tone: "mid", steps: 3, bevel: 0.5 })], {
    after: Dots([at([x + 2.5, -16, 6.5]), at([x + 2.5, 16, 6.5])], { size: 0.45 }),
  });
}

// ---------------------------------------------------------------- carriage with the token card (drawn at the magazine, moved along x)
{
  const X = X_LOAD;
  const plate = { x: X - 25, y: -19, w: 50, d: 38, r: 2.5 };
  const card = { x: X - 20, y: -12, w: 40, d: 24, r: 1.2 };
  const guideB = { x: X - 20, y: -14.6, w: 40, d: 2.4, r: 0.5 };
  const guideF = { x: X - 20, y: 12.2, w: 40, d: 2.4, r: 0.5 };
  const fence = { x: X - 23.4, y: -14.6, w: 3, d: 29.2, r: 0.6 };
  const neck = { x: X + 8, y: 19, w: 4, d: 3.2, r: 0.8 };
  const knob = [X + 10, 24.6];
  const parts = [
    slabPart("carriage.plate", plate, CAR_Z, CAR_TOP - CAR_Z, { tone: "mid", steps: 5, bevel: 0.6 }),
    slabPart("carriage.guideB", guideB, CAR_TOP, CARD_TOP - CAR_TOP, { tone: "mid", steps: 2 }),
    slabPart("carriage.fence", fence, CAR_TOP, 1.6, { tone: "mid", steps: 2 }),
    slabPart("carriage.card", card, CAR_TOP, CARD_TOP - CAR_TOP, { tone: "hi", steps: 3, crease: "lo" }),
    slabPart("carriage.guideF", guideF, CAR_TOP, CARD_TOP - CAR_TOP, { tone: "mid", steps: 2 }),
    slabPart("carriage.neck", neck, 4, 2.6, { tone: "mid", steps: 2, crease: "none" }),
    cylPart("carriage.knob", knob[0], knob[1], 2.6, 3.4, 5.2, { tone: "mid", steps: 20 }),
  ];
  const cardFace = [
    Ln(k.planOutline(k.insetPlan(card, 1.4), CARD_TOP, P, 3), { tone: "faint" }),
    Ln(k.planOutline({ x: X - 17.6, y: 5.6, w: 3.6, d: 3.6, r: 0.6 }, CARD_TOP, P, 3), { tone: "red" }),
    `<path class="iso-line" data-tone="red" data-free="" data-np-card="" d="${CARD_MARKS[0]}"/>`,
  ].join("");
  const svg = [
    parts[0].svg,
    Dots([-20, -10, 0, 10, 20].map((dx) => at([X + dx, plate.y + plate.d - 1.6, CAR_TOP])), { size: 0.4, tone: "lo" }),
    Dots([at([X - 21.6, -17, CAR_TOP]), at([X + 21.6, -17, CAR_TOP]), at([X + 21.6, 17, CAR_TOP])], { size: 0.45 }),
    parts[1].svg,
    parts[2].svg,
    parts[3].svg,
    cardFace,
    parts[4].svg,
    parts[5].svg,
    parts[6].svg,
    Ln(k.knurl(knob[0], knob[1], 2.6, 3.4, 8.6, 18, P), { tone: "lo" }),
  ].join("");
  put("carriage", [X, 0, 6], `<g class="np-halo-soft"><path class="iso-halo" d="${k.haloOf(k.insetPlan(plate, 3), CAR_Z, 0.1, P)}"/></g>` + svg, parts.map((p) => p.shape), { piece: "carriage" });
}

// ---------------------------------------------------------------- card magazine over the load stop
const HOOD = { x: X_LOAD - 24, y: -16, w: 48, d: 32, r: 2 };
const HOOD_Z = CARD_TOP + 1.2;
const HOOD_TOP = 30;
const WIN = { x: X_LOAD - 18, w: 36, z: HOOD_TOP - 3.5, h: 14 };
WIN.step = 1.15;
WIN.lines = Math.floor((WIN.h - 0.8) / WIN.step);
const STACK0 = stackOf(INITIAL.count, TOTAL, WIN);
{
  const post = { x: X_LOAD - 4, y: -28, w: 8, d: 6, r: 1 };
  const arm = { x: X_LOAD - 4, y: -22, w: 8, d: 6, r: 0.6 };
  item("magazine.post", centreOf(post, 0, 29), [slabPart("magazine.post", post, 0, 29, { tone: "mid", steps: 2, bevel: 0.4 })]);
  item("magazine.arm", centreOf(arm, 22, 7), [slabPart("magazine.arm", arm, 22, 7, { tone: "mid", steps: 2 })], {
    after: Dots([at([X_LOAD - 1.5, -19, 29]), at([X_LOAD + 1.5, -19, 29])], { size: 0.45 }),
  });
  const box = slabPart("magazine.box", HOOD, HOOD_Z, HOOD_TOP - HOOD_Z, {
    tone: "mid",
    steps: 4,
    inner: Ln(k.sideSeam(HOOD, HOOD_Z + 3, P, 4), { tone: "faint" }),
  });
  const lidPlan = { x: HOOD.x - 1, y: HOOD.y - 1, w: HOOD.w + 2, d: HOOD.d + 2, r: 2.6 };
  const lid = slabPart("magazine.lid", lidPlan, HOOD_TOP, 1.6, { tone: "mid", steps: 4, bevel: 0.6 });
  const face = k.sideMatrix([WIN.x, HOOD.y + HOOD.d], WIN.z, P, "left");
  const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const windowSvg = [
    `<g transform="${face}">`,
    `<path class="np-well" d="${rr(0, 0, WIN.w, WIN.h, 1.4)}"/>`,
    `<path class="np-cards" data-np-stack="" d="${STACK0.d}"/>`,
    `<g data-np-follower="" transform="translate(0 ${STACK0.follower.toFixed(2)})"><rect class="np-follower" x="2.2" y="0" width="${WIN.w - 4.4}" height="2.6" rx="0.5"/><rect class="iso-line" data-tone="mid" x="2.2" y="0" width="${WIN.w - 4.4}" height="2.6" rx="0.5"/></g>`,
    `<path class="iso-line" data-tone="lo" d="${rr(0, 0, WIN.w, WIN.h, 1.4)}"/>`,
    `<path class="iso-line" data-tone="faint" d="${rr(-1.6, -1.6, WIN.w + 3.2, WIN.h + 3.2, 2.4)}"/>`,
    `</g>`,
    Dots([at([WIN.x - 2.8, 16, WIN.z + 0.4]), at([WIN.x + WIN.w + 2.8, 16, WIN.z + 0.4]), at([WIN.x - 2.8, 16, WIN.z - WIN.h - 0.4]), at([WIN.x + WIN.w + 2.8, 16, WIN.z - WIN.h - 0.4])], { size: 0.45 }),
  ].join("");
  const xf = HOOD.x + HOOD.w;
  const throat = k.pathOf(k.roundedPlan({ x: -12, y: HOOD_Z + 1.1, w: 24, d: 1.5, r: 0.7 }, 3).map(([y, z]) => at([xf, y, z])), true);
  put("magazine.box", centreOf(HOOD, HOOD_Z, HOOD_TOP - HOOD_Z), box.svg + windowSvg + Ln(throat, { tone: "lo" }) + Dots([at([xf, -12.5, HOOD_TOP - 3]), at([xf, 12.5, HOOD_TOP - 3])], { size: 0.45 }), [box.shape]);
  put("magazine.lid", centreOf(lidPlan, HOOD_TOP, 1.6), lid.svg + screws(k.corners(lidPlan, 3.4), HOOD_TOP + 1.6, 1.2) + Ln(k.planOutline(k.insetPlan(lidPlan, 7), HOOD_TOP + 1.6, P, 3), { tone: "faint" }), [lid.shape]);
}

// ---------------------------------------------------------------- tape stand: supply roll, entry roller
{
  const foot = { x: -70, y: -31, w: 44, d: 11, r: 2 };
  const tower = { x: -66, y: -27, w: 36, d: 6, r: 1.5 };
  item("tower.foot", centreOf(foot, 0, 4), [slabPart("tower.foot", foot, 0, 4, { tone: "mid", steps: 3, bevel: 0.5 })], {
    after: Dots([at([foot.x + 2.4, foot.y + foot.d - 2.4, 4]), at([foot.x + foot.w - 2.4, foot.y + foot.d - 2.4, 4])], { size: 0.45 }),
  });
  const plate = slabPart("tower.plate", tower, 4, 60, { tone: "mid", steps: 3, bevel: 0.5 });
  const slot = (z0, z1) => {
    const ring = [
      [tower.x + 12, z0],
      [tower.x + 24, z0],
      [tower.x + 24, z1],
      [tower.x + 12, z1],
    ];
    return k.pathOf(ring.map(([x, z]) => at([x, tower.y + tower.d, z])), true);
  };
  put("tower.plate", centreOf(tower, 4, 60), plate.svg + Ln(slot(20, 30), { tone: "lo" }) + Dots([at([tower.x + 3, -21, 60]), at([tower.x + tower.w - 3, -21, 60])], { size: 0.45 }), [plate.shape]);

  // supply roll on its axle
  const sx = SUPPLY.x;
  const sz = SUPPLY.z;
  item("supply.axle", [sx, -13, sz], [discY("supply.axle", sx, sz, -21, -6, 1.4, { tone: "mid" })]);
  item("supply.flange", [sx, -5.2, sz], [discY("supply.flange", sx, sz, -6, -4.5, SUPPLY.flange, { tone: "mid" })]);
  const F = frameY(sx, sz);
  const rings = [5.4, 7.6, 9.8, 11.4].map((r) => G.circleOf(F, 4.5, r, P)).join("");
  const roll = discY("supply.roll", sx, sz, -4.5, 4.5, SUPPLY.roll, { tone: "hi" });
  const cap = discY("supply.cap", sx, sz, 4.5, 6, 4, { tone: "mid" });
  put("supply.roll", [sx, 0, sz], roll.svg + Ln(rings, { tone: "faint" }) + cap.svg + spinSvg("supply", [sx, 6, sz], 4), [roll.shape, cap.shape]);

  // the blank tape running down to the roller
  const vplan = { x: ROLLER.x - ROLLER.r - TAPE_T, y: -TAPE_HALF, w: TAPE_T, d: TAPE_HALF * 2, r: 0 };
  item("tape.down", centreOf(vplan, ROLLER.z, sz - ROLLER.z), [slabPart("tape.down", vplan, ROLLER.z, sz - ROLLER.z, { tone: "hi", steps: 1 })]);

  // entry roller
  item("roller.axle", [ROLLER.x, -13, ROLLER.z], [discY("roller.axle", ROLLER.x, ROLLER.z, -21, -5.5, 0.9, { tone: "mid" })]);
  item("roller", [ROLLER.x, 0, ROLLER.z], [
    discY("roller.body", ROLLER.x, ROLLER.z, -5.5, 5.5, ROLLER.r, { tone: "mid" }),
    discY("roller.cap", ROLLER.x, ROLLER.z, 5.5, 6.3, 1.3, { tone: "mid" }),
  ]);
}

function spinSvg(name, centre, r) {
  const c = at(centre);
  const ex = k.axisVector(P, [1, 0, 0]);
  const ez = k.axisVector(P, [0, 0, 1]);
  const m = `matrix(${f2(ex[0])} ${f2(ex[1])} ${f2(ez[0])} ${f2(ez[1])} ${f2(c[0])} ${f2(c[1])})`;
  const s = r * 0.55;
  const pins = [0, 120, 240].map((deg) => {
    const a = (deg * Math.PI) / 180 + Math.PI / 2;
    const px = Math.cos(a) * r * 0.66;
    const py = Math.sin(a) * r * 0.66;
    return `M${f2(px + 0.45)} ${f2(py)}A0.45 0.45 0 1 1 ${f2(px - 0.45)} ${f2(py)}A0.45 0.45 0 1 1 ${f2(px + 0.45)} ${f2(py)}Z`;
  });
  return `<g transform="${m}"><g data-np-spin="${name}"><path class="iso-line" data-tone="lo" d="M${-r} 0H${r}"/><path class="iso-line" data-tone="lo" d="${pins.join("")}"/><path class="iso-line" data-tone="faint" d="M${-s} 0A${s} ${s} 0 1 1 ${s} 0A${s} ${s} 0 1 1 ${-s} 0Z"/></g></g>`;
}

// ---------------------------------------------------------------- the tape: blank under the head, embossed from there on (the lit part)
{
  const plan = { x: ROLLER.x, y: -TAPE_HALF, w: TAKEUP.x - ROLLER.x, d: TAPE_HALF * 2, r: 0 };
  const tape = slabPart("tape.run", plan, TAPE_Z, TAPE_T, { tone: "hi", lit: true, steps: 1, crease: "lo" });
  const clipRing = [
    [ROLLER.x, -TAPE_HALF - 0.4],
    [TAKEUP.x, -TAPE_HALF - 0.4],
    [TAKEUP.x, TAPE_HALF + 0.4],
    [ROLLER.x, TAPE_HALF + 0.4],
  ];
  const clip = k.pathOf(clipRing.map(([x, y]) => at([x, y, TAPE_TOP])), true);
  const cut = k.pathOf([at([-PITCH / 2, -TAPE_HALF, TAPE_TOP]), at([-PITCH / 2, TAPE_HALF, TAPE_TOP])]);
  const slots = [0, 1, 2, 3]
    .map((slot) => {
      const shift = k.translateAlong(P, [slot * PITCH, 0, 0]);
      return `<g transform="${shift}"><path class="iso-line" data-tone="lit" data-free="" data-np-slot="${slot}" d="${INITIAL.slots[slot] === null ? "" : TAPE_MARKS[INITIAL.slots[slot]]}"/>${Ln(cut, { tone: "lo" })}</g>`;
    })
    .join("");
  const marks = `<clipPath id="np-__UID__-tape"><path d="${clip}"/></clipPath><g clip-path="url(#np-__UID__-tape)"><g data-np-feed="">${slots}</g></g>`;
  put("tape.run", centreOf(plan, TAPE_Z, TAPE_T), tape.svg + marks, [tape.shape]);
}

// ---------------------------------------------------------------- outfeed guide
{
  const block = { x: 34, y: -8, w: 96, d: 16, r: 1.5 };
  const b = slabPart("outfeed.block", block, 0, TAPE_Z, { tone: "mid", steps: 3, bevel: 0.5, inner: Ln(k.sideSeam(block, 2.4, P, 3), { tone: "faint" }) });
  put("outfeed.block", centreOf(block, 0, TAPE_Z), b.svg + Dots([44, 64, 84, 104, 120].map((x) => at([x, 8, 5.6])), { size: 0.4 }), [b.shape]);
  const lipB = { x: 34, y: -TAPE_HALF - 2.3, w: 96, d: 1.8, r: 0.4 };
  const lipF = { x: 34, y: TAPE_HALF + 0.5, w: 96, d: 1.8, r: 0.4 };
  const ticks = k.topTicks(36, 128, 4, 10, lipB.y + lipB.d, TAPE_Z + 1.4, [-0.7, -1.3], P);
  item("outfeed.lipB", centreOf(lipB, TAPE_Z, 1.4), [slabPart("outfeed.lipB", lipB, TAPE_Z, 1.4, { tone: "mid", steps: 2 })], {
    after: Ln(ticks.minor, { tone: "lo" }) + Ln(ticks.major, { tone: "mid" }),
  });
  item("outfeed.lipF", centreOf(lipF, TAPE_Z, 1.4), [slabPart("outfeed.lipF", lipF, TAPE_Z, 1.4, { tone: "mid", steps: 2 })]);
}

// ---------------------------------------------------------------- take-up reel
{
  const post = { x: TAKEUP.x - 3, y: -18, w: 6, d: 6, r: 1 };
  item("takeup.post", centreOf(post, 0, TAKEUP.z + 3.4), [slabPart("takeup.post", post, 0, TAKEUP.z + 3.4, { tone: "mid", steps: 2, bevel: 0.4 })], {
    after: Dots([at([TAKEUP.x, -15, TAKEUP.z + 3.4])], { size: 0.45 }),
  });
  item("takeup.axle", [TAKEUP.x, -9, TAKEUP.z], [discY("takeup.axle", TAKEUP.x, TAKEUP.z, -12, -6, 1.4, { tone: "mid" })]);
  item("takeup.flange", [TAKEUP.x, -5.2, TAKEUP.z], [discY("takeup.flange", TAKEUP.x, TAKEUP.z, -6, -4.5, TAKEUP.flange, { tone: "mid" })]);
  const F = frameY(TAKEUP.x, TAKEUP.z);
  const rings = [4.6, 6.4, 7.9].map((r) => G.circleOf(F, 4.5, r, P)).join("");
  const roll = discY("takeup.roll", TAKEUP.x, TAKEUP.z, -4.5, 4.5, TAKEUP.roll, { tone: "hi" });
  const cap = discY("takeup.cap", TAKEUP.x, TAKEUP.z, 4.5, 6, 3.4, { tone: "mid" });
  put("takeup.roll", [TAKEUP.x, 0, TAKEUP.z], roll.svg + Ln(rings, { tone: "faint" }) + cap.svg + spinSvg("takeup", [TAKEUP.x, 6, TAKEUP.z], 3.4), [roll.shape, cap.shape]);
}

// ---------------------------------------------------------------- spare tape roll on a peg (stock for the supply stand)
{
  const c = [140, 22];
  const roll = cylPart("spare.roll", c[0], c[1], 9, 0, 9, { tone: "mid", steps: 56 });
  const core = cylPart("spare.peg", c[0], c[1], 2, 9, 2.6, { tone: "mid", steps: 20, bevel: 0.3 });
  const rings = [3.4, 5.4, 7.2].map((r) => k.ring(c[0], c[1], r, 9, P, 48)).join("");
  put("spare.roll", [c[0], c[1], 4.5], roll.svg + Ln(rings, { tone: "faint" }) + core.svg, [roll.shape, core.shape]);
}

// ---------------------------------------------------------------- the press: C-frame, ram, head, return spring, knob, stroke counter
{
  const foot = { x: -20, y: -42, w: 40, d: 22, r: 2 };
  const column = { x: -14, y: -38, w: 28, d: 14, r: 1.5 };
  const arm = { x: -13, y: -24, w: 26, d: 36, r: 2 };
  item("frame.foot", centreOf(foot, 0, 5), [slabPart("frame.foot", foot, 0, 5, { tone: "mid", steps: 3, bevel: 0.6 })], {
    after: Dots(k.corners(foot, 3).filter(([, y]) => y > foot.y + 5).map(([x, y]) => at([x, y, 5])), { size: 0.5 }),
  });
  {
    const col = slabPart("frame.column", column, 5, ARM_TOP - 5, { tone: "mid", steps: 3, bevel: 0.6, inner: Ln(k.sideSeam(column, 12, P, 3), { tone: "faint" }) });
    // a cast pocket on the side that faces the outfeed, with its two tie bolts
    const xs = column.x + column.w;
    const pocket = k.pathOf(k.roundedPlan({ x: column.y + 3, y: 16, w: column.d - 6, d: 24, r: 2 }, 4).map(([y, z]) => at([xs, y, z])), true);
    const bolts = [
      [xs, column.y + column.d / 2, 44],
      [xs, column.y + column.d / 2, 9],
    ];
    put("frame.column", centreOf(column, 5, ARM_TOP - 5), col.svg + Ln(pocket, { tone: "lo" }) + Ln(bolts.map((p) => k.sideRing(p, 1.3, "x", P, 16)).join(""), { tone: "lo" }) + Dots(bolts.map(at), { size: 0.5 }), [col.shape]);
  }
  item("frame.arm", centreOf(arm, ARM_Z, ARM_TOP - ARM_Z), [slabPart("frame.arm", arm, ARM_Z, ARM_TOP - ARM_Z, { tone: "mid", steps: 4, bevel: 0.6 })], {
    after: Dots([at([-9, -20, ARM_TOP]), at([9, -20, ARM_TOP]), at([-9, 8, ARM_TOP]), at([9, 8, ARM_TOP])], { size: 0.45 }),
  });
  const glandHi = cylPart("frame.glandHi", 0, 0, 6, ARM_TOP, GLAND_HI - ARM_TOP, { tone: "mid", steps: 32, bevel: 0.4 });
  put("frame.glandHi", [0, 0, GLAND_HI - 1], glandHi.svg + Ln(k.ring(0, 0, 5, GLAND_HI, P, 40), { tone: "lo" }), [glandHi.shape]);
  item("frame.glandLo", [0, 0, GLAND_LO + 1], [cylPart("frame.glandLo", 0, 0, 6, GLAND_LO, ARM_Z - GLAND_LO, { tone: "mid", steps: 32 })]);

  // stroke counter on the arm's front: digits in its window, the batch size engraved beside it (the one label)
  const box = { x: -10, y: 12, w: 20, d: 5, r: 0.8 };
  const c = slabPart("counter.box", box, 47, 8, { tone: "mid", steps: 2, bevel: 0.4 });
  const face = k.sideMatrix([box.x + 1.6, box.y + box.d], 53.6, P, "left");
  const counter = [
    `<g transform="${face}">`,
    `<clipPath id="np-__UID__-ctr"><rect x="0" y="0" width="9.6" height="5.2" rx="0.6"/></clipPath>`,
    `<rect class="np-well" x="0" y="0" width="9.6" height="5.2" rx="0.6"/>`,
    `<g clip-path="url(#np-__UID__-ctr)"><text class="np-digits" data-np-digits="" x="4.8" y="4.15" text-anchor="middle" font-size="4.1">003</text></g>`,
    `<rect class="iso-line" data-tone="lo" x="0" y="0" width="9.6" height="5.2" rx="0.6"/>`,
    k.faceTextSvg("translate(10.6 3.9)", "/277", { size: 2.5, tone: "lo" }),
    `</g>`,
  ].join("");
  put("counter.box", centreOf(box, 47, 8), c.svg + counter + Dots([at([box.x + 1, 17, 54]), at([box.x + box.w - 1, 17, 48])], { size: 0.4 }), [c.shape]);
  item("counter.knob", [box.x + box.w + 1.2, 14.5, 51], [cylPart("counter.knob", box.x + box.w + 1.2, 14.5, 1.3, 49, 4, { tone: "mid", steps: 16 })]);

  // head (punch holder and platen) — moves down the stroke
  const platen = { x: -18, y: -12, w: 36, d: 24, r: 1 };
  const head = { x: -20, y: -13.5, w: 40, d: 27, r: 2 };
  const hp = [
    slabPart("head.platen", platen, PLATEN_Z, HEAD_Z - PLATEN_Z, { tone: "mid", steps: 2, inner: Ln(k.sideSeam(platen, PLATEN_Z + 1.6, P, 2), { tone: "faint" }) }),
    slabPart("head.plate", head, HEAD_Z, HEAD_TOP - HEAD_Z, { tone: "mid", steps: 4, bevel: 0.6 }),
    cylPart("head.collar", 0, 0, 5, HEAD_TOP, COLLAR_TOP - HEAD_TOP, { tone: "mid", steps: 32 }),
  ];
  const PIN = { x: -9, y: 7, r: 1.3, boss: 2.3 };
  hp.push(cylPart("head.pinBoss", PIN.x, PIN.y, PIN.boss, HEAD_TOP, 1.2, { tone: "mid", steps: 20 }));
  const frontScrews = [-14, 14].map((x) => [x, head.y + head.d, (HEAD_Z + HEAD_TOP) / 2]);
  put(
    "head",
    [0, 0, HEAD_Z],
    hp[0].svg + hp[1].svg + screws(k.corners(head, 3.6), HEAD_TOP, 1.3) + Ln(frontScrews.map((p) => k.sideRing(p, 1.15, "y", P, 16)).join(""), { tone: "lo" }) + Dots(frontScrews.map(at), { size: 0.45 }) + hp[2].svg + hp[3].svg,
    hp.map((p) => p.shape),
    { piece: "head" },
  );

  // guide pin: keeps the head square; it slides out of a bore in the arm's underside
  {
    const F = G.frameAlong([PIN.x, PIN.y, ARM_Z], [0, 0, -1]);
    const reach = ARM_Z - HEAD_TOP - 1.2;
    const rod = G.rodOut(F, 0, reach, PIN.r, P, { stroke: STROKE });
    const svg = `<clipPath id="np-__UID__-pin"><path data-hold="" d="${rod.clip}"/></clipPath><g clip-path="url(#np-__UID__-pin)">${S(rod.paths, { tone: "mid", crease: "none" })}</g>`;
    put("head.pin", [PIN.x, PIN.y, ARM_Z - reach / 2], svg, [A.slide(F, 0, reach, PIN.r, { name: "head.pin" })], { piece: "head" });
  }

  // ram below the arm: slides out of the lower gland as the head goes down
  {
    const F = G.frameAlong([0, 0, GLAND_LO], [0, 0, -1]);
    const rod = G.rodOut(F, 0, GLAND_LO - COLLAR_TOP, 2.8, P, { stroke: STROKE });
    const svg = `<clipPath id="np-__UID__-ramlo"><path data-hold="" d="${rod.clip}"/></clipPath><g clip-path="url(#np-__UID__-ramlo)">${S(rod.paths, { tone: "mid", crease: "none" })}</g>`;
    put("ram.lower", [0, 0, (GLAND_LO + COLLAR_TOP) / 2], svg, [A.slide(F, 0, GLAND_LO - COLLAR_TOP, 2.8, { name: "ram.lower" })], { piece: "head" });
  }
  // ram above the arm with the return spring: the rod retracts into the upper gland, the spring compresses under the knob
  {
    const F = G.frameAlong([0, 0, GLAND_HI], [0, 0, 1]);
    const rod = G.rodOut(F, 0, SPRING_LEN, 2.8, P, { stroke: STROKE });
    const coil0 = coilPaths(COIL.cx, COIL.cy, COIL.r, GLAND_HI, KNOB_Z, COIL.turns, COIL.phase, [V[0], V[1]], P);
    const svg = [
      `<g data-hold=""><path class="iso-line" data-tone="lo" data-np-coil="back" d="${coil0.back}"/></g>`,
      `<clipPath id="np-__UID__-ramhi"><path data-hold="" d="${rod.clip}"/></clipPath><g clip-path="url(#np-__UID__-ramhi)">${S(rod.paths, { tone: "mid", crease: "none" })}</g>`,
      `<g data-hold=""><path class="iso-line" data-tone="mid" data-np-coil="front" d="${coil0.front}"/></g>`,
    ].join("");
    // recorded as the spring's swept envelope, which holds the rod: rod and coil stretch together with the stroke
    put("ram.upper", [0, 0, GLAND_HI + SPRING_LEN / 2], svg, [A.slide(F, 0, SPRING_LEN, 5.6, { name: "ram.upper" })], {
      piece: "head",
    });
  }
  // knob
  const kn = [
    cylPart("knob.collar", 0, 0, 5.2, KNOB_Z, 2, { tone: "mid", steps: 32 }),
    cylPart("knob.body", 0, 0, 8.6, KNOB_Z + 2, 6.6, { tone: "mid", steps: 48 }),
    cylPart("knob.cap", 0, 0, 6.2, KNOB_Z + 8.6, 1.6, { tone: "mid", steps: 40, bevel: 0.5 }),
  ];
  put(
    "knob",
    [0, 0, KNOB_Z + 5],
    kn[0].svg + kn[1].svg + Ln(k.knurl(0, 0, 8.6, KNOB_Z + 2, KNOB_Z + 8.6, 60, P), { tone: "lo" }) + Ln(k.sideArc(0, 0, 8.6, KNOB_Z + 6.4, P, 40), { tone: "faint" }) + kn[2].svg + Ln(k.ring(0, 0, 2.2, KNOB_Z + 10.2, P, 24), { tone: "lo" }) + Dots([at([0, 0, KNOB_Z + 10.2])], { size: 0.5, tone: "mid" }),
    kn.map((p) => p.shape),
    { piece: "head" },
  );
}

// ---------------------------------------------------------------- painter's order, proved over every pose the page shows
const pose = (carriage, head) => ({ label: `carriage ${carriage} · head ${head}`, shares: { carriage, head } });
const STATES = [...Array.from({ length: 11 }, (_, i) => pose(i / 10, 0)), ...[0.25, 0.5, 0.75, 1].map((h) => pose(1, h))];
A.settle(R, P, { states: STATES });

const STILL = poseAt(TIME.still);
const lift = (item) => G.dot3(item.move ?? [0, 0, 0], V);
const keyAtPose = (item, p) => item.key + lift(item) * (item.piece === "carriage" ? p.carriage : item.piece === "head" ? p.head : 0);
const ordered = R.items.map((item, index) => ({ item, index })).sort((a, b) => keyAtPose(a.item, STILL) - keyAtPose(b.item, STILL) || a.index - b.index);

const transformOf = (item) => {
  if (item.piece === "carriage") return k.translateAlong(P, [TRAVEL * STILL.carriage, 0, 0]);
  return "";
};
const groups = ordered
  .map(({ item }) => {
    const t = transformOf(item);
    return `<g class="np-it" data-name="${item.name}" data-k="${item.key.toFixed(3)}"${item.piece ? ` data-p="${item.piece}" data-l="${lift(item).toFixed(3)}"` : ""}${t ? ` transform="${t}"` : ""}>${item.svg}</g>`;
  })
  .join("");

const LABEL = {
  en: "A bench name press. A token card printed with a Figma style name rides on a carriage from a card magazine into a hand press. The knob drives the head down onto a tape that runs from a supply roll, under the head and out across an outfeed guide to a take-up reel. Each stroke embosses the same name on the tape in its code form: lowercased, every slash and space turned into a hyphen, two hyphens in front. A stroke counter on the press counts toward the 277 tokens in the system.",
  es: "Una prensa de nombres sobre un banco. Una tarjeta con el nombre de un estilo de Figma viaja en un carro desde un cargador hasta una prensa manual. La perilla baja el cabezal sobre una cinta que sale de un rollo, pasa bajo el cabezal y sigue por una guía hasta un carrete. Cada golpe estampa en la cinta el mismo nombre en su forma de código: en minúsculas, cada barra y espacio convertidos en guion, con dos guiones delante. Un contador en la prensa cuenta hacia los 277 tokens del sistema.",
};

const svgBody = [`<path class="iso-halo" d="${k.haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`, `<g data-np-items="">${groups}</g>`].join("");
const svgFor = (lang) =>
  `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${LABEL[lang].replace(/"/g, "&quot;")}">${svgBody}</svg>`;

// ---------------------------------------------------------------- data for the live script
const DATA = {
  P,
  view: [V[0], V[1]],
  pitch: PITCH,
  total: TOTAL,
  time: TIME,
  move: MOVE,
  pairs: PAIRS,
  cardMarks: CARD_MARKS,
  tapeMarks: TAPE_MARKS,
  coil: { ...COIL, z0: GLAND_HI, z1: KNOB_Z },
  spin: { supply: SUPPLY.roll, takeup: TAKEUP.roll },
  window: { w: WIN.w, h: WIN.h, step: WIN.step, lines: WIN.lines },
  initial: INITIAL,
};

// the kit functions the page needs, taken from the copied kit (not re-typed)
function kitSubset(names) {
  const lines = readFileSync(join(HERE, "..", "kit", "iso-kit.mjs"), "utf8").split("\n");
  const starts = lines.map((line, index) => (/^(export )?(function|const|let) /.test(line) ? index : -1)).filter((i) => i >= 0);
  const out = [];
  for (const name of names) {
    const index = starts.find((i) => new RegExp(`^(export )?(function|const|let) ${name}\\b`).test(lines[i]));
    if (index === undefined) throw new Error(`kit has no ${name}`);
    const end = starts.find((i) => i > index) ?? lines.length;
    out.push(lines.slice(index, end).join("\n").replace(/^export /, ""));
  }
  return out.join("\n");
}
function modelSubset() {
  const src = readFileSync(join(HERE, "model.mjs"), "utf8");
  const take = (re) => {
    const m = src.match(re);
    if (!m) throw new Error(`model is missing ${re}`);
    return m[0];
  };
  return [
    "const TIME = NP.time;",
    take(/const clamp01 = [^\n]*\n/),
    take(/const smoother = \(u\) => \{[\s\S]*?\n\};\n/),
    take(/export function poseAt\(c\) \{[\s\S]*?\n\}\n/).replace(/^export /, ""),
  ].join("\n");
}
const KIT = kitSubset(["AZIMUTH", "ELEVATION", "RADIANS", "UNIT", "cameraOf", "iso", "tenth", "pathOf", "axisVector", "fine", "translateAlong", "holdStill"]);
const LIVE = readFileSync(join(HERE, "live.js"), "utf8");
const SHARED = readFileSync(join(HERE, "shared.mjs"), "utf8").replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = [`const NP = ${JSON.stringify(DATA)};`, KIT, modelSubset(), SHARED, LIVE].join("\n");

// ---------------------------------------------------------------- CSS: the kit's styles, scoped under .np-fig, on the site's blueprint palette
const SCOPE = ".np-fig";
function scopeCss(css) {
  let out = "";
  let i = 0;
  const block = (from) => {
    let depth = 0;
    for (let j = from; j < css.length; j++) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") {
        depth--;
        if (depth === 0) return j;
      }
    }
    return css.length - 1;
  };
  const prefix = (selectors) =>
    selectors
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `${SCOPE} ${s}`)
      .join(",");
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open < 0) break;
    const head = css.slice(i, open).trim();
    const close = block(open);
    const inner = css.slice(open + 1, close);
    if (head.startsWith("@keyframes")) out += `${head.replace(/iso-/, "np-iso-")}{${inner}}`;
    else if (head.startsWith("@media")) out += `${head}{${scopeCss(inner)}}`;
    else if (head === ".iso" || head.startsWith(".iso[data-theme") || /^\.iso-(plate|figure|legend|keys|key|swatch|caption)/.test(head)) {
      // tokens and the kit card are replaced by the figure's own
    } else out += `${prefix(head)}{${inner}}`;
    i = close + 1;
  }
  return out.replace(/animation:iso-/g, "animation:np-iso-");
}
const KIT_CSS = scopeCss(k.ISO_CSS.replace(/\n/g, ""));
const CSS = `
${SCOPE}{
  --anatomy-page:#0B1424;--anatomy-card:#111F38;--anatomy-rule:#23365A;
  --anatomy-text:#A9B8CF;--anatomy-strong:#E6EEF8;--anatomy-muted:#8193AF;
  --anatomy-paper:#111F38;--anatomy-face:#17284A;--anatomy-top:#1A2C4C;
  --anatomy-shade-0:#0C172C;--anatomy-shade-1:#0F1C34;--anatomy-shade-2:#12213C;--anatomy-shade-3:#152644;
  --anatomy-lit-top:#123248;--anatomy-lit-shade:#0F2A3F;
  --anatomy-hi:#C9D6EA;--anatomy-mid:#62789E;--anatomy-lo:#3B5079;--anatomy-faint:#273B60;--anatomy-lit:#5BD6F5;
  --anatomy-halo:#030913;--anatomy-halo-opacity:.85;--anatomy-dot:#E6EEF8;
  --anatomy-red:#FF4D5E;--anatomy-green:#6be0a0;--anatomy-blue:#5BD6F5;
  --anatomy-weight:.6px;--anatomy-ease:cubic-bezier(.32,.72,0,1);
  --anatomy-mono:"Fragment Mono",ui-monospace,"SFMono-Regular",Menlo,monospace;
  --np-sans:"Archivo Variable","Archivo",system-ui,sans-serif;
  display:block;margin:0;container-type:inline-size;color:var(--anatomy-text);
}
${KIT_CSS}
${SCOPE} .np-plate{position:relative;display:grid;grid-template-rows:auto auto auto;gap:4px;padding:16px 20px 16px;background:var(--anatomy-card);box-shadow:0 0 0 1px var(--anatomy-rule);--anatomy-paper:var(--anatomy-card)}
${SCOPE} .np-top,${SCOPE} .np-bottom{display:flex;justify-content:space-between;gap:12px 20px;font-size:11px;line-height:1.35;letter-spacing:.04em}
${SCOPE} .np-top{align-items:baseline}
${SCOPE} .np-bottom{align-items:flex-end}
${SCOPE} .np-fignum{font-family:var(--anatomy-mono);color:var(--anatomy-text)}
${SCOPE} .np-title{font-family:var(--np-sans);font-weight:600;color:var(--anatomy-text);text-transform:uppercase;letter-spacing:.12em;text-align:right}
${SCOPE} .np-hint{font-family:var(--np-sans);font-weight:500;color:var(--anatomy-muted);text-transform:uppercase;letter-spacing:.1em;max-width:16rem}
${SCOPE} .np-readout{font-family:var(--anatomy-mono);font-variant-numeric:tabular-nums;text-align:right;min-width:0;letter-spacing:0}
${SCOPE} .np-readout span{display:block;overflow-wrap:anywhere}
${SCOPE} .np-figma{color:var(--anatomy-text)}
${SCOPE} .np-figma::before{content:"";display:inline-block;width:.5em;height:.5em;margin-right:.55em;border:1px solid var(--anatomy-red);border-radius:1px;vertical-align:.05em}
${SCOPE} .np-code{color:var(--anatomy-lit)}
${SCOPE} .np-stage{display:block;margin:6px -6px 2px;border-radius:2px;outline:none;cursor:pointer;touch-action:pan-y;-webkit-tap-highlight-color:transparent}
${SCOPE} .np-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:4px}
${SCOPE} .np-stage .iso-svg{width:100%;height:auto}
${SCOPE} .np-well{fill:var(--anatomy-shade-0);stroke:none}
${SCOPE} .np-follower{fill:var(--anatomy-shade-3);stroke:none}
${SCOPE} .np-cards{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
${SCOPE} .np-digits{font-family:var(--anatomy-mono);fill:var(--anatomy-hi);letter-spacing:.04em}
${SCOPE} .np-halo-soft .iso-halo{filter:blur(4px);opacity:.55}
${SCOPE} .np-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
@container (max-width:560px){
  ${SCOPE} .np-plate{padding:14px 12px 14px}
  ${SCOPE} .np-stage{margin:8px -12px 6px;overflow:hidden}
  ${SCOPE} .np-stage .iso-svg{width:104%;margin-left:-2%}
  ${SCOPE} .np-bottom{flex-direction:column;align-items:stretch;gap:8px}
  ${SCOPE} .np-readout{text-align:left;font-size:10.5px}
  ${SCOPE} .np-hint{max-width:none}
}
`
  .replace(/\n\s*/g, "\n")
  .trim();

// ---------------------------------------------------------------- outputs
const TEXT = {
  en: {
    title: "One name, two places",
    hint: "Click or press Enter to stamp the next token",
    stage: "Name press. Press Enter or Space to stamp the next token.",
  },
  es: {
    title: "Un nombre, dos lugares",
    hint: "Haz clic o presiona Enter para estampar el siguiente token",
    stage: "Prensa de nombres. Presiona Enter o Espacio para estampar el siguiente token.",
  },
};
const [figma0, code0] = PAIRS[DATA.initial.card];
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function plateHtml(lang, uid) {
  const t = TEXT[lang];
  return [
    `<figure class="np-fig" data-np="" lang="${lang}">`,
    `<div class="np-plate">`,
    `<div class="np-top" aria-hidden="true"><span class="np-fignum">Fig 1</span><span class="np-title">${escapeHtml(t.title)}</span></div>`,
    `<div class="np-stage" data-np-stage="" tabindex="0" role="group" aria-label="${escapeHtml(t.stage)}">${svgFor(lang).replace(/__UID__/g, uid)}</div>`,
    `<div class="np-bottom"><span class="np-hint" aria-hidden="true">${escapeHtml(t.hint)}</span><span class="np-readout" data-readout="" aria-hidden="true"><span class="np-figma" data-np-figma="">${escapeHtml(figma0)}</span><span class="np-code" data-np-code="">→ ${escapeHtml(code0)}</span></span></div>`,
    `<span class="np-sr" data-np-live="" aria-live="polite" aria-atomic="true"></span>`,
    `</div>`,
    `</figure>`,
  ].join("");
}

const SCRIPT_FINAL = SCRIPT;

const astro = `---
// Generated by scripts/figures/name-press/build.mjs — do not edit by hand; edit the build and run it again.
// Fig 1 · One name, two places: a bench name press (Anatomy kit, MIT, see scripts/figures/kit/LICENSE).
interface Props {
  lang?: "en" | "es";
}
const { lang = "en" } = Astro.props;
const T = ${JSON.stringify(TEXT)} as const;
const t = T[lang] ?? T.en;
const LABEL = ${JSON.stringify(LABEL)} as const;
const BODY = ${JSON.stringify(svgBody)};
const uid = Math.random().toString(36).slice(2, 8);
const svg = \`<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="\${(LABEL[lang] ?? LABEL.en).replace(/"/g, "&quot;")}">\${BODY.replace(/__UID__/g, uid)}</svg>\`;
const first = ${JSON.stringify([figma0, code0])};
---

<figure class="np-fig" data-np lang={lang}>
  <div class="np-plate">
    <div class="np-top" aria-hidden="true"><span class="np-fignum">Fig 1</span><span class="np-title">{t.title}</span></div>
    <div class="np-stage" data-np-stage tabindex="0" role="group" aria-label={t.stage} set:html={svg} />
    <div class="np-bottom">
      <span class="np-hint" aria-hidden="true">{t.hint}</span>
      <span class="np-readout" data-readout aria-hidden="true"><span class="np-figma" data-np-figma>{first[0]}</span><span class="np-code" data-np-code>→ {first[1]}</span></span>
    </div>
    <span class="np-sr" data-np-live aria-live="polite" aria-atomic="true"></span>
  </div>
</figure>

<style is:global>
${CSS}
</style>

<script>
// @ts-nocheck
${SCRIPT_FINAL}
</script>
`;
const OUT = join(ROOT, "src", "components", "figures", "NamePress.astro");
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, astro);
console.log(`wrote ${OUT} · ${(astro.length / 1024).toFixed(0)} KB · ${R.items.length} items · ${R.solids.length + R.items.reduce((n, it) => n + it.shapes.length, 0) ? R.items.reduce((n, it) => n + it.shapes.length, 0) : 0} solids · viewBox ${W}×${H} · scale ${KS.toFixed(3)}`);

if (previewAt) {
  mkdirSync(previewAt, { recursive: true });
  const font = (rel) => pathToFileURL(join(ROOT, "node_modules", rel)).href;
  const fonts = `
@font-face{font-family:"Fragment Mono";font-style:normal;font-weight:400;src:url("${font("@fontsource/fragment-mono/files/fragment-mono-latin-400-normal.woff2")}") format("woff2")}
@font-face{font-family:"Archivo Variable";font-style:normal;font-weight:100 900;src:url("${font("@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2")}") format("woff2-variations")}`;
  const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Name press</title><style>${fonts}
*{box-sizing:border-box}html{color-scheme:dark}body{margin:0;background:#0B1424;color:#A9B8CF;font:15px/1.6 "Archivo Variable",system-ui,sans-serif}
main{width:min(760px,100% - 32px);margin:48px auto 96px;display:grid;gap:56px}
${CSS}</style></head><body><main>${plateHtml("en", "a1")}${plateHtml("es", "b2")}</main><script type="module">${SCRIPT_FINAL.replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;
  const file = join(previewAt, "name-press.html");
  writeFileSync(file, page);
  console.log(`wrote ${file}`);
}

A.auditOrExit(R, P, { frames: STATES, apart: false });
