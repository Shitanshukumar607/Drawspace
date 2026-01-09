import { create } from "zustand";
import {
  FreeDrawingLine,
  LineShape,
  RectangleShape,
  EllipseShape,
  ArrowShape,
} from "@/types/types";
import {
  PenProperties,
  EraserProperties,
  RectangleProperties,
  EllipseProperties,
  LineProperties,
  ArrowProperties,
} from "./toolPropertiesStore";

// Combined shape types with their properties
export type FreeDrawingLineWithProps = FreeDrawingLine;
export type LineShapeWithProps = LineShape & LineProperties;
export type RectangleShapeWithProps = RectangleShape & RectangleProperties;
export type EllipseShapeWithProps = EllipseShape & EllipseProperties;
export type ArrowShapeWithProps = ArrowShape & ArrowProperties;

// Canvas state snapshot
export interface CanvasState {
  freeDrawingLines: FreeDrawingLineWithProps[];
  lines: LineShapeWithProps[];
  rectangles: RectangleShapeWithProps[];
  ellipses: EllipseShapeWithProps[];
  arrows: ArrowShapeWithProps[];
}

const createEmptyState = (): CanvasState => ({
  freeDrawingLines: [],
  lines: [],
  rectangles: [],
  ellipses: [],
  arrows: [],
});

interface HistoryStore {
  current: CanvasState;

  past: CanvasState[];
  future: CanvasState[];

  maxHistorySize: number;

  setFreeDrawingLines: (lines: FreeDrawingLineWithProps[]) => void;
  addFreeDrawingLine: (line: FreeDrawingLineWithProps) => void;
  updateLastFreeDrawingLine: (
    updater: (line: FreeDrawingLineWithProps) => FreeDrawingLineWithProps
  ) => void;

  setLines: (lines: LineShapeWithProps[]) => void;
  addLine: (line: LineShapeWithProps) => void;
  updateLine: (id: string, updates: Partial<LineShapeWithProps>) => void;

  setRectangles: (rectangles: RectangleShapeWithProps[]) => void;
  addRectangle: (rectangle: RectangleShapeWithProps) => void;
  updateRectangle: (
    id: string,
    updates: Partial<RectangleShapeWithProps>
  ) => void;

  setEllipses: (ellipses: EllipseShapeWithProps[]) => void;
  addEllipse: (ellipse: EllipseShapeWithProps) => void;
  updateEllipse: (id: string, updates: Partial<EllipseShapeWithProps>) => void;

  setArrows: (arrows: ArrowShapeWithProps[]) => void;
  addArrow: (arrow: ArrowShapeWithProps) => void;
  updateArrow: (id: string, updates: Partial<ArrowShapeWithProps>) => void;

  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const useHistoryStore = create<HistoryStore>((set, get) => ({
  current: createEmptyState(),
  past: [],
  future: [],
  maxHistorySize: 50,

  setFreeDrawingLines: (lines) =>
    set((state) => ({
      current: { ...state.current, freeDrawingLines: lines },
    })),

  addFreeDrawingLine: (line) =>
    set((state) => ({
      current: {
        ...state.current,
        freeDrawingLines: [...state.current.freeDrawingLines, line],
      },
    })),

  updateLastFreeDrawingLine: (updater) =>
    set((state) => {
      const lines = state.current.freeDrawingLines;
      if (lines.length === 0) return state;

      const newLines = [...lines];
      newLines[newLines.length - 1] = updater(newLines[newLines.length - 1]);

      return {
        current: { ...state.current, freeDrawingLines: newLines },
      };
    }),

  // Lines
  setLines: (lines) =>
    set((state) => ({
      current: { ...state.current, lines },
    })),

  addLine: (line) =>
    set((state) => ({
      current: {
        ...state.current,
        lines: [...state.current.lines, line],
      },
    })),

  updateLine: (id, updates) =>
    set((state) => ({
      current: {
        ...state.current,
        lines: state.current.lines.map((line) =>
          line.id === id ? { ...line, ...updates } : line
        ),
      },
    })),

  // Rectangles
  setRectangles: (rectangles) =>
    set((state) => ({
      current: { ...state.current, rectangles },
    })),

  addRectangle: (rectangle) =>
    set((state) => ({
      current: {
        ...state.current,
        rectangles: [...state.current.rectangles, rectangle],
      },
    })),

  updateRectangle: (id, updates) =>
    set((state) => ({
      current: {
        ...state.current,
        rectangles: state.current.rectangles.map((rect) =>
          rect.id === id ? { ...rect, ...updates } : rect
        ),
      },
    })),

  // Ellipses
  setEllipses: (ellipses) =>
    set((state) => ({
      current: { ...state.current, ellipses },
    })),

  addEllipse: (ellipse) =>
    set((state) => ({
      current: {
        ...state.current,
        ellipses: [...state.current.ellipses, ellipse],
      },
    })),

  updateEllipse: (id, updates) =>
    set((state) => ({
      current: {
        ...state.current,
        ellipses: state.current.ellipses.map((ellipse) =>
          ellipse.id === id ? { ...ellipse, ...updates } : ellipse
        ),
      },
    })),

  // Arrows
  setArrows: (arrows) =>
    set((state) => ({
      current: { ...state.current, arrows },
    })),

  addArrow: (arrow) =>
    set((state) => ({
      current: {
        ...state.current,
        arrows: [...state.current.arrows, arrow],
      },
    })),

  updateArrow: (id, updates) =>
    set((state) => ({
      current: {
        ...state.current,
        arrows: state.current.arrows.map((arrow) =>
          arrow.id === id ? { ...arrow, ...updates } : arrow
        ),
      },
    })),

  // History management
  saveToHistory: () =>
    set((state) => {
      const newPast = [...state.past, state.current];
      // Limit history size
      if (newPast.length > state.maxHistorySize) {
        newPast.shift();
      }
      return {
        past: newPast,
        future: [], // Clear future when new action is performed
      };
    }),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);

      return {
        past: newPast,
        current: previous,
        future: [state.current, ...state.future],
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      return {
        past: [...state.past, state.current],
        current: next,
        future: newFuture,
      };
    }),

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}));

export default useHistoryStore;
