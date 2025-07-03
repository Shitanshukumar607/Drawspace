"use client";

import { useOptions } from "@/context/options";
import { Canvas, Rect } from "fabric";
import { useEffect, useRef } from "react";

const CanvasComponent = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvasInstance = useRef<Canvas | null>(null);

  const {
    pencilOptions,
    canvasOptions,
    addRectangle,
    setCanvasRef,
    canvasRef,
  } = useOptions();

  let dragging = false;
  let freeDrawing = true;
  let initialPos: { x: number; y: number } | null = null;
  let bounds: { x: number; y: number; width: number; height: number } = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  let rect: Rect | null = null;
  const rectProps = {
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
    if (!canvasEl.current) return;
    const canvas = new Canvas(canvasEl.current, {
      ...canvasOptions,
    });
    canvasInstance.current = canvas;
    if (setCanvasRef) {
      setCanvasRef(canvas);
    }

    function onMouseUp() {
      dragging = false;
      if (!freeDrawing) {
        return;
      }
      if (rect && (rect.width == 0 || rect.height === 0)) {
        canvas.remove(rect);
      }
      if (!rect) {
        rect = new Rect({
          ...bounds,
          left: bounds.x,
          top: bounds.y,
          ...rectProps,
        });
        canvas.add(rect);
        rect.dirty = true;
        canvas.requestRenderAll();
      }
      rect.setCoords();
    }

    function onMouseDown(e: any) {
      dragging = true;
      if (!freeDrawing) {
        return;
      }
      initialPos = { ...e.pointer };
      if (!initialPos) return;
      bounds = { x: 0, y: 0, width: 0, height: 0 };
      rect = new Rect({
        left: initialPos.x,
        top: initialPos.y,
        width: 0,
        height: 0,
        ...rectProps,
      });
      canvas.add(rect);
    }

    function update(pointer: { x: number; y: number }) {
      if (!initialPos || !rect) {
        return;
      }

      if (initialPos.x > pointer.x) {
        bounds.x = Math.max(0, pointer.x);
        bounds.width = initialPos.x - bounds.x;
      } else {
        bounds.x = initialPos.x;
        bounds.width = pointer.x - initialPos.x;
      }
      if (initialPos.y > pointer.y) {
        bounds.y = Math.max(0, pointer.y);
        bounds.height = initialPos.y - bounds.y;
      } else {
        bounds.height = pointer.y - initialPos.y;
        bounds.y = initialPos.y;
      }

      rect.left = bounds.x;
      rect.top = bounds.y;
      rect.width = bounds.width;
      rect.height = bounds.height;
      rect.dirty = true;
      canvas.requestRenderAll();
    }

    function onMouseMove(e: any) {
      if (!dragging || !freeDrawing) {
        return;
      }
      requestAnimationFrame(() => update(e.pointer));
    }

    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:move", onMouseMove);
    canvas.on("mouse:up", onMouseUp);

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);

      if (canvas) {
        canvas.dispose();
      }

      canvasInstance.current = null;
    };
  }, [setCanvasRef]);

  return (
    <div>
      <div className="flex gap-4 items-center bg-white border-b border-gray-300 p-2">
        <canvas
          ref={canvasEl}
          className="fixed top-0 left-0 cursor-crosshair"
        />
      </div>
    </div>
  );
};

export default CanvasComponent;
