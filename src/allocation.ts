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

interface displayRecords {
  label: string;
  value: number;
  color: string;
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
  const listOfRecords: displayRecords[] = [
    { label: "Production", value: reportValues.production, color: "#27766b" },
    { label: "Consumption", value: reportValues.consumption, color: "#a44d23" },
  ];
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${reportValues.crew} / 6`, 18, 76);

  for (let i = 0; i < listOfRecords.length; i++) {
    const y = 102 + i * 52;
    ctx.fillText(
      `${listOfRecords[i].label}: ${listOfRecords[i].value}`,
      18,
      y,
    );
    ctx.fillStyle = listOfRecords[i].color;
    ctx.fillRect(18, y + 8, listOfRecords[i].value * 14, 20);
    ctx.fillStyle = "#233e43";
  }
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
