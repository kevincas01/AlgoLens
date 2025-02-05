export const findRandom = (low, high) => {
  return Math.floor(Math.random() * (high - low )) + low;
};

export const bfs = (matrix, startingPoint, endingPoint) => {
  const n = matrix.length;
  const visitedMatrix = Array.from({ length: n }, () => Array(n).fill(false));
  const queue = [];
  const directions = [
    { x: -1, y: 0 }, // Up
    { x: 0, y: 1 }, // Right
    { x: 1, y: 0 }, // Down
    { x: 0, y: -1 }, // Left
  ];

  const tempSteps = []; // Track steps for visualization
  const parentMap = new Map();

  queue.push(startingPoint);
  visitedMatrix[startingPoint.x][startingPoint.y] = true;

  while (queue.length) {
    const currIndices = queue.shift();

    // Check if we reached the ending point

    if (currIndices.x === endingPoint.x && currIndices.y === endingPoint.y) {
      return tempSteps;
    }

    const children = [];
    // Explore all adjacent cells
    for (const dir of directions) {
      const newX = currIndices.x + dir.x;
      const newY = currIndices.y + dir.y;

      // Boundary and visited check
      if (
        newX >= 0 &&
        newX < n &&
        newY >= 0 &&
        newY < n &&
        !visitedMatrix[newX][newY] &&
        matrix[newX][newY] // Ensure it's a walkable cell
      ) {
        queue.push({ x: newX, y: newY });
        children.push({ x: newX, y: newY });
        visitedMatrix[newX][newY] = true;
        parentMap.set(`${newX},${newY}`, currIndices); // Track the parent for path reconstruction
      }
    }

    tempSteps.push({
      type: "enqueue",
      indices: { x: currIndices.x, y: currIndices.y },
      childrenIndices: children,
    });
  }

  console.log(tempSteps);
  return tempSteps;
};
