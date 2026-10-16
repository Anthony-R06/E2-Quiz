export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

interface Direction {
  name: string;
  xAmount: number;
  yAmount: number;
}

const North: Direction = {
  name: "North",
  xAmount: 0,
  yAmount: -1,
};

const East: Direction = {
  name: "East",
  xAmount: 1,
  yAmount: 0,
};

const South: Direction = {
  name: "South",
  xAmount: 0,
  yAmount: 1,
};

const West: Direction = {
  name: "West",
  xAmount: -1,
  yAmount: 0,
};

const Directions = [North, East, South, West];
let x = 2;
let y = 2;
let direction = 0;

interface Command {
  execute(): void;
}

class RightCommand implements Command {
  execute(): void {
    direction = (direction + 1) % 4;
  }
}

class ForwardCommand implements Command {
  execute(): void {
    const sumX = x + Directions[direction].xAmount;
    x = Math.max(0, Math.min(4, sumX));
    const sumY = y + Directions[direction].yAmount;
    y = Math.max(0, Math.min(4, sumY));
  }
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    Directions[direction].name
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  const forwardCommand = new ForwardCommand();
  forwardCommand.execute();
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  const rightCommand = new RightCommand();
  rightCommand.execute();
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  drawRover();
};
drawRover();
