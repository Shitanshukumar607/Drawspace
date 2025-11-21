export interface FreeDrawingLine {
  id: string;
  points: number[];
  tool: "pen" | "eraser";
  strokeWidth: number;
  opacity: number;
  stroke?: string;
}

export interface LineShape {
  id: string;
  initialX: number;
  initialY: number;
  x: number;
  y: number;
}

export interface RectangleShape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EllipseShape {
  id: string;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
}

export interface ArrowShape {
  id: string;
  x: number;
  y: number;
  points: number[];
}
