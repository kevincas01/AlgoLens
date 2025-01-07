import React, { useEffect, useState } from "react";
import BaseSVG from "./BaseSVG";

const LinkedListSVG = ({ root, svgWidth = 700, svgHeight = 500 }) => {
  const [nodePositions, setNodePositions] = useState([]);
  const [headNext, setHeadNext] = useState({ x: 0, y: 0 });
  const calculateNodePositions = (nodes) => {
    const positions = [];
    const nodeSpacing = 100;
    let x = 150; // Start x position for the first node (Head)
    let y = svgHeight / 2; // Vertically center the nodes

    nodes.forEach((value) => {
      positions.push({ x, y, value });
      x += nodeSpacing;
    });

    return positions;
  };

  useEffect(() => {
    const linkedListNodes = [];
    let currentNode = root;
    if (!root) {
      setNodePositions([]);
      return;
    }

    while (currentNode) {
      linkedListNodes.push(currentNode.value);
      currentNode = currentNode.next;
    }

    // Initially position the first node 50px above the correct position
    const positions = calculateNodePositions(linkedListNodes);
    console.log(linkedListNodes);
    positions[0] = {
      ...positions[0],
      x: positions[0]?.x || 150,
      y: svgHeight / 2 - 50,
    };

    setNodePositions(positions);
    setHeadNext({ x: positions[1]?.x || 150, y: svgHeight / 2 - 50 });
   

    // After 5 seconds, move the first node to its correct position
    const timer = setTimeout(() => {
      setNodePositions((prevPositions) => {
        const updatedPositions = [...prevPositions];
        updatedPositions[0] = { ...updatedPositions[0], y: svgHeight / 2 }; // Correct the position of the first node
        return updatedPositions;
      });
    }, 1000);

    // Clean up the timeout
    return () => clearTimeout(timer);
  }, [root]);
  console.log(nodePositions);
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
      <g>
        <rect
          x={30} // Positioned 30 units from the left edge
          y={svgHeight / 2 - 25} // Vertically centered (50% height minus half the rectangle height)
          width={50}
          height={50}
          fill="url(#circleGradient)"
          strokeWidth="2"
        />
        <text
          x={30 + 25} // Position text at the center of the rectangle (x + half width)
          y={svgHeight / 2} // Vertically aligned with the rectangle
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fill="#ffffff"
          style={{
            pointerEvents: "none",
            fontWeight: "bold",
          }}
        >
          Head
        </text>
      </g>

      {/* Line from Head to the first node */}
      {nodePositions.length > 0 && (
        <line
          x1={80}
          y1={svgHeight / 2}
          x2={nodePositions[0]?.x - 50}
          y2={nodePositions[0]?.y}
          stroke="black"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      )}

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
            {index < nodePositions.length - 1 && (
              <line
                x1={nodePositions[index].x}
                y1={nodePositions[index].y}
                x2={nodePositions[index + 1]?.x - 50}
                y2={nodePositions[index + 1]?.y}
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
