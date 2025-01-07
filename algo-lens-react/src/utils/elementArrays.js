export const calculateElementPositions = (array, width, height) => {
  const positions = Array(array.length).fill(null);
  const heightOfElement = 50;
  let x = width;
  let y = height - 30;
  for (let i = 0; i < array.length; i++) {
    positions[i] = { x, y };
    y = height - 30 - (heightOfElement*(i+1));
  }
  return positions;
};
export const MAX_SIZE = 10;
