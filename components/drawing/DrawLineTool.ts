import useStateStore from "@/context/stateStore";
import useToolPropertiesStore, {
  LineProperties,
  defaultLineProperties,
} from "@/context/toolPropertiesStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { LineShape } from "./types";
import { createShapeId } from "./createShapeId";

export function useDrawLineTool() {
  const tool = useStateStore((state) => state.selectedTool);
  const properties = useToolPropertiesStore(
    (s) => s.properties.line ?? defaultLineProperties
  );
  const isDrawing = useRef(false);
  const currentLineId = useRef<string | null>(null);

  const [lines, setLines] = useState<(LineShape & LineProperties)[]>([]);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "line") return;
    isDrawing.current = true;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    const newLine: LineShape & LineProperties = {
      id: createShapeId(),
      initialX: pos.x,
      initialY: pos.y,
      x: pos.x,
      y: pos.y,
      stroke: properties.stroke,
      strokeWidth: properties.strokeWidth,
      opacity: properties.opacity,
    };

    setLines((prevLines) => [...prevLines, newLine]);
    currentLineId.current = newLine.id;
  };

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current || tool !== "line") return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setLines((prevLines) => {
      if (!currentLineId.current) return prevLines;
      return prevLines.map((line) =>
        line.id === currentLineId.current
          ? { ...line, x: pos.x, y: pos.y }
          : line
      );
    });
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    currentLineId.current = null;
  };

  const updateLine = (
    id: string,
    updates: Partial<LineShape & LineProperties>
  ) => {
    setLines((prevLines) =>
      prevLines.map((line) => (line.id === id ? { ...line, ...updates } : line))
    );
  };

  return {
    lines,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    updateLine,
  };
}
