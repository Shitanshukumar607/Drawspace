import useStateStore from "@/context/stateStore";
import useToolPropertiesStore, {
  defaultPenProperties,
  defaultEraserProperties,
} from "@/context/toolPropertiesStore";
import useHistoryStore from "@/context/historyStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";
import { createShapeId } from "./createShapeId";
import { getPointerPositionRelativeToStage } from "./getPointerPosition";

export function useFreeDrawingTool() {
  const tool = useStateStore((state) => state.selectedTool);

  const penProperties = useToolPropertiesStore(
    (state) => state.properties.pen ?? defaultPenProperties
  );
  const eraserProperties = useToolPropertiesStore(
    (state) => state.properties.eraser ?? defaultEraserProperties
  );

  const lines = useHistoryStore((state) => state.current.freeDrawingLines);
  const addLine = useHistoryStore((state) => state.addFreeDrawingLine);
  const updateLastLine = useHistoryStore(
    (state) => state.updateLastFreeDrawingLine
  );
  const saveToHistory = useHistoryStore((state) => state.saveToHistory);

  const isDrawing = useRef(false);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "pen" && tool !== "eraser") return;

    // Save current state before starting new drawing
    saveToHistory();

    isDrawing.current = true;
    const stage = e.target.getStage();
    const pos = stage ? getPointerPositionRelativeToStage(stage) : null;

    if (!pos) return;
    const lineProps =
      tool === "pen"
        ? {
            stroke: penProperties.stroke,
            strokeWidth: penProperties.strokeWidth,
            opacity: penProperties.opacity,
          }
        : {
            strokeWidth: eraserProperties.strokeWidth,
            opacity: eraserProperties.opacity,
          };

    addLine({
      id: createShapeId(),
      tool,
      points: [pos.x, pos.y],
      ...lineProps,
    });
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "pen" && tool !== "eraser") return;

    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const point = getPointerPositionRelativeToStage(stage);
    if (!point) return;

    updateLastLine((line) => ({
      ...line,
      points: line.points.concat([point.x, point.y]),
    }));
  };

  return {
    lines,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
