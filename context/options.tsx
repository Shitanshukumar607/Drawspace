"use client";

import { Canvas, Rect, Shadow } from "fabric";
import React, { createContext, useState, useContext, ReactNode, useRef } from "react";

export interface OptionsContextType {
  canvasRef: React.MutableRefObject<Canvas | null>;
  setCanvasRef: (canvas: Canvas | null) => void;
  pencilOptions: PencilOptions;
  changePencilOptions: (change: Partial<PencilOptions>) => void;
  canvasOptions: CanvasOptions;
  changeCanvasOptions: (change: Partial<CanvasOptions>) => void;
  addRectangle: (canvas: Canvas) => void;
}

export interface PencilOptions {
  color: string;
  width: number;
  limitedToCanvasSize: boolean;
  drawStraightLine: boolean;
  shadow: Shadow;
}

export interface CanvasOptions {
  backgroundColor: string;
  isDrawingMode: boolean;
  selection: boolean;
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

const initialCanvasOptions = {
  backgroundColor: "#fffce8",
  isDrawingMode: false,
  selection: false,
};

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

const OptionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pencilOptions, setPencilOptions] =
    useState<PencilOptions>(initialPencilOptions);

  const [canvasOptions, setCanvasOptions] =
    useState<typeof initialCanvasOptions>(initialCanvasOptions);

  const changeCanvasOptions = (
    change: Partial<typeof initialCanvasOptions>
  ) => {
    setCanvasOptions((prev) => ({
      ...prev,
      ...change,
    }));
  };

  const canvasRef = useRef<Canvas | null>(null);
  const setCanvasRef = (newCanvas: Canvas | null) => {
    canvasRef.current = newCanvas;
  };

  const changePencilOptions = (change: Partial<PencilOptions>) => {
    setPencilOptions((prev) => ({
      ...prev,
      ...change,
    }));
  };

  const addRectangle = (canvas: Canvas | null) => {
    if (!canvas) return;
    console.log(`Adding rectangle to canvas`);

    canvasOptions.isDrawingMode = false;
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 50,
      fill: "red",
    });
    canvas.add(rect);
  };

  return (
    <OptionsContext.Provider
      value={{
        canvasRef,
        setCanvasRef,
        pencilOptions,
        changePencilOptions,
        canvasOptions,
        changeCanvasOptions,
        addRectangle,
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error("useOptions must be used within an OptionsProvider");
  }
  return context;
};

export default OptionsProvider;
