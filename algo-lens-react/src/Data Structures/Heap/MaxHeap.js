import React, { useEffect, useState } from "react";
import HeapButtons from "../../Components/HeapButtons";
import { calculateNodePositions, MAX_SIZE } from "../../utils/nodeArrays";

const MaxHeap = ({ stepByStepMode, setStepByStepMode }) => {
  const [heap, setHeap] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); // Tracks the current step of the process
  const [highlightedIndices, setHighlightedIndices] = useState([]); // Indices to highlight

  const [stepsToExecute, setStepsToExecute] = useState([]); // Steps to execute

  const [paused, setPaused] = useState(false);
  const [fadeInNodeIndex, setFadeInNodeIndex] = useState(null); // Index of the new node
  const [animatedLineIndex, setAnimatedLineIndex] = useState(null); // Index for the new animated line

  useEffect(() => {
    if (!stepByStepMode && stepsToExecute.length > 0) {
      const intervalId = setInterval(() => {
        executeNextStep();
      }, 1000); // Execute every 500ms

      // Clear the interval when all steps are executed or if the mode is changed
      if (currentStep > stepsToExecute.length || stepsToExecute.length == 0) {
        clearInterval(intervalId);
      }

      return () => clearInterval(intervalId);
    }
  }, [stepByStepMode, currentStep, stepsToExecute]);

  const getParentIndex = (index) => Math.floor((index - 1) / 2);
  const getLeftChildIndex = (index) => 2 * index + 1;
  const getRightChildIndex = (index) => 2 * index + 2;

  const swap = (heapArray, index1, index2) => {
    const newHeap = [...heapArray];
    [newHeap[index1], newHeap[index2]] = [newHeap[index2], newHeap[index1]];
    setHeap(newHeap);
  };

  const add = (element) => {
    if (heap.length >= MAX_SIZE) return;
    setCurrentStep(0);

    const newHeap = [...heap, element];
    setHeap(newHeap);
    setFadeInNodeIndex(newHeap.length - 1);
    setAnimatedLineIndex(newHeap.length - 1);
    heapifyUp(newHeap, newHeap.length - 1, element);
  };

  const heapifyUp = (heapArray, index, element) => {
    let steps = [];

    while (index > 0 && element > heapArray[getParentIndex(index)]) {
      const parentIndex = getParentIndex(index);
      steps.push([index, parentIndex]);
      index = parentIndex;
    }
    setStepsToExecute(steps);
    setHighlightedIndices(steps);
  };

  const remove = () => {
    if (heap.length === 0) return null;
    if (heap.length === 1) {
      setHeap([]);
      return heap.pop();
    }

    const newHeap = [...heap];
    const root = newHeap[0];
    const element = newHeap.pop();
    newHeap[0] = element;
    setHeap(newHeap);

    heapifyDown(newHeap, 0, element);
    return root;
  };

  const heapifyDown = (heapArray, index, element) => {
    let steps = [];
    while (getLeftChildIndex(index) < heapArray.length) {
      let biggerChildIndex = getLeftChildIndex(index);
      const rightChildIndex = getRightChildIndex(index);

      if (
        rightChildIndex < heapArray.length &&
        heapArray[rightChildIndex] > heapArray[biggerChildIndex] &&
        heapArray[rightChildIndex] > element
      ) {
        biggerChildIndex = rightChildIndex;
      }
      if (element >= heapArray[biggerChildIndex]) break;

      steps.push([index, biggerChildIndex]);
      index = biggerChildIndex;
    }
    setStepsToExecute(steps);
    setHighlightedIndices(steps);
  };
  // Execute the next step when the user clicks the "Play" button
  const executeNextStep = () => {
    if (currentStep < stepsToExecute.length && stepsToExecute.length != 0) {
      const [index, parentIndex] = stepsToExecute[currentStep];
      // Perform the swap or comparison
      if (parentIndex !== undefined) {
        swap(heap, index, parentIndex);
      } else {
        swap(heap, index, index); // Self-swap (for highlighting)
      }

      // Remove the executed step from the stepsToExecute array
      setCurrentStep((prevStep) => prevStep + 1);

      // Increment the currentStep to move to the next step
    } else {
      setCurrentStep(0);
      setStepsToExecute([]);
      setHighlightedIndices([]);
    }
  };
  const executePreviousStep = () => {
    if (currentStep <= stepsToExecute.length) {
      const [index, parentIndex] = stepsToExecute[currentStep - 1];
      // Perform the swap or comparison
      if (parentIndex !== undefined) {
        swap(heap, index, parentIndex);
      } else {
        swap(heap, index, index); // Self-swap (for highlighting)
      }
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const peek = () => (heap.length === 0 ? null : heap[0]);

  const reset = () => {
    setHeap([]);
    setCurrentStep(0);
    setHighlightedIndices([]);
    setStepsToExecute([]);
    setPaused(false);
    setFadeInNodeIndex(null);
    setAnimatedLineIndex(null);
  };

  // SVG dimensions
  const svgWidth = 700;
  const svgHeight = 500;

  // Calculate node positions

  const nodePositions = calculateNodePositions(heap, svgWidth);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>MaxHeap Visualizer</h1>
      <HeapButtons
        heap={heap}
        reset={reset}
        add={add}
        remove={remove}
        currentStep={currentStep}
        executeNextStep={executeNextStep}
        executePreviousStep={executePreviousStep}
        stepByStepMode={stepByStepMode}
        stepsToExecute={stepsToExecute}
      />

      <svg
        width={svgWidth}
        height={svgHeight}
        style={{
          display: "block",
          margin: "20px auto",
          borderRadius: "15px", // Rounded corners for a sleek look
          background: "linear-gradient(135deg, #1e3c72, #2a5298)", // Modern gradient background
          boxShadow:
            "0 8px 15px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadows
          overflow: "hidden", // Ensures child elements stay within the rounded edges
        }}
      >
        {/* Render edges (lines) */}
        {heap.map((_, index) => {
          const parentIndex = getParentIndex(index);
          if (parentIndex >= 0) {
            const parentPos = nodePositions[parentIndex];
            const childPos = nodePositions[index];
            if (!parentPos || !childPos) return null;

            const length = Math.sqrt(
              Math.pow(childPos.x - parentPos.x, 2) +
                Math.pow(childPos.y - parentPos.y, 2)
            );
            return (
              <line
                key={`line-${index}`}
                x1={nodePositions[parentIndex].x}
                y1={nodePositions[parentIndex].y}
                x2={nodePositions[index].x}
                y2={nodePositions[index].y}
                stroke="black"
                style={{
                  opacity: animatedLineIndex === index ? 0 : 1,
                  animation:
                    animatedLineIndex === index ? "fadeIn 1s forwards" : "none",
                }}
              />
            );
          }
          return null;
        })}

        {/* Render nodes (circles) */}
        {heap.map((value, index) => (
          <>
            <g key={index}>
              <circle
                cx={nodePositions[index].x}
                cy={nodePositions[index].y}
                r={12} /* Slightly larger for a more impactful look */
                fill="url(#circleGradient)" /* Apply a gradient */
                strokeWidth="2"
                style={{
                  opacity: fadeInNodeIndex === index ? 0 : 1,
                  animation:
                    fadeInNodeIndex === index ? "fadeIn 1s forwards" : "none",
                  filter:
                    highlightedIndices.length > currentStep &&
                    highlightedIndices.length > 0 &&
                    highlightedIndices[currentStep].includes(index)
                      ? "drop-shadow(0 0 8px #2ecc71)"
                      : "drop-shadow(0 0 4px rgba(0, 0, 0, 0.2))" /* Glowing effect for highlights */,
                }}
              />
              <text
                x={nodePositions[index].x}
                y={nodePositions[index].y + 5}
                textAnchor="middle"
                fontSize="12"
                fill="#ffffff" /* White text for better contrast */
                style={{
                  pointerEvents:
                    "none" /* Ensure text doesn't block hover events */,
                  fontWeight: "bold",
                }}
              >
                {value}
              </text>
            </g>

            {/* Add a gradient definition for circles */}
            <defs>
              <linearGradient
                id="circleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#6a11cb", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#2575fc", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
          </>
        ))}
      </svg>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes drawLine {
            from {
              stroke-dashoffset: 100%;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MaxHeap;
