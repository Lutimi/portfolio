// Live behaviour for NamePress. The build prepends the kit subset (iso, pathOf, translateAlong, holdStill …),
// poseAt from model.mjs, coilPaths and stackOf from shared.mjs, and `const NP = {…}` (geometry, marks and timeline from the same build).
const NP_TIME = NP.time;

function npMount(root) {
  if (root.__np) return;
  root.__np = true;
  const $ = (selector) => root.querySelector(selector);
  const stage = $("[data-np-stage]");
  const host = $("[data-np-items]");
  const items = [...host.children].map((el, index) => ({
    el,
    index,
    k: Number(el.getAttribute("data-k")),
    l: Number(el.getAttribute("data-l") || 0),
    p: el.getAttribute("data-p") || "",
  }));
  const carriageEls = items.filter((it) => it.p === "carriage").map((it) => it.el);
  const headEls = items.filter((it) => it.p === "head").map((it) => it.el);
  const card = $("[data-np-card]");
  const feedEl = $("[data-np-feed]");
  const slots = [...root.querySelectorAll("[data-np-slot]")];
  const coilBack = $('[data-np-coil="back"]');
  const coilFront = $('[data-np-coil="front"]');
  const spinSupply = $('[data-np-spin="supply"]');
  const spinTakeup = $('[data-np-spin="takeup"]');
  const digits = $("[data-np-digits]");
  const stack = $("[data-np-stack]");
  const follower = $("[data-np-follower]");
  const figmaEl = $("[data-np-figma]");
  const codeEl = $("[data-np-code]");
  const live = $("[data-np-live]");
  const still = matchMedia("(prefers-reduced-motion: reduce)");

  const T = NP_TIME;
  const N = NP.pairs.length;
  const state = {
    c: T.still,
    count: NP.initial.count,
    card: NP.initial.card,
    next: (NP.initial.card + 1) % N,
    shown: NP.initial.card,
    slots: NP.initial.slots.slice(),
    fed: 0,
    rush: false,
    announce: false,
  };
  let order = items.map((it) => it.index);
  let frame = 0;
  let last = 0;
  let visible = false;

  const pad3 = (n) => String(n).padStart(3, "0");

  function writeReadout(index, speak) {
    const [figma, code] = NP.pairs[index];
    if (figmaEl.textContent !== figma) figmaEl.textContent = figma;
    if (codeEl.textContent !== `→ ${code}`) codeEl.textContent = `→ ${code}`;
    if (speak) live.textContent = `${figma} → ${code}`;
  }

  function writeStack() {
    const s = stackOf(state.count, NP.total, NP.window);
    stack.setAttribute("d", s.d);
    follower.setAttribute("transform", `translate(0 ${s.follower.toFixed(2)})`);
  }

  function writeSlots() {
    slots.forEach((el, k) => {
      const token = state.slots[k];
      el.setAttribute("d", token === null || token === undefined ? "" : NP.tapeMarks[token]);
    });
  }

  // Events of the cycle, in order.
  function stamp() {
    state.slots[0] = state.card;
    state.count = state.count >= NP.total ? 1 : state.count + 1;
    state.shown = state.card;
    writeSlots();
    digits.textContent = pad3(state.count);
    writeStack();
    writeReadout(state.shown, state.announce);
    state.announce = false;
    state.rush = false;
  }
  function shift() {
    state.slots = [null, ...state.slots.slice(0, -1)];
    state.fed += 1;
    writeSlots();
  }
  function swap() {
    state.card = state.next;
    state.next = (state.next + 1) % N;
    card.setAttribute("d", NP.cardMarks[state.card]);
  }

  const shareOf = (pose, piece) => (piece === "carriage" ? pose.carriage : piece === "head" ? pose.head : 0);

  function place(pose) {
    const cm = NP.move.carriage;
    const hm = NP.move.head;
    const ct = translateAlong(NP.P, [cm[0] * pose.carriage, cm[1] * pose.carriage, cm[2] * pose.carriage]);
    for (const el of carriageEls) el.setAttribute("transform", ct);
    const hv = axisVector(NP.P, [hm[0] * pose.head, hm[1] * pose.head, hm[2] * pose.head]);
    const ht = `translate(${Math.round(hv[0] * 100) / 100} ${Math.round(hv[1] * 100) / 100})`;
    for (const el of headEls) {
      el.setAttribute("transform", ht);
      holdStill(el, hv);
    }
    const coil = NP.coil;
    const top = coil.z1 + hm[2] * pose.head;
    const c = coilPaths(coil.cx, coil.cy, coil.r, coil.z0, top, coil.turns, coil.phase, NP.view, NP.P);
    coilBack.setAttribute("d", c.back);
    coilFront.setAttribute("d", c.front);
    const fv = axisVector(NP.P, [NP.pitch * pose.feed, 0, 0]);
    feedEl.setAttribute("transform", `translate(${Math.round(fv[0] * 100) / 100} ${Math.round(fv[1] * 100) / 100})`);
    const run = (state.fed + pose.feed) * NP.pitch;
    spinSupply.setAttribute("transform", `rotate(${((-run / NP.spin.supply) * 180) / Math.PI})`);
    spinTakeup.setAttribute("transform", `rotate(${((run / NP.spin.takeup) * 180) / Math.PI})`);
    // painter's order: static keys plus each moving item's lift times its share
    const keyed = items.map((it) => ({ index: it.index, key: it.k + it.l * shareOf(pose, it.p) }));
    keyed.sort((a, b) => a.key - b.key || a.index - b.index);
    const next = keyed.map((entry) => entry.index);
    if (next.some((value, at) => value !== order[at])) {
      const fragment = document.createDocumentFragment();
      for (const index of next) fragment.appendChild(items[index].el);
      host.appendChild(fragment);
      order = next;
    }
  }

  function advance(dt) {
    const from = state.c;
    let to = from + dt * (state.rush ? 2.4 : 1);
    if (state.rush && from >= T.swap && from < T.cycle) to = T.cycle; // skip the rest
    const marks = [
      [T.downTo, stamp],
      [T.feedTo, shift],
      [T.swap, swap],
    ];
    let c = from;
    while (c < to) {
      const end = Math.min(to, T.cycle);
      for (const [at, run] of marks) if (c < at && end >= at) run();
      c = end;
      if (c >= T.cycle) {
        c -= T.cycle;
        to -= T.cycle;
      }
    }
    state.c = c;
  }

  function draw() {
    place(poseAt(state.c));
  }

  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    advance(dt);
    draw();
    frame = visible && !still.matches ? requestAnimationFrame(tick) : 0;
  }
  const run = () => {
    if (!frame && visible && !still.matches) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  };

  // Reduced motion: one still frame; input steps straight to the next stamped token.
  function stepStill() {
    swap();
    stamp();
    shift();
    state.c = T.still;
    draw();
  }

  function request(speak) {
    state.announce = Boolean(speak);
    if (still.matches) {
      stepStill();
      return;
    }
    state.rush = true;
    run();
  }

  stage.addEventListener("click", () => request(true));
  stage.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") request(false);
  });
  stage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      request(true);
    }
  });
  stage.addEventListener("focus", () => {
    const [figma, code] = NP.pairs[state.shown];
    live.textContent = `${figma} → ${code}`;
  });
  still.addEventListener?.("change", () => {
    state.c = T.still;
    draw();
    run();
  });
  new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) run();
    },
    { rootMargin: "120px 0px" },
  ).observe(stage);

  digits.textContent = pad3(state.count);
  writeSlots();
  writeStack();
  writeReadout(state.shown, false);
  draw();
}

function npMountAll() {
  document.querySelectorAll("[data-np]").forEach(npMount);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", npMountAll);
else npMountAll();
document.addEventListener("astro:page-load", npMountAll);
