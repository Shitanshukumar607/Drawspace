import { create } from "zustand";

export type selectedToolType =
  | "line"
  | "rectangle"
  | "pen"
  | "eraser"
  | "pointer"
  | "lock"
  | "hand"
  | "diamond"
  | "ellipse"
  | "arrow"
  | "text"
  | "image"
  | "duplicate"
  | "connect";

export interface StateStore {
  selectedTool: selectedToolType;
  setSelectedTool: (tool: selectedToolType) => void;
}

const useStateStore = create<StateStore>((set) => ({
  selectedTool: "line",
  setSelectedTool: (tool) => set({ selectedTool: tool }),
}));

export default useStateStore;
