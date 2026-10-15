export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let crew = 2;

interface ShiftReport {
  production: number;
  consumption: number;
  balance: number;
  crew: number;
}

function reportCalculations(crew: number) {
  const reportValues: ShiftReport = {
    production: crew * 3,
    consumption: 6,
    balance: crew * 3 - 6,
    crew: crew,
  };
  return reportValues;
}

function update() {
  const reportValues = reportCalculations(crew);
  canvasRender(reportValues);
  readoutRender(reportValues);
}

function canvasRender(reportValues: ShiftReport) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < reportValues.crew ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < reportValues.crew ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${reportValues.crew} / 6`, 18, 76);
  ctx.fillText(`Production: ${reportValues.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, reportValues.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${reportValues.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, reportValues.consumption * 14, 20);
}

function readoutRender(reportValues: ShiftReport) {
  readout.textContent =
    `Assigned: ${reportValues.crew}/6 · Production: ${reportValues.production} · Consumption: ${reportValues.consumption} · Balance: ${
      reportValues.balance > 0 ? "+" : ""
    }${reportValues.balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  crew = Math.max(0, crew - 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  crew = Math.min(6, crew + 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    crew = 2;
    update();
  };
update();
