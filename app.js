// Lift The Cup — game logic

// ---------- formations: rows are rendered top (attack) to bottom (GK) ----------
const FORMATIONS = {
  "4-3-3":   { rows: [["LW","ST","RW"], ["CM","CM","CM"], ["LB","CB","CB","RB"], ["GK"]] },
  "4-4-2":   { rows: [["ST","ST"], ["LM","CM","CM","RM"], ["LB","CB","CB","RB"], ["GK"]] },
  "3-5-2":   { rows: [["ST","ST"], ["LM","CM","CAM","CM","RM"], ["CB","CB","CB"], ["GK"]] },
  "5-3-2":   { rows: [["ST","ST"], ["CM","CAM","CM"], ["LWB","CB","CB","CB","RWB"], ["GK"]] }
};
const LABEL_GROUP = {
  GK:"GK", LB:"DF", RB:"DF", CB:"DF", LWB:"DF", RWB:"DF",
  CM:"MF", CDM:"MF", CAM:"MF", LM:"MF", RM:"MF",
  LW:"FW", RW:"FW", ST:"FW"
};

// which player position tokens each formation slot accepts
const SLOT_ACCEPTS = {
  GK: ["GK"],
  CB: ["CB"],
  LB: ["LB","LWB"],
  RB: ["RB","RWB"],
  LWB: ["LWB","LB","LM","LW"],
  RWB: ["RWB","RB","RM","RW"],
  CDM: ["CDM","CM"],
  CM: ["CM","CDM","CAM"],
  CAM: ["CAM","CM"],
  LM: ["LM","LW"],
  RM: ["RM","RW"],
  LW: ["LW","LM"],
  RW: ["RW","RM"],
  ST: ["ST"]
};

function canPlay(posString, slot) {
  return posString.split("/").some(t => SLOT_ACCEPTS[slot.label].includes(t));
}

// pool of opponents for the simulated tournament: [name, flag, tier]
// tier 5 = giants, 4 = strong, 3 = solid, 2 = mid-tier, 1 = minnows
const OPPONENT_POOL = [
  ["Brazil","🇧🇷",5],["Germany","🇩🇪",5],["Argentina","🇦🇷",5],["France","🇫🇷",5],["Italy","🇮🇹",5],["Spain","🇪🇸",5],
  ["England","🏴󠁧󠁢󠁥󠁮󠁧󠁿",4],["Netherlands","🇳🇱",4],["Portugal","🇵🇹",4],["Uruguay","🇺🇾",4],["Belgium","🇧🇪",4],["Croatia","🇭🇷",4],
  ["Mexico","🇲🇽",3],["Colombia","🇨🇴",3],["Sweden","🇸🇪",3],["Denmark","🇩🇰",3],["Chile","🇨🇱",3],
  ["Poland","🇵🇱",3],["Switzerland","🇨🇭",3],["Serbia","🇷🇸",3],["Morocco","🇲🇦",3],
  ["Japan","🇯🇵",2],["South Korea","🇰🇷",2],["Ghana","🇬🇭",2],["Nigeria","🇳🇬",2],["Cameroon","🇨🇲",2],
  ["United States","🇺🇸",2],["Senegal","🇸🇳",2],["Ecuador","🇪🇨",2],["Australia","🇦🇺",2],
  ["Saudi Arabia","🇸🇦",1],["Costa Rica","🇨🇷",1],["Tunisia","🇹🇳",1],["Panama","🇵🇦",1],["New Zealand","🇳🇿",1]
];

// win / loss / draw scorelines
const WIN_SCORES  = ["1-0","2-0","2-1","3-1","3-0","4-2","2-0"];
const LOSS_SCORES = ["0-1","1-2","0-2","1-3","0-1"];

let state = null;

const $ = (id) => document.getElementById(id);
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

function show(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(screenId).classList.add("active");
  window.scrollTo(0, 0);
}

// ---------- saved game history (persists in localStorage until the app is deleted) ----------
const HISTORY_KEY = "ltc-history";
const RESULT_SHORT = {
  CHAMPION: "Champions", FINAL: "Runners-up", SEMI: "Semi-finals",
  QUARTER: "Quarter-finals", R16: "Round of 16", GROUP: "Group stage"
};

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
}

function saveGameToHistory(avg, resultKey) {
  const entry = {
    date: new Date().toISOString(),
    formation: state.formationKey,
    rating: +avg.toFixed(1),
    result: resultKey,
    squad: state.slots.map(s => ({
      label: s.label, name: s.pick.name, rating: s.pick.rating,
      flag: s.pick.flag, team: s.pick.team, year: s.pick.year
    }))
  };
  const h = loadHistory();
  h.unshift(entry);
  if (h.length > 25) h.length = 25;
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch {}
}

function renderHistory() {
  const h = loadHistory();
  $("history-label").classList.toggle("hidden", !h.length);
  const list = $("history-list");
  list.innerHTML = "";
  h.forEach(e => {
    const v = VERDICTS[e.result] || { emoji: "⚽" };
    const when = new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const row = document.createElement("div");
    row.className = "h-row";
    row.innerHTML = `<div class="h-main">
        <span class="h-emoji">${v.emoji}</span>
        <span class="h-info">${RESULT_SHORT[e.result] || e.result}<small>${e.formation} · ${when}</small></span>
        <span class="h-rating ${ratingClass(e.rating)}">${e.rating.toFixed(1)}</span>
      </div>
      <div class="h-squad hidden">${e.squad.map(p =>
        `<div class="h-p"><span>${p.label}</span>${p.name} ${p.flag} ${p.year}<em class="${ratingClass(p.rating)}">${p.rating}</em></div>`
      ).join("")}</div>`;
    row.querySelector(".h-main").onclick = () => row.querySelector(".h-squad").classList.toggle("hidden");
    list.appendChild(row);
  });
}

// ---------- start screen ----------
function renderStart() {
  const wrap = $("formation-buttons");
  wrap.innerHTML = "";
  Object.keys(FORMATIONS).forEach(key => {
    const bands = key.split("-").map(Number);
    const df = bands[0], fw = bands[bands.length - 1];
    const mf = bands.slice(1, -1).reduce((a, b) => a + b, 0);
    const btn = document.createElement("button");
    btn.className = "formation-btn";
    btn.innerHTML = `${key}<small>${df} DEF · ${mf} MID · ${fw} ATT</small>`;
    btn.onclick = () => startDraft(key);
    wrap.appendChild(btn);
  });
}

// ---------- draft ----------
function startDraft(formationKey) {
  const slots = [];
  FORMATIONS[formationKey].rows.forEach((row, r) => {
    row.forEach((label, c) => slots.push({ label, group: LABEL_GROUP[label], row: r, col: c, pick: null }));
  });
  state = { formationKey, slots, spinning: false, spin: null, moveFrom: null, respins: { country: 1, year: 1 } };
  resetRestartBtn();
  renderPitch();
  updateDraftUI();
  show("screen-draft");
}

function filledCount() {
  return state.slots.filter(s => s.pick).length;
}

// all open slots this player can actually fill
function openSlotsFor(p) {
  return state.slots.filter(s => !s.pick && canPlay(p[1], s));
}

function renderPitch() {
  const pitch = $("pitch");
  pitch.innerHTML = "";
  const rows = FORMATIONS[state.formationKey].rows;
  rows.forEach((row, r) => {
    const rowEl = document.createElement("div");
    rowEl.className = "pitch-row";
    row.forEach((_, c) => {
      const slot = state.slots.find(s => s.row === r && s.col === c);
      const el = document.createElement("div");
      el.className = "slot";
      el.id = `slot-${r}-${c}`;
      if (slot.pick) {
        el.classList.add("filled");
        el.innerHTML = `<div class="pos-label">${slot.label}</div>
          <div class="pname">${shortName(slot.pick.name)}</div>
          <div class="pteam">${slot.pick.flag} ${slot.pick.year}</div>`;
      } else {
        el.innerHTML = `<div class="pos-label">${slot.label}</div><div style="font-size:20px;opacity:.6">?</div>`;
      }
      if (state.moveFrom) {
        if (slot === state.moveFrom) el.classList.add("selected");
        else if (isValidDest(state.moveFrom, slot)) el.classList.add("dest");
      }
      el.onclick = () => onSlotTap(slot);
      rowEl.appendChild(el);
    });
    pitch.appendChild(rowEl);
  });
}

// ---------- mid-draft rearranging ----------
function isValidDest(src, dst) {
  if (dst === src || !src.pick) return false;
  if (!dst.pick) return canPlay(src.pick.pos, dst);
  return canPlay(src.pick.pos, dst) && canPlay(dst.pick.pos, src);
}

function onSlotTap(slot) {
  if (state.spinning) return;
  if (state.moveFrom) {
    if (slot === state.moveFrom) { state.moveFrom = null; setDraftHint(); renderPitch(); return; }
    if (isValidDest(state.moveFrom, slot)) { doMove(state.moveFrom, slot); return; }
    if (slot.pick) { state.moveFrom = slot; setDraftHint(); renderPitch(); return; }
    return;
  }
  if (slot.pick) { state.moveFrom = slot; setDraftHint(); renderPitch(); }
}

function doMove(src, dst) {
  const a = src.pick, b = dst.pick || null;
  src.pick = b;
  dst.pick = a;
  // a move into an empty slot changes which positions are open — never allow it
  // to strand a pending spin with zero pickable players
  if (state.spin && !b) {
    const t = state.spin;
    const stillOk = t.team.players.some(p => !isTaken(p[0], t.year) && openSlotsFor(p).length);
    if (!stillOk) {
      src.pick = a;
      dst.pick = b;
      state.moveFrom = null;
      renderPitch();
      setDraftHint(`Blocked — that would leave no valid pick from ${t.team.name} ${t.year}`);
      return;
    }
  }
  state.moveFrom = null;
  setDraftHint();
  renderPitch();
}

function setDraftHint(msg) {
  const el = $("draft-hint");
  if (msg) { el.textContent = msg; return; }
  if (state.moveFrom) el.textContent = `Moving ${shortName(state.moveFrom.pick.name)} — tap a glowing spot, or tap them again to cancel`;
  else if (filledCount() > 0) el.textContent = "Tap a player to move or swap their position";
  else el.textContent = "";
}

function shortName(name) {
  const parts = name.split(" ");
  return parts.length > 2 ? parts[0] + " " + parts[parts.length - 1] : name;
}

function updateDraftUI() {
  const filled = filledCount();
  $("pick-count").textContent = `${filled} / ${state.slots.length}`;
  const btn = $("spin-btn");
  if (state.spin && !state.spinning) {
    // a spin is waiting while the user rearranges the pitch
    btn.textContent = "Resume pick ▶";
    btn.classList.add("green");
    btn.onclick = () => {
      state.moveFrom = null;
      renderPitch();
      setDraftHint();
      $("spin-overlay").classList.add("active");
      showPlayerChoices(state.spin);
    };
  } else if (filled < state.slots.length) {
    btn.textContent = `Spin — pick ${filled + 1} of ${state.slots.length}`;
    btn.classList.remove("green");
    btn.onclick = openSpin;
  } else {
    btn.textContent = "Play Tournament ▶";
    btn.classList.add("green");
    btn.onclick = playTournament;
  }
  setDraftHint();
}

function isTaken(name, year) {
  return state.slots.some(s => s.pick && s.pick.name === name && s.pick.year === year);
}

// every (tournament, team) pair that still has a pickable player
// (someone whose real positions match an open slot, not already in your XI)
function eligibleSpins() {
  const options = [];
  WC_DATA.forEach(t => t.teams.forEach(team => {
    const ok = team.players.some(p => openSlotsFor(p).length && !isTaken(p[0], t.year));
    if (ok) options.push({ year: t.year, team });
  }));
  return options;
}

function openSpin() {
  if (state.spinning || state.spin) return;
  state.moveFrom = null;
  $("spin-for").textContent = `Pick ${filledCount() + 1} of ${state.slots.length}`;
  $("spin-overlay").classList.add("active");
  spinReels(true, true, rand(eligibleSpins()));
}

function spinReels(spinCountry, spinYear, target) {
  state.spinning = true;
  state.spin = null;
  updateRespinButtons();
  $("pick-hint").classList.add("hidden");
  $("sort-row").classList.add("hidden");
  $("rearrange-btn").classList.add("hidden");
  $("player-list").innerHTML = "";
  const rc = $("reel-country"), ry = $("reel-year");
  if (spinCountry) { rc.classList.add("spinning"); rc.classList.remove("landed"); }
  if (spinYear) { ry.classList.add("spinning"); ry.classList.remove("landed"); }

  const allPairs = [];
  WC_DATA.forEach(t => t.teams.forEach(team => allPairs.push({ year: t.year, team })));
  let delay = 55;
  const tick = () => {
    const p = rand(allPairs);
    if (spinCountry) setCountryReel(p.team.flag, p.team.name);
    if (spinYear) setYearReel(p.year);
    delay *= 1.13;
    if (delay < 420) {
      setTimeout(tick, delay);
    } else {
      setCountryReel(target.team.flag, target.team.name);
      setYearReel(target.year);
      if (spinCountry) { rc.classList.remove("spinning"); rc.classList.add("landed"); }
      if (spinYear) { ry.classList.remove("spinning"); ry.classList.add("landed"); }
      setTimeout(() => {
        state.spin = target;
        state.spinning = false;
        updateRespinButtons();
        showPlayerChoices(target);
      }, 350);
    }
  };
  tick();
}

function setCountryReel(flag, name) {
  $("reel-flag").textContent = flag;
  $("reel-team").textContent = name;
}
function setYearReel(year) {
  $("reel-yearnum").textContent = year;
}

// spins that keep one reel fixed and change the other
function respinCandidates(kind) {
  const cur = state.spin;
  return eligibleSpins().filter(o => kind === "country"
    ? o.year === cur.year && o.team.name !== cur.team.name
    : o.team.name === cur.team.name && o.year !== cur.year);
}

function updateRespinButtons() {
  const bc = $("respin-country"), by = $("respin-year");
  bc.textContent = `↻ new nation (${state.respins.country} left)`;
  by.textContent = `↻ new year (${state.respins.year} left)`;
  const ready = !state.spinning && state.spin;
  bc.disabled = !ready || state.respins.country < 1 || !respinCandidates("country").length;
  by.disabled = !ready || state.respins.year < 1 || !respinCandidates("year").length;
}

function doRespin(kind) {
  if (state.spinning || !state.spin || state.respins[kind] < 1) return;
  const cands = respinCandidates(kind);
  if (!cands.length) return;
  state.respins[kind]--;
  spinReels(kind === "country", kind === "year", rand(cands));
}

// bands track the tournament thresholds: elite = champion territory (89.5+),
// good = clears the group stage (83.5+)
function ratingClass(r) {
  return r >= 89.5 ? "r-elite" : r >= 83.5 ? "r-good" : r >= 77.5 ? "r-mid" : "r-poor";
}

let playerSort = localStorage.getItem("ltc-sort") || "position";

function showPlayerChoices(target) {
  const hint = $("pick-hint");
  hint.textContent = "Pick any player — greyed-out spots are already filled.";
  hint.classList.remove("hidden");
  $("rearrange-btn").classList.toggle("hidden", filledCount() === 0);
  const sortRow = $("sort-row");
  sortRow.classList.remove("hidden");
  const sel = $("sort-select");
  sel.value = playerSort;
  sel.onchange = () => {
    playerSort = sel.value;
    try { localStorage.setItem("ltc-sort", playerSort); } catch {}
    showPlayerChoices(target);
  };
  const list = $("player-list");
  list.innerHTML = "";
  const posOrder = { GK:0, RB:1, CB:2, LB:3, RWB:1, LWB:3, CDM:4, CM:5, CAM:6, RM:7, LM:7, RW:8, LW:8, ST:9 };
  const players = [...target.team.players].sort(playerSort === "rating"
    ? (a, b) => b[2] - a[2]
    : (a, b) => posOrder[a[1].split("/")[0]] - posOrder[b[1].split("/")[0]]);
  players.forEach(p => {
    const open = openSlotsFor(p);
    const taken = isTaken(p[0], target.year);
    const btn = document.createElement("button");
    btn.className = "player-btn";
    btn.innerHTML = `<span class="pb-pos">${p[1]}</span><span class="pb-name">${p[0]}</span>` +
      (!open.length ? `<span class="pb-full">positions filled</span>` : (taken ? `<span class="pb-full">in your XI</span>` : "")) +
      `<span class="pb-rating ${ratingClass(p[2])}">${p[2]}</span>`;
    if (!open.length || taken) {
      btn.classList.add("taken");
    } else {
      btn.onclick = () => choosePosition(p, target);
    }
    list.appendChild(btn);
  });
}

// step 2: player chosen — now pick which open slot they take
function choosePosition(p, target) {
  const open = openSlotsFor(p);
  if (open.length === 1) return placePlayer(p, target, open[0]);
  $("rearrange-btn").classList.add("hidden");
  $("sort-row").classList.add("hidden");
  $("pick-hint").textContent = `Where does ${p[0]} play?`;
  const list = $("player-list");
  list.innerHTML = "";
  open.sort((a, b) => a.row - b.row || a.col - b.col).forEach(s => {
    const btn = document.createElement("button");
    btn.className = "player-btn";
    btn.innerHTML = `<span class="pb-pos">${s.label}</span><span class="pb-name">${slotSideName(s)}</span>`;
    btn.onclick = () => placePlayer(p, target, s);
    list.appendChild(btn);
  });
  const back = document.createElement("button");
  back.className = "player-btn";
  back.innerHTML = `<span class="pb-name">← pick a different player</span>`;
  back.onclick = () => showPlayerChoices(target);
  list.appendChild(back);
}

// disambiguate identical labels in the same row: CB (left) / CB (centre) / CB (right)
function slotSideName(slot) {
  const siblings = state.slots
    .filter(s => s.row === slot.row && s.label === slot.label)
    .sort((a, b) => a.col - b.col);
  if (siblings.length === 1) return "";
  const names = siblings.length === 2 ? ["left", "right"] : ["left", "centre", "right", "far right"];
  return names[siblings.indexOf(slot)] || "";
}

function placePlayer(p, target, slot) {
  slot.pick = { name: p[0], pos: p[1], rating: p[2], team: target.team.name, flag: target.team.flag, year: target.year };
  state.spin = null;
  $("spin-overlay").classList.remove("active");
  renderPitch();
  updateDraftUI();
}

// ---------- tournament simulation ----------
function squadRating() {
  const sum = state.slots.reduce((a, s) => a + s.pick.rating, 0);
  return sum / state.slots.length;
}

// pure rating threshold -> how far you go
function outcomeFor(avg) {
  if (avg >= 89.5)  return { stage: 5, key: "CHAMPION" };
  if (avg >= 88.5)  return { stage: 5, key: "FINAL" };      // lose the final
  if (avg >= 87.5)  return { stage: 4, key: "SEMI" };
  if (avg >= 86)    return { stage: 3, key: "QUARTER" };
  if (avg >= 83.5)  return { stage: 2, key: "R16" };
  return { stage: 1, key: "GROUP" };
}

const VERDICTS = {
  CHAMPION: { emoji: "🏆", title: "World Champions!", detail: "A perfect run. Your XI lifts the trophy — legends, every one of them." },
  FINAL:    { emoji: "🥈", title: "Runners-up", detail: "So close. Beaten in the final — a squad for the ages, but not quite enough." },
  SEMI:     { emoji: "😖", title: "Out in the Semi-finals", detail: "A deep run, but the last four is where the dream died." },
  QUARTER:  { emoji: "😤", title: "Out in the Quarter-finals", detail: "A respectable campaign — undone by one bad night." },
  R16:      { emoji: "😬", title: "Out in the Round of 16", detail: "Escaped the group, then got picked apart in the knockouts." },
  GROUP:    { emoji: "🫣", title: "Group Stage Exit", detail: "Flights home booked early. This squad never got going." }
};

function playTournament() {
  const avg = squadRating();
  const outcome = outcomeFor(avg);
  saveGameToHistory(avg, outcome.key);
  const feed = $("match-feed");
  feed.innerHTML = "";
  $("verdict").classList.add("hidden");
  $("reveal-btn").classList.add("hidden");
  $("sim-sub").textContent = "Your squad takes the field…";
  show("screen-sim");

  // opponents get tougher as the rounds progress, like a real bracket
  const usedOpp = new Set();
  const opp = (minTier, maxTier) => {
    let pool = OPPONENT_POOL.filter(o => !usedOpp.has(o[0]) && o[2] >= minTier && o[2] <= maxTier);
    if (!pool.length) pool = OPPONENT_POOL.filter(o => !usedOpp.has(o[0]));
    const o = rand(pool);
    usedOpp.add(o[0]);
    return o;
  };
  // knockout draw: R16 anyone, QF solid+, SF strong (rare surprise), final giants (rare strong)
  const koTiers = {
    2: [1, 4],
    3: [3, 5],
    4: [Math.random() < 0.15 ? 3 : 4, 5],
    5: [Math.random() < 0.2 ? 4 : 5, 5]
  };

  const events = [];
  // group stage: one seeded team, one mid-tier, one underdog
  events.push({ type: "round", text: "Group Stage" });
  const groupOpp = [opp(3, 5), opp(2, 3), opp(1, 2)];
  if (outcome.key === "GROUP") {
    const bad = avg < 74;
    events.push(match(groupOpp[0], "loss"));
    events.push(match(groupOpp[1], bad ? "loss" : "draw"));
    events.push(match(groupOpp[2], bad ? "loss" : "draw"));
  } else {
    events.push(match(groupOpp[0], outcome.stage >= 4 ? "win" : "draw"));
    events.push(match(groupOpp[1], "win"));
    events.push(match(groupOpp[2], "win"));
  }
  // knockout rounds
  const koRounds = [[2, "Round of 16"], [3, "Quarter-final"], [4, "Semi-final"], [5, "Final"]];
  for (const [stageNum, label] of koRounds) {
    if (outcome.stage < stageNum) break;
    events.push({ type: "round", text: label });
    const o = opp(koTiers[stageNum][0], koTiers[stageNum][1]);
    const isExit =
      (outcome.key === "R16" && stageNum === 2) ||
      (outcome.key === "QUARTER" && stageNum === 3) ||
      (outcome.key === "SEMI" && stageNum === 4) ||
      (outcome.key === "FINAL" && stageNum === 5);
    if (isExit) {
      // drop out — heartbreak on penalties sometimes
      const pens = Math.random() < 0.45;
      events.push(pens ? match(o, "penloss") : match(o, "loss"));
      break;
    } else {
      events.push(match(o, "win"));
    }
  }
  events.push({ type: "verdict", key: outcome.key });

  // reveal one by one
  let i = 0;
  const step = () => {
    if (i >= events.length) return;
    const ev = events[i++];
    if (ev.type === "round") {
      const el = document.createElement("div");
      el.className = "round-tag";
      el.textContent = ev.text;
      feed.appendChild(el);
      setTimeout(step, 550);
    } else if (ev.type === "match") {
      feed.appendChild(ev.el);
      ev.el.scrollIntoView({ behavior: "smooth", block: "end" });
      setTimeout(step, 900);
    } else {
      showVerdict(ev.key, avg);
    }
  };
  setTimeout(step, 600);
}

function match(opponent, result) {
  const el = document.createElement("div");
  let score, cls, pens = "";
  if (result === "win") { score = rand(WIN_SCORES); cls = "win"; }
  else if (result === "loss") { score = rand(LOSS_SCORES); cls = "loss"; }
  else if (result === "penloss") { score = rand(["1-1","0-0","2-2"]); cls = "loss"; pens = `<span class="pens">lost ${rand(["3-4","2-4","4-5","1-3"])} on penalties</span>`; }
  else { score = rand(["1-1","0-0","2-2"]); cls = "draw"; }
  el.className = "match " + cls;
  el.innerHTML = `<span class="side">🌟 Your XI</span>
    <span class="score">${score}${pens}</span>
    <span class="side right">${opponent[0]} ${opponent[1]}</span>`;
  return { type: "match", el };
}

function showVerdict(key, avg) {
  const v = VERDICTS[key];
  $("v-emoji").textContent = v.emoji;
  $("v-title").textContent = v.title;
  $("v-detail").textContent = v.detail;
  const verdict = $("verdict");
  verdict.className = key === "CHAMPION" ? "champion" : (key === "FINAL" ? "" : "out");
  verdict.classList.remove("hidden");
  verdict.scrollIntoView({ behavior: "smooth", block: "end" });
  $("reveal-btn").classList.remove("hidden");
  $("reveal-btn").onclick = () => showResult(key, avg);
  if (key === "CHAMPION") confetti();
}

// ---------- result screen ----------
function showResult(key, avg) {
  const v = VERDICTS[key];
  $("r-emoji").textContent = v.emoji;
  $("r-title").textContent = v.title;
  $("r-rating").textContent = avg.toFixed(1);
  const list = $("squad-list");
  list.innerHTML = "";
  state.slots.forEach(s => {
    const p = s.pick;
    const rc = ratingClass(p.rating);
    const row = document.createElement("div");
    row.className = "sq-row";
    row.innerHTML = `<span class="sq-pos">${s.label}</span>
      <span class="sq-name">${p.name}<small>${p.flag} ${p.team} · World Cup ${p.year}</small></span>
      <span class="sq-rating ${rc}">${p.rating}</span>`;
    list.appendChild(row);
  });
  show("screen-result");
  if (key === "CHAMPION") confetti();
}

function confetti() {
  const bits = ["🎉","⚽","🏆","✨","🎊","⭐"];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement("div");
    el.className = "confetti";
    el.textContent = rand(bits);
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = (2 + Math.random() * 2.5) + "s";
    el.style.animationDelay = (Math.random() * 1.2) + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 6000);
  }
}

// mid-draft restart: first tap arms the button, second tap confirms
let restartArm = null;
function resetRestartBtn() {
  clearTimeout(restartArm);
  restartArm = null;
  const btn = $("restart-btn");
  btn.textContent = "↺ Restart";
  btn.classList.remove("armed");
}
$("restart-btn").onclick = () => {
  const btn = $("restart-btn");
  if (restartArm) {
    resetRestartBtn();
    state = null;
    $("spin-overlay").classList.remove("active");
    renderHistory();
    show("screen-start");
  } else {
    btn.textContent = "Tap again to restart";
    btn.classList.add("armed");
    restartArm = setTimeout(resetRestartBtn, 2500);
  }
};

$("replay-btn").onclick = () => { renderHistory(); show("screen-start"); };
$("respin-country").onclick = () => doRespin("country");
$("respin-year").onclick = () => doRespin("year");
$("rearrange-btn").onclick = () => {
  $("spin-overlay").classList.remove("active");
  state.moveFrom = null;
  renderPitch();
  updateDraftUI();
  setDraftHint("Rearrange your XI, then hit Resume pick");
};
renderStart();
renderHistory();
