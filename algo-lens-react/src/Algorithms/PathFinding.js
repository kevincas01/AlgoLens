import React, { useEffect, useState } from "react";
import {
  bfs,
  dfs,
  findRandom,
  generateMazeGrid,
} from "../utils/pathfindingAlgorithm";

const PathFinding = ({ stepByStepMode }) => {
  const N = 51;
  const [matrix, setMatrix] = useState([]);

  const [matrixIndicesStates, setMatrixIndicesStates] = useState(
    Array.from({ length: N }, () => Array(N).fill(null))
  );

  const [isPathFindable, setIsPathFindable] = useState(true);
  const [pathFound, setPathFound] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [stepsToExecute, setStepsToExecute] = useState([]);

  const [startingPoint, setStartingPoint] = useState(null);

  const [endingPoint, setEndingPoint] = useState(null);

  useEffect(() => {
    if (!stepByStepMode && stepsToExecute.length > 0) {
      const intervalId = setInterval(() => {
        executeNextStep();
      }, 10);

      if (currentStep > stepsToExecute.length || stepsToExecute.length == 0) {
        clearInterval(intervalId);
      }

      return () => clearInterval(intervalId);
    }
  }, [stepByStepMode, currentStep, stepsToExecute]);

  useEffect(() => {
    const grid = generateMazeGrid(N);
    const startX = findRandom(0, N);
    const startY = findRandom(0, N);
    const endX = findRandom(0, N);
    const endY = findRandom(0, N);

    // Ensure the starting and ending points are marked as true on the grid
    grid[startX][startY] = true;
    grid[endX][endY] = true;

    setMatrix(grid);
    setStartingPoint({ x: startX, y: startY });
    setEndingPoint({ x: endX, y: endY });
  }, []);

  //Cyan Visited and checked for goal destination
  //green Next to be visited
  const executePreviousStep = () => {
    if (currentStep <= stepsToExecute.length) {
      const { type, indices, childrenIndices, path } =
        stepsToExecute[currentStep - 1];
      if (type == "enqueue") {
        setMatrixIndicesStates((prevState) => {
          const newState = prevState.map((row) => row.slice()); // Clone the matrix

          for (const child of childrenIndices) {
            newState[child.x][child.y] = "null";
          }
          if (
            !(indices.x === startingPoint.x && indices.y === startingPoint.y)
          ) {
            newState[indices.x][indices.y] = "enqueued";
          }

          return newState;
        });
      }

      setCurrentStep((prevStep) => prevStep - 1);
    }
  };
  const executeNextStep = () => {
    if (currentStep < stepsToExecute.length && stepsToExecute.length !== 0) {
      const { type, indices, childrenIndices, path } =
        stepsToExecute[currentStep];

      if (type == "enqueue") {
        setMatrixIndicesStates((prevState) => {
          const newState = prevState.map((row) => row.slice()); // Clone the matrix

          for (const child of childrenIndices) {
            newState[child.x][child.y] = "enqueued";
          }
          if (
            !(indices?.x === startingPoint.x && indices?.y === startingPoint.y)
          ) {
            newState[indices.x][indices.y] = "visited";
          }

          return newState;
        });
      } else if (type == "showPath") {
        setMatrixIndicesStates((prevState) => {
          const newState = prevState.map((row) => row.slice()); // Clone the matrix

          for (const child of path) {
            newState[child.x][child.y] = "path";
          }
          return newState;
        });
      }

      setCurrentStep((prevStep) => prevStep + 1);
    }

    if (currentStep + 1 >= stepsToExecute.length) {
      setCurrentStep(0);
      setStepsToExecute([]);
      setPathFound(true);
    }
  };

  const reset = () => {
    const grid = generateMazeGrid(N);
    const startX = findRandom(0, N);
    const startY = findRandom(0, N);
    const endX = findRandom(0, N);
    const endY = findRandom(0, N);

    // Ensure the starting and ending points are marked as true on the grid
    grid[startX][startY] = true;
    grid[endX][endY] = true;

    setMatrix(grid);
    setStartingPoint({ x: startX, y: startY });
    setEndingPoint({ x: endX, y: endY });
    setCurrentStep(0);
    setStepsToExecute([]);
    setMatrixIndicesStates(
      Array.from({ length: N }, () => Array(N).fill(null))
    );
    setPathFound(false)
    setIsPathFindable(true);
  };

  const clearStates = () => {
    setIsPathFindable(true);
    setMatrixIndicesStates(
      Array.from({ length: N }, () => Array(N).fill(null))
    );
  };

  const startBFS = () => {
    setIsPathFindable(false);
    const newSteps = bfs(matrix, startingPoint, endingPoint);
    setStepsToExecute(newSteps);
    setCurrentStep(0);
  };
  const startDFS = () => {
    setIsPathFindable(false);
    const newSteps = dfs(matrix, startingPoint, endingPoint);
    setStepsToExecute(newSteps);
    setCurrentStep(0);
  };

  return (
    <div>
      <h1>Path Finding Visualizer</h1>

      <div className="grid">
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => {
              let cellClass = cell ? "white" : "black";

              // Highlight the starting and ending points
              if (
                rowIndex === startingPoint.x &&
                colIndex === startingPoint.y
              ) {
                cellClass = "starting-point";
              }
              if (rowIndex === endingPoint.x && colIndex === endingPoint.y) {
                cellClass = "ending-point";
              }

              const state = matrixIndicesStates[rowIndex][colIndex];
              if (state === "enqueued") {
                cellClass = "enqueued-cell";
              } else if (state === "visited") {
                cellClass = "visited-cell";
              } else if (state === "path") {
                cellClass = "path-cell";
              }

              return <div key={colIndex} className={`cell ${cellClass}`}></div>;
            })}
          </div>
        ))}
      </div>
      <button onClick={reset}>Generate New</button>
      {pathFound && <button onClick={clearStates}>Clear States</button>}

      <button disabled={!isPathFindable} onClick={startBFS}>Breadth First Search</button>
      <button disabled={!isPathFindable} onClick={startDFS}>Depth First Search</button>

      {stepByStepMode && stepsToExecute.length > 0 && (
        <>
          <button disabled={currentStep === 0} onClick={executePreviousStep}>
            Previous Step
          </button>
          <button onClick={executeNextStep}>
            {currentStep === stepsToExecute.length - 1 ? "Finish" : "Next Step"}
          </button>
        </>
      )}
    </div>
  );
};

export default PathFinding;
