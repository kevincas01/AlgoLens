export const findRandom = (low, high) => {
  return Math.floor(Math.random() * (high - low)) + low;
};

export const generateRandomGrid = (n) => {
  const grid = [];
  const obstacleProbability = 15; // Percentage chance of placing an obstacle (false)

  for (let row = 0; row < n; row++) {
    const currentRow = [];
    for (let col = 0; col < n; col++) {
      const randomPercentage = Math.random() * 100;
      currentRow.push(randomPercentage > obstacleProbability); // true for open path, false for obstacle
    }
    grid.push(currentRow);
  }

  return grid;
};

export const generateMazeGrid = (size) => {
  const mazeGrid = Array.from({ length: size }, () => Array(size).fill(false)); // Initialize with all walls

  const possibleDirections = [
    [0, 2], // Down
    [0, -2], // Up
    [2, 0], // Right
    [-2, 0], // Left
  ];

  const isValidCell = (row, col) => row >= 0 && col >= 0 && row < size && col < size;

  const carvePath = (row, col) => {
    mazeGrid[row][col] = true; // Mark the current cell as part of the path

    // Shuffle directions to create a randomized maze
    possibleDirections.sort(() => Math.random() - 0.5);

    for (const [dRow, dCol] of possibleDirections) {
      const nextRow = row + dRow;
      const nextCol = col + dCol;
      const wallRow = row + dRow / 2;
      const wallCol = col + dCol / 2;

      if (isValidCell(nextRow, nextCol) && !mazeGrid[nextRow][nextCol]) {
        mazeGrid[wallRow][wallCol] = true; // Carve a passage through the wall
        carvePath(nextRow, nextCol);
      }
    }
  };

  if (size >= 3) {
    carvePath(0,0);
  }

  return mazeGrid;
};


export const getPathFromParentMap = (parentMap, startingPoint, endingPoint) => {
  const path = [];
  let currentNode = `${endingPoint.x},${endingPoint.y}`;

  // Traverse from ending point to starting point
  while (currentNode) {
    // Extract the coordinates from the string and push to the path
    const [x, y] = currentNode.split(",").map(Number);
    path.push({ x, y });

    // Stop if we reach the starting point
    if (x === startingPoint.x && y === startingPoint.y) {
      break;
    }

    // Get the parent node and update currentNode
    const parent = parentMap.get(currentNode);
    currentNode = parent ? `${parent.x},${parent.y}` : null;
  }

  // Reverse to get the path from start to end
  return path.reverse();
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
      const path = getPathFromParentMap(parentMap, startingPoint, endingPoint);

      tempSteps.push({
        type: "showPath",
        path: path,
      });
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

  return tempSteps;
};

export const dfs = (matrix, startingPoint, endingPoint) => {
  const n = matrix.length;
  const visitedMatrix = Array.from({ length: n }, () => Array(n).fill(false));
  const directions = [
    { x: -1, y: 0 }, // Up
    { x: 0, y: 1 }, // Right
    { x: 1, y: 0 }, // Down
    { x: 0, y: -1 }, // Left
  ];

  const tempSteps = []; // Track steps for visualization
  const parentMap = new Map();
  let pathFound = false;

  const dfsRecurse = (currIndices) => {
    if (pathFound) return; // Stop further recursion if path is found

    visitedMatrix[currIndices.x][currIndices.y] = true;
    tempSteps.push({
      type: "enqueue",
      indices: { x: currIndices.x, y: currIndices.y },
      childrenIndices: [],
    });

    if (currIndices.x === endingPoint.x && currIndices.y === endingPoint.y) {
      const path = getPathFromParentMap(parentMap, startingPoint, endingPoint);
      tempSteps.push({
        type: "showPath",
        path: path,
      });
      pathFound = true;
      return;
    }

    const children = [];
    for (const dir of directions) {
      const newX = currIndices.x + dir.x;
      const newY = currIndices.y + dir.y;

      // Boundary and visited check
      if (
        !pathFound &&
        newX >= 0 &&
        newX < n &&
        newY >= 0 &&
        newY < n &&
        !visitedMatrix[newX][newY] &&
        matrix[newX][newY] // Ensure it's a walkable cell
      ) {
        parentMap.set(`${newX},${newY}`, currIndices);
        children.push({ x: newX, y: newY });
        tempSteps.push({
          type: "enqueue",
          indices: { x: currIndices.x, y: currIndices.y },
          childrenIndices: [{ x: newX, y: newY }],
        });
        dfsRecurse({ x: newX, y: newY });
      }
    }
  };

  dfsRecurse(startingPoint);
  return tempSteps;
};
