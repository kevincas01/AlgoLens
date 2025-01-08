import React, { useEffect, useState } from "react";
import LinkedListSVG from "../../Components/LinkedListSVG";
import { SVG_HEIGHT, svgWidth } from "../../utils/svgSettings.js";

class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

const LinkedList = ({ stepByStepMode }) => {
  const [root, setRoot] = useState(new LinkedListNode("HEAD"));
  const [linkedListLength, setLinkedListLength] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const [stepsToExecute, setStepsToExecute] = useState([]);
  const [nodePositions, setNodePositions] = useState([]);
  // Add node to the head of the list
  const add = (element) => {
    const newNode = new LinkedListNode(element);

    newNode.next = root.next; // Point the new node to the current head
    const updatedRoot = { ...root, next: newNode }; // Create a new root with the updated next
    setRoot(updatedRoot); // Update the state

    setStepsToExecute([
      [1, 2],
      [0, 1],
    ]);
    setLinkedListLength(linkedListLength + 1);
  };
  const calculateNodePositions = (nodes) => {
    const positions = [];
    const nodeSpacing = 100;
    let x = 80; // Start x position for the first node (Head)
    let y = SVG_HEIGHT / 2; // Vertically center the nodes
    let x2 = 80 + 50; // Start x position for the first node (Head)
    let y2 = SVG_HEIGHT / 2; // Vertically center the nodes

    nodes.forEach((value) => {
      positions.push({ x, y, value, x2, y2 });
      x += nodeSpacing;
      x2 += nodeSpacing;
    });

    return positions;
  };

  useEffect(() => {
    const linkedListNodes = [];
    let currentNode = root;

    while (currentNode) {
      linkedListNodes.push(currentNode.value);
      currentNode = currentNode.next;
    }

    // Initially position the first node 50px above the correct position
    const positions = calculateNodePositions(linkedListNodes);

    if (!root.next) {
      setNodePositions(positions);
      return;
    }
    if (linkedListNodes.length > 2) {
      positions[0] = {
        ...positions[0],
        x2: positions[2].x - 50,
        y2: SVG_HEIGHT / 2,
      };
    } else if (linkedListNodes.length == 2) {
      positions[0] = {
        ...positions[0],
        x2: null,
        y2: null,
      };
      setCurrentStep(1);
    }
    positions[1] = {
      ...positions[1],
      y: SVG_HEIGHT / 2 - 50,
      x2: null,
      y2: null,
    };
    setNodePositions(positions);

    if (!stepByStepMode && stepsToExecute.length > 0) {
      const intervalId = setInterval(() => {
        executeNextStep();
      }, 1000);

      // Clear the interval when all steps are execu ted or if the mode is changed
      if (currentStep > stepsToExecute.length || stepsToExecute.length == 0) {
        clearInterval(intervalId);
      }

      return () => clearInterval(intervalId);
    }
  }, [linkedListLength]);

  // Remove the head node
  const remove = () => {
    if (root.next) {
      root.next = root.next.next; // Skip over the first real node
      setLinkedListLength(linkedListLength - 1); // Update the length
    }
  };
  const executeNextStep = () => {
    if (currentStep < stepsToExecute.length && stepsToExecute.length != 0) {
      // Remove the executed step from the stepsToExecute array
      const [replaceIndex, replaceWithIndex] = stepsToExecute[currentStep];
      setNodePositions((prevNodePositions) => {
        prevNodePositions[replaceIndex] = {
          ...prevNodePositions[replaceIndex],
          x2: prevNodePositions[replaceWithIndex]?.x - 50,
          y2: prevNodePositions[replaceWithIndex]?.y,
        };
        return prevNodePositions;
      });

      setCurrentStep((prevStep) => prevStep + 1);

      // Increment the currentStep to move to the next step
    } else {
      setCurrentStep(0);
      setStepsToExecute([]);
      setNodePositions((prevNodePositions) => {
        prevNodePositions[1] = {
          ...prevNodePositions[1],
          y: SVG_HEIGHT / 2,
        };
        prevNodePositions[0] = {
          ...prevNodePositions[0],
          y2: SVG_HEIGHT / 2,
        };
        return prevNodePositions;
      });
    }
  };

  const executePreviousStep = () => {
    if (currentStep <= stepsToExecute.length) {
      const [replaceIndex, replaceWithIndex] = stepsToExecute[currentStep - 1];

      if (replaceIndex == 1) {
        setNodePositions((prevNodePositions) => {
          prevNodePositions[replaceIndex] = {
            ...prevNodePositions[replaceIndex],
            x2: null,
            y2: null,
          };
          return prevNodePositions;
        });
      } else if (replaceIndex == 0) {
        setNodePositions((prevNodePositions) => {
          prevNodePositions[replaceIndex] = {
            ...prevNodePositions[replaceIndex],
            x2: prevNodePositions[replaceWithIndex+1]?.x - 50,
            y2: prevNodePositions[replaceWithIndex+1]?.y,
          };
          return prevNodePositions;
        });
      }
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h1>LinkedList Visualizer</h1>
      <button
        onClick={() => {
          root.next = null;
          setLinkedListLength(0);
        }}
      >
        Reset
      </button>
      <button
        onClick={() => add(Math.floor(Math.random() * 100))}
        disabled={linkedListLength >= 10 || stepsToExecute.length > 0} // Disabled when list length is >= 10
      >
        Add Random
      </button>
      <button
        onClick={() => remove()}
        disabled={linkedListLength === 0 || stepsToExecute.length > 0}
      >
        Remove
      </button>
      {stepByStepMode && stepsToExecute.length > 0 && (
        <>
          <button
            onClick={executePreviousStep}
            disabled={
              currentStep === 0 ||
              (nodePositions.length == 2 && currentStep === 1)
            }
          >
            Previous Step
          </button>
          <button onClick={executeNextStep}>
            {currentStep === stepsToExecute.length ? "Finish" : "Next Step"}
          </button>
        </>
      )}
      <LinkedListSVG
        nodePositions={nodePositions}
        root={root}
        svgWidth={700}
        SVG_HEIGHT={500}
      />
    </div>
  );
};

export default LinkedList;
