import React from "react";
import { calculateNodePositions, getParentIndex } from "../utils/nodeArrays";

const HeapSvg = ({
  array,
  currentStep,
  highlightedIndices,
  fadeInNodeIndex,
  animatedLineIndex,
  svgWidth = 700,
  svgHeight = 500,
}) => {
  // Calculate node positions
  const nodePositions = calculateNodePositions(array, svgWidth);

  return (
    <>
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{
          display: "block",
          margin: "20px auto",
          borderRadius: "15px", // Rounded corners for a sleek look
          background: "linear-gradient(135deg, #1e3c72, #2a5298)", // Modern gradient background
          boxShadow:
            "0 8px 15px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadows
          overflow: "hidden", // Ensures child elements stay within the rounded edges
        }}
      >
        {/* Render edges (lines) */}
        {array.map((_, index) => {
          const parentIndex = getParentIndex(index);
          if (parentIndex >= 0) {
            const parentPos = nodePositions[parentIndex];
            const childPos = nodePositions[index];
            if (!parentPos || !childPos) return null;

            const length = Math.sqrt(
              Math.pow(childPos.x - parentPos.x, 2) +
                Math.pow(childPos.y - parentPos.y, 2)
            );
            return (
              <line
                key={`line-${index}`}
                x1={nodePositions[parentIndex].x}
                y1={nodePositions[parentIndex].y}
                x2={nodePositions[index].x}
                y2={nodePositions[index].y}
                stroke="black"
                style={{
                  opacity: animatedLineIndex === index ? 0 : 1,
                  animation:
                    animatedLineIndex === index ? "fadeIn 1s forwards" : "none",
                }}
              />
            );
          }
          return null;
        })}

        {/* Render nodes (circles) */}
        {array.map((value, index) => (
          <>
            <g key={index}>
              <circle
                cx={nodePositions[index].x}
                cy={nodePositions[index].y}
                r={12} /* Slightly larger for a more impactful look */
                fill="url(#circleGradient)" /* Apply a gradient */
                strokeWidth="2"
                style={{
                  opacity: fadeInNodeIndex === index ? 0 : 1,
                  animation:
                    fadeInNodeIndex === index ? "fadeIn 1s forwards" : "none",
                  filter:
                    highlightedIndices.length > currentStep &&
                    highlightedIndices.length > 0 &&
                    highlightedIndices[currentStep].includes(index)
                      ? "drop-shadow(0 0 8px #2ecc71)"
                      : "drop-shadow(0 0 4px rgba(0, 0, 0, 0.2))" /* Glowing effect for highlights */,
                }}
              />
              <text
                x={nodePositions[index].x}
                y={nodePositions[index].y + 5}
                textAnchor="middle"
                fontSize="12"
                fill="#ffffff" /* White text for better contrast */
                style={{
                  pointerEvents:
                    "none" /* Ensure text doesn't block hover events */,
                  fontWeight: "bold",
                }}
              >
                {value}
              </text>
            </g>

            {/* Add a gradient definition for circles */}
            <defs>
              <linearGradient
                id="circleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#6a11cb", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#2575fc", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
          </>
        ))}
      </svg>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes drawLine {
            from {
              stroke-dashoffset: 100%;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </>
  );
};

export default HeapSvg;
