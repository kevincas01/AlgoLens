import React from "react";
import { calculateElementPositions } from "../utils/elementArrays";


const QueueStackSvg = ({
  array,
  fadeInNodeIndex,
  fadeOutNodeIndex,
  svgWidth = 700,
  svgHeight = 500,
}) => {
  // Calculate node positions
  const elementPositions = calculateElementPositions(
    array,
    svgWidth / 2,
    svgHeight
  );

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={{
        display: "block",
        margin: "20px auto",
        borderRadius: "15px",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        boxShadow:
          "0 8px 15px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      {array.map((value, index) => (
        <g
          key={index}
          style={{
            animation:
              fadeInNodeIndex === index
                ? "slideInFromLeft 0.5s forwards"
                : fadeOutNodeIndex === index
                ? "slideOutToRight 0.5s forwards"
                : "none",
          }}
        >
          <rect
            x={elementPositions[index].x - 50}
            y={elementPositions[index].y - 25}
            width={100}
            height={50}
            fill="url(#circleGradient)"
            strokeWidth="2"
          />

          <text
            x={elementPositions[index].x}
            y={elementPositions[index].y + 5}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="16"
            fill="#ffffff"
            style={{
              pointerEvents: "none",
              fontWeight: "bold",
            }}
          >
            {value}
          </text>
        </g>
      ))}

      <defs>
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#6a11cb", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#2575fc", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>

      <style>
        {`
          @keyframes slideInFromLeft {
            0% {
              transform: translateX(-150%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideOutToRight {
            0% {
              transform: translateX(0);
              opacity: 1;
            }
            100% {
              transform: translateX(150%);
              opacity: 0;
            }
          }
        `}
      </style>
    </svg>
  );
};

export default QueueStackSvg;
