"use client";

import useStateStore from "@/context/stateStore";
import { useEffect, useState } from "react";
import { Arrow, Ellipse, Layer, Line, Rect, Stage } from "react-konva";
import { useEllipseTool } from "./drawing/DrawEllipseTool";
import { useDrawLineTool } from "./drawing/DrawLineTool";
import { useDrawRectangleTool } from "./drawing/DrawRectangleTool";
import { useFreeDrawingTool } from "./drawing/FreeDrawingTool";
import { useDrawArrowTool } from "./drawing/DrawArrowTool";

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
  const drawingArrow = useDrawArrowTool();

  let drawingTool;

  if (selectedTool === "pen" || selectedTool === "eraser") {
    drawingTool = freeDrawing;
  } else if (selectedTool === "line") {
    drawingTool = drawingLines;
  } else if (selectedTool === "rectangle") {
    drawingTool = drawingRectangle;
  } else if (selectedTool === "ellipse") {
    drawingTool = drawingEllipse;
  } else if (selectedTool === "arrow") {
    drawingTool = drawingArrow;
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
          {drawingLines.lines.map((line, i) => (
            <Line
              key={i}
              points={[line.initialX, line.initialY, line.x, line.y]}
              stroke="black"
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
              draggable={selectedTool === "pointer"}
            />
          ))}
        </Layer>

        <Layer>
          {drawingRectangle.rectangles.map((rect, i) => (
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
          ))}
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

        <Layer>
          {drawingArrow.arrows.map((arrow, i) => (
            <Arrow
              key={i}
              x={arrow.x}
              y={arrow.y}
              points={arrow.points}
              pointerAtEnding={
                arrow.points[0] !== arrow.points[2] &&
                arrow.points[1] !== arrow.points[3]
              }
              pointerLength={20}
              pointerWidth={20}
              tension={1}
              fill="black"
              stroke="black"
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
              draggable={selectedTool === "pointer"}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default CanvasComponent;
