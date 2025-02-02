import React, { useEffect, useRef, useState } from "react";
const MIN_BAR_WIDTH = 20; // Minimum width of each bar in pixels
const BAR_MARGIN = 4;
const Sorting = ({ stepByStepMode }) => {
  const containerRef = useRef(null);
  const [array, setArray] = useState([]);
  const [stepsToTake, setStepsToTake] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const MAX_BARS = 100;

  const getNewArray = () => {
    let newArray = [];
    for (let i = 0; i < MAX_BARS; i++) {
      newArray.push(Math.floor(Math.random(1) * 100));
    }

    setArray(newArray);
  };
  const calculateMaxBars = () => {
    const containerWidth = containerRef.current.offsetWidth-50; // Get actual width
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
    if (!stepByStepMode && stepsToTake.length > 0) {
      const intervalId = setInterval(() => {
        executeNextStep();
      }, 50); // Execute every 500ms

      // Clear the interval when all stepsToTake are executed or if the mode is changed
      if (currentStep > stepsToTake.length || stepsToTake.length == 0) {
        clearInterval(intervalId);
      }

      return () => clearInterval(intervalId);
    }
  }, [stepByStepMode, currentStep, stepsToTake]);

  const executeNextStep = () => {
    if (currentStep < stepsToTake.length && stepsToTake.length !== 0) {
      const step = stepsToTake[currentStep];

      if (step.type === "compare") {
        const [index1, index2] = step.indices;
        // Add visual highlight logic here if needed
      }

      if (step.type === "overwrite") {
        const newArr = [...array];
        newArr[step.index] = step.value;
        setArray(newArr);
      }

      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const mergeSort = (arr) => {
    let tempSteps = [];
    let sorted = arr.slice();

    const merge2 = (leftIndex1, rightIndex1, leftIndex2, rightIndex2) => {
      let temp = [];
      let i = leftIndex1,
        j = leftIndex2;

      while (i <= rightIndex1 && j <= rightIndex2) {
        tempSteps.push({ type: "compare", indices: [i, j] }); // Compare

        if (sorted[i] < sorted[j]) {
          temp.push(sorted[i]);
          i++;
        } else {
          temp.push(sorted[j]);
          j++;
        }
      }

      while (i <= rightIndex1) {
        tempSteps.push({ type: "compare", indices: [i, i] }); // Single element left
        temp.push(sorted[i]);
        i++;
      }

      while (j <= rightIndex2) {
        tempSteps.push({ type: "compare", indices: [j, j] });
        temp.push(sorted[j]);
        j++;
      }

      for (let k = 0; k < temp.length; k++) {
        tempSteps.push({
          type: "overwrite",
          index: leftIndex1 + k,
          value: temp[k],
        });
        sorted[leftIndex1 + k] = temp[k];
      }
    };

    const divide2 = (leftIndex, rightIndex) => {
      if (leftIndex >= rightIndex) return;

      const mid = Math.floor((leftIndex + rightIndex) / 2);
      divide2(leftIndex, mid);
      divide2(mid + 1, rightIndex);
      merge2(leftIndex, mid, mid + 1, rightIndex);
    };

    divide2(0, arr.length - 1);
    return tempSteps;
  };

  const startMergeSort = () => {
    const newSteps = mergeSort(array);
    setStepsToTake(newSteps);
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
                stepsToTake[currentStep]?.type === "compare" &&
                stepsToTake[currentStep].indices.includes(index)
                  ? "active-compare"
                  : ""
              }

              ${
                stepsToTake[currentStep]?.type === "overwrite" &&
                stepsToTake[currentStep]?.index == index + 1
                  ? "active-overwrite"
                  : ""
              }
              
              `}
              style={{
                height: `${element}%`,
                width: `${MIN_BAR_WIDTH}px`,
                margin: `0 ${BAR_MARGIN / 2}px`,
                backgroundColor: "#3498db",
                transition: "height 0.3s ease",
              }}
            ></div>
          );
        })}
      </div>
      <button onClick={() => getNewArray()}>Reset Array</button>
      <button onClick={startMergeSort}>Start Merge Sort</button>
    </div>
  );
};

export default Sorting;
