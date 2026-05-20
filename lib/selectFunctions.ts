import { Draw } from "@/types";

export const getDrawAtPosition: (
  x: number,
  y: number,
  diagrams: Draw[],
  ctx: CanvasRenderingContext2D,
) => Draw | null = (
  x: number,
  y: number,
  diagrams: Draw[],
  ctx: CanvasRenderingContext2D,
) => {
  for (let i = diagrams.length - 1; i >= 0; i--) {
    const draw = diagrams[i];
    if (isWithinDraw(x, y, draw, ctx)) {
      return draw;
    }
  }
  return null;
};

export const isWithinDraw: (
  mouseX: number,
  mouseY: number,
  draw: Draw,
  ctx: CanvasRenderingContext2D,
) => boolean = (
  mouseX: number,
  mouseY: number,
  draw: Draw,
  ctx: CanvasRenderingContext2D,
) => {
  if (!draw) return false;
  const shape = draw.shape;

  switch (shape) {
    case "rectangle": {
      if (
        draw.startX === undefined ||
        draw.startY === undefined ||
        draw.endX === undefined ||
        draw.endY === undefined
      ) {
        return false;
      }

      const minX = Math.min(draw.startX, draw.endX);
      const minY = Math.min(draw.startY, draw.endY);
      const maxX = Math.max(draw.startX, draw.endX);
      const maxY = Math.max(draw.startY, draw.endY);

      return (
        mouseX >= minX && mouseX <= maxX && mouseY >= minY && mouseY <= maxY
      );
    }

    default: {
      return false;
    }
  }
};

export const hoverOverSelectionBox = (
  selectionBox: Draw | null,
  x: number,
  y: number,
): {
  cursor: string;
  position:
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "left"
    | "right"
    | "top"
    | "bottom";
} | null => {
  if (!selectionBox) return null;
  const topLeft = { x: selectionBox.startX!, y: selectionBox.startY! };
  const topRight = { x: selectionBox.endX!, y: selectionBox.startY! };
  const bottomLeft = { x: selectionBox.startX!, y: selectionBox.endY! };
  const bottomRight = { x: selectionBox.endX!, y: selectionBox.endY! };

  const leftEdge = {
    x1: topLeft.x,
    y1: topLeft.y,
    x2: bottomLeft.x,
    y2: bottomLeft.y,
  };

  const rightEdge = {
    x1: topRight.x,
    y1: topRight.y,
    x2: bottomRight.x,
    y2: bottomRight.y,
  };

  const topEdge = {
    x1: topLeft.x,
    y1: topLeft.y,
    x2: topRight.x,
    y2: topRight.y,
  };

  const bottomEdge = {
    x1: bottomLeft.x,
    y1: bottomLeft.y,
    x2: bottomRight.x,
    y2: bottomRight.y,
  };

  if (
    x >= topLeft.x - 4 &&
    x <= topLeft.x + 4 &&
    y >= topLeft.y - 4 &&
    y <= topLeft.y + 4
  ) {
    return { cursor: "nwse-resize", position: "topLeft" };
  } else if (
    x >= topRight.x - 4 &&
    x <= topRight.x + 4 &&
    y >= topRight.y - 4 &&
    y <= topRight.y + 4
  ) {
    return { cursor: "nesw-resize", position: "topRight" };
  } else if (
    x >= bottomRight.x - 4 &&
    x <= bottomRight.x + 4 &&
    y >= bottomRight.y - 4 &&
    y <= bottomRight.y + 4
  ) {
    return { cursor: "nwse-resize", position: "bottomRight" };
  } else if (
    x >= bottomLeft.x - 4 &&
    x <= bottomLeft.x + 4 &&
    y >= bottomLeft.y - 4 &&
    y <= bottomLeft.y + 4
  ) {
    return { cursor: "nesw-resize", position: "bottomLeft" };
  } else if (
    x >= leftEdge.x1 - 4 &&
    x <= leftEdge.x2 + 4 &&
    y >= leftEdge.y1 - 4 &&
    y <= leftEdge.y2 + 4
  ) {
    return { cursor: "ew-resize", position: "left" };
  } else if (
    x >= rightEdge.x1 - 4 &&
    x <= rightEdge.x2 + 4 &&
    y >= rightEdge.y1 - 4 &&
    y <= rightEdge.y2 + 4
  ) {
    return { cursor: "ew-resize", position: "right" };
  } else if (
    y >= topEdge.y1 - 4 &&
    y <= topEdge.y2 + 4 &&
    x >= topEdge.x1 - 4 &&
    x <= topEdge.x2 + 4
  ) {
    return { cursor: "ns-resize", position: "top" };
  } else if (
    y >= bottomEdge.y1 - 4 &&
    y <= bottomEdge.y2 + 4 &&
    x >= bottomEdge.x1 - 4 &&
    x <= bottomEdge.x2 + 4
  ) {
    return { cursor: "ns-resize", position: "bottom" };
  }

  return null;
};
