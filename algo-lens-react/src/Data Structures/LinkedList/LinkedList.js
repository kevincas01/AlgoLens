import React, { useState } from "react";
import LinkedListSVG from "../../Components/LinkedListSVG";

class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

const LinkedList = ({ stepByStepMode }) => {
  const [root, setRoot] = useState(null); // root points to the head of the linked list
  const [linkedListLength, setLinkedListLength] = useState(0);

  // Add node to the head of the list
  const add = (element) => {
    const newNode = new LinkedListNode(element);
    newNode.next = root; // Point the new node to the current head
    setRoot(newNode); // Set the new node as the head
    setLinkedListLength(linkedListLength + 1);
  };

  // Remove the head node
  const remove = () => {
    if (root) {
      setRoot(root.next); // Remove the head by pointing to the next node
      setLinkedListLength(linkedListLength - 1);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>LinkedList Visualizer</h1>
      <button
        onClick={() => {
          setRoot(null);
          setLinkedListLength(0);
        }}
      >
        Reset
      </button>
      <button
        onClick={() => add(Math.floor(Math.random() * 100))}
        disabled={linkedListLength >= 10} // Disabled when list length is >= 10
      >
        Add Random
      </button>
      <button onClick={() => remove()} disabled={linkedListLength === 0}>
        Remove
      </button>
      <LinkedListSVG root={root} svgWidth={700} svgHeight={500} />
    </div>
  );
};

export default LinkedList;
