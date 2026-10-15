// The truth behind Fig 1, "One name, two places".
// Izipay merchant-panel design system: every token has one name in Figma and the same name in code.
// The rule is mechanical: lowercase the Figma style/variable name, turn every "/" and space into "-", prefix "--".

export const TOTAL = 277;

export const PAIRS = [
  ["color/neutral/darkest 900", "--color-neutral-darkest-900"],
  ["color/brand/primary interactive 1/medium 500", "--color-brand-primary-interactive-1-medium-500"],
  ["text/body/base/bold", "--text-body-base-bold"],
  ["spacing/inset/small", "--spacing-inset-small"],
  ["border/radius/pill", "--border-radius-pill"],
  ["shadow neutral/xl", "--shadow-neutral-xl"],
];

export const toCode = (figma) => "--" + figma.toLowerCase().replace(/[/ ]/g, "-");

for (const [figma, code] of PAIRS) {
  if (toCode(figma) !== code) throw new Error(`rule mismatch: ${figma} -> ${toCode(figma)} (expected ${code})`);
}

// One cell per character. Letters and digits are type; "/" and " " are the Figma separators; "-" is the code separator.
export function cellsOf(text) {
  return [...text].map((ch) => (ch === "/" ? "slash" : ch === " " ? "space" : ch === "-" ? "dash" : "type"));
}

// The press cycle, in seconds. One token is stamped per cycle.
export const TIME = {
  cycle: 4.6,
  inTo: 1.2, // carriage: magazine -> press
  downTo: 1.55, // head reaches the tape: the stamp
  holdTo: 1.63,
  upTo: 2.2,
  feedFrom: 2.2, // tape advances one label pitch
  feedTo: 2.95,
  outFrom: 2.35, // carriage: press -> magazine
  outTo: 3.55,
  swap: 3.6, // under the magazine, the stamped card is exchanged for the next one
  still: 3.0, // the reduced-motion frame: card just stamped, riding home, its label out on the tape
};

const clamp01 = (u) => Math.min(1, Math.max(0, u));
const smoother = (u) => {
  u = clamp01(u);
  return u * u * u * (u * (u * 6 - 15) + 10);
};

// carriage: 0 at the magazine, 1 under the press. head: 0 up, 1 on the tape. feed: 0..1 of one label pitch.
export function poseAt(c) {
  const t = TIME;
  let carriage = 0;
  if (c < t.inTo) carriage = smoother(c / t.inTo);
  else if (c < t.outFrom) carriage = 1;
  else if (c < t.outTo) carriage = 1 - smoother((c - t.outFrom) / (t.outTo - t.outFrom));
  let head = 0;
  if (c >= t.inTo && c < t.downTo) {
    const u = (c - t.inTo) / (t.downTo - t.inTo);
    head = u * u;
  } else if (c >= t.downTo && c < t.holdTo) head = 1;
  else if (c >= t.holdTo && c < t.upTo) head = 1 - smoother((c - t.holdTo) / (t.upTo - t.holdTo));
  let feed = 0;
  if (c >= t.feedFrom && c < t.feedTo) feed = smoother((c - t.feedFrom) / (t.feedTo - t.feedFrom));
  return { carriage, head, feed };
}
