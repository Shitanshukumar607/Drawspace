import useStateStore from "@/context/stateStore";
import useToolPropertiesStore, {
  defaultLineProperties,
} from "@/context/toolPropertiesStore";
import useHistoryStore, { LineShapeWithProps } from "@/context/historyStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";
import { createShapeId } from "./createShapeId";
import { getPointerPositionRelativeToStage } from "./getPointerPosition";

export function useDrawLineTool() {
  const tool = useStateStore((state) => state.selectedTool);
  const properties = useToolPropertiesStore(
    (s) => s.properties.line ?? defaultLineProperties
  );

  const lines = useHistoryStore((state) => state.current.lines);
  const addLine = useHistoryStore((state) => state.addLine);
  const updateLineInStore = useHistoryStore((state) => state.updateLine);
  const saveToHistory = useHistoryStore((state) => state.saveToHistory);

  const isDrawing = useRef(false);
  const currentLineId = useRef<string | null>(null);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "line") return;

    // Save current state before starting new drawing
    saveToHistory();

    isDrawing.current = true;

    const stage = e.target.getStage();
    const pos = stage ? getPointerPositionRelativeToStage(stage) : null;
    if (!pos) return;

    const newLine: LineShapeWithProps = {
      id: createShapeId(),
      initialX: pos.x,
      initialY: pos.y,
      x: pos.x,
      y: pos.y,
      stroke: properties.stroke,
      strokeWidth: properties.strokeWidth,
      opacity: properties.opacity,
    };

    addLine(newLine);
    currentLineId.current = newLine.id;
  };

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current || tool !== "line") return;

    const stage = e.target.getStage();
    const pos = stage ? getPointerPositionRelativeToStage(stage) : null;
    if (!pos) return;

    if (currentLineId.current) {
      updateLineInStore(currentLineId.current, { x: pos.x, y: pos.y });
    }
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    currentLineId.current = null;
  };

  const updateLine = (id: string, updates: Partial<LineShapeWithProps>) => {
    saveToHistory();
    updateLineInStore(id, updates);
  };

  return {
    lines,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    updateLine,
  };
}
