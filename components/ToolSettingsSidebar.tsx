"use client";

import useStateStore from "@/context/stateStore";
import useToolPropertiesStore, { ToolKey } from "@/context/toolPropertiesStore";

const strokes = [
  "#0f172a",
  "#ef4444",
  "#16a34a",
  "#2563eb",
  "#f59e0b",
  "#111827",
];

const backgroundColors = [
  "transparent",
  "#fee2e2",
  "#bbf7d0",
  "#bfdbfe",
  "#fde68a",
  "#f3f4f6",
];

const strokeWidths = [2, 4, 6];

const createCheckboard = () => ({
  backgroundImage:
    "linear-gradient(45deg, #d6d3d1 25%, transparent 25%, transparent 75%, #d6d3d1 75%, #d6d3d1), linear-gradient(45deg, #d6d3d1 25%, transparent 25%, transparent 75%, #d6d3d1 75%, #d6d3d1)",
  backgroundSize: "10px 10px",
  backgroundPosition: "0 0, 5px 5px",
  backgroundColor: "#fff",
});

function isPropertyTool(tool: string): tool is ToolKey {
  return ["pen", "eraser", "rectangle", "ellipse", "line", "arrow"].includes(
    tool
  );
}

const ToolSettingsSidebar = () => {
  const selectedTool = useStateStore((state) => state.selectedTool);

  const isPropTool = isPropertyTool(selectedTool);

  const toolProperties = useToolPropertiesStore((state) =>
    isPropTool ? state.properties[selectedTool] : undefined
  );

  const updateProperties = useToolPropertiesStore(
    (state) => state.updateProperties
  );

  if (!isPropTool || !toolProperties) {
    return null;
  }

  const toolKey: ToolKey = selectedTool;

  return (
    <aside className="fixed left-5 top-1/2 -translate-y-1/2 z-50 select-none">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 flex flex-col items-start gap-3">
        {"stroke" in toolProperties && (
          <section className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Stroke
            </span>
            <div className="flex flex-wrap gap-2">
              {strokes.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`size-8 rounded-full border border-gray-200 hover:scale-110 transition-all cursor-pointer ${
                    toolProperties.stroke === color
                      ? "ring-2 ring-offset-2 ring-gray-900 border-transparent"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Set stroke color to ${color}`}
                  onClick={() => updateProperties(toolKey, { stroke: color })}
                />
              ))}
            </div>
          </section>
        )}

        {"fill" in toolProperties && (
          <section className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Background
            </span>
            <div className="flex flex-wrap gap-2">
              {backgroundColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`size-8 rounded-full border border-gray-200 hover:scale-110 transition-all cursor-pointer ${
                    toolProperties.fill === color
                      ? "ring-2 ring-offset-2 ring-gray-900 border-transparent"
                      : ""
                  }`}
                  style={
                    color === "transparent"
                      ? createCheckboard()
                      : { backgroundColor: color }
                  }
                  aria-label={`Set background to ${color}`}
                  onClick={() => updateProperties(toolKey, { fill: color })}
                />
              ))}
            </div>
          </section>
        )}

        {toolProperties.strokeWidth !== undefined && (
          <section className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Stroke width
            </span>
            <div className="flex flex-wrap gap-2">
              {strokeWidths.map((width) => (
                <button
                  key={width}
                  type="button"
                  className={`size-8 rounded-md border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer flex justify-center items-center ${
                    toolProperties.strokeWidth === width
                      ? "bg-gray-100 ring-2 ring-gray-900 border-transparent"
                      : ""
                  }`}
                  onClick={() =>
                    updateProperties(toolKey, { strokeWidth: width })
                  }
                >
                  <div
                    className="bg-gray-800 rounded-full"
                    style={{ width: width * 2, height: width * 2 }}
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {toolProperties.opacity !== undefined && (
          <section className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Opacity
            </span>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                data-testid="opacity"
                value={toolProperties.opacity * 100}
                onChange={(event) =>
                  updateProperties(toolKey, {
                    opacity: Number(event.target.value) / 100,
                  })
                }
              />
              <span className="text-xs font-medium text-gray-600 min-w-[2rem] text-right">
                {Math.round(toolProperties.opacity * 100)}%
              </span>
            </div>
          </section>
        )}
      </div>
    </aside>
  );
};

export default ToolSettingsSidebar;
