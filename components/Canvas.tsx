"use client";
import { Button } from "@/components/Button";
import { renderDraws } from "@/lib/drawFunctions";
import {
  getDrawAtPosition,
  hoverOverSelectionBox,
} from "@/lib/selectFunctions";
import { handleShapeSelectionBox, moveDraw } from "@/lib/updateFunctions";
import type { Draw } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BsFonts } from "react-icons/bs";
import { LiaHandPaper, LiaHandRock } from "react-icons/lia";
import {
  PiArrowRight,
  PiCircle,
  PiCircleFill,
  PiCursor,
  PiCursorFill,
  PiDiamond,
  PiDiamondFill,
  PiEraser,
  PiEraserFill,
  PiLineVertical,
  PiLineVerticalLight,
  PiPencil,
  PiPencilFill,
  PiSquare,
  PiSquareFill,
} from "react-icons/pi";
import { TbZoom } from "react-icons/tb";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const router = useRouter();

  const [activeAction, setActiveAction] = useState<
    "select" | "move" | "draw" | "resize" | "edit" | "erase" | "pan" | "zoom"
  >("select");
  const [activeShape, setActiveShape] = useState<
    "rectangle" | "diamond" | "circle" | "line" | "arrow" | "text" | "freeHand"
  >("rectangle");
  const [selectedShape, setSelectedShape] = useState<
    | "rectangle"
    | "diamond"
    | "circle"
    | "line"
    | "arrow"
    | "text"
    | "freeHand"
    | null
  >(null);
  const [activeStrokeStyle, setActiveStrokeStyle] = useState<string>("#eeeeee");
  const [activeLineWidth, setActiveLineWidth] = useState<number>(2);
  const [activeFillStyle, setActiveFillStyle] = useState<string>("#eeeeee00");
  const [activeFont, setActiveFont] = useState<string>("Arial");
  const [activeFontSize, setActiveFontSize] = useState<string>("20");

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const activeDraw = useRef<Draw | null>(null);
  const selectedDraw = useRef<Draw>(null);
  const shapeSelectionBox = useRef<Draw>(null);
  const modifiedDrawState = useRef<Draw>(null);
  const movingOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const diagrams = useRef<Draw[]>([]);
  const panOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);
  const currentY = useRef<number | null>(null);

  const changeActiveStrokeStyle = (color: string) => {
    setActiveStrokeStyle(color);
    // if (selectedDraw.current) {
    //   selectedDraw.current.strokeStyle = color;
    //   if (
    //     originalDrawState.current &&
    //     originalDrawState.current.strokeStyle !==
    //       selectedDraw.current.strokeStyle
    //   ) {
    //     const action: Action = {
    //       type: "edit",
    //       originalDraw: JSON.parse(JSON.stringify(originalDrawState.current)),
    //       modifiedDraw: JSON.parse(JSON.stringify(selectedDraw.current)),
    //     };
    //     const { undoRedoArray, undoRedoIndex } = pushToUndoRedoArray(
    //       action,
    //       undoRedoArrayRef.current,
    //       undoRedoIndexRef.current,
    //       null,
    //       user!.id,
    //       roomId,
    //     );
    //     modifiedDrawState.current = null;
    //     originalDrawState.current = JSON.parse(
    //       JSON.stringify(selectedDraw.current),
    //     );
    //     undoRedoArrayRef.current = undoRedoArray;
    //     undoRedoIndexRef.current = undoRedoIndex;
    //     updateUndoRedoState();
    //   }
    // }
  };

  const changeActiveFont = (font: string) => {
    setActiveFont(font);
    // if (selectedDraw.current) {
    //   selectedDraw.current.font = font;
    //   if (
    //     originalDrawState.current &&
    //     originalDrawState.current.font !== selectedDraw.current.font
    //   ) {
    //     const action: Action = {
    //       type: "edit",
    //       originalDraw: JSON.parse(JSON.stringify(originalDrawState.current)),
    //       modifiedDraw: JSON.parse(JSON.stringify(selectedDraw.current)),
    //     };
    //     const { undoRedoArray, undoRedoIndex } = pushToUndoRedoArray(
    //       action,
    //       undoRedoArrayRef.current,
    //       undoRedoIndexRef.current,
    //       null,
    //       user!.id,
    //       roomId,
    //     );
    //     modifiedDrawState.current = null;
    //     originalDrawState.current = JSON.parse(
    //       JSON.stringify(selectedDraw.current),
    //     );
    //     undoRedoArrayRef.current = undoRedoArray;
    //     undoRedoIndexRef.current = undoRedoIndex;
    //     updateUndoRedoState();
    //   }
    // }
  };

  const changeActiveFontSize = (size: number) => {
    setActiveFontSize(size.toString());
    // if (selectedDraw.current) {
    //   selectedDraw.current.fontSize = size.toString();
    //   if (
    //     originalDrawState.current &&
    //     originalDrawState.current.fontSize !== selectedDraw.current.fontSize
    //   ) {
    //     const action: Action = {
    //       type: "edit",
    //       originalDraw: JSON.parse(JSON.stringify(originalDrawState.current)),
    //       modifiedDraw: JSON.parse(JSON.stringify(selectedDraw.current)),
    //     };
    //     const { undoRedoArray, undoRedoIndex } = pushToUndoRedoArray(
    //       action,
    //       undoRedoArrayRef.current,
    //       undoRedoIndexRef.current,
    //       null,
    //       user!.id,
    //       roomId,
    //     );
    //     modifiedDrawState.current = null;
    //     originalDrawState.current = JSON.parse(
    //       JSON.stringify(selectedDraw.current),
    //     );
    //     undoRedoArrayRef.current = undoRedoArray;
    //     undoRedoIndexRef.current = undoRedoIndex;
    //     updateUndoRedoState();
    //   }
    // }
  };

  const changeActiveLineWidth = (width: number) => {
    setActiveLineWidth(width);
    // if (selectedDraw.current) {
    //   selectedDraw.current.lineWidth = width;
    //   if (
    //     originalDrawState.current &&
    //     originalDrawState.current.lineWidth !== selectedDraw.current.lineWidth
    //   ) {
    //     const action: Action = {
    //       type: "edit",
    //       originalDraw: JSON.parse(JSON.stringify(originalDrawState.current)),
    //       modifiedDraw: JSON.parse(JSON.stringify(selectedDraw.current)),
    //     };
    //     const { undoRedoArray, undoRedoIndex } = pushToUndoRedoArray(
    //       action,
    //       undoRedoArrayRef.current,
    //       undoRedoIndexRef.current,
    //       null,
    //       user!.id,
    //       roomId,
    //     );
    //     modifiedDrawState.current = null;
    //     originalDrawState.current = JSON.parse(
    //       JSON.stringify(selectedDraw.current),
    //     );
    //     undoRedoArrayRef.current = undoRedoArray;
    //     undoRedoIndexRef.current = undoRedoIndex;
    //     updateUndoRedoState();
    //   }
    // }
  };

  const changeActiveFillStyle = (color: string) => {
    setActiveFillStyle(color);
    // if (selectedDraw.current) {
    //   selectedDraw.current.fillStyle = color;
    //   if (
    //     originalDrawState.current &&
    //     originalDrawState.current.fillStyle !== selectedDraw.current.fillStyle
    //   ) {
    //     const action: Action = {
    //       type: "edit",
    //       originalDraw: JSON.parse(JSON.stringify(originalDrawState.current)),
    //       modifiedDraw: JSON.parse(JSON.stringify(selectedDraw.current)),
    //     };
    //     const { undoRedoArray, undoRedoIndex } = pushToUndoRedoArray(
    //       action,
    //       undoRedoArrayRef.current,
    //       undoRedoIndexRef.current,
    //       null,
    //       user!.id,
    //       roomId,
    //     );
    //     modifiedDrawState.current = null;
    //     originalDrawState.current = JSON.parse(
    //       JSON.stringify(selectedDraw.current),
    //     );
    //     undoRedoArrayRef.current = undoRedoArray;
    //     undoRedoIndexRef.current = undoRedoIndex;
    //     updateUndoRedoState();
    //   }
    // }
  };

  const activeShapeRef = useRef(activeShape);
  const selectedShapeRef = useRef(selectedShape);
  const activeActionRef = useRef(activeAction);
  const isDraggingRef = useRef<boolean>(isDragging);
  const activeStrokeStyleRef = useRef<string>(activeStrokeStyle);
  const activeFillStyleRef = useRef<string>(activeFillStyle);
  const activeLineWidthRef = useRef<number>(activeLineWidth);
  const activeFontRef = useRef<string>(activeFont);
  const activeFontSizeRef = useRef<string>(activeFontSize);

  useEffect(() => {
    activeShapeRef.current = activeShape;
    activeActionRef.current = activeAction;
    selectedShapeRef.current = selectedShape;
    isDraggingRef.current = isDragging;
    activeStrokeStyleRef.current = activeStrokeStyle;
    activeFillStyleRef.current = activeFillStyle;
    activeLineWidthRef.current = activeLineWidth;
    activeFontRef.current = activeFont;
    activeFontSizeRef.current = activeFontSize;

    if (canvasRef.current) {
      canvasRef.current.focus();
      switch (activeActionRef.current) {
        case "pan":
          if (isDraggingRef.current) {
            canvasRef.current.style.cursor = "grabbing";
          } else {
            canvasRef.current.style.cursor = "grab";
          }
          break;
        case "zoom":
          canvasRef.current.style.cursor = "zoom-in";
          break;
        case "select":
          canvasRef.current.style.cursor = "default";
          break;
        case "move":
          canvasRef.current.style.cursor = "move";
          break;
        case "draw":
          canvasRef.current.style.cursor = "crosshair";
          break;
        case "resize":
          canvasRef.current.style.cursor = "default";
          break;
        case "edit":
          canvasRef.current.style.cursor = "text";
          break;
        case "erase":
          canvasRef.current.style.cursor = "cell";
          break;
      }
    }

    if (selectedDraw.current) {
      selectedDraw.current.fillStyle = activeFillStyleRef.current;
      selectedDraw.current.strokeStyle = activeStrokeStyleRef.current;
      selectedDraw.current.lineWidth = activeLineWidthRef.current;
      selectedDraw.current.font = activeFontRef.current;
      if (
        selectedDraw.current.fontSize === "20" ||
        selectedDraw.current.fontSize === "40" ||
        selectedDraw.current.fontSize === "60"
      ) {
        selectedDraw.current.fontSize = activeFontSizeRef.current;
      }
    }
  }, [
    activeShape,
    activeAction,
    isDragging,
    selectedShape,
    activeStrokeStyle,
    activeFillStyle,
    activeLineWidth,
    activeFont,
    activeFontSize,
  ]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvasCurrent = canvasRef.current;

    const ctx = canvasCurrent.getContext("2d");
    if (!ctx) return;
    canvasCurrent.focus();

    const renderInterval = setInterval(() => {
      renderDraws(
        ctx,
        canvasCurrent,
        diagrams.current,
        activeDraw.current,
        shapeSelectionBox.current,
        activeActionRef.current,
        selectedDraw.current,
        panOffset.current,
      );
    }, 15);

    const getMousePosition = (event: MouseEvent) => {
      return {
        offsetX: event.offsetX - panOffset.current.x,
        offsetY: event.offsetY - panOffset.current.y,
      };
    };

    const handleScroll = (event: WheelEvent) => {
      event.preventDefault();

      panOffset.current.x -= event.deltaX;
      panOffset.current.y -= event.deltaY;
    };

    const handleMouseDown = (event: MouseEvent) => {
      modifiedDrawState.current = null;
      setIsDragging(true);

      const { offsetX, offsetY } = getMousePosition(event);

      if (activeActionRef.current === "draw") {
        const currentActiveShape = activeShapeRef.current;
        const isDrawing = currentActiveShape === "freeHand";

        startX.current = offsetX;
        startY.current = offsetY;

        activeDraw.current = {
          id: Date.now() + "-" + Math.random(),
          shape: currentActiveShape,
          strokeStyle: activeStrokeStyleRef.current,
          fillStyle: isDrawing ? "transparent" : activeFillStyleRef.current,
          lineWidth: activeLineWidthRef.current,
          startX: isDrawing ? undefined : startX.current,
          startY: isDrawing ? undefined : startY.current,
          points: isDrawing ? [{ x: startX.current, y: startY.current }] : [],
          text: "",
          font: "",
          fontSize: "",
        };
      }

      if (activeActionRef.current === "select") {
        const draw = getDrawAtPosition(offsetX, offsetY, diagrams.current, ctx);

        const hoveredSelectionBox = hoverOverSelectionBox(
          shapeSelectionBox.current!,
          offsetX,
          offsetY,
        );

        // if some shape is selected then select the properties of this shape in the left sidebar
        if (!hoverOverSelectionBox && draw) {
          setActiveFillStyle(draw?.fillStyle);
          setActiveStrokeStyle(draw?.strokeStyle);
          setActiveLineWidth(draw?.lineWidth);
        }

        if (draw && !hoveredSelectionBox?.position.includes("point")) {
          shapeSelectionBox.current = handleShapeSelectionBox(draw, ctx);
          setActiveAction("move");

          movingOffset.current = {
            x: offsetX - draw.startX!,
            y: offsetY - draw.startY!,
          };

          selectedDraw.current = draw;
          setSelectedShape(draw.shape);
          setActiveShape(draw.shape);
        } else {
          setActiveAction("select");
          selectedDraw.current = null;
          setSelectedShape(null);
          shapeSelectionBox.current = null;
        }
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      const canvasCurrent = canvasRef.current!;
      setIsDragging(false);

      const { offsetX, offsetY } = getMousePosition(event);

      if (activeActionRef.current === "select") {
        canvasCurrent.style.cursor = "default";
        return;
      }

      if (activeActionRef.current === "draw") {
        if (!activeDraw.current) return;
        activeDraw.current.endX = offsetX;
        activeDraw.current.endY = offsetY;
        if (activeDraw.current.endX < activeDraw.current.startX!) {
          const a = activeDraw.current.endX;
          activeDraw.current.endX = activeDraw.current.startX;
          activeDraw.current.startX = a;
        }
        if (activeDraw.current.endY < activeDraw.current.startY!) {
          const a = activeDraw.current.endY;
          activeDraw.current.endY = activeDraw.current.startY;
          activeDraw.current.startY = a;
        }
        diagrams.current.push(activeDraw.current);
        activeDraw.current = null;
        startX.current = null;
        startY.current = null;
      }

      if (activeActionRef.current === "move") {
        setActiveAction("select");
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const canvasCurrent = canvasRef.current!;
      const { offsetX, offsetY } = getMousePosition(event);

      if (activeActionRef.current === "select") {
        const hoveredDraw = getDrawAtPosition(
          offsetX,
          offsetY,
          diagrams.current,
          ctx,
        );

        const hoveredSelectionBox = hoverOverSelectionBox(
          shapeSelectionBox.current,
          offsetX,
          offsetY,
        );

        canvasCurrent.style.cursor = hoveredSelectionBox
          ? hoveredSelectionBox.cursor
          : hoveredDraw
            ? "move"
            : "default";

        return;
      }

      if (activeActionRef.current === "draw") {
        canvasCurrent.style.cursor = "crosshair";

        if (!activeDraw.current) return;

        currentX.current = offsetX;
        currentY.current = offsetY;

        if (activeDraw.current.shape === "freeHand") {
          activeDraw.current.points?.push({
            x: currentX.current,
            y: currentY.current,
          });
        } else {
          activeDraw.current.endX = currentX.current;
          activeDraw.current.endY = currentY.current;
        }
      }

      if (activeActionRef.current === "move") {
        canvasCurrent.style.cursor = "move";

        const draw = moveDraw(
          offsetX,
          offsetY,
          movingOffset.current.x,
          movingOffset.current.y,
          selectedDraw.current!,
          diagrams.current,
        );

        modifiedDrawState.current = JSON.parse(JSON.stringify(draw));

        if (!draw) return;

        shapeSelectionBox.current = handleShapeSelectionBox(draw, ctx);
      }
    };

    canvasCurrent.addEventListener("wheel", handleScroll);
    canvasCurrent.addEventListener("mousedown", handleMouseDown);
    canvasCurrent.addEventListener("mouseup", handleMouseUp);
    canvasCurrent.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(renderInterval);
      canvasCurrent.removeEventListener("wheel", handleScroll);
      canvasCurrent.removeEventListener("mousedown", handleMouseDown);
      canvasCurrent.removeEventListener("mouseup", handleMouseUp);
      canvasCurrent.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="w-screen h-screen relative">
      {/* Home Icon */}
      <div className="fixed z-2 w-fit h-fit bg-neutral-900 rounded-md left-3 top-3">
        <div className="bg-green-400/25 z-1 rounded-lg px-1.5 py-1 flex gap-1.5 items-center">
          <Button
            className={`bg-transparent relative p-2 hover:bg-green-600/20 cursor-pointer`}
            onClick={() => {
              router.push("/");
            }}
          >
            <AiOutlineHome className="text-white" size="18" />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="fixed z-2 w-fit h-fit bg-black rounded-lg left-1/2 transform -translate-x-1/2 top-3">
        <div className="bg-green-400/25 z-1 rounded-lg px-1.5 py-1 flex gap-1.5 items-center">
          {/* Select Icon */}
          <Button
            size="icon"
            className={`bg-transparent relative p-2 ${activeAction === "select" || activeAction === "move" || activeAction === "resize" ? "bg-green-600 hover:bg-green-600" : "hover:bg-green-600/20"} cursor-pointer`}
            onClick={() => {
              setActiveAction("select");
              //   if (activeDraw.current?.shape === "text") {
              // activeDraw.current = null;
              // shapeSelectionBox.current = null;
              //   }
            }}
          >
            {activeAction === "select" ||
            activeAction === "move" ||
            activeAction === "resize" ? (
              <PiCursorFill className="text-white" size="18" />
            ) : (
              <PiCursor className="text-white" size="18" />
            )}
            <p className="text-white font-mono absolute text-[8px] right-1 bottom-1">
              1
            </p>
          </Button>

          {/* Rectangle */}
          <Button
            size="icon"
            className={`bg-transparent relative p-2 ${activeAction === "draw" && activeShape === "rectangle" ? "bg-green-600 hover:bg-green-600" : "hover:bg-green-600/20"} cursor-pointer`}
            onClick={() => {
              setActiveAction("draw");
              setActiveShape("rectangle");
              //   if (activeDraw.current?.shape === "text") {
              //     activeDraw.current = null;
              //     shapeSelectionBox.current = null;
              //   }
            }}
          >
            {activeAction === "draw" && activeShape === "rectangle" ? (
              <PiSquareFill className="text-white" size="18" />
            ) : (
              <PiSquare className="text-white" size="18" />
            )}
            <p className="text-white font-mono absolute text-[8px] right-1 bottom-1">
              2
            </p>
          </Button>

          {/* Diamond */}
          <Button
            size="icon"
            className={`bg-transparent relative p-2 ${activeAction === "draw" && activeShape === "diamond" ? "bg-green-600 hover:bg-green-600" : "hover:bg-green-600/20"} cursor-pointer`}
            onClick={() => {
              setActiveAction("draw");
              setActiveShape("diamond");
              //   if (activeDraw.current?.shape === "text") {
              //     activeDraw.current = null;
              //     shapeSelectionBox.current = null;
              //   }
            }}
          >
            {activeAction === "draw" && activeShape === "diamond" ? (
              <PiDiamondFill className="text-white" size="18" />
            ) : (
              <PiDiamond className="text-white" size="18" />
            )}
            <p className="text-white font-mono absolute text-[8px] right-1 bottom-1">
              3
            </p>
          </Button>

          {/* Circle */}
          <Button
            size="icon"
            className={`bg-transparent relative p-2 ${activeAction === "draw" && activeShape === "circle" ? "bg-green-600 hover:bg-green-600" : "hover:bg-green-600/20"} cursor-pointer`}
            onClick={() => {
              setActiveAction("draw");
              setActiveShape("circle");
              //   if (activeDraw.current?.shape === "text") {
              //     activeDraw.current = null;
              //     shapeSelectionBox.current = null;
              //   }
            }}
          >
            {activeAction === "draw" && activeShape === "circle" ? (
              <PiCircleFill className="text-white" size="18" />
            ) : (
              <PiCircle className="text-white" size="18" />
            )}
            <p className="text-white font-mono absolute text-[8px] right-1 bottom-1">
              4
            </p>
          </Button>

          {/* Line */}
          <Button
            size="icon"
            className={`bg-transparent relative p-2 ${activeAction === "draw" && activeShape === "line" ? "bg-green-600 hover:bg-green-600" : "hover:bg-green-600/20"} cursor-pointer`}
            onClick={() => {
              setActiveAction("draw");
              setActiveShape("line");
              //   if (activeDraw.current?.shape === "text") {
              //     activeDraw.current = null;
              //     shapeSelectionBox.current = null;
              //   }
            }}
          >
            <PiLineVertical className="text-white rotate-90" size="18" />
            <p className="text-white font-mono absolute text-[8px] right-1 bottom-1">
              5
            </p>
          </Button>

          {/* Arrow */}
          <Button
            size="icon"
            className={`bg-transparent relative p-2 ${activeAction === "draw" && activeShape === "arrow" ? "bg-green-600 hover:bg-green-600" : "hover:bg-green-600/20"} cursor-pointer`}
            onClick={() => {
              setActiveAction("draw");
              setActiveShape("arrow");
              //   if (activeDraw.current?.shape === "text") {
              //     activeDraw.current = null;
              //     shapeSelectionBox.current = null;
              //   }
            }}
          >
            <PiArrowRight className="text-white" size="18" />
            <p className="text-white font-mono absolute text-[8px] right-1 bottom-1">
              6
            </p>
          </Button>

          {/* Freehand */}
          <Button
            size="icon"
            className={`bg-transparent relative p-2 ${activeAction === "draw" && activeShape === "freeHand" ? "bg-green-600 hover:bg-green-600" : "hover:bg-green-600/20"} cursor-pointer`}
            onClick={() => {
              setActiveAction("draw");
              setActiveShape("freeHand");
              //   if (activeDraw.current?.shape === "text") {
              //     activeDraw.current = null;
              //     shapeSelectionBox.current = null;
              //   }
            }}
          >
            {activeAction === "draw" && activeShape === "freeHand" ? (
              <PiPencilFill className="text-white" size="18" />
            ) : (
              <PiPencil className="text-white" size="18" />
            )}
            <p className="text-white font-mono absolute text-[8px] right-1 bottom-1">
              7
            </p>
          </Button>

          {/* Text */}
          <Button
            size="icon"
            className={`bg-transparent relative p-2 ${(activeAction === "draw" && activeShape === "text") || activeAction === "edit" ? "bg-green-600 hover:bg-green-600" : "hover:bg-green-600/20"} cursor-pointer`}
            onClick={() => {
              setActiveAction("draw");
              setActiveShape("text");
              //   if (activeDraw.current?.shape === "text") {
              //     activeDraw.current = null;
              //     shapeSelectionBox.current = null;
              //   }
            }}
          >
            <BsFonts className="text-white" size="20" />
            <p className="text-white font-mono absolute text-[8px] right-1 bottom-1">
              8
            </p>
          </Button>

          {/* Eraser */}
          <Button
            size="icon"
            className={`bg-transparent relative p-2 ${activeAction === "erase" ? "bg-green-600 hover:bg-green-600" : "hover:bg-green-600/20"} cursor-pointer`}
            onClick={() => {
              setActiveAction("erase");
              //   if (activeDraw.current?.shape === "text") {
              //     activeDraw.current = null;
              //     shapeSelectionBox.current = null;
              //   }
            }}
          >
            {activeAction === "erase" ? (
              <PiEraserFill className="text-white" size="18" />
            ) : (
              <PiEraser className="text-white" size="18" />
            )}
            <p className="text-white font-mono absolute text-[8px] right-1 bottom-1">
              9
            </p>
          </Button>

          <PiLineVerticalLight size="20" />

          {/* Hand Icon */}
          <Button
            size="icon"
            className={`bg-transparent -ml-1 relative p-2 ${activeAction === "pan" ? "bg-green-600 hover:bg-green-600" : "hover:bg-green-600/20"} cursor-pointer`}
            onClick={() => {
              setActiveAction("pan");
              // if (activeDraw.current?.shape === "text") {
              //   activeDraw.current = null;
              //   shapeSelectionBox.current = null;
              // }
            }}
          >
            {activeAction === "pan" && isDragging ? (
              <LiaHandRock className="text-white" />
            ) : (
              <LiaHandPaper className="text-white" />
            )}
          </Button>

          {/* Zoom Icon */}
          <Button
            size="icon"
            className={`bg-transparent -ml-0.5 relative p-2 ${activeAction === "zoom" ? "bg-green-600 hover:bg-green-600" : "hover:bg-green-600/20"} cursor-pointer`}
            onClick={() => {
              setActiveAction("zoom");
              //   if (activeDraw.current?.shape === "text") {
              //     activeDraw.current = null;
              //     shapeSelectionBox.current = null;
              //   }
            }}
          >
            <TbZoom className="text-white" />
          </Button>
        </div>
      </div>

      {/* Left Sidebar */}
      {/* Small fact: here activeShape refers to the shape selected in the upper toolbar and selectedShape refers to the shape which is currently selected using selection tool */}
      {activeAction === "draw" ||
      (activeAction === "select" && activeShape !== null) ? (
        activeShape === "text" || selectedShape === "text" ? (
          <div className="fixed px-3 py-2 z-2 w-fit h-fit border border-neutral-600 left-3 top-1/2 transform -translate-y-1/2 bg-black rounded-md">
            <div className="space-y-2 items-center rounded-md text-white">
              <div className="text-sm">
                <h3>Color</h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-[#eeeeee] hover:bg-[#eeeeee] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#eeeeee");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#FFD586] hover:bg-[#FFD586] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#FFD586");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#FF9898] hover:bg-[#FF9898] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#FF9898");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#B9D4AA] hover:bg-[#B9D4AA] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#B9D4AA");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#8DD8FF] hover:bg-[#8DD8FF] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#8DD8FF");
                    }}
                  >
                    ..
                  </Button>
                  <PiLineVerticalLight size="20" />
                  <Button
                    size="icon"
                    className="relative cursor-default -mr-1"
                    style={{ backgroundColor: activeStrokeStyle }}
                  ></Button>
                </div>
              </div>
              <div className="text-sm">
                <h3>Font</h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className={`relative cursor-pointer text-white font-[Arial] -mr-1 ${activeFont === "Arial" ? "bg-green-600/40 hover:bg-green-600/40" : "bg-neutral-900 hover:bg-neutral-800"}`}
                    onClick={() => changeActiveFont("Arial")}
                  >
                    Abc
                  </Button>
                  <Button
                    size="sm"
                    className={`relative cursor-pointer text-white font-[Verdana] -mr-1 ${activeFont === "Verdana" ? "bg-green-600/40 hover:bg-green-600/40" : "bg-neutral-900 hover:bg-neutral-800"}`}
                    onClick={() => changeActiveFont("Verdana")}
                  >
                    Abc
                  </Button>
                  <Button
                    size="sm"
                    className={`relative cursor-pointer text-white font-[ComicSansMS] -mr-1 ${activeFont === "Comic Sans MS" ? "bg-green-600/40 hover:bg-green-600/40" : "bg-neutral-900 hover:bg-neutral-800"}`}
                    onClick={() => changeActiveFont("Comic Sans MS")}
                  >
                    Abc
                  </Button>
                </div>
              </div>
              <div className="text-sm">
                <h3>Font Size</h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className={`relative cursor-pointer text-white -mr-1 ${activeFontSize === "20" ? "bg-green-600/40 hover:bg-green-600/40" : "bg-neutral-900 hover:bg-neutral-800"}`}
                    onClick={() => changeActiveFontSize(20)}
                  >
                    S
                  </Button>
                  <Button
                    size="sm"
                    className={`relative cursor-pointer text-white -mr-1 ${activeFontSize === "40" ? "bg-green-600/40 hover:bg-green-600/40" : "bg-neutral-900 hover:bg-neutral-800"}`}
                    onClick={() => changeActiveFontSize(40)}
                  >
                    M
                  </Button>
                  <Button
                    size="sm"
                    className={`relative cursor-pointer text-white -mr-1 ${activeFontSize === "60" ? "bg-green-600/40 hover:bg-green-600/40" : "bg-neutral-900 hover:bg-neutral-800"}`}
                    onClick={() => changeActiveFontSize(60)}
                  >
                    L
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : activeShape === "freeHand" ||
          activeShape === "arrow" ||
          activeShape === "line" ||
          selectedShape === "freeHand" ||
          selectedShape === "arrow" ||
          selectedShape === "line" ? (
          <div className="fixed px-3 py-2 z-2 w-fit h-fit border border-neutral-600 left-3 top-1/2 transform -translate-y-1/2 bg-black rounded-md">
            <div className="space-y-2 items-center rounded-md">
              <div className="text-sm">
                <h3>Stroke</h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-[#eeeeee] hover:bg-[#eeeeee] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#eeeeee");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#FFD586] hover:bg-[#FFD586] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#FFD586");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#FF9898] hover:bg-[#FF9898] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#FF9898");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#B9D4AA] hover:bg-[#B9D4AA] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#B9D4AA");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#8DD8FF] hover:bg-[#8DD8FF] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#8DD8FF");
                    }}
                  >
                    ..
                  </Button>
                  <PiLineVerticalLight size="20" />
                  <Button
                    size="icon"
                    className="relative cursor-default -mr-1"
                    style={{ backgroundColor: activeStrokeStyle }}
                  ></Button>
                </div>
              </div>
              <div className="text-sm">
                <h3>Stroke Width</h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className={`relative cursor-pointer text-white -mr-1 ${activeLineWidth === 2 ? "bg-green-600/40 hover:bg-green-600/40" : "bg-neutral-900 hover:bg-neutral-800"}`}
                    onClick={() => {
                      changeActiveLineWidth(2);
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M4.167 10h11.666"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </Button>
                  <Button
                    size="sm"
                    className={`relative cursor-pointer text-white -mr-1 ${activeLineWidth === 3 ? "bg-green-600/40 hover:bg-green-600/40" : "bg-neutral-900 hover:bg-neutral-800"}`}
                    onClick={() => {
                      changeActiveLineWidth(3);
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M5 10h10"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </Button>
                  <Button
                    size="sm"
                    className={`relative cursor-pointer text-white -mr-1 ${activeLineWidth === 4 ? "bg-green-600/40 hover:bg-green-600/40" : "bg-neutral-900 hover:bg-neutral-800"}`}
                    onClick={() => {
                      changeActiveLineWidth(4);
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M5 10h10"
                        stroke="currentColor"
                        strokeWidth="3.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed px-3 py-2 z-2 w-fit h-fit border border-neutral-600 left-3 top-1/2 transform -translate-y-1/2 bg-black rounded-md">
            <div className="space-y-2 items-center rounded-md">
              <div className="text-sm">
                <h3>Stroke</h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-[#eeeeee] hover:bg-[#eeeeee] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#eeeeee");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#FFD586] hover:bg-[#FFD586] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#FFD586");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#FF9898] hover:bg-[#FF9898] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#FF9898");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#B9D4AA] hover:bg-[#B9D4AA] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#B9D4AA");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#8DD8FF] hover:bg-[#8DD8FF] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveStrokeStyle("#8DD8FF");
                    }}
                  >
                    ..
                  </Button>
                  <PiLineVerticalLight size="20" />
                  <Button
                    size="icon"
                    className="relative cursor-default -mr-1"
                    style={{ backgroundColor: activeStrokeStyle }}
                  ></Button>
                </div>
              </div>
              <div className="text-sm">
                <h3>Background</h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="relative cursor-pointer -mr-1 text-transparent hover:bg-transparent bg-transparent border border-gray-400/20"
                    onClick={() => {
                      changeActiveFillStyle("#eeeeee00");
                    }}
                  >
                    .
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#FFD58660] hover:bg-[#FFD58660] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveFillStyle("#FFD58660");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#FF989860] hover:bg-[#FF989860] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveFillStyle("#FF989860");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#B9D4AA60] hover:bg-[#B9D4AA60] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveFillStyle("#B9D4AA60");
                    }}
                  >
                    ..
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#8DD8FF60] hover:bg-[#8DD8FF60] relative cursor-pointer -mr-1 text-transparent"
                    onClick={() => {
                      changeActiveFillStyle("#8DD8FF60");
                    }}
                  >
                    ..
                  </Button>
                  <PiLineVerticalLight size="20" />
                  <Button
                    size="icon"
                    className="relative cursor-default -mr-1 border"
                    style={{ backgroundColor: activeFillStyle }}
                  ></Button>
                </div>
              </div>
              <div className="text-sm">
                <h3>Stroke Width</h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className={`relative cursor-pointer text-white -mr-1 ${activeLineWidth === 3 ? "bg-green-600/40 hover:bg-green-600/40" : "bg-neutral-900 hover:bg-neutral-800"}`}
                    onClick={() => {
                      changeActiveLineWidth(3);
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M4.167 10h11.666"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </Button>
                  <Button
                    size="sm"
                    className={`relative cursor-pointer text-white -mr-1 ${activeLineWidth === 6 ? "bg-green-600/40 hover:bg-green-600/40" : "bg-neutral-900 hover:bg-neutral-800"}`}
                    onClick={() => {
                      changeActiveLineWidth(6);
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M5 10h10"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </Button>
                  <Button
                    size="sm"
                    className={`relative cursor-pointer text-white -mr-1 ${activeLineWidth === 9 ? "bg-green-600/40 hover:bg-green-600/40" : "bg-neutral-900 hover:bg-neutral-800"}`}
                    onClick={() => {
                      changeActiveLineWidth(9);
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M5 10h10"
                        stroke="currentColor"
                        strokeWidth="3.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <></>
      )}

      {isClient ? (
        <canvas
          ref={canvasRef}
          className="bg-neutral-900 absolute top-0 left-0 z-1"
          width={window.innerWidth}
          height={window.innerHeight}
        ></canvas>
      ) : (
        <canvas
          ref={canvasRef}
          className="bg-neutral-900 absolute top-0 left-0 z-1"
        ></canvas>
      )}
    </div>
  );
}
