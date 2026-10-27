const { el, label, task, event, gateway, dataObject, flow, assoc, pool, lane, defs, path } = Bpmn;

const X = (i) => 1800 * i;
const A = (i) => X(i) + 250;
const BY = -950;
const ME = 525;
const AG = 1000;
const SB = 1475;
const WORLD = { x: 600, y: -1800, w: 6800, h: 3700 };
const END_X = 6450;

const ROLES = ["Head of Eng", "Coach", "Architect", "Lecturer", "Builder"];
const tokens = {};

function before1() {
  const ax = A(1);
  const ys = [BY - 180, BY, BY + 180];
  const names = ["Ping", "Email", "Invite"];
  const routes = ys.map((y) => [[ax - 222, y], [ax - 80, y], [ax - 80, BY], [ax + 20, BY]]);
  tokens.b1 = routes.map((r) => ({ d: path(r), dur: 1.6 }));
  return {
    svg: ys.map((y, i) => event(ax - 250, y, { icon: "message", text: names[i] })).join("") +
      routes.map((r) => flow(r, "bf")).join("") +
      task(ax + 120, BY, 200, 110, "React", { kind: "user" }),
    out: [ax + 220, BY],
  };
}

function now1() {
  const ax = A(1);
  const route = [[ax - 172, AG], [ax + 30, AG]];
  tokens.n1 = [{ d: path([[ax - 200, AG], [ax + 30, AG], [ax + 150, AG]]), dur: 1.4 }];
  return {
    svg: event(ax - 200, AG, { icon: "timer", text: "06:00\nweekdays" }) +
      flow(route, "nf") +
      task(ax + 150, AG, 240, 120, "Collector", { kind: "service" }) +
      label(ax + 150, AG - 110, "mail · Slack · calendar · Drive", "lbl small mono") +
      assoc([[ax + 150, AG + 60], [ax + 150, SB - 66]]) +
      label(ax + 180, AG + 170, "feeds/", "lbl small mono start"),
    out: [ax + 270, AG],
  };
}

function before2(prev) {
  const ax = A(2);
  const loop = [[ax + 130, BY - 30], [ax + 330, BY - 30], [ax + 330, BY - 300], [ax - 330, BY - 300], [ax - 330, BY - 30], [ax - 130, BY - 30]];
  tokens.b2 = [{ d: path(loop), dur: 3.2, repeat: true }];
  return {
    svg: flow([prev, [ax - 130, BY]], "bf") +
      task(ax, BY, 260, 120, "Refactor\nthe calendar", { kind: "user", loop: true }) +
      flow(loop, "bf loop") +
      label(ax + 350, BY - 165, "move meetings", "lbl hand start") +
      label(ax, BY - 330, "book slots for tasks", "lbl hand") +
      label(ax - 350, BY - 165, "rebook", "lbl hand end"),
    out: [ax + 130, BY],
  };
}

function now2(prev) {
  const ax = A(2);
  const toMe = [[ax - 40, AG], [ax + 60, AG], [ax + 60, ME], [ax + 90, ME]];
  tokens.n2 = [{ d: path([prev, [ax - 150, AG], ...toMe, [ax + 250, ME]]), dur: 2.4 }];
  return {
    svg: flow([prev, [ax - 260, AG]], "nf") +
      task(ax - 150, AG, 220, 110, "Composer", { kind: "service" }) +
      label(ax - 150, AG + 90, "06:30", "lbl small mono") +
      dataObject(ax - 150, AG - 215, "") +
      label(ax - 110, AG - 215, "Today's brief", "lbl small start") +
      assoc([[ax - 150, AG - 55], [ax - 150, AG - 182]]) +
      assoc([[ax - 150, AG + 110], [ax - 150, SB - 72]]) +
      label(ax - 120, AG + 200, "daily/ · tasks", "lbl small mono start") +
      flow(toMe, "nf") +
      task(ax + 250, ME, 320, 120, "Read one page,\nanswer a few sentences", { kind: "user", cls: "me" }) +
      el("g", { class: "badge-noform" }, el("rect", { x: ax + 290, y: ME - 104, width: 190, height: 50, rx: 25 }) + label(ax + 385, ME - 79, "no form", "lbl")) +
      flow([[ax + 410, ME], [ax + 500, ME], [ax + 500, AG], [ax + 560, AG]], "nf"),
    out: [ax + 560, AG],
  };
}

function before3(prev) {
  const ax = A(3);
  const gw = [ax - 330, BY];
  const ys = [-320, -160, 0, 160, 320].map((d) => BY + d);
  const go = (y) => [[gw[0] + 34, BY], [ax - 200, BY], [ax - 200, y], [ax - 50, y]];
  const back = (y) => [[ax + 170, y], [ax + 300, y], [ax + 300, BY + 380], [gw[0], BY + 380], [gw[0], BY + 34]];
  const visit = (y) => [...go(y), [ax + 60, y], ...back(y)];
  tokens.b3 = [{ d: path([gw, ...visit(ys[0]), ...visit(ys[2]), ...visit(ys[4]), ...visit(ys[1])]), dur: 9, repeat: true }];
  return {
    svg: flow([prev, [gw[0] - 34, BY]], "bf") +
      gateway(gw[0], gw[1], "x", { text: "Which hat now?" }) +
      ys.map((y) => flow(go(y), "bf")).join("") +
      ys.map((y, i) => task(ax + 60, y, 220, 80, ROLES[i], { kind: "user" })).join("") +
      ys.map((y) => flow(back(y), "bf")).join("") +
      flow([[ax + 300, BY], [END_X - 28, BY]], "bf") +
      event(END_X, BY, { type: "end", text: "Day ends late" }),
  };
}

function now3(prev) {
  const ax = A(3);
  const gw = [ax - 380, AG];
  const join = [ax + 380, AG];
  const ys = [-240, -120, 0, 120, 240].map((d) => AG + d);
  const branch = (y) => [[gw[0] + 34, AG], [ax - 260, AG], [ax - 260, y], [ax - 90, y], [ax + 130, y], [ax + 300, y], [ax + 300, AG], [join[0] - 34, AG]];
  tokens.n3 = ys.map((y) => ({ d: path([gw, ...branch(y), join]), dur: 3, repeat: true }));
  return {
    svg: flow([prev, [gw[0] - 34, AG]], "nf") +
      gateway(gw[0], gw[1], "+") +
      ys.map((y) => flow(branch(y), "nf")).join("") +
      ys.map((y, i) => task(ax + 20, y, 220, 86, ROLES[i], { kind: "service" })).join("") +
      gateway(join[0], join[1], "+") +
      task(ax + 20, ME, 260, 110, "In meetings", { kind: "user", cls: "me" }) +
      label(ax + 20, AG + 380, "people/ · work/ · university/ · personal/", "lbl small mono") +
      flow([[join[0] + 34, AG], [END_X - 28, AG]], "nf") +
      event(END_X, AG, { type: "end", text: "Day ends" }),
  };
}

function memoryBand() {
  const y = -380, x0 = 1950, x1 = 6600;
  const drops = [2400, 3300, 4100, 4900, 5800].map((x, i) =>
    el("circle", { class: "leak", cx: x, cy: y + 40, r: 9, style: `animation-delay:${i * 0.5}s` })).join("");
  return el("g", { class: "band memory" },
    el("rect", { x: x0, y: y - 40, width: x1 - x0, height: 80, rx: 40, class: "shape" }) +
    label(x0 + 260, y, "My memory", "lbl hand") + drops);
}

function storeBand() {
  const x0 = 1950, x1 = 6600, h0 = 70, h1 = 150;
  const d = `M${x0} ${SB - h0} L${x1} ${SB - h1} A40 ${h1} 0 0 1 ${x1} ${SB + h1} L${x0} ${SB + h0} A40 ${h0} 0 0 1 ${x0} ${SB - h0} Z`;
  return el("g", { class: "band store" },
    el("path", { d, class: "shape" }) +
    el("path", { d: `M${x1} ${SB - h1} A40 ${h1} 0 0 0 ${x1} ${SB + h1}`, class: "shape rim" }) +
    label(x0 + 420, SB, "Vault: the second brain", "lbl strong"));
}

function pools() {
  return pool(1150, -1550, 5650, 1300, "JANUARY 2026 · I was the process engine", "before") +
    pool(1150, 350, 5650, 1300, "OCTOBER 2026 · I am one user task", "now") +
    lane(1240, 350, 5560, 350, "Me") +
    lane(1240, 700, 5560, 600, "Agents") +
    lane(1240, 1300, 5560, 350, "Second brain");
}

function diagram() {
  const b1 = before1(), n1 = now1();
  const b2 = before2(b1.out), n2 = now2(n1.out);
  const b3 = before3(b2.out), n3 = now3(n2.out);
  const body = pools() + memoryBand() + storeBand() +
    el("g", { class: "before-art" }, b1.svg + b2.svg + b3.svg) +
    el("g", { class: "now-art" }, n1.svg + n2.svg + n3.svg);
  return el("svg", {
    id: "world", xmlns: "http://www.w3.org/2000/svg",
    viewBox: `${WORLD.x} ${WORLD.y} ${WORLD.w} ${WORLD.h}`, width: WORLD.w, height: WORLD.h,
    style: `transform: translate(${WORLD.x}px, ${WORLD.y}px)`,
  }, defs() + el("rect", { x: WORLD.x, y: WORLD.y, width: WORLD.w, height: WORLD.h, fill: "url(#grid)" }) + body + el("g", { id: "tokens" }));
}

const CENTER = { x: 3975, y: 50, scale: 3.4 };

const PROCESS_STEPS = [
  { id: "part2", ...CENTER, side: "center", kicker: "Part 2 · for the engineers", title: "The same day,<br>as a process",
    text: "Top pool: January 2026. Bottom pool: October 2026. Watch the token.",
    notes: "Same working day, drawn twice as a BPMN process." },
  { id: "b1", x: X(1), y: BY, scale: 1, pool: "before", tag: "Proactivity", title: "The day starts with someone else's event",
    text: "A ping, an email, an invite. In January, every day began by reacting.",
    notes: "Message start events: other people threw the first event, I caught it." },
  { id: "n1", x: X(1), y: 850, scale: 1.2, pool: "now", tag: "Proactivity", title: "Now a timer fires first",
    text: "06:00 on weekdays, before anyone has asked for anything. A collector agent gathers mail, Slack, calendar and Drive into one feed.",
    notes: "Accuracy if asked: the scheduled collector reads mail, calendar and Drive; Slack comes in through my interactive sessions." },
  { id: "b2", x: X(2), y: BY, scale: 1, pool: "before", tag: "Parallelism", title: "Refactoring the calendar",
    text: "Move a meeting, book a slot for a task, rebook it when the day breaks. Not a step. A loop.",
    notes: "The loop marker is honest: this task never finished, it repeated." },
  { id: "n2", x: X(2), y: 820, scale: 1.2, pool: "now", tag: "Second brain", title: "Now I am one user task",
    text: "At 06:30 a composer agent writes one page. My task: read it, answer a few sentences. In Camunda a user task comes with a form. This one deliberately has none.",
    notes: "Contract rule: nothing here ever asks a human to fill in a file." },
  { id: "b3", x: X(3), y: BY, scale: 1, pool: "before", tag: "Parallelism", title: "Which hat now?",
    text: "Head of engineering, coach, architect, lecturer, builder. One token, an exclusive gateway, a loop back at every context switch.",
    notes: "Let the token bounce for a few seconds before moving on." },
  { id: "n3", x: X(3), y: 850, scale: 1.2, pool: "now", tag: "Parallelism", title: "Agents work while I am in meetings",
    text: "A parallel gateway: five roles advance at once, each with its own context. The meeting stops being lost time for the rest of the work.",
    notes: "Key line of the talk. Pause here." },
  { id: "brain", x: 4000, y: 520, scale: 3.4, side: "right", tag: "Second brain", title: "Underneath: the second brain",
    text: "Before, context lived in my head and leaked between meetings. Now it lives in plain markdown that every agent reads and writes, and it grows every day.",
    notes: "Point at the leaking memory band on top, then the growing vault at the bottom." },
  { id: "overview", ...CENTER, side: "gap", kicker: "Two runs of the same day", title: "One token, looping. Many tokens, finishing.",
    text: "Questions?", notes: "Zoom-out reveal." },
];

function card(s) {
  const kicker = s.kicker || (s.pool === "before" ? "January 2026" : s.pool === "now" ? "October 2026" : "");
  const tag = s.tag ? `<span class="tag">${s.tag}</span>` : "";
  return `<div class="card ${s.pool || ""} ${s.side || ""}"><div class="kicker">${kicker}${tag}</div><h1>${s.title}</h1><p>${s.text}</p></div>`;
}

const STEPS = [...Hats.steps, ...PROCESS_STEPS];

function stepHtml(s) {
  const body = s.html ? s.html(s) : card(s);
  return `<div id="${s.id}" class="step" data-x="${s.x}" data-y="${s.y}" data-scale="${s.scale}">${body}<div class="notes">${s.notes || ""}</div></div>`;
}

function onEnter(e) {
  Hats.enter(e.target.id);
  playTokens(e.target.id);
}

function playTokens(id) {
  const layer = document.getElementById("tokens");
  layer.innerHTML = "";
  (tokens[id] || []).forEach((t, i) => {
    const repeat = t.repeat ? "indefinite" : "1";
    layer.insertAdjacentHTML("beforeend",
      `<circle class="token" r="16"><animateMotion dur="${t.dur}s" begin="indefinite" fill="freeze" repeatCount="${repeat}" path="${t.d}"/></circle>`);
    const anim = layer.lastElementChild.firstElementChild;
    setTimeout(() => anim.beginElement(), 500 + i * (t.repeat ? 0 : 120));
  });
}

function build() {
  const root = document.getElementById("impress");
  root.innerHTML = Hats.board() + diagram() + STEPS.map(stepHtml).join("");
  root.addEventListener("impress:stepenter", onEnter);
  impress().init();
}

build();
