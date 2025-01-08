import React, { useEffect, useState } from "react";
import BaseSVG from "./BaseSVG";

const LinkedListSVG = ({
  nodePositions,
  root,
  svgWidth = 700,
  svgHeight = 500,
}) => {
  return (
    <BaseSVG svgWidth={svgWidth} svgHeight={svgHeight}>
      <defs>
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#6a11cb", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#2575fc", stopOpacity: 1 }}
          />
        </linearGradient>

        {/* Define arrowhead marker once */}
        <marker
          id="arrowhead"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <polygon points="0,0 10,5 0,10" fill="black" />
        </marker>
      </defs>

      {/* Head Block and pointer */}

      {/* Render linked list nodes */}
      {nodePositions.length > 0 &&
        nodePositions.map((node, index) => (
          <g key={index}>
            {/* Render node rectangle */}
            <rect
              x={node.x - 50}
              y={node.y - 25}
              width={50}
              height={50}
              fill="url(#circleGradient)"
              strokeWidth="2"
              // style={{
              //   animation: index === 0 ? "slideInFromTop 5s forwards" : "none",
              // }}
            />
            <text
              x={node.x - 25} // Centered horizontally
              y={node.y} // Vertically aligned
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fill="#ffffff"
              style={{ pointerEvents: "none", fontWeight: "bold" }}
            >
              {node.value}
            </text>

            {/* Render arrow to next node */}
            {index < nodePositions.length - 1 &&
              nodePositions[index].x2 &&
              nodePositions[index]?.y2 && (
                <line
                  x1={nodePositions[index].x}
                  y1={nodePositions[index].y}
                  x2={nodePositions[index]?.x2}
                  y2={nodePositions[index]?.y2}
                  stroke="black"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              )}
          </g>
        ))}

      <style>
        {`
          @keyframes slideInFromTop {
            0% {
              transform: translateY(-50px);
              opacity: 1;
            }
            100% {
              transform: translateY(0px);
              opacity: 1;
            }
          }
        `}
      </style>
    </BaseSVG>
  );
};

export default LinkedListSVG;
