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

  const currentTool = useStateStore((state: StateStore) => state.selectedTool);
  const setSelectedTool = useStateStore((s) => s.setSelectedTool);

  const shapeOptions = useOptionsStore((state) => state.shapeOptions);

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
      cleanup = setupRectangleDrawing(canvas, shapeOptions, setSelectedTool);
    } else if (currentTool === "circle") {
      cleanup = setupCircleDrawing(canvas, shapeOptions, setSelectedTool);
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
