import useStateStore from "@/context/stateStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";
import { createShapeId } from "./createShapeId";
import useToolPropertiesStore, {
  defaultRectangleProperties,
} from "@/context/toolPropertiesStore";
import useHistoryStore, {
  RectangleShapeWithProps,
} from "@/context/historyStore";
import { getPointerPositionRelativeToStage } from "./getPointerPosition";

export function useDrawRectangleTool() {
  const tool = useStateStore((state) => state.selectedTool);
  const properties = useToolPropertiesStore(
    (s) => s.properties.rectangle ?? defaultRectangleProperties
  );

  const rectangles = useHistoryStore((state) => state.current.rectangles);
  const addRectangle = useHistoryStore((state) => state.addRectangle);
  const updateRectangleInStore = useHistoryStore(
    (state) => state.updateRectangle
  );
  const saveToHistory = useHistoryStore((state) => state.saveToHistory);

  const isDrawing = useRef(false);
  const currentDraw = useRef<{
    id: string;
    startX: number;
    startY: number;
  } | null>(null);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "rectangle") return;

    // Save current state before starting new drawing
    saveToHistory();

    isDrawing.current = true;

    const stage = e.target.getStage();
    const pos = stage ? getPointerPositionRelativeToStage(stage) : null;
    if (!pos) return;

    const id = createShapeId();
    currentDraw.current = { id, startX: pos.x, startY: pos.y };

    addRectangle({
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
    });
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

    updateRectangleInStore(id, { x, y, width, height });
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    currentDraw.current = null;
  };

  const updateRectangle = (
    id: string,
    updates: Partial<RectangleShapeWithProps>
  ) => {
    saveToHistory();
    updateRectangleInStore(id, updates);
  };

  return {
    rectangles,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    updateRectangle,
  };
}
