import { ShapeOptions } from "@/context/optionsStore";
import { Canvas, CanvasOptions, Line } from "fabric";

interface MouseEventWithPointer {
  pointer: { x: number; y: number };
}

export function setupLineDrawing(
  canvas: Canvas,
  shapeOptions: ShapeOptions,
  setSelectedTool: (tool: string) => void
) {
  let isDrawing = false;
  let line: Line | null = null;

  const onMouseDown = (opt: MouseEventWithPointer) => {
    isDrawing = true;
    const { x, y } = opt.pointer;

    line = new Line([x, y, x, y], {
      ...shapeOptions,
    });

    canvas.add(line);
    canvas.isDrawingMode = true;
    canvas.selection = true;
  };

  const onMouseMove = (opt: MouseEventWithPointer) => {
    if (!isDrawing || !line) return;

    const { x, y } = opt.pointer;
    line.set({ x2: x, y2: y });
    canvas.requestRenderAll();
  };

  const onMouseUp = () => {
    isDrawing = false;
    line = null;

    setSelectedTool("pointer");
    canvas.isDrawingMode = false;
    canvas.selection = true;
  };

  canvas.on("mouse:down", onMouseDown);
  canvas.on("mouse:move", onMouseMove);
  canvas.on("mouse:up", onMouseUp);

  return () => {
    canvas.off("mouse:down", onMouseDown);
    canvas.off("mouse:move", onMouseMove);
    canvas.off("mouse:up", onMouseUp);
  };
}
