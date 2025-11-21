"use client";

import useStateStore from "@/context/stateStore";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Layer, Stage, Transformer } from "react-konva";
import {
  ArrowShapes,
  EllipseShapes,
  FreeDrawingLines,
  LineShapes,
  RectangleShapes,
  ShapeRefRegistry,
  TransformerSelectionType,
} from "./CanvasShapeRenderers";
import { useDrawArrowTool } from "./drawing/DrawArrowTool";
import { useEllipseTool } from "./drawing/DrawEllipseTool";
import { useDrawLineTool } from "./drawing/DrawLineTool";
import { useDrawRectangleTool } from "./drawing/DrawRectangleTool";
import { useFreeDrawingTool } from "./drawing/FreeDrawingTool";

type SelectedTransformableShape = {
  id: string;
  type: TransformerSelectionType;
};

const CanvasComponent: React.FC = () => {
  const selectedTool = useStateStore((state) => state.selectedTool);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stageRef = useRef<Konva.Stage | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const shapeRefs = useRef<Map<string, Konva.Node | null>>(new Map());
  const [selectedTransformableShape, setSelectedTransformableShape] =
    useState<SelectedTransformableShape | null>(null);
  const [activeNode, setActiveNode] = useState<Konva.Node | null>(null);

  const freeDrawing = useFreeDrawingTool();
  const drawingLines = useDrawLineTool();
  const drawingRectangle = useDrawRectangleTool();
  const drawingEllipse = useEllipseTool();
  const drawingArrow = useDrawArrowTool();

  const isPointerTool = selectedTool === "pointer";

  useEffect(() => {
    if (!selectedTransformableShape) {
      setActiveNode(null);
      return;
    }

    const node = shapeRefs.current.get(selectedTransformableShape.id) ?? null;
    setActiveNode(node);
  }, [selectedTransformableShape]);

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    if (isPointerTool && selectedTransformableShape && activeNode) {
      transformer.nodes([activeNode]);
    } else {
      transformer.nodes([]);
    }

    transformer.getLayer()?.batchDraw();
  }, [activeNode, isPointerTool, selectedTransformableShape]);

  useEffect(() => {
    if (!isPointerTool) {
      setSelectedTransformableShape(null);
    }
  }, [isPointerTool]);

  const registerShapeRef: ShapeRefRegistry = (id, node) => {
    if (node) {
      shapeRefs.current.set(id, node);
    } else {
      shapeRefs.current.delete(id);
    }
  };

  const handleShapeSelect = (id: string, type: TransformerSelectionType) => {
    if (!isPointerTool) return;
    setSelectedTransformableShape({ id, type });
  };

  const drawingTool =
    selectedTool === "pen" || selectedTool === "eraser"
      ? freeDrawing
      : selectedTool === "line"
      ? drawingLines
      : selectedTool === "rectangle"
      ? drawingRectangle
      : selectedTool === "ellipse"
      ? drawingEllipse
      : selectedTool === "arrow"
      ? drawingArrow
      : null;

  const selectedLineId =
    selectedTransformableShape?.type === "line"
      ? selectedTransformableShape.id
      : null;
  const selectedArrowId =
    selectedTransformableShape?.type === "arrow"
      ? selectedTransformableShape.id
      : null;

  const isResizableShapeSelected =
    selectedTransformableShape?.type === "rectangle" ||
    selectedTransformableShape?.type === "ellipse";

  const transformerAnchors = isResizableShapeSelected
    ? [
        "top-left",
        "top-center",
        "top-right",
        "middle-right",
        "middle-left",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ]
    : [];

  const handleStagePointerDown = (
    e: KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (isPointerTool && e.target === stageRef.current) {
      setSelectedTransformableShape(null);
      setActiveNode(null);
    }
    drawingTool?.handlePointerDown(e);
  };

  const handleStagePointerMove = (
    e: KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    drawingTool?.handlePointerMove(e);
  };

  const handleStagePointerUp = () => {
    drawingTool?.handlePointerUp();
  };

  const handleRectangleDragEnd = (id: string, e: KonvaEventObject<Event>) => {
    const node = e.target as Konva.Rect;
    drawingRectangle.updateRectangle(id, { x: node.x(), y: node.y() });
  };

  const handleRectangleTransformEnd = (
    id: string,
    e: KonvaEventObject<Event>
  ) => {
    const node = e.target as Konva.Rect;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const width = Math.max(node.width() * scaleX, 5);
    const height = Math.max(node.height() * scaleY, 5);

    node.scaleX(1);
    node.scaleY(1);

    drawingRectangle.updateRectangle(id, {
      x: node.x(),
      y: node.y(),
      width,
      height,
    });
  };

  const handleLineDragEnd = (id: string, e: KonvaEventObject<Event>) => {
    const node = e.target as Konva.Line;
    const deltaX = node.x();
    const deltaY = node.y();

    if (deltaX === 0 && deltaY === 0) return;

    const line = drawingLines.lines.find((line) => line.id === id);
    if (!line) return;

    node.position({ x: 0, y: 0 });
    drawingLines.updateLine(id, {
      initialX: line.initialX + deltaX,
      initialY: line.initialY + deltaY,
      x: line.x + deltaX,
      y: line.y + deltaY,
    });
  };

  const handleEllipseDragEnd = (id: string, e: KonvaEventObject<Event>) => {
    const node = e.target as Konva.Ellipse;
    drawingEllipse.updateEllipse(id, { x: node.x(), y: node.y() });
  };

  const handleEllipseTransformEnd = (
    id: string,
    e: KonvaEventObject<Event>
  ) => {
    const node = e.target as Konva.Ellipse;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const radiusX = Math.max(node.radiusX() * scaleX, 5);
    const radiusY = Math.max(node.radiusY() * scaleY, 5);

    node.scaleX(1);
    node.scaleY(1);

    drawingEllipse.updateEllipse(id, {
      x: node.x(),
      y: node.y(),
      radiusX,
      radiusY,
    });
  };

  const handleArrowDragEnd = (id: string, e: KonvaEventObject<Event>) => {
    const node = e.target as Konva.Arrow;
    const deltaX = node.x();
    const deltaY = node.y();
    if (deltaX === 0 && deltaY === 0) return;
    const arrow = drawingArrow.arrows.find((arrow) => arrow.id === id);
    if (!arrow) return;
    drawingArrow.updateArrow(id, {
      x: arrow.x + deltaX,
      y: arrow.y + deltaY,
    });
  };

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={handleStagePointerDown}
      onMouseMove={handleStagePointerMove}
      onMouseUp={handleStagePointerUp}
      onTouchStart={handleStagePointerDown}
      onTouchMove={handleStagePointerMove}
      onTouchEnd={handleStagePointerUp}
      draggable={selectedTool === "hand"}
    >
      <Layer>
        <LineShapes
          lines={drawingLines.lines}
          isPointerTool={isPointerTool}
          selectedShapeId={selectedLineId}
          onSelect={handleShapeSelect}
          registerRef={registerShapeRef}
          onDragEnd={handleLineDragEnd}
        />
        <RectangleShapes
          rectangles={drawingRectangle.rectangles}
          isPointerTool={isPointerTool}
          onSelect={handleShapeSelect}
          onDragEnd={handleRectangleDragEnd}
          onTransformEnd={handleRectangleTransformEnd}
          registerRef={registerShapeRef}
          selectedShapeId={
            selectedTransformableShape?.type === "rectangle"
              ? selectedTransformableShape.id
              : null
          }
        />
        <EllipseShapes
          ellipses={drawingEllipse.ellipses}
          isPointerTool={isPointerTool}
          onSelect={handleShapeSelect}
          onDragEnd={handleEllipseDragEnd}
          onTransformEnd={handleEllipseTransformEnd}
          registerRef={registerShapeRef}
          selectedShapeId={
            selectedTransformableShape?.type === "ellipse"
              ? selectedTransformableShape.id
              : null
          }
        />
        <ArrowShapes
          arrows={drawingArrow.arrows}
          isPointerTool={isPointerTool}
          selectedShapeId={selectedArrowId}
          onSelect={handleShapeSelect}
          registerRef={registerShapeRef}
          onDragEnd={handleArrowDragEnd}
        />
        <Transformer
          ref={transformerRef}
          rotateEnabled={false}
          enabledAnchors={transformerAnchors}
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
          }
        />
      </Layer>
      <Layer>
        <FreeDrawingLines lines={freeDrawing.lines} />
      </Layer>
    </Stage>
  );
};

export default CanvasComponent;
