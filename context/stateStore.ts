import { create } from "zustand";

export interface StateStore {
  selectedTool: "line" | "rectangle" | "pen" | "eraser" | "pointer";
  setSelectedTool: (
    tool: "line" | "rectangle" | "pen" | "eraser" | "pointer"
  ) => void;
}

const useStateStore = create<StateStore>((set) => ({
  selectedTool: "line",
  setSelectedTool: (tool) => set({ selectedTool: tool }),
}));

export default useStateStore;
