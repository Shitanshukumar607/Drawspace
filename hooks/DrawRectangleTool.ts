import useStateStore from "@/context/stateStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { RectangleShape } from "../types/types";
import { createShapeId } from "./createShapeId";
import useToolPropertiesStore, {
  RectangleProperties,
  defaultRectangleProperties,
} from "@/context/toolPropertiesStore";
import { getPointerPositionRelativeToStage } from "./getPointerPosition";

export function useDrawRectangleTool() {
  const tool = useStateStore((state) => state.selectedTool);
  const properties = useToolPropertiesStore(
    (s) => s.properties.rectangle ?? defaultRectangleProperties
  );

  const isDrawing = useRef(false);
  const currentDraw = useRef<{
    id: string;
    startX: number;
    startY: number;
  } | null>(null);
  const [rectangles, setRectangles] = useState<
    (RectangleShape & RectangleProperties)[]
  >([]);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "rectangle") return;
    isDrawing.current = true;

    const stage = e.target.getStage();
    const pos = stage ? getPointerPositionRelativeToStage(stage) : null;
    if (!pos) return;

    const id = createShapeId();
    currentDraw.current = { id, startX: pos.x, startY: pos.y };

    setRectangles((prevRects) => [
      ...prevRects,
      {
        id,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        stroke: properties.stroke,
        fill: properties.fill,
        strokeWidth: properties.strokeWidth,
        cornerRadius: properties.cornerRadius,
        opacity: properties.opacity,
      },
    ]);
  };

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current || tool !== "rectangle") return;

    const stage = e.target.getStage();
    const pos = stage ? getPointerPositionRelativeToStage(stage) : null;
    if (!pos) return;

    const current = currentDraw.current;
    if (!current) return;

    const { startX, startY, id } = current;
    const x = Math.min(startX, pos.x);
    const y = Math.min(startY, pos.y);
    const width = Math.max(Math.abs(pos.x - startX), 1);
    const height = Math.max(Math.abs(pos.y - startY), 1);

    setRectangles((prevRects) =>
      prevRects.map((rect) =>
        rect.id === id ? { ...rect, x, y, width, height } : rect
      )
    );
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    currentDraw.current = null;
  };

  const updateRectangle = (id: string, updates: Partial<RectangleShape>) => {
    setRectangles((prevRects) =>
      prevRects.map((rect) => (rect.id === id ? { ...rect, ...updates } : rect))
    );
  };

  return {
    rectangles,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    updateRectangle,
  };
}
