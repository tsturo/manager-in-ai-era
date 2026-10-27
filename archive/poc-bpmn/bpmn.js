const Bpmn = (() => {
  const attrs = (a) => Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(" ");
  const el = (tag, a, inner = "") => `<${tag} ${attrs(a)}>${inner}</${tag}>`;

  const label = (x, y, text, cls = "lbl", lineHeight = 26) => {
    const lines = text.split("\n");
    const top = y - ((lines.length - 1) * lineHeight) / 2;
    const spans = lines.map((l, i) => el("tspan", { x, y: top + i * lineHeight }, l)).join("");
    return el("text", { class: cls, x, y: top, "dominant-baseline": "middle" }, spans);
  };

  const userIcon = (x, y) =>
    el("g", { class: "icon", transform: `translate(${x},${y})` },
      el("circle", { cx: 12, cy: 8, r: 7 }) + el("path", { d: "M0 28 Q12 10 24 28 Z" }));

  const gearIcon = (x, y) =>
    el("g", { class: "icon gear", transform: `translate(${x + 13},${y + 13})` },
      el("circle", { r: 11, class: "teeth" }) + el("circle", { r: 4 }));

  const icons = { user: userIcon, service: gearIcon, none: () => "" };

  const task = (x, y, w, h, text, { kind = "none", cls = "", loop = false } = {}) => {
    const box = el("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 14, class: "shape" });
    const marker = loop ? el("path", { class: "marker", d: `M${x - 9} ${y + h / 2 - 12} a9 9 0 1 1 9 9 m0 0 l-4 -6 m4 6 l-7 3` }) : "";
    return el("g", { class: `task ${cls}` }, box + icons[kind](x - w / 2 + 12, y - h / 2 + 10) + label(x, y, text) + marker);
  };

  const timerIcon = (x, y) =>
    el("circle", { cx: x, cy: y, r: 16, class: "icon-line" }) +
    el("path", { class: "icon-line", d: `M${x} ${y - 11} L${x} ${y} L${x + 8} ${y + 4}` });

  const messageIcon = (x, y) =>
    el("rect", { x: x - 14, y: y - 9, width: 28, height: 18, class: "icon-line" }) +
    el("path", { class: "icon-line", d: `M${x - 14} ${y - 9} L${x} ${y + 2} L${x + 14} ${y - 9}` });

  const eventIcons = { timer: timerIcon, message: messageIcon, none: () => "" };

  const event = (x, y, { type = "start", icon = "none", text = "", cls = "" } = {}) => {
    const r = 28;
    const ring = el("circle", { cx: x, cy: y, r, class: `shape ev-${type}` });
    const inner = type === "inter" ? el("circle", { cx: x, cy: y, r: r - 6, class: "shape ev-inner" }) : "";
    const caption = text ? label(x, y + r + 34, text, "lbl small") : "";
    return el("g", { class: `event ${cls}` }, ring + inner + eventIcons[icon](x, y) + caption);
  };

  const gateway = (x, y, kind, { cls = "", text = "" } = {}) => {
    const s = 34;
    const diamond = el("path", { class: "shape", d: `M${x} ${y - s} L${x + s} ${y} L${x} ${y + s} L${x - s} ${y} Z` });
    const mark = kind === "x"
      ? el("path", { class: "gw-mark", d: `M${x - 11} ${y - 11} L${x + 11} ${y + 11} M${x + 11} ${y - 11} L${x - 11} ${y + 11}` })
      : el("path", { class: "gw-mark", d: `M${x} ${y - 15} L${x} ${y + 15} M${x - 15} ${y} L${x + 15} ${y}` });
    const caption = text ? label(x, y - s - 30, text, "lbl small") : "";
    return el("g", { class: `gateway ${cls}` }, diamond + mark + caption);
  };

  const dataObject = (x, y, text, { cls = "" } = {}) => {
    const w = 52, h = 66, f = 14;
    const d = `M${x - w / 2} ${y - h / 2} L${x + w / 2 - f} ${y - h / 2} L${x + w / 2} ${y - h / 2 + f} L${x + w / 2} ${y + h / 2} L${x - w / 2} ${y + h / 2} Z`;
    return el("g", { class: `data ${cls}` }, el("path", { class: "shape", d }) + label(x, y + h / 2 + 34, text, "lbl small"));
  };

  const path = (pts) => "M" + pts.map((p) => p.join(" ")).join(" L");

  const flow = (pts, cls = "") => el("path", { class: `flow ${cls}`, d: path(pts), "marker-end": "url(#arrow)" });
  const assoc = (pts, cls = "") => el("path", { class: `assoc ${cls}`, d: path(pts) });

  const pool = (x, y, w, h, title, cls) =>
    el("g", { class: `pool ${cls}` },
      el("rect", { x, y, width: w, height: h, class: "pool-box" }) +
      el("rect", { x, y, width: 90, height: h, class: "pool-head" }) +
      el("text", { class: "pool-title", transform: `translate(${x + 56},${y + h / 2}) rotate(-90)`, "text-anchor": "middle" }, title));

  const lane = (x, y, w, h, title) =>
    el("g", { class: "lane" },
      el("rect", { x, y, width: w, height: h, class: "lane-box" }) +
      el("text", { class: "lane-title", transform: `translate(${x + 36},${y + h / 2}) rotate(-90)`, "text-anchor": "middle" }, title));

  const defs = () => el("defs", {},
    el("marker", { id: "arrow", viewBox: "0 0 12 12", refX: 11, refY: 6, markerWidth: 9, markerHeight: 9, orient: "auto-start-reverse" },
      el("path", { d: "M0 0 L12 6 L0 12 Z", class: "arrowhead" })) +
    el("pattern", { id: "grid", width: 40, height: 40, patternUnits: "userSpaceOnUse" },
      el("circle", { cx: 2, cy: 2, r: 1.6, class: "grid-dot" })));

  return { el, label, task, event, gateway, dataObject, flow, assoc, pool, lane, defs, path };
})();
