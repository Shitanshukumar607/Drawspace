import { Circle, Canvas } from "fabric";

export function setupCircleDrawing(canvas: Canvas, circleProps: any) {
  console.log("Setting up circle drawing");

  let dragging = false;
  let circle: Circle | null = null;
  let initialPos: { x: number; y: number } | null = null;

  function onMouseDown(e: any) {
    dragging = true;
    initialPos = { ...e.pointer };
    if (!initialPos) return;
    circle = new Circle({
      left: initialPos.x,
      top: initialPos.y,
      radius: 0,
      originX: "center",
      originY: "center",
      ...circleProps,
    });
    canvas.add(circle);
  }

  function onMouseMove(e: any) {
    if (!dragging || !circle || !initialPos) return;

    const dx = e.pointer.x - initialPos.x;
    const dy = e.pointer.y - initialPos.y;
    const radius = Math.sqrt(dx * dx + dy * dy) / 2;

    circle.set({
      left: (e.pointer.x + initialPos.x) / 2,
      top: (e.pointer.y + initialPos.y) / 2,
      radius,
    });

    circle.dirty = true;
    canvas.requestRenderAll();
  }

  function onMouseUp() {
    dragging = false;
    circle?.setCoords();
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
