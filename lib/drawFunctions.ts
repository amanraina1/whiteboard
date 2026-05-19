import { Draw } from "@/types";

export const renderDraws = (
  ctx: CanvasRenderingContext2D,
  canvasCurrent: HTMLCanvasElement,
  diagrams: Draw[],
  activeDraw: Draw | null,
  //   selectionBox: Draw | null,
  activeAction:
    | "select"
    | "move"
    | "draw"
    | "resize"
    | "edit"
    | "erase"
    | "pan"
    | "zoom",
  //   selectedDraw: Draw | null,
  //   toErase: Draw[],
  panOffset: { x: number; y: number },
  //   scale: number,
) => {
  ctx.save();
  ctx.clearRect(0, 0, canvasCurrent.width, canvasCurrent.height);
  ctx.translate(panOffset.x, panOffset.y);

  diagrams.forEach((diagram) => {
    ctx.save();
    if (diagram.strokeStyle) {
      ctx.strokeStyle = diagram.strokeStyle;
    }
    if (diagram.fillStyle) {
      ctx.fillStyle = diagram.fillStyle;
    }
    if (diagram.lineWidth) {
      ctx.lineWidth = diagram.lineWidth;
    }
    switch (diagram.shape) {
      case "rectangle":
        renderRectangle(ctx, diagram);
        break;

      case "freeHand":
        renderFreehand(ctx, diagram);
        break;
    }
    ctx.restore();
  });

  if (activeDraw) {
    ctx.save();
    if (activeDraw.strokeStyle) {
      ctx.strokeStyle = activeDraw.strokeStyle;
    }
    if (activeDraw.fillStyle) {
      ctx.fillStyle = activeDraw.fillStyle;
    }
    if (activeDraw.lineWidth) {
      ctx.lineWidth = activeDraw.lineWidth;
    }
    switch (activeDraw.shape) {
      case "rectangle":
        renderRectangle(ctx, activeDraw);
        break;

      case "freeHand":
        renderFreehand(ctx, activeDraw);
        break;
    }
  }

  ctx.restore();
};

function renderRectangle(ctx: CanvasRenderingContext2D, diagram: Draw) {
  // calculating corner radius
  const width = Math.abs(diagram.endX! - diagram.startX!);
  const height = Math.abs(diagram.endY! - diagram.startY!);

  const smallerSide = Math.min(width, height);

  const proportionalRadius = smallerSide * 0.2;
  const maxSafeRadius = smallerSide / 2;

  const cornerRadius = Math.min(40, proportionalRadius, maxSafeRadius);

  // starting drawing the rectangle
  ctx.beginPath();
  const { startX, startY, endX, endY } = diagram;
  ctx.roundRect(
    startX!,
    startY!,
    endX! - startX!,
    endY! - startY!,
    cornerRadius,
  );
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

function renderFreehand(ctx: CanvasRenderingContext2D, diagram: Draw) {
  const points = diagram.points;
  console.log(points);
  if (!points || points.length < 2) return;

  ctx.beginPath();

  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.stroke();
  ctx.closePath();
}
