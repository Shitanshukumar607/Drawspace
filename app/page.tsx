import CanvasComponent from "@/components/CanvasComponent";
import FloatingToolbar from "@/components/FloatingToolbar";
import ToolSettingsSidebar from "@/components/ToolSettingsSidebar";

export default function Home() {
  return (
    <>
      <ToolSettingsSidebar />
      <CanvasComponent />
      <FloatingToolbar />
    </>
  );
}
