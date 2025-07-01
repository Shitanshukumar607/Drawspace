"use client";

import { useOptions } from "@/context/options";
import { Canvas, PencilBrush, Rect, Shadow } from "fabric";
import { useEffect, useRef } from "react";

const CanvasComponent = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<Canvas | null>(null);

  const { pencilOptions, canvasOptions, addRectangle } = useOptions();

  const resizeCanvas = () => {
    if (canvasEl.current && fabricCanvas.current) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvasEl.current.width = width;
      canvasEl.current.height = height;
      fabricCanvas.current.setDimensions({ width, height });
    }
  };

  useEffect(() => {
    if (!canvasEl.current) return;

    const canvas = new Canvas(canvasEl.current, {
      backgroundColor: canvasOptions.backgroundColor,
      isDrawingMode: canvasOptions.isDrawingMode,
      selection: canvasOptions.selection,
    });

    fabricCanvas.current = canvas;

    const brush = new PencilBrush(canvas);
    brush.color = pencilOptions.color;
    brush.width = pencilOptions.width;
    brush.drawStraightLine = pencilOptions.drawStraightLine;
    brush.shadow = pencilOptions.shadow;
    brush.limitedToCanvasSize = true;
    canvas.freeDrawingBrush = brush;

    addRectangle(canvas);

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  console.log("Canvas initialized with fabric.js");

  return (
    <div>
      <div className="flex gap-4 items-center bg-white border-b border-gray-300"></div>

        <canvas ref={canvasEl} className="fixed top-0 left-0" />
    </div>
  );
};

export default CanvasComponent;
