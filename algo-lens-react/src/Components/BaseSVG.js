import React from "react";

const BaseSVG = ({ children, svgWidth, svgHeight }) => {

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={{
        display: "block",
        margin: "20px auto 0px auto",
        borderRadius: "15px", // Rounded corners for a sleek look
        background: "linear-gradient(135deg, #1e3c72, #2a5298)", // Modern gradient background
        boxShadow:
          "0 8px 15px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadows
        overflow: "hidden", // Ensures child elements stay within the rounded edges
      }}
    >
      {children}
    </svg>
  );
};

export default BaseSVG;
