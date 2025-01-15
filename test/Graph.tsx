"use client";
import React, { useEffect, useRef, useState } from "react";
import { Graph } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import MultiAINode from "./MultiAINode";
import { ArrowDown, ArrowRight } from "lucide-react";
//
const GraphComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const [isVertical, setIsVertical] = useState(false);

  const updateLayout = (graph: Graph, vertical: boolean) => {
    graph.options.connecting.router = {
      name: "orth",
      args: {
        padding: 20,
        startDirections: vertical ? ["bottom"] : ["right"],
        endDirections: vertical ? ["top"] : ["left"],
      },
    };

    // Update existing edges with new router settings
    graph.getEdges().forEach((edge) => {
      edge.router = {
        name: "orth",
        args: {
          padding: 20,
          startDirections: vertical ? ["bottom"] : ["right"],
          endDirections: vertical ? ["top"] : ["left"],
        },
      };
    });

    graph.getNodes().forEach((node) => {
      node.setData({ isVertical: vertical }); // Update node data
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    register({
      shape: "multi-ai-node",
      width: 350,
      height: 50,
      component: MultiAINode,
      ports: {
        groups: {
          right: {
            position: {
              name: "absolute",
              args: {
                x: "100%",
                y: "50%",
              },
            },
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "#fff",
                strokeWidth: 2,
              },
              plus: {
                d: "M -4 0 L 4 0 M 0 -4 L 0 4",
                stroke: "#2d8cf0",
                strokeWidth: 2,
              },
              line: {
                stroke: "#2d8cf0",
                strokeWidth: 2,
                targetMarker: null,
              },
            },
            markup: [
              {
                tagName: "path",
                selector: "line",
              },
              {
                tagName: "circle",
                selector: "circle",
              },
              {
                tagName: "path",
                selector: "plus",
              },
            ],
          },

          bottom: {
            position: {
              name: "absolute",
              args: {
                x: "50%",
                y: "100%",
              },
            },
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "#fff",
                strokeWidth: 2,
                cursor: "pointer",
              },
            },
            markup: [
              {
                tagName: "circle",
                selector: "circle",
              },
            ],
          },
        },
      },
    });
    const graph = new Graph({
      container: containerRef.current,
      grid: true,
      width: 800,
      height: 600,
      background: { color: "#f8f9fa" },
      connecting: {
        router: {
          name: "orth",
          args: {
            padding: 20,
            startDirections: ["right"],
            endDirections: ["left"],
          },
        },
        connector: {
          name: "rounded",
          args: { radius: 8 },
        },
        validateConnection: ({ sourcePort, targetPort, targetMagnet }) => {
          return (
            !!targetMagnet &&
            sourcePort !== targetPort &&
            targetMagnet.getAttribute("magnet") === "true"
          );
        },
        connectionPoint: "anchor",
        snap: { radius: 20 },
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        allowEdge: false,
        allowMulti: true,
        highlight: true,
      },
      highlighting: {
        magnetAvailable: {
          name: "stroke",
          args: {
            padding: 4,
            attrs: {
              strokeWidth: 4,
              stroke: "#52c41a",
            },
          },
        },
      },
      interacting: {
        magnetConnectable: true,
        nodeMovable: true,
      },
    });

    graph.on("node:change:position", ({ node, options }) => {
      if (options.skipParentHandler) return;

      const parent = node.getParent();
      if (parent && parent.shape === "block-node") {
        const parentBBox = parent.getBBox();
        const nodeBBox = node.getBBox();

        const x = Math.min(
          Math.max(nodeBBox.x, parentBBox.x + 10),
          parentBBox.x + parentBBox.width - nodeBBox.width - 10
        );

        const y = Math.min(
          Math.max(nodeBBox.y, parentBBox.y + 40),
          parentBBox.y + parentBBox.height - nodeBBox.height - 10
        );

        if (x !== nodeBBox.x || y !== nodeBBox.y) {
          node.setPosition({ x, y }, { skipParentHandler: true });
        }
      }
    });

    graphRef.current = graph;
    return () => {
      graph.dispose();
    };
  }, []);

  const handleDragStart = (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData("nodeType", type);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData("nodeType");

    if (nodeType && graphRef.current) {
      const { offsetX, offsetY } = event.nativeEvent;
      const point = graphRef.current.clientToLocal({ x: offsetX, y: offsetY });

      graphRef.current.addNode({
        shape: nodeType,
        x: point.x - 175, // Center the node
        y: point.y - 25,
        ports: {
          items: [
            {
              id: "port-1",
              group: "right",
            },
          ],
        },
      });
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };
  const handleLayoutToggle = () => {
    if (graphRef.current) {
      const newIsVertical = !isVertical;
      setIsVertical(newIsVertical);
      updateLayout(graphRef.current, newIsVertical);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="p-4 bg-gray-100 border-r border-gray-200 h-full">
        {/* Multi-AI Node */}
        <div
          className="mb-2 border border-gray-300 rounded bg-white cursor-pointer"
          draggable
          onDragStart={(event) => handleDragStart(event, "multi-ai-node")}
        >
          <MultiAINode isVertical={isVertical} />
        </div>
      </div>

      {/* Right Canvas Area */}
      <div className="flex-1 h-screen relative">
        {/* Layout Toggle Button */}
        <button
          onClick={handleLayoutToggle}
          className="absolute top-4 right-4 z-10 bg-white p-2 rounded-md shadow-md hover:bg-gray-50"
          title={
            isVertical
              ? "Switch to Horizontal Layout"
              : "Switch to Vertical Layout"
          }
        >
          {isVertical ? <ArrowRight /> : <ArrowDown />}
        </button>

        <div
          ref={containerRef}
          className="w-full h-full"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
      </div>
    </div>
  );
};

export default GraphComponent;
