import useStateStore from "@/context/stateStore";
import useToolPropertiesStore, {
  defaultEllipseProperties,
} from "@/context/toolPropertiesStore";
import useHistoryStore, { EllipseShapeWithProps } from "@/context/historyStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";
import { createShapeId } from "./createShapeId";
import { getPointerPositionRelativeToStage } from "./getPointerPosition";

export function useEllipseTool() {
  const tool = useStateStore((state) => state.selectedTool);
  const properties = useToolPropertiesStore(
    (s) => s.properties.ellipse ?? defaultEllipseProperties
  );

  const ellipses = useHistoryStore((state) => state.current.ellipses);
  const addEllipse = useHistoryStore((state) => state.addEllipse);
  const updateEllipseInStore = useHistoryStore((state) => state.updateEllipse);
  const saveToHistory = useHistoryStore((state) => state.saveToHistory);

  const isDrawing = useRef(false);
  const currentDraw = useRef<{
    id: string;
    startX: number;
    startY: number;
  } | null>(null);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "ellipse") return;

    // Save current state before starting new drawing
    saveToHistory();

    isDrawing.current = true;

    const stage = e.target.getStage();
    const pos = stage ? getPointerPositionRelativeToStage(stage) : null;
    if (!pos) return;

    const id = createShapeId();
    currentDraw.current = { id, startX: pos.x, startY: pos.y };

    addEllipse({
      id,
      x: pos.x,
      y: pos.y,
      radiusX: 0,
      radiusY: 0,
      stroke: properties.stroke,
      fill: properties.fill,
      strokeWidth: properties.strokeWidth,
      opacity: properties.opacity,
    });
  };

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current || tool !== "ellipse") return;

    const stage = e.target.getStage();
    const pos = stage ? getPointerPositionRelativeToStage(stage) : null;
    if (!pos) return;

    const current = currentDraw.current;
    if (!current) return;

    const { startX, startY, id } = current;
    const radiusX = Math.max(Math.abs(pos.x - startX) / 2, 1);
    const radiusY = Math.max(Math.abs(pos.y - startY) / 2, 1);
    const x = (startX + pos.x) / 2;
    const y = (startY + pos.y) / 2;

    updateEllipseInStore(id, { x, y, radiusX, radiusY });
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    currentDraw.current = null;
  };

  const updateEllipse = (
    id: string,
    updates: Partial<EllipseShapeWithProps>
  ) => {
    saveToHistory();
    updateEllipseInStore(id, updates);
  };

  return {
    ellipses,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    updateEllipse,
  };
}
