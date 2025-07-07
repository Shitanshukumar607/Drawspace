"use client";

import { Image as KonvaImage, Layer, Line, Stage } from "react-konva";
import { freeDrawingTool } from "./drawing/FreeDrawingTool";
import useStateStore from "@/context/stateStore";
import { drawLineTool } from "./drawing/DrawLineTool";

const CanvasComponent: React.FC = () => {
  const selectedTool = useStateStore((state) => state.selectedTool);

  const freeDrawing = freeDrawingTool();
  const drawingLines = drawLineTool();

  let drawingTool: any;

  if (selectedTool === "pen" || selectedTool === "eraser") {
    drawingTool = freeDrawing;
  } else if (selectedTool === "line") {
    drawingTool = drawingLines;
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
              />
            ) : null
          )}
        </Layer>
      </Stage>
    </>
  );
};

export default CanvasComponent;
