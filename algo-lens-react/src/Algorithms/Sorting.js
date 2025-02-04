import React, { useEffect, useRef, useState } from "react";
import { mergeSort, quickSort } from "../utils/sortingAlgorithms";
const MIN_BAR_WIDTH = 5;
const BAR_MARGIN = 4;
const Sorting = ({ stepByStepMode }) => {
  const containerRef = useRef(null);
  const [array, setArray] = useState([]);
  const [stepsToExecute, setStepsToExecute] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [isSortable, setIsSortable] = useState(true);

  const getNewArray = (maxBars) => {
    let newArray = [];
    for (let i = 0; i < maxBars; i++) {
      newArray.push(Math.ceil(Math.random(1) * 100));
    }

    setArray(newArray);
  };
  const calculateMaxBars = () => {
    const containerWidth = containerRef.current.offsetWidth; // Get actual width
    const barTotalWidth = MIN_BAR_WIDTH + BAR_MARGIN; // Bar width + spacing
    return Math.floor(containerWidth / barTotalWidth); // Max bars that fit
  };

  useEffect(() => {
    const handleResize = () => {
      const maxBars = calculateMaxBars();
      getNewArray(maxBars);
    };

    handleResize(); // Initial calculation on mount

    window.addEventListener("resize", handleResize); // Recalculate on window resize
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!stepByStepMode && stepsToExecute.length > 0) {
      const intervalId = setInterval(() => {
        executeNextStep();
      }, 50); // Execute every 500ms

      // Clear the interval when all stepsToExecute are executed or if the mode is changed
      if (currentStep > stepsToExecute.length || stepsToExecute.length == 0) {
        clearInterval(intervalId);
      }

      return () => clearInterval(intervalId);
    }
  }, [stepByStepMode, currentStep, stepsToExecute]);

  const executeNextStep = () => {
    if (currentStep < stepsToExecute.length && stepsToExecute.length !== 0) {
      const step = stepsToExecute[currentStep];

      if (step.type === "overwrite") {
        const newArr = [...array];
        newArr[step.index] = step.value;
        setArray(newArr);
      }
      if (step.type === "swap") {
        const newArr = [...array];
        const [i, j] = step.indices;
        // Swap the elements
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        setArray(newArr);
      }

      setCurrentStep((prevStep) => prevStep + 1);
    }

    if (currentStep + 1 >= stepsToExecute.length) {
      setCurrentStep(0);
      setStepsToExecute([]);
    }
  };

  const reset = () => {
    const maxBars = calculateMaxBars();
    getNewArray(maxBars);
    setCurrentStep(0);
    setStepsToExecute([]);
    setIsSortable(true);
  };

  const startMergeSort = () => {
    setIsSortable(false);
    const newSteps = mergeSort(array);
    setStepsToExecute(newSteps);
    setCurrentStep(0);
  };

  const startQuickSort = () => {
    setIsSortable(false);
    const newSteps = quickSort(array);
    console.log(newSteps);
    setStepsToExecute(newSteps);
    setCurrentStep(0);
  };

  return (
    <div className="sorting-visualization">
      <div className="bars-wrapper" ref={containerRef}>
        {array.map((element, index) => {
          return (
            <div
              key={index}
              className={`sort-bar ${
                stepsToExecute[currentStep]?.type === "compare" &&
                stepsToExecute[currentStep].indices.includes(index)
                  ? "active-compare"
                  : ""
              }
              ${
                stepsToExecute[currentStep]?.type === "overwrite" &&
                stepsToExecute[currentStep]?.index == index + 1
                  ? "active-overwrite"
                  : ""
              }
              ${
                stepsToExecute[currentStep]?.type === "swap" &&
                stepsToExecute[currentStep]?.indices.includes(index)
                  ? "active-swap"
                  : ""
              }
               ${
                 stepsToExecute[currentStep]?.pivotIndex == index ? "pivot" : ""
               }
              
              `}
              style={{
                height: `${element}%`,
                width: `${MIN_BAR_WIDTH}px`,
                minWidth: "5px",
              }}
            ></div>
          );
        })}
      </div>
      <button onClick={reset}>Reset Array</button>
      <button disabled={!isSortable} onClick={startMergeSort}>
        Merge Sort
      </button>
      <button disabled={!isSortable} onClick={startQuickSort}>
        Quick Sort
      </button>
      {stepByStepMode && stepsToExecute.length > 0 && (
        <>
          <button disabled={currentStep === 0}>Previous Step</button>
          <button onClick={executeNextStep}>
            {currentStep === stepsToExecute.length - 1 ? "Finish" : "Next Step"}
          </button>
        </>
      )}
    </div>
  );
};

export default Sorting;
