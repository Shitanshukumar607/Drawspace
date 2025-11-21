import useStateStore from "@/context/stateStore";
import useToolPropertiesStore, {
  defaultPenProperties,
  defaultEraserProperties,
} from "@/context/toolPropertiesStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { FreeDrawingLine } from "./types";
import { createShapeId } from "./createShapeId";

export function useFreeDrawingTool() {
  const tool = useStateStore((state) => state.selectedTool);

  const penProperties = useToolPropertiesStore(
    (state) => state.properties.pen ?? defaultPenProperties
  );
  const eraserProperties = useToolPropertiesStore(
    (state) => state.properties.eraser ?? defaultEraserProperties
  );

  const isDrawing = useRef(false);
  const [lines, setLines] = useState<FreeDrawingLine[]>([]);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "pen" && tool !== "eraser") return;

    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition() || null;

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

    setLines((prev) => [
      ...prev,
      {
        id: createShapeId(),
        tool,
        points: [pos.x, pos.y],
        ...lineProps,
      },
    ]);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "pen" && tool !== "eraser") return;

    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    setLines((prev) => {
      if (prev.length === 0) return prev;

      const next = prev.slice();
      const last = next[next.length - 1];
      const updatedLast: FreeDrawingLine = {
        ...last,
        points: last.points.concat([point.x, point.y]),
      };
      next[next.length - 1] = updatedLast;
      return next;
    });
  };

  return {
    lines,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
