"use client";

import useStateStore, { selectedToolType } from "@/context/stateStore";
import React from "react";

const instructions: Record<selectedToolType, string> = {
  line: "Click and drag to create a line",
  rectangle: "Click and drag to create a rectangle",
  pen: "Click and drag to draw freely",
  eraser: "Click on an object to remove it",
  pointer: "Click to select an object",
  lock: "Lock is yet to be implemented",
  hand: "Click and drag to move the canvas",
  ellipse: "Click and drag to create an ellipse",
  arrow: "Click and drag to create an arrow",
  text: "Text tool is yet to be implemented",
  image: "Image tool is yet to be implemented",
  duplicate: "Duplicate is yet to be implemented",
  connect: "Connect is yet to be implemented",
};

const ToolInstructions = () => {
  const selectedTool = useStateStore((state) => state.selectedTool);

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
      <div className="backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium text-gray-500 shadow-sm border border-gray-200">
        {instructions[selectedTool]}
      </div>
    </div>
  );
};

export default ToolInstructions;
