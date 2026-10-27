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
  { from: "20:30", to: "23:00", title: "Refactoring. Inbox. Follow-ups.", cls: "over", note: "overtime" },
];

const OCT_CHIPS = {
  "1:1 · Coachee A": "prep ready",
  "1:1 · Coachee B": "prep ready",
  "1:1 · Coachee C": "prep ready",
  "Martijn · PlusPort": "agenda drafted",
  "1:1 · Agnius": "week summary",
  "Business Group": "budget notes",
};

const AGENTS = [
  { from: "06:00", to: "07:00", title: "Scan everything, write the page", cls: "agent" },
  { from: "10:45", to: "11:00", title: "Debrief A: 4 questions", cls: "agent" },
  { from: "11:45", to: "12:15", title: "Debrief B, file answers", cls: "agent" },
  { from: "13:00", to: "14:30", title: "Draft 12 replies", cls: "agent" },
  { from: "16:15", to: "16:30", title: "Debrief C", cls: "agent" },
];

function janCalendar() {
  const meetings = MEETINGS.map((m) => ({ ...m, note: JAN_NOTES[m.title] }));
  return hours(1000) + [...meetings, ...JAN_EXTRA].map((e) => ev(e, 0, 1000)).join("");
}

function octCalendar() {
  const meetings = MEETINGS.map((m) => ({ ...m, chip: OCT_CHIPS[m.title] }));
  const runTop = ypos("07:00"), runH = ypos("19:00") - runTop;
  const run = `<div class="runbar" style="left:${80 + 640}px;top:${runTop}px;height:${runH}px"></div>` +
    `<div class="runlabel" style="left:${80 + 660}px;top:${ypos("07:30")}px">Refactoring the services, all day</div>`;
  const ping = (t, text) => `<div class="ping" style="left:${80 + 714}px;top:${ypos(t) - 12}px"><i></i>${text}</div>`;
  return hours(1100) +
    `<div class="colhead" style="left:80px">Me</div><div class="colhead p" style="left:${80 + 640}px">Agents</div>` +
    meetings.map((e) => ev(e, 0, 600)).join("") + run +
    AGENTS.map((e) => ev(e, 720, 380)).join("") +
    ping("17:50", "Approve the migration step?") + ping("18:30", "Keep the old API contract?") +
    `<div class="free" style="top:${ypos("20:15")}px">The evening is <span class="i">mine again.</span></div>`;
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

const roles = () => ROLES.map(([t, x, cls = ""]) =>
  `<div class="role ${cls}"><span class="t">${t}</span><span class="x">${x}</span></div>`).join("");

const B = {
  task: (x, y, w, h, t, cls = "s") => `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="10" class="${cls}"/>` +
    t.split("\n").map((l, i, a) => `<text x="${x}" y="${y + (i - (a.length - 1) / 2) * 27 + 8}" text-anchor="middle">${l}</text>`).join(""),
  ev: (x, y, cap, extra = "") => `<circle cx="${x}" cy="${y}" r="20" class="s" ${extra}/>` + (cap ? `<text x="${x}" y="${y + 48}" text-anchor="middle">${cap}</text>` : ""),
  gw: (x, y, plus) => `<path d="M${x} ${y - 26} L${x + 26} ${y} L${x} ${y + 26} L${x - 26} ${y} Z" class="s"/>` +
    (plus ? `<path d="M${x} ${y - 12} V${y + 12} M${x - 12} ${y} H${x + 12}" class="f" style="stroke-width:4"/>`
      : `<path d="M${x - 9} ${y - 9} L${x + 9} ${y + 9} M${x + 9} ${y - 9} L${x - 9} ${y + 9}" class="f" style="stroke-width:4"/>`),
  flow: (pts, cls = "f") => `<path d="M${pts.map((p) => p.join(" ")).join(" L")}" class="${cls}" marker-end="url(#ah)"/>`,
  tok: (x, y, g) => `<circle cx="${x}" cy="${y}" r="12" class="tok ${g ? "g" : ""}"/>`,
  pool: (y, h, title) => `<rect x="0" y="${y}" width="1760" height="${h}" class="pool"/><line x1="44" y1="${y}" x2="44" y2="${y + h}" class="pool"/>` +
    `<text class="ptitle" transform="translate(28,${y + h / 2}) rotate(-90)" text-anchor="middle">${title}</text>`,
  lane: (y, h, title) => `<rect x="44" y="${y}" width="1716" height="${h}" class="lane"/>` +
    `<text class="ltitle" transform="translate(72,${y + h / 2}) rotate(-90)" text-anchor="middle">${title}</text>`,
};

function janPool() {
  const jy = 90, w = 150;
  const labels = ["Standup", "1:1 ×3", "Business\nGroup", "PlusPort", "1:1 Agnius", "Music\nschool"];
  const jx = (i) => 260 + i * 200;
  const tasks = labels.map((t, i) => B.task(jx(i), jy, w, 76, t) +
    B.flow([[jx(i) + w / 2, jy], [i < 5 ? jx(i + 1) - w / 2 : 1395, jy]])).join("");
  return `<g class="jan">` + B.ev(130, jy, "07:30") + B.flow([[150, jy], [jx(0) - w / 2, jy]]) + tasks +
    B.task(1500, jy, 210, 76, "Refactoring,\ninbox, follow-ups") + B.flow([[1605, jy], [1658, jy]]) +
    `<circle cx="1680" cy="${jy}" r="20" class="s" style="stroke-width:5"/><text x="1680" y="${jy + 48}" text-anchor="middle">23:00</text></g>` +
    B.tok(1362, jy, true);
}

function octPool() {
  const ROW = 272, ANS = 372, RUN = 490, AG = 615, g1 = 260, g2 = 1480;
  const me = B.flow([[g1, RUN - 26], [g1, ROW], [330, ROW]]) + B.task(420, ROW, 180, 76, "Read\none page") +
    B.flow([[510, ROW], [580, ROW]]) + B.task(700, ROW, 240, 76, "Meetings ×8") +
    B.flow([[820, ROW], [900, ROW]]) + B.task(990, ROW, 180, 76, "Music\nschool") +
    B.flow([[1080, ROW], [g2, ROW], [g2, RUN - 26]]);
  const run = B.flow([[g1 + 26, RUN], [330, RUN]]) + B.task(640, RUN, 620, 76, "Refactoring: splitting the services", "run") +
    B.flow([[950, RUN], [1250, RUN], [1250, ANS + 38]]) + `<text x="1100" y="${RUN - 16}" text-anchor="middle" class="q">a question</text>` +
    B.task(1250, ANS, 200, 76, "Answer from\nmy phone") + B.flow([[1350, ANS], [1400, ANS], [1400, RUN], [g2 - 26, RUN]]);
  const ag = B.flow([[g1, RUN + 26], [g1, AG], [330, AG]]) + B.task(430, AG, 200, 76, "Scan and\nwrite the page") +
    B.flow([[530, AG], [600, AG]]) + B.task(710, AG, 220, 76, "Prep and\ndebriefs") +
    B.flow([[820, AG], [900, AG]]) + B.task(1000, AG, 200, 76, "Draft\nreplies") +
    B.flow([[1100, AG], [g2, AG], [g2, RUN + 26]]);
  const timer = B.ev(150, RUN, "06:00") + `<circle cx="150" cy="${RUN}" r="14" class="f" style="stroke-width:1.5"/><path d="M150 ${RUN - 10} V${RUN} L157 ${RUN + 5}" class="f"/>`;
  const end = B.flow([[g2 + 26, RUN], [1658, RUN]]) + `<circle cx="1680" cy="${RUN}" r="20" class="s" style="stroke-width:5"/><text x="1680" y="${RUN + 48}" text-anchor="middle">19:00</text>`;
  return B.lane(220, 210, "Me") + B.lane(430, 120, "Background") + B.lane(550, 130, "Agents") + B.pool(220, 460, "OCTOBER") +
    timer + B.flow([[170, RUN], [g1 - 26, RUN]]) + B.gw(g1, RUN, true) + me + run + ag + B.gw(g2, RUN, true) + end +
    B.tok(860, ROW) + B.tok(1250, (RUN + ANS + 38) / 2) + B.tok(565, AG);
}

function bpmn() {
  const defs = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#131313"/></marker></defs>`;
  return defs + B.pool(0, 180, "JANUARY") + janPool() + octPool();
}

document.getElementById("cal-jan").innerHTML = janCalendar();
document.getElementById("cal-oct").innerHTML = octCalendar();
document.getElementById("roles").innerHTML = roles();
document.getElementById("bp").innerHTML = bpmn();

const only = location.search.slice(1);
const scale = () => only ? Math.min(innerWidth / 1920, innerHeight / 1080) : Math.min(1, (innerWidth - 80) / 1920);
const fit = () => document.querySelectorAll(".slide").forEach((s) => { s.style.zoom = scale(); });
if (only) {
  document.body.classList.add("single");
  document.getElementById(only).classList.add("on");
}
addEventListener("resize", fit);
fit();
