const Hats = (() => {
  const BOARD = { x: 3975, y: -4400 };
  const PAGE = { x: BOARD.x + 2600, y: BOARD.y };
  const GRID = { left: 80, top: 300, w: 410, h: 340, gap: 40 };
  const HOPS = [2, 0, 5, 1, 6, 3, 2, 7, 4, 1];

  const HATS = [
    { title: "Architect", lines: ["Visma Finance team"], file: "work/" },
    { title: "Development Department Manager", lines: ["Business Group: partners, budgets"], file: "work/business-group.md" },
    { title: "Coach", lines: ["20 direct coachees", "monthly 1:1s"], file: "people/ · 36 hubs" },
    { title: "Operational Group", lines: ["member"], file: "work/" },
    { title: "Work council", lines: ["member"], file: "work/" },
    { title: "Academic", lines: ["Vilnius Tech lecturer", "Academic committee"], file: "university/" },
    { title: "“Taxi driver”", lines: ["music school, dance,", "English, swimming pool"], file: "calendar" },
    { title: "Builder", lines: ["DIY projects,", "educational tools and apps"], file: "personal/" },
  ];

  const TIMELINE = [
    { at: "06:00", who: "Collector", what: "gathers mail and calendar into one feed" },
    { at: "06:30", who: "Composer", what: "writes one page: Top 3, prep for every meeting, a few questions" },
    { at: "09:00", who: "Me", what: "read one page, answer a few sentences", me: true },
    { at: "12:00", who: "Refresh", what: "the page updates in place for the afternoon" },
  ];

  const cell = (i) => ({
    left: GRID.left + (i % 4) * (GRID.w + GRID.gap),
    top: GRID.top + Math.floor(i / 4) * (GRID.h + GRID.gap),
  });

  const hat = (h, i) => {
    const { left, top } = cell(i);
    const lines = h.lines.map((l) => `<span>${l}</span>`).join("");
    return `<div class="hat" style="left:${left}px;top:${top}px;width:${GRID.w}px;height:${GRID.h}px;--i:${i}">` +
      `<b class="hat-n">${i + 1}</b><h2>${h.title}</h2><p>${lines}</p><code class="chip">${h.file}</code></div>`;
  };

  const board = () =>
    `<div id="board" style="transform:translate(${BOARD.x - 960}px,${BOARD.y - 540}px)">` +
    HATS.map(hat).join("") + `<div id="hopper"></div></div>`;

  const header = (s) =>
    `<div class="head"><div class="kicker">${s.kicker}</div><h1>${s.title}</h1>${s.text ? `<p>${s.text}</p>` : ""}</div>`;

  const row = (r) =>
    `<li class="${r.me ? "me" : ""}"><time>${r.at}</time><b>${r.who}</b><span>${r.what}</span></li>`;

  const timeline = (s) => header(s) + `<ol class="timeline">${TIMELINE.map(row).join("")}</ol>`;

  const centerCard = (s) =>
    `<div class="card center ${s.tone || ""}"><div class="kicker">${s.kicker}</div><h1>${s.title}</h1><p>${s.text}</p></div>`;

  const steps = [
    { id: "cover", ...BOARD, scale: 1, html: centerCard,
      kicker: "Project Dune · show and tell", title: "Manager in the AI era",
      text: "January 2026 vs October 2026: what changed when a second brain of agents started working for me.<br><span class='who'>Tomasz Szturo</span>",
      notes: "Part 1 is the simple story. Part 2 is the same day drawn as a BPMN process." },
    { id: "hats", ...BOARD, scale: 1, html: header,
      kicker: "My week", title: "Eight hats, one head",
      notes: "Walk the eight quickly. The point is the count, not the details." },
    { id: "before", ...BOARD, scale: 1, html: header,
      kicker: "January 2026", title: "I was the scheduler",
      text: "Refactoring the calendar: move a meeting, book a slot for a task, rebook it when the day breaks.",
      notes: "The dot is me. Every hop is a context switch, and the context of the last hat stays behind." },
    { id: "cost", ...BOARD, scale: 1, html: centerCard, tone: "bad",
      kicker: "January 2026 · the bill", title: "Overtime. Evenings on side tasks.<br>A task list that only grows.",
      text: "The work did not fit into the day, so it moved into the evening.",
      notes: "Pause. Everyone in the room knows this one." },
    { id: "brain", ...BOARD, scale: 1, html: header,
      kicker: "October 2026 · second brain", title: "Every hat has its own memory",
      text: "Plain markdown files that agents read and write. The context lives outside my head.",
      notes: "Chips are real folders in the vault. 36 people hubs is a real count." },
    { id: "page", ...PAGE, scale: 1, html: timeline,
      kicker: "October 2026 · proactivity", title: "The day starts with a page, not a ping",
      notes: "Real schedule from the jobs file. Nothing here asks me to fill in a form." },
    { id: "parallel", ...BOARD, scale: 1, html: header,
      kicker: "October 2026 · parallelism", title: "Every hat moves, not only the one I wear",
      text: "The work happens before my first meeting and between them, so meetings stop costing me the prep.",
      notes: "Key line of part 1. Pause here." },
  ];

  let hop = null;

  const startHopper = () => {
    const frames = HOPS.map((i) => {
      const { left, top } = cell(i);
      return { transform: `translate(${left + GRID.w - 70}px,${top + 30}px)` };
    });
    hop = document.getElementById("hopper").animate([...frames, frames[0]], {
      duration: 900 * HOPS.length, iterations: Infinity, easing: "steps(1, end)",
    });
  };

  const stopHopper = () => { if (hop) hop.cancel(); hop = null; };

  const enter = (id) => { stopHopper(); if (id === "before") startHopper(); };

  return { board, steps, enter };
})();
