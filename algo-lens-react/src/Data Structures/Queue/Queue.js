import React, { useEffect, useState } from "react";
import HeapButtons from "../../Components/HeapButtons";
import { calculateElementPositions, MAX_SIZE } from "../../utils/elementArrays";
import QueueStackSvg from "../../Components/QueueStackSvg";

const Queue = ({ stepByStepMode }) => {
  const [queue, setQueue] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); // Tracks the current step of the process

  const [fadeInNodeIndex, setFadeInNodeIndex] = useState(null); // Index of the new node
  const [fadeOutNodeIndex, setFadeOutNodeIndex] = useState(null);
  const add = (element) => {
    if (queue.length >= MAX_SIZE) return;
    setCurrentStep(0);

    const newQueue = [...queue, element];
    setQueue(newQueue);
    setFadeInNodeIndex(newQueue.length - 1);
    setFadeOutNodeIndex(null);
  };
  const remove = () => {
    if (queue.length === 0) return;
    setFadeInNodeIndex(null);
    setFadeOutNodeIndex(0);

    setTimeout(() => {
      setQueue((prevQueue) => prevQueue.slice(1));
      setFadeOutNodeIndex(null);
    }, 500);
  };

  const reset = () => {
    setQueue([]);
    setCurrentStep(0);
    setFadeInNodeIndex(null);
    setFadeOutNodeIndex(null);
  };

  // SVG dimensions
  const svgWidth = 700;
  const svgHeight = 500;

  // Calculate node positions

  const elementPositions = calculateElementPositions(
    queue,
    svgWidth / 2,
    svgHeight
  );

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Queue Visualizer</h1>
      <button onClick={() => reset()}>Reset</button>
      <button
        onClick={() => add(Math.floor(Math.random() * 100))}
        disabled={queue.length >= MAX_SIZE} // Disabled when queue length is >= MAX_SIZE
      >
        Add Random
      </button>
      <button
        onClick={() => remove()}
        disabled={queue.length === 0} // Disabled when heap is empty
      >
        Remove
      </button>
      <QueueStackSvg
        array={queue}
        fadeInNodeIndex={fadeInNodeIndex}
        fadeOutNodeIndex={fadeOutNodeIndex}
      />
    </div>
  );
};

export default Queue;
