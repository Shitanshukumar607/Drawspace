"use client";

import React from "react";

type ToolButtonProps = {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  isLockTool?: boolean;
};

const ToolButton: React.FC<ToolButtonProps> = ({
  icon: Icon,
  label,
  isSelected,
  onClick,
  isLockTool = false,
}) => {
  return (
    <button
      onClick={onClick}
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
      aria-pressed={isSelected}
      aria-label={label}
      title={label}
    >
      <Icon
        size={18}
        className={`
          transition-transform duration-200
          ${isSelected ? "scale-110" : "group-hover:scale-105"}
        `}
      />
      <div
        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 
                  bg-gray-900 text-white text-xs px-2 py-1 rounded 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  pointer-events-none whitespace-nowrap z-10"
      >
        {label}
      </div>
    </button>
  );
};

export default ToolButton;
