import { Canvas } from "fabric";
import { RefObject } from "react";

export const resizeCanvas = (
  canvasEl: RefObject<HTMLCanvasElement | null>,
  canvasInstance: RefObject<Canvas | null>
) => {
  if (canvasEl?.current && canvasInstance?.current) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvasEl.current.width = width;
    canvasEl.current.height = height;
    canvasInstance.current.setDimensions({ width, height });
  }
};
