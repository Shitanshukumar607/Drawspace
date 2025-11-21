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
          <section className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Stroke</span>
            <div className="flex flex-wrap gap-2">
              {strokes.map((color) => (
                <div
                  key={color}
                  className={`${
                    toolProperties.stroke === color
                      ? "border-4 border-red-500 rounded-sm"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className={`size-7 rounded-sm border hover:scale-110 transition cursor-pointer`}
                    style={{ backgroundColor: color }}
                    aria-label={`Set stroke color to ${color}`}
                    onClick={() => updateProperties(toolKey, { stroke: color })}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {"fill" in toolProperties && (
          <section className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">
              Background
            </span>
            <div className="flex flex-wrap gap-2">
              {backgroundColors.map((color) => (
                <div
                  key={color}
                  className={`${
                    toolProperties.fill === color
                      ? "border-4 border-red-500 rounded-sm"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className={`size-7 rounded-sm border hover:scale-110 transition cursor-pointer`}
                    style={
                      color === "transparent"
                        ? createCheckboard()
                        : { backgroundColor: color }
                    }
                    aria-label={`Set background to ${color}`}
                    onClick={() => updateProperties(toolKey, { fill: color })}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {toolProperties.strokeWidth !== undefined && (
          <section className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">
              Stroke width
            </span>
            <div className="flex flex-wrap gap-3">
              {strokeWidths.map((width) => (
                <button
                  key={width}
                  type="button"
                  className={`size-7 rounded-sm border hover:scale-110 transition cursor-pointer flex justify-center items-center text-center ${
                    toolProperties.strokeWidth === width ? "selected" : ""
                  }`}
                  style={{ fontSize: `${width * 8}px` }}
                  onClick={() =>
                    updateProperties(toolKey, { strokeWidth: width })
                  }
                >
                  -
                </button>
              ))}
            </div>
          </section>
        )}

        {toolProperties.opacity !== undefined && (
          <section className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">Opacity</span>
            <div className="relative flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                className="h-1 border-[2px] outline-none"
                data-testid="opacity"
                value={toolProperties.opacity * 100}
                style={{
                  background:
                    "linear-gradient(to right, var(--color-slider-track) 0%, var(--color-slider-track) 100%, var(--button-bg) 100%, var(--button-bg) 100%)",
                }}
                onChange={(event) =>
                  updateProperties(toolKey, {
                    opacity: Number(event.target.value) / 100,
                  })
                }
              />
              <span className="min-w-8 color-black text-sm ">
                {toolProperties.opacity * 100}
              </span>
            </div>
          </section>
        )}
      </div>
    </aside>
  );
};

export default ToolSettingsSidebar;
