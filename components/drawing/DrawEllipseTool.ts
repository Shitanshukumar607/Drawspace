import useStateStore from "@/context/stateStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { EllipseShape } from "./types";
import { createShapeId } from "./createShapeId";

export function useEllipseTool() {
  const tool = useStateStore((state) => state.selectedTool);
  const isDrawing = useRef(false);
  const currentDraw = useRef<{
    id: string;
    startX: number;
    startY: number;
  } | null>(null);

  const [ellipses, setEllipses] = useState<EllipseShape[]>([]);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "ellipse") return;
    isDrawing.current = true;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    const id = createShapeId();
    currentDraw.current = { id, startX: pos.x, startY: pos.y };

    setEllipses((prevEllipses) => [
      ...prevEllipses,
      {
        id,
        x: pos.x,
        y: pos.y,
        radiusX: 0,
        radiusY: 0,
      },
    ]);
  };

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current || tool !== "ellipse") return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    const current = currentDraw.current;
    if (!current) return;

    const { startX, startY, id } = current;
    const radiusX = Math.max(Math.abs(pos.x - startX) / 2, 1);
    const radiusY = Math.max(Math.abs(pos.y - startY) / 2, 1);
    const x = (startX + pos.x) / 2;
    const y = (startY + pos.y) / 2;

    setEllipses((prevEllipses) =>
      prevEllipses.map((ellipse) =>
        ellipse.id === id ? { ...ellipse, x, y, radiusX, radiusY } : ellipse
      )
    );
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    currentDraw.current = null;
  };

  const updateEllipse = (id: string, updates: Partial<EllipseShape>) => {
    setEllipses((prevEllipses) =>
      prevEllipses.map((ellipse) =>
        ellipse.id === id ? { ...ellipse, ...updates } : ellipse
      )
    );
  };

  return {
    ellipses,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    updateEllipse,
  };
}
