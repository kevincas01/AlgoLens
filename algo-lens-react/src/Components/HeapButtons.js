import React from "react";
import { MAX_SIZE } from "../utils/nodeArrays";

const HeapButtons = ({

  heap,
  reset,
  add,
  remove,
  currentStep,
  executeNextStep,
  executePreviousStep,
  stepByStepMode,
  stepsToExecute,
}) => {
  return (
    <div>
      <button onClick={() => reset()}>Reset</button>
      <button
        onClick={() => add(Math.floor(Math.random() * 100))}
        disabled={heap.length >= MAX_SIZE} // Disabled when heap length is >= MAX_SIZE
      >
        Add Random
      </button>
      <button
        onClick={() => remove()}
        disabled={heap.length === 0} // Disabled when heap is empty
      >
        Remove
      </button>

      {stepByStepMode && stepsToExecute.length > 0 && (
        <>
          <button onClick={executePreviousStep} disabled={currentStep===0}>Previous Step</button>
          <button onClick={executeNextStep}>{currentStep=== stepsToExecute.length?"Finish":"Next Step"}</button>
        </>
      )}
    </div>
  );
};

export default HeapButtons;
