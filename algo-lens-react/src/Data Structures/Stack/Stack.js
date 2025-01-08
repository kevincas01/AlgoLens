import React, { useEffect, useState } from "react";
import HeapButtons from "../../Components/HeapButtons";
import { calculateElementPositions, MAX_SIZE } from "../../utils/elementArrays";
import QueueStackSvg from "../../Components/QueueStackSvg";

const Stack = ({ stepByStepMode }) => {
  const [stack, setStack] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); // Tracks the current step of the process

  const [fadeInNodeIndex, setFadeInNodeIndex] = useState(null); // Index of the new node
  const [fadeOutNodeIndex, setFadeOutNodeIndex] = useState(null);
  const add = (element) => {
    if (stack.length >= MAX_SIZE) return;
    setCurrentStep(0);

    const newStack = [...stack, element];
    setStack(newStack);
    setFadeInNodeIndex(newStack.length - 1);
    setFadeOutNodeIndex(null);
  };
  const remove = () => {
    if (stack.length === 0) return;
    setFadeInNodeIndex(null);
    setFadeOutNodeIndex(stack.length - 1);

    setTimeout(() => {
      setStack((prevStack) => {
        const newStack = [...prevStack]; // Create a copy of the stack
        newStack.pop(); // Modify the copy
        return newStack; // Return the updated copy
      });
    }, 200);
  };

  const reset = () => {
    setStack([]);
    setCurrentStep(0);
    setFadeInNodeIndex(null);
    setFadeOutNodeIndex(null);
  };

  // SVG dimensions
  const svgWidth = 700;
  const svgHeight = 500;

  // Calculate node positions

  const elementPositions = calculateElementPositions(
    stack,
    svgWidth / 2,
    svgHeight
  );
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Stack Visualizer</h1>
      <button onClick={() => reset()}>Reset</button>
      <button
        onClick={() => add(Math.floor(Math.random() * 100))}
        disabled={stack.length >= MAX_SIZE} // Disabled when stack length is >= MAX_SIZE
      >
        Add Random
      </button>
      <button
        onClick={() => remove()}
        disabled={stack.length === 0} // Disabled when heap is empty
      >
        Remove
      </button>
      <QueueStackSvg
        array={stack}
        fadeInNodeIndex={fadeInNodeIndex}
        fadeOutNodeIndex={fadeOutNodeIndex}
      />
    </div>
  );
};

export default Stack;
