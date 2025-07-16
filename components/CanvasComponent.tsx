"use client";

import useStateStore from "@/context/stateStore";
import { Image as KonvaImage, Layer, Line, Rect, Stage } from "react-konva";
import { drawLineTool } from "./drawing/DrawLineTool";
import { drawRectangleTool } from "./drawing/DrawRectangleTool";
import { freeDrawingTool } from "./drawing/FreeDrawingTool";

const CanvasComponent: React.FC = () => {
  const selectedTool = useStateStore((state) => state.selectedTool);

  const freeDrawing = freeDrawingTool();
  const drawingLines = drawLineTool();
  const drawingRectangle = drawRectangleTool();

  let drawingTool: any;

  if (selectedTool === "pen" || selectedTool === "eraser") {
    drawingTool = freeDrawing;
  } else if (selectedTool === "line") {
    drawingTool = drawingLines;
  } else if (selectedTool === "rectangle") {
    drawingTool = drawingRectangle;
  } else {
    drawingTool = null;
  }

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 25}
        onMouseDown={drawingTool?.handlePointerDown}
        onMouseMove={drawingTool?.handlePointerMove}
        onMouseUp={drawingTool?.handlePointerUp}
        onTouchStart={drawingTool?.handlePointerDown}
        onTouchMove={drawingTool?.handlePointerMove}
        onTouchEnd={drawingTool?.handlePointerUp}
      >
        <Layer>
          {freeDrawing.canvas && (
            <KonvaImage
              ref={freeDrawing.imageRef}
              image={freeDrawing.canvas}
              x={0}
              y={0}
              draggable={selectedTool === "pointer"}
            />
          )}
        </Layer>
        <Layer>
          {drawingLines.lines.map((line, i) =>
            line.initialX !== null &&
            line.initialY !== null &&
            line.x !== null &&
            line.y !== null ? (
              <Line
                key={i}
                points={[line.initialX, line.initialY, line.x, line.y]}
                stroke="black"
                strokeWidth={4}
                lineCap="round"
                lineJoin="round"
                draggable={selectedTool === "pointer"}
              />
            ) : null
          )}
        </Layer>

        <Layer>
          {drawingRectangle.rectangles.map((rect, i) =>
            rect.initialX !== null &&
            rect.initialY !== null &&
            rect.x !== null &&
            rect.y !== null ? (
              <Rect
                key={i}
                x={Math.min(rect.initialX, rect.x)}
                y={Math.min(rect.initialY, rect.y)}
                width={Math.abs(rect.x - rect.initialX)}
                height={Math.abs(rect.y - rect.initialY)}
                fill="transparent"
                stroke="black"
                strokeWidth={4}
                draggable={selectedTool === "pointer"}
              />
            ) : null
          )}
        </Layer>
      </Stage>
    </>
  );
};

export default CanvasComponent;
