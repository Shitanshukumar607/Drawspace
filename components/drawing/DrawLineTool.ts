import useStateStore from "@/context/stateStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";

interface LinePoints {
  initialX: number | null;
  initialY: number | null;
  x: number | null;
  y: number | null;
}

export function drawLineTool() {
  const tool = useStateStore((state) => state.selectedTool);
  const isDrawing = useRef(false);

  const [lines, setLines] = useState<LinePoints[]>([]);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "line") return;
    isDrawing.current = true;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setLines((prevLines) => [
      ...prevLines,
      {
        initialX: pos.x,
        initialY: pos.y,
        x: pos.x,
        y: pos.y,
      },
    ]);
  };

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current || tool !== "line") return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setLines((prevLines) => {
      const updated = [...prevLines];
      const last = updated[updated.length - 1];
      updated[updated.length - 1] = {
        ...last,
        x: pos.x,
        y: pos.y,
      };
      return updated;
    });
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  return { lines, handlePointerDown, handlePointerMove, handlePointerUp };
}
