import CanvasComponent from "@/components/CanvasComponent";
import FloatingToolbar from "@/components/FloatingToolbar";
import ToolSettingsSidebar from "@/components/ToolSettingsSidebar";
import ToolInstructions from "@/components/ToolInstructions";

export default function Home() {
  return (
    <>
      <ToolSettingsSidebar />
      <CanvasComponent />
      <FloatingToolbar />
      <ToolInstructions />
    </>
  );
}
