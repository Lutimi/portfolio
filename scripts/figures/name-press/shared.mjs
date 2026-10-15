import { iso, pathOf } from "../kit/iso-kit.mjs";

// Shapes that change while the press runs. The build uses them for the first frame in the markup,
// and inlines this file into the page so the live script draws the same shapes.

// Vertical coil spring between z0 and z1 around (cx, cy), split into the half behind the rod and the half in front.
export function coilPaths(cx, cy, r, z0, z1, turns, phase, view, P) {
  const count = Math.max(12, Math.round(turns * 28));
  const back = [];
  const front = [];
  let run = [];
  let near = null;
  for (let index = 0; index <= count; index++) {
    const angle = phase + (index / count) * turns * Math.PI * 2;
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    const flat = iso([cx + r * ca, cy + r * sa, z0 + ((z1 - z0) * index) / count], P);
    const facing = ca * view[0] + sa * view[1] > 0;
    if (near === null) near = facing;
    if (facing !== near) {
      run.push(flat);
      (near ? front : back).push(pathOf(run));
      run = [flat];
      near = facing;
      continue;
    }
    run.push(flat);
  }
  if (run.length > 1) (near ? front : back).push(pathOf(run));
  return { back: back.join(""), front: front.join("") };
}

// The card stack seen through the magazine window (face coordinates): one thin closed edge per card,
// as many as the cards still to stamp allow, and the follower weight resting on top.
export function stackOf(count, total, w) {
  const remaining = Math.max(0, total - count);
  const lines = Math.max(1, Math.round((remaining / total) * w.lines));
  const t = w.step * 0.52;
  let d = "";
  for (let j = 0; j < lines; j++) {
    const y = w.h - w.step * (j + 1) + (w.step - t) / 2;
    d += `M1.2 ${y.toFixed(2)}H${w.w - 1.2}V${(y + t).toFixed(2)}H1.2Z`;
  }
  return { d, follower: w.h - w.step * lines - 2.6 - 0.15 };
}
