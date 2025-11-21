// useToolPropertiesStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface PenProperties {
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
}

export interface EraserProperties {
  strokeWidth: number;
  opacity: number;
}

export interface RectangleProperties {
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  opacity: number;
}

export interface EllipseProperties {
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  opacity: number;
}

export interface LineProperties {
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
}

export interface ArrowProperties {
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
}

/**
 * Map tool id -> its property interface
 * NOTE: `selectedToolType` must be a union of the same literal keys below.
 */
export type ToolPropertiesMap = {
  pen: PenProperties;
  eraser: EraserProperties;
  rectangle: RectangleProperties;
  ellipse: EllipseProperties;
  line: LineProperties;
  arrow: ArrowProperties;
};

/**
 * Generic tool properties type for convenience
 */
export type AnyToolProperties =
  | PenProperties
  | EraserProperties
  | RectangleProperties
  | EllipseProperties
  | LineProperties
  | ArrowProperties;

/**
 * Defaults per tool — only include the fields that tool supports.
 */
export const defaultPenProperties: PenProperties = {
  strokeColor: "#0f172a",
  strokeWidth: 2,
  opacity: 1,
};

export const defaultEraserProperties: EraserProperties = {
  strokeWidth: 10,
  opacity: 1,
};

export const defaultRectangleProperties: RectangleProperties = {
  strokeColor: "#0f172a",
  backgroundColor: "transparent",
  strokeWidth: 2,
  opacity: 1,
};

export const defaultEllipseProperties: EllipseProperties = {
  strokeColor: "#0f172a",
  backgroundColor: "transparent",
  strokeWidth: 2,
  opacity: 1,
};

export const defaultLineProperties: LineProperties = {
  strokeColor: "#0f172a",
  strokeWidth: 2,
  opacity: 1,
};

export const defaultArrowProperties: ArrowProperties = {
  strokeColor: "#0f172a",
  strokeWidth: 2,
  opacity: 1,
};

/**
 * Helper to get defaults by tool key.
 * If you add new tools later, add their defaults here.
 */
export const getDefaultForTool = (
  tool: keyof ToolPropertiesMap
): AnyToolProperties => {
  switch (tool) {
    case "pen":
      return defaultPenProperties;
    case "eraser":
      return defaultEraserProperties;
    case "rectangle":
      return defaultRectangleProperties;
    case "ellipse":
      return defaultEllipseProperties;
    case "line":
      return defaultLineProperties;
    case "arrow":
      return defaultArrowProperties;
    // default:
    //   // Fallback — should not happen if selectedToolType matches keys
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   return {} as any;
  }
};

/**
 * Store types
 */
// Ensure selectedToolType matches the keys of ToolPropertiesMap at runtime/compile time.
// For methods we use generics so updates are typed per-tool.
export type ToolKey = keyof ToolPropertiesMap;

export interface ToolPropertiesState {
  // partial because you might not want to set all tools, but we initialize all on creation
  properties: Partial<{ [K in ToolKey]: ToolPropertiesMap[K] }>;

  // Update method typed per-tool
  updateProperties: <K extends ToolKey>(
    tool: K,
    updates: Partial<ToolPropertiesMap[K]>
  ) => void;

  // Reset a single tool to its defaults
  resetProperties: <K extends ToolKey>(tool: K) => void;

  // Reset all tools
  resetAll: () => void;
}

/**
 * Build initial properties object (pre-fill every known tool with its defaults).
 * This should be used if no saved state exists in localStorage.
 */
const buildInitialProperties = (): Partial<{
  [K in ToolKey]: ToolPropertiesMap[K];
}> => {
  return {
    pen: getDefaultForTool("pen") as PenProperties,
    eraser: getDefaultForTool("eraser") as EraserProperties,
    rectangle: getDefaultForTool("rectangle") as RectangleProperties,
    ellipse: getDefaultForTool("ellipse") as EllipseProperties,
    line: getDefaultForTool("line") as LineProperties,
    arrow: getDefaultForTool("arrow") as ArrowProperties,
  };
};

/**
 * Merge existing properties with defaults for a specific tool.
 * Only the supported fields are returned (i.e. defaults auto-fill only valid fields).
 */
const mergeWithDefaults = <K extends ToolKey>(
  tool: K,
  existing?: Partial<ToolPropertiesMap[K]>
): ToolPropertiesMap[K] => {
  const defaults = getDefaultForTool(tool) as ToolPropertiesMap[K];
  return {
    ...defaults,
    ...(existing ?? {}),
  } as ToolPropertiesMap[K];
};

/**
 * Create the store
 */
const useToolPropertiesStore = create<ToolPropertiesState>()(
  persist(
    (set, get) => ({
      // Initialize properties from localStorage if available; otherwise use defaults.
      // persist middleware will rehydrate from storage automatically; but providing an initial
      // value here helps when storage is empty.
      properties: buildInitialProperties(),

      updateProperties: (tool, updates) =>
        set((state: ToolPropertiesState) => {
          const prev = state.properties[tool as ToolKey] as
            | Partial<AnyToolProperties>
            | undefined;
          // merge prev with defaults then apply updates
          const merged = mergeWithDefaults(
            tool as ToolKey,
            prev as Partial<ToolPropertiesMap[keyof ToolPropertiesMap]>
          );
          const next = {
            ...merged,
            ...updates,
          } as ToolPropertiesMap[typeof tool & keyof ToolPropertiesMap];

          return {
            properties: {
              ...state.properties,
              [tool]: next,
            },
          };
        }),

      resetProperties: (tool) =>
        set((state) => ({
          properties: {
            ...state.properties,
            [tool]: mergeWithDefaults(tool as ToolKey, undefined),
          },
        })),

      resetAll: () =>
        set(() => ({
          properties: buildInitialProperties(),
        })),
    }),
    {
      name: "drawspace-tool-properties",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useToolPropertiesStore;
