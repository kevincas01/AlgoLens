import React, { useState } from "react";

const MinHeap = () => {
  const [heap, setHeap] = useState([]);

  const [currentIndex,setCurrentIndex] = useState(-1)
  const [comparingIndex,setComparingIndex] = useState(-1)
  
  // Helper methods
  function getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  function getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  function getRightChildIndex(index) {
    return 2 * index + 2;
  }

  function swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }

  // Add an element (Insert)
  function add(element) {
    this.heap.push(element);
    this.heapifyUp();
  }

  function heapifyUp() {
    let index = this.heap.length - 1;
    while (
      index > 0 &&
      this.heap[index] < this.heap[this.getParentIndex(index)]
    ) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  // Remove the root element (Extract Min)
  function remove() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return root;
  }

  function heapifyDown() {
    let index = 0;
    while (this.getLeftChildIndex(index) < this.heap.length) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);

      if (
        rightChildIndex < this.heap.length &&
        this.heap[rightChildIndex] < this.heap[smallerChildIndex]
      ) {
        smallerChildIndex = rightChildIndex;
      }

      if (this.heap[index] <= this.heap[smallerChildIndex]) break;

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }

  // Get the root element (Min value)
  function peek() {
    return this.heap.length === 0 ? null : this.heap[0];
  }
  return <div>MinHeap</div>;
};

export default MinHeap;
