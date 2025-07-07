import useStateStore from "@/context/stateStore";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

export function freeDrawingTool() {
  const tool = useStateStore((state) => state.selectedTool);

  const isDrawing = useRef(false);
  const imageRef = useRef<any>(null);
  const lastPos = useRef<Point | null>(null);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvasEl = document.createElement("canvas");
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    const ctx = canvasEl.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "#df4b26";
      ctx.lineJoin = "round";
      ctx.lineWidth = 5;
      setCanvas(canvasEl);
      setContext(ctx);
    }
  }, []);

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!context || (tool !== "pen" && tool !== "eraser")) return;

    isDrawing.current = true;
    lastPos.current = e.target.getStage()?.getPointerPosition() || null;

    context.lineWidth = 5;
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "pen" && tool !== "eraser") return;

    if (!isDrawing.current || !context || !imageRef.current || !lastPos.current)
      return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    const image = imageRef.current;

    context.globalCompositeOperation =
      tool === "eraser" ? "destination-out" : "source-over";

    const from = {
      x: lastPos.current.x - image.x(),
      y: lastPos.current.y - image.y(),
    };
    const to = {
      x: pos.x - image.x(),
      y: pos.y - image.y(),
    };

    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();

    lastPos.current = pos;
    image.getLayer().batchDraw();
  };

  return {
    canvas,
    imageRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
