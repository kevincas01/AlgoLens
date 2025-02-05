import React, { useEffect, useState } from "react";
import { bfs, dfs, findRandom } from "../utils/pathfindingAlgorithm";

const PathFinding = ({ stepByStepMode }) => {
  const N = 25;
  const [matrix, setMatrix] = useState([]);

  const [matrixIndicesStates, setMatrixIndicesStates] = useState(
    Array.from({ length: N }, () => Array(N).fill(null))
  );
  const [currentStep, setCurrentStep] = useState(0);

  const [stepsToExecute, setStepsToExecute] = useState([]);

  const [startingPoint, setStartingPoint] = useState({
    x: findRandom(0, N),
    y: findRandom(0, N),
  });

  const [endingPoint, setEndingPoint] = useState({
    x: findRandom(0, N),
    y: findRandom(0, N),
  });

  useEffect(() => {
    if (!stepByStepMode && stepsToExecute.length > 0) {
      const intervalId = setInterval(() => {
        executeNextStep();
      }, 50);

      if (currentStep > stepsToExecute.length || stepsToExecute.length == 0) {
        clearInterval(intervalId);
      }

      return () => clearInterval(intervalId);
    }
  }, [stepByStepMode, currentStep, stepsToExecute]);

  const getNewArray = () => {
    const newArray2d = [];
    const falseThreshold = 15; // Percentage chance of getting a false value

    for (let i = 0; i < N; i++) {
      const rowArray = [];
      for (let j = 0; j < N; j++) {
        const randomValue = Math.random() * 100;
        rowArray.push(randomValue > falseThreshold); // true for values above the threshold
      }
      newArray2d.push(rowArray);
    }

    setMatrix(newArray2d);
  };

  useEffect(() => {
    getNewArray();
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
    }
  };

  const reset = () => {
    getNewArray();
    setStartingPoint({
      x: findRandom(0, N),
      y: findRandom(0, N),
    });

    setEndingPoint({
      x: findRandom(0, N),
      y: findRandom(0, N),
    });
    setCurrentStep(0);
    setStepsToExecute([]);
    setMatrixIndicesStates(
      Array.from({ length: N }, () => Array(N).fill(null))
    );
  };

  const startBFS = () => {
    const newSteps = bfs(matrix, startingPoint, endingPoint);
    setStepsToExecute(newSteps);
    setCurrentStep(0);
  };
  const startDFS = () => {
    const newSteps = dfs(matrix, startingPoint, endingPoint);
    setStepsToExecute(newSteps);
    setCurrentStep(0);
  };

  return (
    <div>
      <h1>Sorting Visualizer</h1>

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
      <button onClick={reset}>Reset Array</button>
      <button onClick={startBFS}>Breadth First Search</button>
      <button onClick={startDFS}>Depth First Search</button>

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
