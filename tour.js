const Tour = (() => {
  const W = 1920, H = 1080;

  const COL = 2120, ROW = 1700, SIDE = 2540;
  const SLIDES = {
    cover: { x: -COL, y: -ROW },
    jan: { x: 0, y: -ROW },
    roles: { x: COL, y: -ROW },
    pensieve: { x: SIDE, y: 0, rotate: 90 },
    setup: { x: COL, y: ROW, rotate: 180 },
    oct: { x: 0, y: ROW, rotate: 180 },
    trust: { x: -COL, y: ROW, rotate: 180 },
    bpmn: { x: -SIDE, y: 0, rotate: 270 },
  };

  const PATH = [
    "cover", "jan", "roles", "pensieve", "setup", "oct",
    "trust", "bpmn",
    { id: "bpmn-morning", on: "bpmn", left: 120, top: 440, width: 1040 },
    { id: "bpmn-day", on: "bpmn", left: 570, top: 460, width: 780 },
    { id: "bpmn-ask", on: "bpmn", left: 1020, top: 570, width: 840 },
    { id: "bpmn-race", on: "bpmn", left: 0, top: 0, width: W },
    { id: "overview", x: 0, y: 0, rotate: 360, scale: 4.4 },
  ];

  const rad = (deg) => (deg * Math.PI) / 180;

  const focus = (stop) => {
    const host = SLIDES[stop.on];
    const r = rad(host.rotate || 0), s = host.scale || 1;
    const dx = stop.left + stop.width / 2 - W / 2;
    const dy = stop.top + (stop.width * H) / W / 2 - H / 2;
    return {
      x: host.x + (dx * Math.cos(r) - dy * Math.sin(r)) * s,
      y: host.y + (dx * Math.sin(r) + dy * Math.cos(r)) * s,
      rotate: host.rotate || 0,
      scale: (s * stop.width) / W,
    };
  };

  const place = (el, pos) => {
    el.dataset.x = pos.x;
    el.dataset.y = pos.y;
    el.dataset.rotate = pos.rotate || 0;
    el.dataset.scale = pos.scale || 1;
  };

  const zoomStep = (stop) => {
    const el = document.createElement("div");
    el.className = "step zoom";
    el.id = stop.id;
    if (stop.on) el.dataset.on = stop.on;
    place(el, stop.on ? focus(stop) : stop);
    return el;
  };

  const slideStep = (id) => {
    const el = document.getElementById(id);
    place(el, SLIDES[id]);
    return el;
  };

  const markHost = (e) => {
    const host = e.target.dataset.on;
    document.querySelectorAll(".step.slide").forEach((s) => s.classList.toggle("host", s.id === host));
  };

  const build = (root) => {
    PATH.forEach((stop) => root.appendChild(typeof stop === "string" ? slideStep(stop) : zoomStep(stop)));
    root.addEventListener("impress:stepenter", markHost);
  };

  return { build };
})();

Tour.build(document.getElementById("impress"));
impress().init();
