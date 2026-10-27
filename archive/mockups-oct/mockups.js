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

const CHIPS = {
  "1:1 · Coachee A": "prep ready",
  "1:1 · Coachee B": "prep ready",
  "1:1 · Coachee C": "open items ready",
  "Martijn · PlusPort": "agenda drafted",
  "1:1 · Agnius": "week summary",
  "Business Group": "budget notes",
  "Taxi: music school, 2 kids": "2 questions answered by phone",
};

function mockA() {
  const g = grid(6, 23, 46, 1000);
  const meetings = MEETINGS.map((m) => ({ ...m, chip: CHIPS[m.title] }));
  const agents = [
    { from: "06:00", to: "07:00", title: "Morning page written", cls: "agent" },
    { from: "07:30", to: "08:15", title: "Labs and Live Viva: agents working", cls: "agent" },
    { from: "12:00", to: "13:00", title: "Refactoring: running since 07:00, never moved", cls: "agent" },
  ];
  const evening = [{ from: "20:00", to: "20:45", title: "Review what the agents built", cls: "over", note: "Live Viva, labs" }];
  return g.html + [...meetings, ...agents, ...evening].map((e) => g.box(e, 0, 1000)).join("") +
    `<div class="evening" style="top:${g.y("21:15")}px">The evening is <span class="i">mine again.</span></div>`;
}

function mockB() {
  const g = grid(6, 23, 42, 1680);
  const me = MEETINGS.filter((m) => !m.title.startsWith("Taxi")).map((m) => g.box(m, 0, 740)).join("") +
    g.box({ from: "17:30", to: "19:00", title: "Taxi: music school, 2 kids" }, 0, 740) +
    `<div class="ask" style="left:${80 + 380}px;top:${g.y("17:45")}px"><b>▸</b>Approve the migration?</div>` +
    `<div class="ask" style="left:${80 + 380}px;top:${g.y("18:15")}px"><b>▸</b>Keep the old API?</div>` +
    g.box({ from: "20:00", to: "20:40", title: "Review what the agents built", cls: "over" }, 0, 740);
  const quick = [
    { from: "06:00", to: "07:00", title: "Morning page" },
    { from: "09:30", to: "10:00", title: "Prep: Coachee A, B" },
    { from: "13:00", to: "14:30", title: "Draft 6 replies, PlusPort agenda" },
    { from: "15:00", to: "15:30", title: "Prep: Coachee C" },
    { from: "16:00", to: "16:30", title: "Week summary" },
  ].map((e) => g.box({ ...e, cls: "agent" }, 820, 420)).join("");
  const run = (left, from, to, label) =>
    `<div class="bar" style="left:${80 + left}px;top:${g.y(from)}px;width:130px;height:${g.y(to) - g.y(from) - 3}px">${label}</div>`;
  const runs = run(1250, "07:00", "19:00", "Refactoring") + run(1400, "09:00", "17:00", "Live Viva") + run(1550, "13:00", "16:00", "Labs");
  const heads = `<div class="lanehead" style="left:80px">Me</div><div class="lanehead p" style="left:${80 + 820}px">Agents</div><div class="lanehead p" style="left:${80 + 1250}px">Long runs</div>`;
  return g.html + heads + me + quick + runs +
    `<div class="evening" style="top:${g.y("21:15")}px">The evening is <span class="i">mine again.</span></div>`;
}

const C = { me: 0, meW: 700, ag: 780, agW: 420, runs: [1280, 1420, 1560], runW: 120, px: 43 };

function mockC() {
  const g = grid(6, 23, C.px, 1680);
  const h = (e) => Math.max(g.y(e.to) - g.y(e.from) - 3, 34);
  const mid = (e) => g.y(e.from) + h(e) / 2;
  const box = (e, left, w, cls, badge) =>
    `<div class="ev ${cls || ""}" style="top:${g.y(e.from)}px;left:${80 + left}px;width:${w}px;height:${h(e)}px"><b>${e.title}</b>${badge ? `<span class="badge">${badge}</span>` : ""}</div>`;

  const read = { from: "07:00", to: "07:40", title: "Read the page" };
  const review = { from: "12:00", to: "12:40", title: "Review drafts" };
  const meet = Object.fromEntries(MEETINGS.map((m) => [m.title, m]));
  const taxi = meet["Taxi: music school, 2 kids"];
  const me = MEETINGS.filter((m) => m !== taxi).map((m) => box(m, C.me, C.meW)).join("") +
    box(read, C.me, C.meW, "touch", 1) + box(review, C.me, C.meW, "touch", 2) + box(taxi, C.me, C.meW, "touch", 3) +
    `<div class="qs" style="left:${80 + 340}px;top:${g.y("17:33")}px"><i>▸</i>Approve the migration?<br><i>▸</i>Keep the old API?</div>`;

  const agents = [
    [{ from: "06:00", to: "07:00", title: "Morning page" }, [read]],
    [{ from: "09:10", to: "09:55", title: "Prep: Coachee A, B" }, [meet["1:1 · Coachee A"], meet["1:1 · Coachee B"]]],
    [{ from: "10:45", to: "11:45", title: "Draft 6 replies" }, [review]],
    [{ from: "13:40", to: "14:25", title: "PlusPort agenda" }, [meet["Martijn · PlusPort"]]],
    [{ from: "14:45", to: "15:25", title: "Prep: Coachee C" }, [meet["1:1 · Coachee C"]]],
    [{ from: "15:50", to: "16:25", title: "Week summary" }, [meet["1:1 · Agnius"]]],
  ];
  const agentBoxes = agents.map(([e]) => box(e, C.ag, C.agW, "agentc")).join("");
  const wire = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} C${x1 - 40} ${y1} ${x2 + 40} ${y2} ${x2} ${y2}" class="w" marker-end="url(#pa)"/>`;
  const wires = agents.flatMap(([e, targets]) => targets.map((t) => wire(80 + C.ag, mid(e), 80 + C.meW + 6, mid(t)))).join("");

  const runs = [["Refactoring", "07:00", "19:00"], ["Live Viva", "08:00", "17:00"], ["Labs", "13:00", "18:00"]]
    .map(([t, from, to], i) => `<div class="runbar2" style="left:${80 + C.runs[i]}px;top:${g.y(from)}px;width:${C.runW}px;height:${g.y(to) - g.y(from) - 3}px">${t}</div>`).join("");
  const askY = g.y("17:50");
  const ask = `<circle cx="${80 + C.runs[0]}" cy="${askY}" r="9" class="d"/>` + wire(80 + C.runs[0], askY, 80 + C.meW + 6, mid(taxi));

  const svg = `<svg class="wires" width="1760" height="760"><defs><marker id="pa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#7f56fa"/></marker></defs>${wires}${ask}</svg>`;
  const tint = `<div class="tint" style="left:${80 + C.ag - 20}px;width:${1680 - C.ag + 20}px;height:${g.y("23:00")}px"></div>`;
  const heads = `<div class="lanehead" style="left:80px">Me</div><div class="lanehead p" style="left:${80 + C.ag}px">Agents</div><div class="lanehead p" style="left:${80 + C.runs[0]}px">Long runs · Mac mini</div>`;
  const eve = `<div class="eve2" style="top:${g.y("20:15")}px">The evening is <span class="i">mine again.</span><small>Labs and Live Viva moved into the day. Agents carried them.</small></div>`;
  return tint + g.html + heads + svg + me + agentBoxes + runs + eve;
}

document.getElementById("cal-c").innerHTML = mockC();
document.getElementById("cal-a").innerHTML = mockA();
document.getElementById("cal-b").innerHTML = mockB();

const only = location.search.slice(1);
if (only) {
  document.body.classList.add("single");
  document.getElementById(only).classList.add("on");
}
