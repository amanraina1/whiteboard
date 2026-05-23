import { Draw } from "@/types";

export const renderDraws = (
  ctx: CanvasRenderingContext2D,
  canvasCurrent: HTMLCanvasElement,
  diagrams: Draw[],
  activeDraw: Draw | null,
  selectionBox: Draw | null,
  activeAction:
    | "select"
    | "move"
    | "draw"
    | "resize"
    | "edit"
    | "erase"
    | "pan"
    | "zoom",
  selectedDraw: Draw | null,
  //   toErase: Draw[],
  panOffset: { x: number; y: number },
  scale: number,
) => {
  ctx.save();
  ctx.clearRect(0, 0, canvasCurrent.width, canvasCurrent.height);
  ctx.translate(panOffset.x, panOffset.y);
  ctx.scale(scale, scale);

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
        renderFreeHand(ctx, diagram);
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
        renderFreeHand(ctx, activeDraw);
        break;
    }
  }

  if (selectionBox) {
    renderSelectionBox(ctx, selectionBox);
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

function renderFreeHand(ctx: CanvasRenderingContext2D, diagram: Draw) {
  if (!diagram.points || diagram.points.length < 2) {
    return;
  }

  ctx.beginPath();
  ctx.moveTo(diagram.points[0]!.x, diagram.points[0]!.y);

  // Use quadratic curves for a smoother line
  for (let i = 1; i < diagram.points.length - 2; i += 2) {
    // Calculate the midpoint for the curve
    const xc = (diagram.points[i]!.x + diagram.points[i + 2]!.x) / 2;
    const yc = (diagram.points[i]!.y + diagram.points[i + 2]!.y) / 2;
    // The current point is the control point, and the midpoint is the end point
    ctx.quadraticCurveTo(diagram.points[i]!.x, diagram.points[i]!.y, xc, yc);
  }
  ctx.lineTo(
    diagram.points[diagram.points.length - 1]!.x,
    diagram.points[diagram.points.length - 1]!.y,
  );

  ctx.stroke();
}

function renderSelectionBox(ctx: CanvasRenderingContext2D, selectionBox: Draw) {
  if (selectionBox.strokeStyle) {
    ctx.strokeStyle = selectionBox.strokeStyle;
  }
  if (selectionBox.fillStyle) {
    ctx.fillStyle = selectionBox.fillStyle;
  }
  if (selectionBox.lineWidth) {
    ctx.lineWidth = selectionBox.lineWidth;
  }
  const corner_1 = { x: selectionBox.startX!, y: selectionBox.startY! };
  const corner_2 = { x: selectionBox.endX!, y: selectionBox.startY! };
  const corner_3 = { x: selectionBox.endX!, y: selectionBox.endY! };
  const corner_4 = { x: selectionBox.startX!, y: selectionBox.endY! };

  ctx.beginPath();
  ctx.strokeRect(
    selectionBox.startX!,
    selectionBox.startY!,
    selectionBox.endX! - selectionBox.startX!,
    selectionBox.endY! - selectionBox.startY!,
  );
  ctx.fillStyle = "#cccccc";
  ctx.lineWidth = 1;

  ctx.fillRect(corner_1.x - 4, corner_1.y - 4, 8, 8);
  ctx.fillRect(corner_2.x - 4, corner_2.y - 4, 8, 8);
  ctx.fillRect(corner_3.x - 4, corner_3.y - 4, 8, 8);
  ctx.fillRect(corner_4.x - 4, corner_4.y - 4, 8, 8);
  ctx.strokeRect(corner_1.x - 4, corner_1.y - 4, 8, 8);
  ctx.strokeRect(corner_2.x - 4, corner_2.y - 4, 8, 8);
  ctx.strokeRect(corner_3.x - 4, corner_3.y - 4, 8, 8);
  ctx.strokeRect(corner_4.x - 4, corner_4.y - 4, 8, 8);
  ctx.stroke();
  ctx.fill();

  ctx.closePath();
}
