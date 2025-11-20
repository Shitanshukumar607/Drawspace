"use client";

import { Arrow, Ellipse, Line, Rect } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import {
  ArrowShape,
  EllipseShape,
  FreeDrawingLine,
  LineShape,
  RectangleShape,
} from "./drawing/types";

export type TransformerSelectionType =
  | "rectangle"
  | "ellipse"
  | "line"
  | "arrow";

export interface ShapeRefRegistry {
  (id: string, node: Konva.Node | null): void;
}

interface RectangleShapesProps {
  rectangles: RectangleShape[];
  selectedShapeId: string | null;
  isPointerTool: boolean;
  onSelect: (id: string, type: TransformerSelectionType) => void;
  onDragEnd: (id: string, e: KonvaEventObject<Event>) => void;
  onTransformEnd: (id: string, e: KonvaEventObject<Event>) => void;
  registerRef: ShapeRefRegistry;
}

export const RectangleShapes = ({
  rectangles,
  isPointerTool,
  onSelect,
  onDragEnd,
  onTransformEnd,
  registerRef,
  selectedShapeId,
}: RectangleShapesProps) => (
  <>
    {rectangles.map((rect) => (
      <Rect
        key={rect.id}
        ref={(node) => registerRef(rect.id, node)}
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill="transparent"
        stroke={selectedShapeId === rect.id ? "#1d4ed8" : "black"}
        strokeWidth={4}
        draggable={isPointerTool}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelect(rect.id, "rectangle");
        }}
        onTransformEnd={(e) => onTransformEnd(rect.id, e)}
        onDragEnd={(e) => onDragEnd(rect.id, e)}
      />
    ))}
  </>
);

interface EllipseShapesProps {
  ellipses: EllipseShape[];
  selectedShapeId: string | null;
  isPointerTool: boolean;
  onSelect: (id: string, type: TransformerSelectionType) => void;
  onDragEnd: (id: string, e: KonvaEventObject<Event>) => void;
  onTransformEnd: (id: string, e: KonvaEventObject<Event>) => void;
  registerRef: ShapeRefRegistry;
}

export const EllipseShapes = ({
  ellipses,
  isPointerTool,
  onSelect,
  onDragEnd,
  onTransformEnd,
  registerRef,
  selectedShapeId,
}: EllipseShapesProps) => (
  <>
    {ellipses.map((ellipse) => (
      <Ellipse
        key={ellipse.id}
        ref={(node) => registerRef(ellipse.id, node)}
        x={ellipse.x}
        y={ellipse.y}
        radiusX={ellipse.radiusX}
        radiusY={ellipse.radiusY}
        fill="transparent"
        stroke={selectedShapeId === ellipse.id ? "#1d4ed8" : "black"}
        strokeWidth={4}
        draggable={isPointerTool}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelect(ellipse.id, "ellipse");
        }}
        onTransformEnd={(e) => onTransformEnd(ellipse.id, e)}
        onDragEnd={(e) => onDragEnd(ellipse.id, e)}
      />
    ))}
  </>
);

interface LineShapesProps {
  lines: LineShape[];
  selectedShapeId: string | null;
  isPointerTool: boolean;
  onSelect: (id: string, type: TransformerSelectionType) => void;
  onDragEnd?: (id: string, e: KonvaEventObject<Event>) => void;
  registerRef: ShapeRefRegistry;
}

export const LineShapes = ({
  lines,
  selectedShapeId,
  isPointerTool,
  onSelect,
  onDragEnd,
  registerRef,
}: LineShapesProps) => (
  <>
    {lines.map((line) => (
      <Line
        key={line.id}
        ref={(node) => registerRef(line.id, node)}
        points={[line.initialX, line.initialY, line.x, line.y]}
        stroke={selectedShapeId === line.id ? "#1d4ed8" : "black"}
        strokeWidth={selectedShapeId === line.id ? 5 : 4}
        lineCap="round"
        lineJoin="round"
        draggable={isPointerTool}
        onDragEnd={(e) => onDragEnd?.(line.id, e)}
        onMouseDown={(e) => {
          if (!isPointerTool) return;
          e.cancelBubble = true;
          onSelect(line.id, "line");
        }}
        onTouchStart={(e) => {
          if (!isPointerTool) return;
          e.cancelBubble = true;
          onSelect(line.id, "line");
        }}
      />
    ))}
  </>
);

export const FreeDrawingLines = ({ lines }: { lines: FreeDrawingLine[] }) => (
  <>
    {lines.map((line) => (
      <Line
        key={line.id}
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
  </>
);

interface ArrowShapesProps {
  arrows: ArrowShape[];
  selectedShapeId: string | null;
  isPointerTool: boolean;
  onSelect: (id: string, type: TransformerSelectionType) => void;
  onDragEnd?: (id: string, e: KonvaEventObject<Event>) => void;
  registerRef: ShapeRefRegistry;
}

export const ArrowShapes = ({
  arrows,
  selectedShapeId,
  isPointerTool,
  onSelect,
  onDragEnd,
  registerRef,
}: ArrowShapesProps) => (
  <>
    {arrows.map((arrow) => (
      <Arrow
        key={arrow.id}
        ref={(node) => registerRef(arrow.id, node)}
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
        stroke={selectedShapeId === arrow.id ? "#1d4ed8" : "black"}
        strokeWidth={selectedShapeId === arrow.id ? 5 : 4}
        lineCap="round"
        lineJoin="round"
        draggable={isPointerTool}
        onDragEnd={(e) => onDragEnd?.(arrow.id, e)}
        onMouseDown={(e) => {
          if (!isPointerTool) return;
          e.cancelBubble = true;
          onSelect(arrow.id, "arrow");
        }}
        onTouchStart={(e) => {
          if (!isPointerTool) return;
          e.cancelBubble = true;
          onSelect(arrow.id, "arrow");
        }}
      />
    ))}
  </>
);
