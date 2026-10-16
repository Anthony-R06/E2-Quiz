export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;
const shieldMax = 10;

interface ShieldSnapshot {
  curCharge: number;
  maxCharge: number;
  missingCharge: number;
}

function prepare(currentCharge: number, capacity: number): ShieldSnapshot {
  const snapshot: ShieldSnapshot = {
    curCharge: currentCharge,
    maxCharge: capacity,
    missingCharge: capacity - currentCharge,
  };
  return snapshot;
}

function drawMeter(snapshot: ShieldSnapshot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < snapshot.maxCharge; i++) {
    ctx.fillStyle = i < snapshot.curCharge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${snapshot.curCharge} / 10 shield`, 12, 100);
  readout.textContent = `Shield charge: ${snapshot.curCharge} / 10`;
}

function updateStats(snapshot: ShieldSnapshot) {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(snapshot);
}

function renderStats(snapshot: ShieldSnapshot) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${snapshot.curCharge} · Missing charge: ${snapshot.missingCharge}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(shieldMax, next));
  if (bounded === count) return;
  count = bounded;
  const snapshot = prepare(count, shieldMax);
  drawMeter(snapshot);
  if (panel) updateStats(snapshot);
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  const snapshot = prepare(count, shieldMax);
  renderStats(snapshot);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};
drawMeter(prepare(count, shieldMax));
