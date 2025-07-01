"use client";

import { Canvas, PencilBrush, Shadow } from "fabric";
import { useEffect, useRef } from "react";

const CanvasComponent = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<Canvas | null>(null);

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
      backgroundColor: "#fffce8",
      isDrawingMode: true,
    });

    fabricCanvas.current = canvas;

    const brush = new PencilBrush(canvas);
    brush.color = "#000000";
    brush.width = 5;
    brush.drawStraightLine = true;
    brush.shadow = new Shadow({
      color: "#000000",
      blur: 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
    });
    brush.limitedToCanvasSize = true;

    canvas.freeDrawingBrush = brush;
    // resizeCanvas();
    fabricCanvas.current.setDimensions({ width: 500, height: 500 });

    window.addEventListener("resize", resizeCanvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  console.log("Canvas initialized with fabric.js");

  return (
    <div>
      <div className="p-4 flex gap-4 items-center bg-white border-b border-gray-300"></div>

      <canvas ref={canvasEl} className="fixed top-0 left-0" />
    </div>
  );
};

export default CanvasComponent;
