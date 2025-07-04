"use client";

import { useOptionsStore } from "@/context/optionsStore";
import useStateStore from "@/context/stateStore";
import { resizeCanvas } from "@/utils/resizeCanvas";
import { Canvas } from "fabric";
import { useEffect, useRef } from "react";
import { setupCircleDrawing } from "./drawing/DrawCircle";
import { setupLineDrawing } from "./drawing/DrawLine";
import { setupRectangleDrawing } from "./drawing/DrawRectangle";
import { drawUsingPen } from "./drawing/Pen";

const CanvasComponent = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvasInstance = useRef<Canvas | null>(null);

  const currentTool = useStateStore((s) => s.selectedTool);
  const setSelectedTool = useStateStore((s) => s.setSelectedTool);

  const canvasOptions = useOptionsStore((s) => s.canvasOptions);
  const updateCanvasOptions = useOptionsStore((s) => s.updateCanvasOptions);
  const pencilOptions = useOptionsStore((s) => s.pencilOptions);
  const shapeOptions = useOptionsStore((s) => s.shapeOptions);

  useEffect(() => {
    if (!canvasEl.current || canvasInstance.current) return;

    const canvas = new Canvas(canvasEl.current, {
      ...canvasOptions,
    });
    canvasInstance.current = canvas;

    resizeCanvas(canvasEl, canvasInstance);
    window.addEventListener("resize", () =>
      resizeCanvas(canvasEl, canvasInstance)
    );

    return () => {
      window.removeEventListener("resize", () =>
        resizeCanvas(canvasEl, canvasInstance)
      );
      canvas.dispose();
      canvasInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    let cleanup: (() => void) | null = null;

    drawUsingPen(canvas, currentTool, { ...pencilOptions, ...shapeOptions });

    if (currentTool === "rectangle") {
      cleanup = setupRectangleDrawing(canvas, shapeOptions, setSelectedTool);
    } else if (currentTool === "circle") {
      cleanup = setupCircleDrawing(canvas, shapeOptions, setSelectedTool);
    } else if (currentTool === "line") {
      cleanup = setupLineDrawing(canvas, shapeOptions, setSelectedTool);
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
