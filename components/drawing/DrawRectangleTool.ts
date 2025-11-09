import useStateStore from "@/context/stateStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";

interface LinePoints {
  initialX: number;
  initialY: number;
  x: number;
  y: number;
}

export function useDrawRectangleTool() {
  const tool = useStateStore((state) => state.selectedTool);
  const isDrawing = useRef(false);
  const [rectangles, setRectangles] = useState<LinePoints[]>([]);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "rectangle") return;
    isDrawing.current = true;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setRectangles((prevRects) => [
      ...prevRects,
      {
        initialX: pos.x,
        initialY: pos.y,
        x: pos.x,
        y: pos.y,
      },
    ]);
  };

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current || tool !== "rectangle") return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setRectangles((prevRects) => {
      const updated = [...prevRects];
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

  return { rectangles, handlePointerDown, handlePointerMove, handlePointerUp };
}
