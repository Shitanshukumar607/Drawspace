import useStateStore from "@/context/stateStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";

interface EllipseType {
  initialX: number;
  initialY: number;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
}

export function useEllipseTool() {
  const tool = useStateStore((state) => state.selectedTool);
  const isDrawing = useRef(false);

  const [ellipses, setEllipses] = useState<EllipseType[]>([]);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "ellipse") return;
    isDrawing.current = true;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setEllipses((prevEllipses) => [
      ...prevEllipses,
      {
        initialX: pos.x,
        initialY: pos.y,
        x: 0,
        y: 0,
        radiusX: 0,
        radiusY: 0,
      },
    ]);
  };

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current || tool !== "ellipse") return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setEllipses((prevEllipses) => {
      const updated = [...prevEllipses];
      const last = updated[updated.length - 1];
      if (!last) return updated;

      const radiusX = Math.abs(pos.x - (last.initialX || 0)) / 2;
      const radiusY = Math.abs(pos.y - (last.initialY || 0)) / 2;
      updated[updated.length - 1] = {
        ...last,
        x: (last.initialX + pos.x) / 2,
        y: (last.initialY + pos.y) / 2,
        radiusX,
        radiusY,
      };
      return updated;
    });
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  return { ellipses, handlePointerDown, handlePointerMove, handlePointerUp };
}
