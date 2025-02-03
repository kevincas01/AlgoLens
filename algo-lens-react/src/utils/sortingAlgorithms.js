export const mergeSort = (arr) => {
  let tempSteps = [];
  let sorted = arr.slice();

  const merge = (leftIndex1, rightIndex1, leftIndex2, rightIndex2) => {
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

  const divide = (leftIndex, rightIndex) => {
    if (leftIndex >= rightIndex) return;

    const mid = Math.floor((leftIndex + rightIndex) / 2);
    divide(leftIndex, mid);
    divide(mid + 1, rightIndex);
    merge(leftIndex, mid, mid + 1, rightIndex);
  };

  divide(0, arr.length - 1);
  return tempSteps;
};

export const quickSort = (arr) => {
  let tempSteps = [];

  let sorted = arr.slice();
  const swap = (i, j) => {
    [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
    tempSteps.push({ type: "swap", indices: [i, j] });
  };

  const partition = (leftIndex, rightIndex) => {
    let pivotElement = sorted[rightIndex];
    let currLowIndex = leftIndex - 1;

    for (let i = leftIndex; i < rightIndex; i++) {
      tempSteps.push({ type: "compare", indices: [i, rightIndex] }); // Compare
      if (sorted[i] <= pivotElement) {
        currLowIndex++;
        swap(i, currLowIndex); // Correct swap
      }
    }

    swap(currLowIndex + 1, rightIndex); // Move pivot to the correct position
    return currLowIndex + 1;
  };

  const sort = (leftIndex, rightIndex) => {
    if (leftIndex >= rightIndex) return;
    const pivot = partition(leftIndex, rightIndex);
    sort(leftIndex, pivot - 1); // Corrected recursion
    sort(pivot + 1, rightIndex);
  };

  sort(0, sorted.length - 1);
  return tempSteps;
};
