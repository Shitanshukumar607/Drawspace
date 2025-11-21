let shapeIdCounter = 0;

export const createShapeId = () => {
  shapeIdCounter += 1;
  return `shape-${Date.now()}-${shapeIdCounter}`;
};
