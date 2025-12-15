import Konva from "konva";

export function getPointerPositionRelativeToStage(
  stage: Konva.Stage
): Konva.Vector2d | null {
  const pointerPosition = stage.getPointerPosition();
  if (!pointerPosition) {
    return null;
  }

  const transform = stage.getAbsoluteTransform().copy();
  transform.invert();
  return transform.point(pointerPosition);
}
