"use client";

import { useOptionsStore } from "@/context/optionsStore";
import useStateStore, { StateStore } from "@/context/stateStore";
import { Canvas } from "fabric";
import { useEffect, useRef } from "react";
import { setupCircleDrawing } from "./drawing/DrawCircle";
import { setupRectangleDrawing } from "./drawing/DrawRectangle";

const CanvasComponent = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvasInstance = useRef<Canvas | null>(null);

  const { canvasOptions, setCanvasRef } = useOptionsStore();

  let currentTool = useStateStore((state: StateStore) => state.selectedTool);

  const shapeProps = {
    stroke: "blue",
    strokeWidth: 2,
  };

  const resizeCanvas = () => {
    if (canvasEl.current && canvasInstance.current) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvasEl.current.width = width;
      canvasEl.current.height = height;
      canvasInstance.current.setDimensions({ width, height });
    }
  };

  useEffect(() => {
    if (!canvasEl.current || canvasInstance.current) return;

    const canvas = new Canvas(canvasEl.current, {
      ...canvasOptions,
    });
    canvasInstance.current = canvas;
    setCanvasRef?.(canvas);

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.dispose();
      canvasInstance.current = null;
    };
  }, [setCanvasRef]);

  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    let cleanup: (() => void) | null = null;

    if (currentTool === "rectangle") {
      cleanup = setupRectangleDrawing(canvas, shapeProps);
    } else if (currentTool === "circle") {
      cleanup = setupCircleDrawing(canvas, shapeProps);
    }

    return () => {
      cleanup?.();
    };
  }, [currentTool]);

  return (
    <div>
      <canvas ref={canvasEl} className="fixed cursor-crosshair" />
    </div>
  );
};

export default CanvasComponent;
