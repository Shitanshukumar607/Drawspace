"use client";

import useStateStore from "@/context/stateStore";
import { useEffect, useState } from "react";
import { Ellipse, Layer, Line, Rect, Stage } from "react-konva";
import { useDrawLineTool } from "./drawing/DrawLineTool";
import { useDrawRectangleTool } from "./drawing/DrawRectangleTool";
import { useFreeDrawingTool } from "./drawing/FreeDrawingTool";
import { useEllipseTool } from "./drawing/DrawEllipseTool";

const CanvasComponent: React.FC = () => {
  const selectedTool = useStateStore((state) => state.selectedTool);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight - 25);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const freeDrawing = useFreeDrawingTool();
  const drawingLines = useDrawLineTool();
  const drawingRectangle = useDrawRectangleTool();
  const drawingEllipse = useEllipseTool();

  let drawingTool;

  if (selectedTool === "pen" || selectedTool === "eraser") {
    drawingTool = freeDrawing;
  } else if (selectedTool === "line") {
    drawingTool = drawingLines;
  } else if (selectedTool === "rectangle") {
    drawingTool = drawingRectangle;
  } else if (selectedTool === "ellipse") {
    drawingTool = drawingEllipse;
  } else {
    drawingTool = null;
  }

  return (
    <>
      <Stage
        width={width}
        height={height}
        onMouseDown={drawingTool?.handlePointerDown}
        onMouseMove={drawingTool?.handlePointerMove}
        onMouseUp={drawingTool?.handlePointerUp}
        onTouchStart={drawingTool?.handlePointerDown}
        onTouchMove={drawingTool?.handlePointerMove}
        onTouchEnd={drawingTool?.handlePointerUp}
      >
        <Layer>
          {freeDrawing.lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
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

        <Layer>
          {drawingEllipse.ellipses.map((ellipse, i) => (
            <Ellipse
              key={i}
              x={ellipse.x}
              y={ellipse.y}
              radiusX={ellipse.radiusX}
              radiusY={ellipse.radiusY}
              fill="transparent"
              stroke="black"
              strokeWidth={4}
              draggable={selectedTool === "pointer"}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default CanvasComponent;
