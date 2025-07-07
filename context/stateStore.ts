import { create } from "zustand";

export interface StateStore {
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
}

const useStateStore = create<StateStore>((set) => ({
  selectedTool: "line",
  setSelectedTool: (tool: string) => set({ selectedTool: tool }),
}));

export default useStateStore;
