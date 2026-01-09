"use client";

import useStateStore, {
  StateStore,
  selectedToolType,
} from "@/context/stateStore";
import useHistoryStore from "@/context/historyStore";
import {
  ArrowRight,
  Circle,
  Copy,
  Edit3,
  Eraser,
  Hand,
  Image,
  Lock,
  Minus,
  MousePointer,
  Redo2,
  Share2,
  Square,
  Type,
  Undo2,
} from "lucide-react";
import React, { Fragment, useState, useEffect, useCallback } from "react";
import ToolButton from "./ToolButton";

type Tool = {
  id: selectedToolType;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  isDefault?: boolean;
  special?: boolean;
};

const FloatingToolbar = () => {
  const selectedTool = useStateStore((s: StateStore) => s.selectedTool);
  const setSelectedTool = useStateStore((s) => s.setSelectedTool);
  const [isLocked, setIsLocked] = useState(false);

  // History store
  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);
  const canUndo = useHistoryStore((state) => state.past.length > 0);
  const canRedo = useHistoryStore((state) => state.future.length > 0);

  // Keyboard shortcuts for undo/redo
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    },
    [undo, redo]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const tools: Tool[] = [
    { id: "lock", icon: Lock, label: "Lock", special: true },
    { id: "hand", icon: Hand, label: "Hand Tool" },
    { id: "pointer", icon: MousePointer, label: "Select", isDefault: true },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "ellipse", icon: Circle, label: "Ellipse" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "pen", icon: Edit3, label: "Pen" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
    { id: "text", icon: Type, label: "Text" },
    { id: "image", icon: Image, label: "Image" },
    { id: "duplicate", icon: Copy, label: "Duplicate" },
    { id: "connect", icon: Share2, label: "Connect" },
  ];

  const handleToolClick = (toolId: selectedToolType) => {
    if (toolId === "lock") {
      setIsLocked(!isLocked);
    } else {
      setSelectedTool(toolId);
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-2 py-2 flex items-center gap-1">
        {/* Undo/Redo buttons */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-colors ${
            canUndo
              ? "hover:bg-gray-100 text-gray-700"
              : "text-gray-300 cursor-not-allowed"
          }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-colors ${
            canRedo
              ? "hover:bg-gray-100 text-gray-700"
              : "text-gray-300 cursor-not-allowed"
          }`}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={18} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        {tools.map((tool, index) => {
          const isSelected =
            tool.id === "lock" ? isLocked : selectedTool === tool.id;

          return (
            <Fragment key={tool.id}>
              <ToolButton
                id={tool.id}
                icon={tool.icon}
                label={tool.label}
                isSelected={isSelected}
                onClick={() => handleToolClick(tool.id)}
                isLockTool={tool.id === "lock"}
              />

              {index === 0 && <div className="w-px h-6 bg-gray-200 mx-1"></div>}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingToolbar;
