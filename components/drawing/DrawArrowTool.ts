import useStateStore from "@/context/stateStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";

interface ArrowType {
  x: number;
  y: number;
  points: number[];
}

export function useDrawArrowTool() {
  const tool = useStateStore((state) => state.selectedTool);
  const isDrawing = useRef(false);

  const [arrows, setArrows] = useState<ArrowType[]>([]);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "arrow") return;
    isDrawing.current = true;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setArrows((prevArrows) => [
      ...prevArrows,
      {
        x: pos.x,
        y: pos.y,
        points: [0, 0, 0, 0],
      },
    ]);
  };

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current || tool !== "arrow") return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setArrows((prevArrows) => {
      const updated = [...prevArrows];
      const last = updated[updated.length - 1];
      updated[updated.length - 1] = {
        ...last,
        points: [0, 0, pos.x - last.x, pos.y - last.y],
      };
      return updated;
    });
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  return { arrows, handlePointerDown, handlePointerMove, handlePointerUp };
}
