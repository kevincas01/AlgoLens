export const calculateNodePositions = (array,width) => {
  const positions = Array(array.length).fill(null);
  const recurse = (index, x, y, level,width) => {
    if (index >= array.length) return;
    positions[index] = { x, y };

    const offset = width / (level);
    recurse(getLeftChildIndex(index), x - offset, y + 80, level + 1,width/1.3);
    recurse(getRightChildIndex(index), x + offset, y + 80, level + 1,width/1.3);
  };
  recurse(0, width / 2, 50, 1,width /4); // Start at the center for the root node
  return positions;
};

export const getParentIndex = (index) => Math.floor((index - 1) / 2);
export const getLeftChildIndex = (index) => 2 * index + 1;
export const getRightChildIndex = (index) => 2 * index + 2;


export const MAX_SIZE=31