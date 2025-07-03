"use client";

import React, { useState, Fragment } from "react";
import {
  Lock,
  Hand,
  MousePointer,
  Square,
  Diamond,
  Circle,
  ArrowRight,
  Minus,
  Edit3,
  Type,
  Image,
  Copy,
  Share2,
} from "lucide-react";
import { useOptions } from "@/context/options";
import { Canvas } from "fabric";

type Tool = {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  isDefault?: boolean;
  special?: boolean;
  eventListeners?: {
    onClick?: (canvas: Canvas | null) => void;
  };
};

const FloatingToolbar = () => {
  const [selectedTool, setSelectedTool] = useState("pointer");
  const [isLocked, setIsLocked] = useState(false);

  const { addRectangle, canvasRef } = useOptions();

  const tools: Tool[] = [
    { id: "lock", icon: Lock, label: "Lock", special: true },
    { id: "hand", icon: Hand, label: "Hand Tool" },
    { id: "pointer", icon: MousePointer, label: "Select", isDefault: true },
    {
      id: "rectangle",
      icon: Square,
      label: "Rectangle",
      eventListeners: {
        onClick: (canvas: Canvas | null) => {
          console.log("Adding rectangle");

          if (canvas) {
            addRectangle(canvas);
          }
        },
      },
    },
    { id: "diamond", icon: Diamond, label: "Diamond" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "pen", icon: Edit3, label: "Pen" },
    { id: "text", icon: Type, label: "Text" },
    { id: "image", icon: Image, label: "Image" },
    { id: "duplicate", icon: Copy, label: "Duplicate" },
    { id: "connect", icon: Share2, label: "Connect" },
  ];

  const handleToolClick = (toolId: string) => {
    if (toolId === "lock") {
      setIsLocked(!isLocked);
    } else {
      setSelectedTool(toolId);
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-2 py-2 flex items-center gap-1">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          const isSelected =
            tool.id === "lock" ? isLocked : selectedTool === tool.id;
          const isLockTool = tool.id === "lock";

          return (
            <Fragment key={tool.id}>
              <button
                onClick={() => {
                  handleToolClick(tool.id);
                  if (tool.eventListeners?.onClick) {
                    tool.eventListeners.onClick(canvasRef.current);
                  }
                }}
                className={`
                  relative p-2 rounded-lg transition-all duration-200 group
                  ${
                    isSelected
                      ? isLockTool
                        ? "bg-red-100 text-red-600 shadow-sm"
                        : "bg-blue-100 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                  hover:scale-105 active:scale-95
                `}
                title={tool.label}
              >
                <Icon
                  size={18}
                  className={`
                    transition-transform duration-200
                    ${isSelected ? "scale-110" : "group-hover:scale-105"}
                  `}
                />

                {/* Tooltip */}
                <div
                  className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 
                              bg-gray-900 text-white text-xs px-2 py-1 rounded 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-200
                              pointer-events-none whitespace-nowrap z-10"
                >
                  {tool.label}
                </div>
              </button>

              {/* Separator after lock tool */}
              {index === 0 && <div className="w-px h-6 bg-gray-200 mx-1"></div>}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingToolbar;
