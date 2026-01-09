import useStateStore from "@/context/stateStore";
import useToolPropertiesStore, {
  defaultArrowProperties,
} from "@/context/toolPropertiesStore";
import useHistoryStore, { ArrowShapeWithProps } from "@/context/historyStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";
import { createShapeId } from "./createShapeId";
import { getPointerPositionRelativeToStage } from "./getPointerPosition";

export function useDrawArrowTool() {
  const tool = useStateStore((state) => state.selectedTool);
  const properties = useToolPropertiesStore(
    (s) => s.properties.arrow ?? defaultArrowProperties
  );

  const arrows = useHistoryStore((state) => state.current.arrows);
  const addArrow = useHistoryStore((state) => state.addArrow);
  const updateArrowInStore = useHistoryStore((state) => state.updateArrow);
  const saveToHistory = useHistoryStore((state) => state.saveToHistory);

  const isDrawing = useRef(false);
  const currentArrowId = useRef<string | null>(null);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "arrow") return;

    // Save current state before starting new drawing
    saveToHistory();

    isDrawing.current = true;

    const stage = e.target.getStage();
    const pos = stage ? getPointerPositionRelativeToStage(stage) : null;
    if (!pos) return;

    const id = createShapeId();
    currentArrowId.current = id;

    addArrow({
      id,
      x: pos.x,
      y: pos.y,
      points: [0, 0, 0, 0],
      stroke: properties.stroke,
      strokeWidth: properties.strokeWidth,
      opacity: properties.opacity,
    });
  };

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current || tool !== "arrow") return;

    const stage = e.target.getStage();
    const pos = stage ? getPointerPositionRelativeToStage(stage) : null;
    if (!pos) return;

    if (currentArrowId.current) {
      const arrow = arrows.find((a) => a.id === currentArrowId.current);
      if (arrow) {
        updateArrowInStore(currentArrowId.current, {
          points: [0, 0, pos.x - arrow.x, pos.y - arrow.y],
        });
      }
    }
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    currentArrowId.current = null;
  };

  const updateArrow = (id: string, updates: Partial<ArrowShapeWithProps>) => {
    saveToHistory();
    updateArrowInStore(id, updates);
  };

  return {
    arrows,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    updateArrow,
  };
}
