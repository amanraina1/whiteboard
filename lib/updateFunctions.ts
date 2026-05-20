import { Draw } from "@/types";

export const handleShapeSelectionBox = (
  draw: Draw,
  ctx: CanvasRenderingContext2D,
): Draw | null => {
  const farthestLeft = Math.min(draw.startX!, draw.endX!);
  const farthestRight = Math.max(draw.startX!, draw.endX!);
  const farthestTop = Math.min(draw.startY!, draw.endY!);
  const farthestBottom = Math.max(draw.startY!, draw.endY!);

  switch (draw.shape) {
    case "rectangle": {
      return {
        ...draw,
        id: "0",
        shape: "rectangle",
        startX: farthestLeft - 5,
        startY: farthestTop - 5,
        endX: farthestRight + 5,
        endY: farthestBottom + 5,
        fillStyle: "transparent",
        strokeStyle: "#5588ff",
        lineWidth: 2,
      };
    }
    default:
      return null;
  }
};
export const moveDraw = (
  x: number,
  y: number,
  offsetX: number,
  offsetY: number,
  selectedDraw: Draw,
  diagrams: Draw[],
) => {
  const oldStartX = selectedDraw.startX!;
  const oldStartY = selectedDraw.startY!;

  const newStartX = x - offsetX;
  const newStartY = y - offsetY;
  const dx = newStartX - oldStartX;
  const dy = newStartY - oldStartY;

  selectedDraw.startX = newStartX;
  selectedDraw.startY = newStartY;
  selectedDraw.endX! += dx;
  selectedDraw.endY! += dy;

  const index = diagrams.findIndex((draw) => draw.id === selectedDraw.id);
  diagrams[index] = selectedDraw;
  return selectedDraw;
};
