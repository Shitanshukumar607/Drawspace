import { Canvas, Shadow } from "fabric";
import { create } from "zustand";

export interface PencilOptions {
  color: string;
  width: number;
  limitedToCanvasSize: boolean;
  drawStraightLine: boolean;
  shadow: Shadow;
}

export interface ShapeOptions {
  stroke: string;
  strokeWidth: number;
  fill: string;
  cornerStyle: "circle" | "rect";
  padding: number;
  cornerStrokeColor: string;
  cornerColor: string;
  transparentCorners: boolean;
  cornerSize: number;
}

export interface CanvasOptions {
  backgroundColor: string;
  isDrawingMode: boolean;
  selection: boolean;
}

export interface OptionsStore {
  canvasRef: Canvas | null;
  setCanvasRef: (ref: Canvas | null) => void;

  pencilOptions: PencilOptions;
  updatePencilOptions: (updates: Partial<PencilOptions>) => void;

  shapeOptions: ShapeOptions;
  updateShapeOptions: (updates: Partial<ShapeOptions>) => void;

  canvasOptions: CanvasOptions;
  updateCanvasOptions: (updates: Partial<CanvasOptions>) => void;
}

const initialPencilOptions: PencilOptions = {
  color: "#000000",
  width: 5,
  limitedToCanvasSize: true,
  drawStraightLine: true,
  shadow: new Shadow({
    color: "#000000",
    blur: 0,
    offsetX: 0,
    offsetY: 0,
    affectStroke: true,
  }),
};

const initialShapeOptions: ShapeOptions = {
  stroke: "blue",
  strokeWidth: 2,
  fill: "rgba(0, 0, 255, 0.3)",
  cornerStyle: "circle",
  padding: 5,
  cornerStrokeColor: "blue",
  cornerColor: "white",
  transparentCorners: false,
  cornerSize: 10,
};

const initialCanvasOptions: CanvasOptions = {
  backgroundColor: "#fffce8",
  isDrawingMode: false,
  selection: false,
};

export const useOptionsStore = create<OptionsStore>((set) => ({
  canvasRef: null,
  setCanvasRef: (ref) => set({ canvasRef: ref }),

  pencilOptions: initialPencilOptions,
  updatePencilOptions: (updates) =>
    set((state) => ({
      pencilOptions: {
        ...state.pencilOptions,
        ...updates,
      },
    })),

  shapeOptions: initialShapeOptions,
  updateShapeOptions: (updates) =>
    set((state) => ({
      shapeOptions: {
        ...state.shapeOptions,
        ...updates,
      },
    })),

  canvasOptions: initialCanvasOptions,
  updateCanvasOptions: (updates) =>
    set((state) => ({
      canvasOptions: {
        ...state.canvasOptions,
        ...updates,
      },
    })),
}));
