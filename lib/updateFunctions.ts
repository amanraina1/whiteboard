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
