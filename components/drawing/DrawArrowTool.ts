import useStateStore from "@/context/stateStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { ArrowShape } from "./types";
import { createShapeId } from "./createShapeId";

export function useDrawArrowTool() {
  const tool = useStateStore((state) => state.selectedTool);
  const isDrawing = useRef(false);

  const [arrows, setArrows] = useState<ArrowShape[]>([]);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "arrow") return;
    isDrawing.current = true;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setArrows((prevArrows) => [
      ...prevArrows,
      {
        id: createShapeId(),
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

    setArrows((prevArrows) =>
      prevArrows.map((arrow, index) =>
        index === prevArrows.length - 1
          ? { ...arrow, points: [0, 0, pos.x - arrow.x, pos.y - arrow.y] }
          : arrow
      )
    );
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const updateArrow = (id: string, updates: Partial<ArrowShape>) => {
    setArrows((prevArrows) =>
      prevArrows.map((arrow) =>
        arrow.id === id ? { ...arrow, ...updates } : arrow
      )
    );
  };

  return {
    arrows,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    updateArrow,
  };
}
