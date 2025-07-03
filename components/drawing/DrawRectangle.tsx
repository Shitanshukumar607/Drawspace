import { ShapeOptions } from "@/context/optionsStore";
import { Canvas, Rect } from "fabric";

interface MouseEventWithPointer {
  pointer: { x: number; y: number };
}

export function setupRectangleDrawing(
  canvas: Canvas,
  shapeOptions: ShapeOptions,
  setSelectedTool: (tool: string) => void
) {
  let dragging = false;
  let rect: Rect | null = null;
  let initialPos: { x: number; y: number } | null = null;

  const bounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  function update(pointer: { x: number; y: number }) {
    if (!initialPos || !rect) return;

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

    rect.set({
      left: bounds.x,
      top: bounds.y,
      width: bounds.width,
      height: bounds.height,
    });
    rect.dirty = true;
    canvas.requestRenderAll();
  }

  function onMouseDown(e: MouseEventWithPointer) {
    dragging = true;
    initialPos = { ...e.pointer };

    if (!initialPos) return;
    rect = new Rect({
      left: initialPos.x,
      top: initialPos.y,
      width: 0,
      height: 0,
      ...shapeOptions,
    });
    canvas.add(rect);
  }

  function onMouseMove(e: MouseEventWithPointer) {
    if (!dragging) return;
    requestAnimationFrame(() => update(e.pointer));
  }

  function onMouseUp() {
    dragging = false;
    if (rect && (rect.width === 0 || rect.height === 0)) {
      canvas.remove(rect);
    } else {
      rect?.setCoords();
    }
    setSelectedTool("pointer");
  }

  canvas.on("mouse:down", onMouseDown);
  canvas.on("mouse:move", onMouseMove);
  canvas.on("mouse:up", onMouseUp);

  return () => {
    canvas.off("mouse:down", onMouseDown);
    canvas.off("mouse:move", onMouseMove);
    canvas.off("mouse:up", onMouseUp);
  };
}
