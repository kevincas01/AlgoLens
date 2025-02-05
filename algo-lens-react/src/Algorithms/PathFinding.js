import React, { useEffect, useState } from "react";
import { findRandom } from "../utils/pathfindingAlgorithm";

const PathFinding = ({ stepByStepMode }) => {
  const N = 25;
  const [matrix, setMatrix] = useState([]);

  const [checkedMatrixIndices, setCheckedMatrixIndices] = useState([]);
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

  const getNewArray = () => {
    const newArray2d = [];
    const falseThreshold = 5; // Percentage chance of getting a false value

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

  const executeNextStep = () => {
    if (currentStep < stepsToExecute.length && stepsToExecute.length !== 0) {
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

              return <div key={colIndex} className={`cell ${cellClass}`}></div>;
            })}
          </div>
        ))}
      </div>
      <button onClick={reset}>Reset Array</button>
    </div>
  );
};

export default PathFinding;
