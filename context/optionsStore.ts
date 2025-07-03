import { Canvas, Shadow } from "fabric";
import { create } from "zustand";

interface PencilOptions {
  color: string;
  width: number;
  limitedToCanvasSize: boolean;
  drawStraightLine: boolean;
  shadow: Shadow;
}

interface CanvasOptions {
  backgroundColor: string;
  isDrawingMode: boolean;
  selection: boolean;
}

interface OptionsStore {
  canvasRef: Canvas | null;
  setCanvasRef: (ref: Canvas | null) => void;

  pencilOptions: PencilOptions;
  changePencilOptions: (change: Partial<PencilOptions>) => void;

  canvasOptions: CanvasOptions;
  changeCanvasOptions: (change: Partial<CanvasOptions>) => void;
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

const initialCanvasOptions: CanvasOptions = {
  backgroundColor: "#fffce8",
  isDrawingMode: false,
  selection: false,
};

export const useOptionsStore = create<OptionsStore>((set, get) => ({
  canvasRef: null,
  setCanvasRef: (ref) => set({ canvasRef: ref }),

  pencilOptions: initialPencilOptions,
  changePencilOptions: (change) =>
    set((state) => ({
      pencilOptions: {
        ...state.pencilOptions,
        ...change,
      },
    })),

  canvasOptions: initialCanvasOptions,
  changeCanvasOptions: (change) =>
    set((state) => ({
      canvasOptions: {
        ...state.canvasOptions,
        ...change,
      },
    })),
}));
