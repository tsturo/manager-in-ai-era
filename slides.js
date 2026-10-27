const START = 6, END = 23, PX = 46;

const minutes = (t) => { const [h, m] = t.split(":").map(Number); return h + m / 60; };
const ypos = (t) => (minutes(t) - START) * PX;

function hours(width) {
  const labels = [], lines = [];
  for (let h = START; h <= END; h++) {
    const top = (h - START) * PX;
    labels.push(`<span style="top:${top}px">${String(h).padStart(2, "0")}:00</span>`);
    lines.push(`<div class="line" style="top:${top}px"></div>`);
  }
  return `<div class="hours">${labels.join("")}</div><div class="grid" style="width:${width}px;height:${(END - START) * PX}px">${lines.join("")}</div>`;
}

function ev(e, left, width) {
  const top = ypos(e.from);
  const raw = ypos(e.to) - top - 3;
  const height = Math.max(raw, 34);
  const short = raw < 40 ? " short" : "";
  const note = e.note ? `<em>${e.note}</em>` : "";
  const chip = e.chip ? `<span class="chip">${e.chip}</span>` : "";
  return `<div class="ev ${e.cls || ""}${short}" style="top:${top}px;left:${80 + left}px;width:${width}px;height:${height}px"><b>${e.title}</b>${note}${chip}</div>`;
}

const MEETINGS = [
  { from: "09:00", to: "09:30", title: "Daily standup" },
  { from: "10:00", to: "10:45", title: "1:1 · Coachee A" },
  { from: "11:00", to: "11:45", title: "1:1 · Coachee B" },
  { from: "13:00", to: "14:30", title: "Business Group" },
  { from: "14:30", to: "15:15", title: "Martijn · PlusPort" },
  { from: "15:30", to: "16:15", title: "1:1 · Coachee C" },
  { from: "16:30", to: "17:15", title: "1:1 · Agnius" },
  { from: "17:30", to: "19:00", title: "Taxi: music school, 2 kids" },
];

const JAN_NOTES = {
  "1:1 · Coachee A": "no topics",
  "1:1 · Coachee C": "what was open last time?",
  "Martijn · PlusPort": "searched mail 5 min before",
  "1:1 · Agnius": "what do I even report?",
  "Taxi: music school, 2 kids": "nothing moves",
};

const JAN_EXTRA = [
  { from: "07:30", to: "08:15", title: "Rebook today's task slots", cls: "slot", note: "again" },
  { from: "12:00", to: "13:00", title: "Refactoring", cls: "slot", note: "moved ×3" },
  { from: "20:00", to: "21:30", title: "Vilnius Tech: labs, grading", cls: "over", note: "academic" },
  { from: "21:30", to: "23:00", title: "Live Viva", cls: "over", note: "my own project, after the kids sleep" },
];

function janCalendar() {
  const meetings = MEETINGS.map((m) => ({ ...m, note: JAN_NOTES[m.title] }));
  return hours(1000) + [...meetings, ...JAN_EXTRA].map((e) => ev(e, 0, 1000)).join("");
}

const grid = (start, end, px, width) => {
  const y = (t) => (minutes(t) - start) * px;
  const labels = [], lines = [];
  for (let h = start; h <= end; h++) {
    labels.push(`<span style="top:${(h - start) * px}px">${String(h).padStart(2, "0")}:00</span>`);
    lines.push(`<div class="line" style="top:${(h - start) * px}px"></div>`);
  }
  const html = `<div class="hours">${labels.join("")}</div><div class="grid" style="width:${width}px;height:${(end - start) * px}px">${lines.join("")}</div>`;
  const box = (e, left, w) => {
    const top = y(e.from), raw = y(e.to) - top - 3, h = Math.max(raw, 34);
    const note = e.note ? `<em>${e.note}</em>` : "", chip = e.chip ? `<span class="chip">${e.chip}</span>` : "";
    return `<div class="ev ${e.cls || ""}${raw < 40 ? " short" : ""}" style="top:${top}px;left:${80 + left}px;width:${w}px;height:${h}px"><b>${e.title}</b>${note}${chip}</div>`;
  };
  return { html, y, box };
};

const OCTC = { me: 0, meW: 700, ag: 780, agW: 420, runs: [1280, 1420, 1560], runW: 120, px: 43 };

function octCalendar() {
  const g = grid(6, 23, OCTC.px, 1680);
  const h = (e) => Math.max(g.y(e.to) - g.y(e.from) - 3, 34);
  const mid = (e) => g.y(e.from) + h(e) / 2;
  const meRight = 80 + OCTC.meW + 6;
  const box = (e, left, w, cls, badge) =>
    `<div class="ev ${cls || ""}" style="top:${g.y(e.from)}px;left:${80 + left}px;width:${w}px;height:${h(e)}px"><b>${e.title}</b>${badge ? `<span class="badge">${badge}</span>` : ""}</div>`;
  const wire = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} C${x1 - 40} ${y1} ${x2 + 40} ${y2} ${x2} ${y2}" class="w" marker-end="url(#pa)"/>`;
  const svg = (inner) => `<svg class="wires" width="1760" height="760">${inner}</svg>`;
  const group = (inner, order) => `<div class="reveal substep" data-substep-order="${order}">${inner}</div>`;

  const meet = Object.fromEntries(MEETINGS.map((m) => [m.title, m]));
  const taxi = meet["Taxi: music school, 2 kids"];
  const read = { from: "07:00", to: "07:55", title: "Read the page" };
  const review = { from: "12:00", to: "12:55", title: "Review drafts" };

  const agents = [
    [{ from: "06:00", to: "07:00", title: "Morning page" }, [read], box(read, OCTC.me, OCTC.meW, "touch", 1)],
    [{ from: "09:10", to: "09:55", title: "Prep: Coachee A, B" }, [meet["1:1 · Coachee A"], meet["1:1 · Coachee B"]], ""],
    [{ from: "10:45", to: "11:45", title: "Draft 6 replies" }, [review], box(review, OCTC.me, OCTC.meW, "touch", 2)],
    [{ from: "13:40", to: "14:25", title: "PlusPort agenda" }, [meet["Martijn · PlusPort"]], ""],
    [{ from: "14:45", to: "15:25", title: "Prep: Coachee C" }, [meet["1:1 · Coachee C"]], ""],
    [{ from: "15:50", to: "16:25", title: "Week summary" }, [meet["1:1 · Agnius"]], ""],
  ];
  const agentGroups = agents.map(([e, targets, touch], i) => group(
    svg(targets.map((t) => wire(80 + OCTC.ag, mid(e), meRight, mid(t))).join("")) + box(e, OCTC.ag, OCTC.agW, "agentc") + touch, i + 1)).join("");

  const runs = [["Refactoring", "07:00", "19:00"], ["Live Viva", "08:00", "17:00"], ["Labs", "13:00", "18:00"]]
    .map(([t, from, to], i) => `<div class="runbar2" style="left:${80 + OCTC.runs[i]}px;top:${g.y(from)}px;width:${OCTC.runW}px;height:${g.y(to) - g.y(from) - 3}px">${t}</div>`).join("");
  const askY = g.y("17:50");
  const ask = svg(`<circle cx="${80 + OCTC.runs[0]}" cy="${askY}" r="9" class="d"/>` + wire(80 + OCTC.runs[0], askY, meRight, mid(taxi))) +
    `<div class="ev touch outline" style="top:${g.y(taxi.from)}px;left:80px;width:${OCTC.meW}px;height:${h(taxi)}px"><span class="badge">3</span></div>` +
    `<div class="qs" style="left:${80 + 340}px;top:${g.y("17:33")}px"><i>▸</i>Approve the migration?<br><i>▸</i>Keep the old API?</div>`;
  const runGroup = group(runs + ask, agents.length + 1);

  const defs = `<svg width="0" height="0" style="position:absolute"><defs><marker id="pa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#7f56fa"/></marker></defs></svg>`;
  const me = MEETINGS.map((m) => box(m, OCTC.me, OCTC.meW)).join("");
  const tint = `<div class="tint" style="left:${80 + OCTC.ag - 20}px;width:${1680 - OCTC.ag + 20}px;height:${g.y("23:00")}px"></div>`;
  const heads = `<div class="lanehead" style="left:80px">Me</div><div class="lanehead p" style="left:${80 + OCTC.ag}px">Agents</div><div class="lanehead p" style="left:${80 + OCTC.runs[0]}px">Long runs · Mac mini</div>`;
  const eve = group(`<div class="eve2" style="top:${g.y("20:15")}px">The evening is <span class="i">mine again.</span><small>Labs and Live Viva moved into the day. Agents carried them.</small></div>`, agents.length + 3);
  return defs + tint + g.html + heads + me + agentGroups + runGroup + eve;
}

const ROLES = [
  ["Architect", "Visma Finance team"],
  ["Development Department Manager", "and the Business Group: partners, budgets"],
  ["Coach", "20 direct coachees, a 1:1 with each every month"],
  ["Operational Group", "member"],
  ["Work council", "member"],
  ["Lecturer", "Vilnius Tech, and the Academic committee"],
  ["AI coding JAMs and talks", "preparing them"],
  ["Builder", "DIY projects, educational tools and apps"],
  ["“Taxi driver”", "2 kids: music school, dance, English, swimming", "last"],
];

const roles = () => ROLES.map(([t, x, cls = ""], i) =>
  `<div class="role ${i ? "substep" : ""} ${cls}"><span class="t">${t}</span><span class="x">${x}</span></div>`).join("");

const badge = (x, y, n) => `<circle cx="${x}" cy="${y}" r="15" class="badge"/><text x="${x}" y="${y + 7}" text-anchor="middle" class="badgen">${n}</text>`;

const icon = {
  touch: (x, y) => icon.user(x, y),
  user: (x, y) => `<circle cx="${x}" cy="${y - 5}" r="6" class="ico"/><path d="M${x - 10} ${y + 11} Q${x} ${y - 3} ${x + 10} ${y + 11} Z" class="ico"/>`,
  service: (x, y) => `<circle cx="${x}" cy="${y}" r="8" class="gear"/><circle cx="${x}" cy="${y}" r="5.5" class="hub"/>`,
};

const B = {
  task: (x, y, w, h, t, kind = "user") => `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="10" class="${{ service: "run", touch: "s touch", user: "s" }[kind]}"/>` +
    icon[kind](x - w / 2 + 18, y - h / 2 + 18) +
    t.split("\n").map((l, i, a) => `<text x="${x + 8}" y="${y + (i - (a.length - 1) / 2) * 26 + 8}" text-anchor="middle">${l}</text>`).join(""),
  ev: (x, y, cap, extra = "") => `<circle cx="${x}" cy="${y}" r="20" class="s" ${extra}/>` + (cap ? `<text x="${x}" y="${y + 48}" text-anchor="middle">${cap}</text>` : ""),
  gw: (x, y) => `<path d="M${x} ${y - 26} L${x + 26} ${y} L${x} ${y + 26} L${x - 26} ${y} Z" class="s"/>` +
    `<path d="M${x} ${y - 12} V${y + 12} M${x - 12} ${y} H${x + 12}" class="f" style="stroke-width:4"/>`,
  flow: (pts, cls = "f") => `<path d="M${pts.map((p) => p.join(" ")).join(" L")}" class="${cls}" marker-end="url(#ah)"/>`,
  tok: (pts, dur, g) => `<circle r="12" class="tok ${g ? "g" : ""}"><animateMotion dur="${dur}s" repeatCount="indefinite" path="M${pts.map((p) => p.join(" ")).join(" L")}"/></circle>`,
  pool: (y, h, title) => `<rect x="0" y="${y}" width="1760" height="${h}" class="pool"/><line x1="44" y1="${y}" x2="44" y2="${y + h}" class="pool"/>` +
    `<text class="ptitle" transform="translate(28,${y + h / 2}) rotate(-90)" text-anchor="middle">${title}</text>`,
  lane: (y, h, title) => `<rect x="44" y="${y}" width="1716" height="${h}" class="lane"/>` +
    `<text class="ltitle" transform="translate(72,${y + h / 2}) rotate(-90)" text-anchor="middle">${title}</text>`,
  end: (x, y, cap) => `<circle cx="${x}" cy="${y}" r="20" class="s" style="stroke-width:5"/><text x="${x}" y="${y + 48}" text-anchor="middle">${cap}</text>`,
};

const MARKS = [[150, "06:00"], [520, "09:00"], [1000, "17:30"], [1450, "19:00"], [1660, "23:00"]];

const ruler = () => MARKS.map(([x, t]) =>
  `<line x1="${x}" y1="38" x2="${x}" y2="760" class="mark"/><text x="${x}" y="24" text-anchor="middle" class="marklabel">${t}</text>`).join("");

const J = 130;

function janPool() {
  const tasks = B.task(410, J, 140, 64, "Rebook\nslots") + B.flow([[480, J], [520, J]]) +
    B.task(730, J, 420, 64, "Meetings ×8, no prep") + B.flow([[940, J], [1000, J]]) +
    B.task(1100, J, 200, 64, "Driving:\nmusic school") + B.flow([[1200, J], [1430, J]]) +
    B.task(1520, J, 180, 64, "Labs,\nLive Viva") + B.flow([[1610, J], [1638, J]]);
  return B.tok([[290, J], [1660, J]], 16, true) +
    `<g class="jan">` + B.ev(290, J, "07:30") + B.flow([[310, J], [340, J]]) + tasks + B.end(1660, J, "23:00") + `</g>`;
}

const O = { A: 300, U: 405, M: 500, D: 595, R: 700, g1: 210, g2: 1340, end: 1450 };

function octAgents() {
  const { A, U, M, g1, g2 } = O;
  return B.flow([[g1, M - 26], [g1, A], [265, A]]) + B.task(340, A, 150, 64, "Write\nthe page", "service") +
    B.flow([[415, A], [460, A], [460, U - 28]]) + B.task(460, U, 110, 56, "Read\npage", "touch") + badge(515, U - 28, 1) +
    B.flow([[515, U], [538, U], [538, A], [560, A]]) + B.task(750, A, 380, 64, "Prep 1:1s · drafts · agendas", "service") +
    B.flow([[940, A], [1030, A], [1030, U - 28]]) + B.task(1030, U, 140, 56, "Review\ndrafts", "touch") + badge(1100, U - 28, 2) +
    B.flow([[1100, U], [g2, U], [g2, M - 26]]);
}

function octMe() {
  const { M, g1, g2 } = O;
  return B.flow([[g1 + 26, M], [520, M]]) + B.task(730, M, 420, 64, "Meetings ×8, prepared") +
    B.flow([[940, M], [1000, M]]) + B.task(1100, M, 200, 64, "Driving:\nmusic school") +
    B.flow([[1200, M], [g2 - 26, M]]);
}

function octBackground() {
  const { R, D, M, g1, g2 } = O;
  return B.flow([[g1, M + 26], [g1, R], [265, R]]) + B.task(612, R, 694, 64, "Refactoring · Live Viva · labs", "service") +
    B.flow([[959, R], [1150, R], [1150, D + 28]]) + `<text x="1055" y="${R - 14}" text-anchor="middle" class="q">a question</text>` +
    B.task(1150, D, 160, 56, "Answer\nfrom phone", "touch") + badge(1230, D - 28, 3) + B.flow([[1230, D], [g2, D], [g2, M + 26]]);
}

function octTokens() {
  const { A, U, M, D, R, g1, g2, end } = O;
  return B.tok([[150, M], [end, M]], 8) +
    B.tok([[150, M], [g1, M], [g1, A], [460, A], [460, U], [538, U], [538, A], [1030, A], [1030, U], [g2, U], [g2, M], [end, M]], 8) +
    B.tok([[150, M], [g1, M], [g1, R], [1150, R], [1150, D], [g2, D], [g2, M], [end, M]], 8);
}

const evening = () =>
  `<path d="M1540 420 H1520 V580 H1540" class="annot"/><text x="1550" y="490" class="note">The evening:</text><text x="1550" y="524" class="note i">mine again</text>`;

function octPool() {
  const { M, g1, g2, end } = O;
  const timer = B.ev(150, M, "06:00") + `<circle cx="150" cy="${M}" r="14" class="f" style="stroke-width:1.5"/><path d="M150 ${M - 10} V${M} L157 ${M + 5}" class="f"/>`;
  return B.lane(240, 120, "Agents") + B.lane(360, 280, "Me") + B.lane(640, 120, "Mac mini") + B.pool(240, 520, "OCTOBER") + octTokens() +
    timer + B.flow([[170, M], [g1 - 26, M]]) + B.gw(g1, M) + octAgents() + octMe() + octBackground() +
    B.gw(g2, M) + B.flow([[g2 + 26, M], [end - 22, M]]) + B.end(end, M, "19:00") + evening();
}

function bpmn() {
  const defs = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#131313"/></marker></defs>`;
  return defs + ruler() + B.pool(60, 140, "JANUARY") + janPool() + octPool();
}

const SESSIONS = ["nuo · second brain", "Visma Finance · refactoring", "Live Viva", "Kids' learning app", "Vilnius Tech · labs", "This deck"];

const device = {
  mini: (x, y) => `<rect x="${x - 170}" y="${y - 55}" width="340" height="110" rx="26" class="dev"/>` +
    `<circle cx="${x + 145}" cy="${y - 32}" r="6" class="led"/>`,
  laptop: (x, y) => `<rect x="${x - 140}" y="${y - 190}" width="280" height="180" rx="12" class="dev"/>` +
    `<path d="M${x - 180} ${y} H${x + 180} L${x + 160} ${y + 16} H${x - 160} Z" class="dev"/>`,
  phone: (x, y) => `<rect x="${x - 58}" y="${y - 115}" width="116" height="230" rx="24" class="dev"/>` +
    `<rect x="${x - 18}" y="${y - 100}" width="36" height="8" rx="4" class="notch"/>`,
};

const caption = (x, y, name, role) =>
  `<text x="${x}" y="${y}" text-anchor="middle" class="dname">${name}</text>` +
  `<text x="${x}" y="${y + 36}" text-anchor="middle" class="drole">${role}</text>`;

const session = (label, i) => {
  const x = 480 + (i % 3) * 400, y = 40 + Math.floor(i / 3) * 96;
  return `<line x1="${x}" y1="${y + 32}" x2="880" y2="275" class="wire"/>` +
    `<rect x="${x - 180}" y="${y - 32}" width="360" height="64" rx="12" class="sess"/>` +
    `<circle cx="${x - 150}" cy="${y}" r="8" class="dot"/>` +
    `<text x="${x - 128}" y="${y + 8}" class="slabel">${label}</text>`;
};

const pulse = (pts, dur, delay) =>
  `<circle r="9" class="dot"><animateMotion dur="${dur}s" begin="${delay}s" repeatCount="indefinite" path="M${pts.map((p) => p.join(" ")).join(" L")}"/></circle>`;

const ICON_PATHS = {
  "gmail": "M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z",
  "slack": "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z",
  "googledrive": "M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z",
  "googlecalendar": "M18.316 5.684H24v12.632h-5.684V5.684zM5.684 24h12.632v-5.684H5.684V24zM18.316 5.684V0H1.895A1.894 1.894 0 0 0 0 1.895v16.421h5.684V5.684h12.632zm-7.207 6.25v-.065c.272-.144.5-.349.687-.617s.279-.595.279-.982c0-.379-.099-.72-.3-1.025a2.05 2.05 0 0 0-.832-.714 2.703 2.703 0 0 0-1.197-.257c-.6 0-1.094.156-1.481.467-.386.311-.65.671-.793 1.078l1.085.452c.086-.249.224-.461.413-.633.189-.172.445-.257.767-.257.33 0 .602.088.816.264a.86.86 0 0 1 .322.703c0 .33-.12.589-.36.778-.24.19-.535.284-.886.284h-.567v1.085h.633c.407 0 .748.109 1.02.327.272.218.407.499.407.843 0 .336-.129.614-.387.832s-.565.327-.924.327c-.351 0-.651-.103-.897-.311-.248-.208-.422-.502-.521-.881l-1.096.452c.178.616.505 1.082.977 1.401.472.319.984.478 1.538.477a2.84 2.84 0 0 0 1.293-.291c.382-.193.684-.458.902-.794.218-.336.327-.72.327-1.149 0-.429-.115-.797-.344-1.105a2.067 2.067 0 0 0-.881-.689zm2.093-1.931l.602.913L15 10.045v5.744h1.187V8.446h-.827l-2.158 1.557zM22.105 0h-3.289v5.184H24V1.895A1.894 1.894 0 0 0 22.105 0zm-3.289 23.5l4.684-4.684h-4.684V23.5zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0v3.289z"
};

const SOURCES = [["Gmail", "gmail"], ["Slack", "slack"], ["Drive", "googledrive"], ["Calendar", "googlecalendar"]];
const SRC_Y = 610, BUS_Y = 540, MINI = { x: 880, y: 330 };

const source = ([label, key], i) => {
  const x = 430 + i * 300;
  return `<line x1="${x}" y1="${BUS_Y}" x2="${x}" y2="${SRC_Y - 30}" class="feed" marker-end="url(#rah)"/>` +
    `<rect x="${x - 110}" y="${SRC_Y - 28}" width="220" height="56" rx="28" class="src"/>` +
    `<svg x="${x - 84}" y="${SRC_Y - 15}" width="30" height="30" viewBox="0 0 24 24"><path d="${ICON_PATHS[key]}" class="srcicon"/></svg>` +
    `<text x="${x + 18}" y="${SRC_Y + 9}" text-anchor="middle" class="srclabel">${label}</text>`;
};

const bus = () => `<line x1="430" y1="${BUS_Y}" x2="1330" y2="${BUS_Y}" class="feed"/>` +
  `<line x1="${MINI.x}" y1="${MINI.y + 55}" x2="${MINI.x}" y2="${BUS_Y}" class="feed"/>` +
  `<text x="0" y="${SRC_Y + 9}" class="drole">agents connect to</text>`;

const rigDefs = () => `<defs><marker id="rah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#131313"/></marker></defs>`;

function rig() {
  const link = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="link"/>`;
  const L = [[420, 330], [710, 330]], P = [[1050, 330], [1440, 330]];
  return rigDefs() + bus() + SOURCES.map(source).join("") + SESSIONS.map(session).join("") +
    link(...L) + link(...P) + pulse([L[1], L[0]], 2.4, 0) + pulse([P[1], P[0]], 2.4, 1.2) + pulse([P[0], P[1]], 2.4, 0.4) +
    device.mini(MINI.x, MINI.y) + `<text x="${MINI.x}" y="${MINI.y - 2}" text-anchor="middle" class="dname">Mac mini</text><text x="${MINI.x}" y="${MINI.y + 32}" text-anchor="middle" class="drole">always on, runs the agents</text>` +
    device.laptop(240, 380) + caption(240, 500, "MacBook", "start a task, review") +
    device.phone(1520, 340) + caption(1520, 500, "iPhone", "status, questions, permissions");}

document.getElementById("cal-jan").innerHTML = janCalendar();
document.getElementById("rig").innerHTML = rig();
document.getElementById("cal-oct").innerHTML = octCalendar();
document.getElementById("role-list").innerHTML = roles();
document.getElementById("bp").innerHTML = bpmn();

