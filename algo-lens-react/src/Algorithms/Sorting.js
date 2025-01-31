import React, { useEffect, useState } from "react";

const Sorting = () => {
  const [array, setArray] = useState([]);

  const MAX_BARS = 100;
  const getNewArray = () => {
    let newArray = [];
    for (let i = 0; i < MAX_BARS; i++) {
      newArray.push(Math.floor(Math.random(1) * 100));
    }

    setArray(newArray);
  };
  useEffect(() => {
    getNewArray();
  }, []);

  return (
    <div className="sorting-visualization">
      <div className="bars-wrapper">
        {array.map((element, index) => {
          return (
            <div
              key={index}
              className="sort-bar"
              style={{ height: element + "%" }}
            ></div>
          );
        })}
      </div>
      <button onClick={() => getNewArray()}>Reset Array</button>
    </div>
  );
};

export default Sorting;
