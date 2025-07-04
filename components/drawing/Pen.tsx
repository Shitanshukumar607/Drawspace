import { PencilOptions } from "@/context/optionsStore";
import { Canvas, PencilBrush, Shadow } from "fabric";

export const drawUsingPen = (
  canvas: Canvas,
  selectedTool: string,
  pencilOptions: PencilOptions
) => {
  console.log("Drawing with pen tool, selected tool:", selectedTool);

  if (selectedTool !== "pen") {
    canvas.isDrawingMode = false;
    return;
  }

  canvas.isDrawingMode = true;
  const brush = new PencilBrush(canvas);
  brush.color = pencilOptions.color;
  brush.width = pencilOptions.width;
  brush.drawStraightLine = pencilOptions.drawStraightLine;
  brush.limitedToCanvasSize = true;
  brush.shadow = new Shadow({
    color: pencilOptions.shadow.color,
    blur: pencilOptions.shadow.blur,
    offsetX: pencilOptions.shadow.offsetX,
    offsetY: pencilOptions.shadow.offsetY,
    affectStroke: true,
  });

  canvas.freeDrawingBrush = brush;
};
