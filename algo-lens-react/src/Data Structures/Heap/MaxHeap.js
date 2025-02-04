import React, { useEffect, useState } from "react";
import HeapButtons from "../../Components/HeapButtons";
import { calculateNodePositions, getLeftChildIndex, getParentIndex, getRightChildIndex, MAX_SIZE } from "../../utils/nodeArrays";
import HeapSvg from "../../Components/HeapSvg";
const MaxHeap = ({ stepByStepMode }) => {
  const [heap, setHeap] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); // Tracks the current step of the process
  const [highlightedIndices, setHighlightedIndices] = useState([]); // Indices to highlight

  const [stepsToExecute, setStepsToExecute] = useState([]); // Steps to execute

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

  const reset = () => {
    setHeap([]);
    setCurrentStep(0);
    setHighlightedIndices([]);
    setStepsToExecute([]);
    setFadeInNodeIndex(null);
    setAnimatedLineIndex(null);
  };



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

      <HeapSvg
        array={heap}
        currentStep={currentStep}
        fadeInNodeIndex={fadeInNodeIndex}
        animatedLineIndex={animatedLineIndex}
        highlightedIndices={highlightedIndices}
      />
    </div>
  );
};

export default MaxHeap;
