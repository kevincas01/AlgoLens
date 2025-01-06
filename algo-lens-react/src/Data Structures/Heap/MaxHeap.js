import React, { useEffect, useState } from "react";

const MaxHeap = () => {
  const [heap, setHeap] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); // Tracks the current step of the process
  const [highlightedIndices, setHighlightedIndices] = useState([]); // Indices to highlight

  const [stepsToExecute, setStepsToExecute] = useState([]); // Steps to execute

  const [stepByStepMode, setStepByStepMode] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!stepByStepMode && stepsToExecute.length > 0) {
      const intervalId = setInterval(() => {
        executeNextStep();
      }, 1000); // Execute every 500ms

      // Clear the interval when all steps are executed or if the mode is changed
      if (currentStep >= stepsToExecute.length) {
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
    const newHeap = [...heap, element];
    setHeap(newHeap);
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
    if (heap.length === 1) return heap.pop();

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

      console.log( heapArray[biggerChildIndex], heapArray[rightChildIndex], element)
      if (
        rightChildIndex < heapArray.length &&
        heapArray[rightChildIndex] > heapArray[biggerChildIndex] &&
        heapArray[rightChildIndex] > element
      ) {
        biggerChildIndex = rightChildIndex;
      }
      console.log(element, heapArray[biggerChildIndex]);
      if (element >= heapArray[biggerChildIndex]) break;

      steps.push([index, biggerChildIndex]);
      index = biggerChildIndex;
    }
    setStepsToExecute(steps);
    setHighlightedIndices(steps);
  };

  // Execute the next step when the user clicks the "Play" button
  const executeNextStep = () => {
    if (currentStep < stepsToExecute.length) {
      const [index, parentIndex] = stepsToExecute[currentStep];
      // Perform the swap or comparison
      if (parentIndex !== undefined) {
        swap(heap, index, parentIndex);
      } else {
        swap(heap, index, index); // Self-swap (for highlighting)
      }

      // Remove the executed step from the stepsToExecute array
      setStepsToExecute((prevSteps) => prevSteps.slice(1));
      setHighlightedIndices((prevIndices) => prevIndices.slice(1));

      // Increment the currentStep to move to the next step
    }
  };

  const peek = () => (heap.length === 0 ? null : heap[0]);

  // SVG dimensions
  const svgWidth = 700;
  const svgHeight = 500;

  // Calculate node positions

  const getNodePositions = () => {
    const newNodePositions = Array(heap.length).fill(null); // Initialize array to store node positions
    recurseLevelPosition(newNodePositions, 0, svgWidth / 2, 50); // Start at center for root
    return newNodePositions;
  };

  const recurseLevelPosition = (newNodePositions, index, x, y) => {
    if (index < 0 || index > heap.length) return;

    newNodePositions[index] = { x, y };
    const level = Math.floor(Math.log2(index + 1)) + 1; // Calculate the level in the tree
    const leftChild = getLeftChildIndex(index);
    const rightChild = getRightChildIndex(index);
    if (leftChild < heap.length) {
      recurseLevelPosition(
        newNodePositions,
        leftChild,
        x - 150 / level,
        y + 80
      );
    }
    if (rightChild < heap.length) {
      recurseLevelPosition(
        newNodePositions,
        rightChild,
        x + 150 / level,
        y + 80
      );
    }
  };
  const nodePositions = getNodePositions(svgWidth);

  console.log(highlightedIndices);
  return (
    <div style={{ textAlign: "center" }}>
      <h1>MaxHeap Visualizer</h1>
      <button onClick={() => add(Math.floor(Math.random() * 100))}>
        Add Random
      </button>
      <button onClick={() => remove()}>Remove Max</button>
      {paused && (
        <button
          onClick={() => {
            setPaused(true);
          }}
        >
          Play
        </button>
      )}

      {paused && stepsToExecute.length > 0 && (
        <button onClick={executeNextStep}>Next Step</button>
      )}

      <svg
        width={svgWidth}
        height={svgHeight}
        style={{
          display: "block",
          margin: "20px auto",
          border: "1px solid black",
          backgroundColor: "white",
        }}
      >
        {/* Render edges (lines) */}
        {heap.map((_, index) => {
          const parentIndex = getParentIndex(index);
          if (parentIndex >= 0) {
            return (
              <line
                key={`line-${index}`}
                x1={nodePositions[parentIndex].x}
                y1={nodePositions[parentIndex].y}
                x2={nodePositions[index].x}
                y2={nodePositions[index].y}
                stroke="black"
              />
            );
          }
          return null;
        })}

        {/* Render nodes (circles) */}
        {heap.map((value, index) => (
          <g key={index}>
            <circle
              cx={nodePositions[index].x}
              cy={nodePositions[index].y}
              r={10}
              fill={
                highlightedIndices.length > 0 &&
                highlightedIndices[0].includes(index)
                  ? "lightgreen"
                  : "lightblue"
              }
              stroke="black"
            />
            <text
              x={nodePositions[index].x}
              y={nodePositions[index].y + 5}
              textAnchor="middle"
              fontSize="12"
            >
              {value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default MaxHeap;
