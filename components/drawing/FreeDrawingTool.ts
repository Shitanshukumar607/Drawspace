import useStateStore from "@/context/stateStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";

interface LinePoints {
  points: number[];
  tool: string;
}

export function useFreeDrawingTool() {
  const tool = useStateStore((state) => state.selectedTool);

  const isDrawing = useRef(false);
  const [lines, setLines] = useState<LinePoints[]>([]);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "pen" && tool !== "eraser") return;

    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition() || null;

    if (!pos) return;
    setLines((prev) => [...prev, { tool, points: [pos.x, pos.y] }]);
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
      const updatedLast: LinePoints = {
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
