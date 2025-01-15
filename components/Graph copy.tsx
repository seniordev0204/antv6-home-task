"use client";
import React, { useEffect, useRef } from "react";
import { Graph } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import MultiAINode from "./MultiAINode";
import TextNode from "./TextNode";
import BlockNode from "./BlockNode";

const GraphComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  useEffect(() => {
    if (!containerRef.current) return;

    register({
      shape: "multi-ai-node",
      width: 350,
      height: 50,
      component: MultiAINode,
      ports: {
        groups: {
          top: {
            position: {
              name: "top",
              args: {
                dx: 0,
                dy: 0,
              },
            },
            attrs: {
              circle: {
                r: 0,
                magnet: true,
                stroke: "none",
                fill: "none",
              },
              ".plus-icon": {
                d: "M 0 -6 L 0 6 M -6 0 L 6 0",
                stroke: "#2d8cf0",
                strokeWidth: 2,
                fill: "none",
              },
              ".plus-background": {
                r: 10,
                fill: "#fff",
                stroke: "#2d8cf0",
                strokeWidth: 1,
              },
            },
            markup: [
              {
                tagName: "circle",
                selector: ".plus-background",
              },
              {
                tagName: "path",
                selector: ".plus-icon",
              },
            ],
          },
          bottom: {
            position: "bottom",
            attrs: {
              circle: {
                r: 10,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "#fff",
                strokeWidth: 1,
              },
              path: {
                d: "M -4 0 L 4 0 M 0 -4 L 0 4",
                stroke: "#2d8cf0",
                strokeWidth: 2,
              },
            },
            markup: [
              {
                tagName: "circle",
                selector: "circle",
              },
              {
                tagName: "path",
                selector: "path",
              },
            ],
          },
          left: {
            position: "left",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "#fff",
                strokeWidth: 1,
              },
            },
            markup: [
              {
                tagName: "circle",
                selector: "circle",
              },
            ],
          },
          right: {
            position: "right",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "#fff",
                strokeWidth: 1,
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

    register({
      shape: "text-node",
      width: 200,
      height: 40,
      component: TextNode,
      ports: {
        groups: {
          top: {
            position: {
              name: "top",
              args: {
                dx: 0,
                dy: 0,
              },
            },
            attrs: {
              circle: {
                r: 0,
                magnet: true,
                stroke: "none",
                fill: "none",
              },
              ".plus-icon": {
                d: "M 0 -6 L 0 6 M -6 0 L 6 0",
                stroke: "#2d8cf0",
                strokeWidth: 2,
                fill: "none",
              },
              ".plus-background": {
                r: 10,
                fill: "#fff",
                stroke: "#2d8cf0",
                strokeWidth: 1,
              },
            },
            markup: [
              {
                tagName: "circle",
                selector: ".plus-background",
              },
              {
                tagName: "path",
                selector: ".plus-icon",
              },
            ],
          },
          bottom: {
            position: "bottom",
            attrs: {
              circle: {
                r: 10,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "#fff",
                strokeWidth: 1,
              },
              path: {
                d: "M -4 0 L 4 0 M 0 -4 L 0 4",
                stroke: "#2d8cf0",
                strokeWidth: 2,
              },
            },
            markup: [
              {
                tagName: "circle",
                selector: "circle",
              },
              {
                tagName: "path",
                selector: "path",
              },
            ],
          },
          left: {
            position: "left",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "#fff",
                strokeWidth: 1,
              },
            },
            markup: [
              {
                tagName: "circle",
                selector: "circle",
              },
            ],
          },
          right: {
            position: "right",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "#fff",
                strokeWidth: 1,
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

    register({
      shape: "block-node",
      width: 400,
      height: 300,
      component: BlockNode,
      zIndex: 0,
      ports: {
        groups: {
          left: {
            position: "left",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "#fff",
                strokeWidth: 1,
              },
            },
            markup: [
              {
                tagName: "circle",
                selector: "circle",
              },
            ],
          },
          right: {
            position: "right",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "#fff",
                strokeWidth: 1,
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
        router: { name: "orth", args: { padding: 20 } },
        connector: { name: "rounded", args: { radius: 8 } },
        validateConnection: ({ sourcePort, targetPort }) =>
          sourcePort !== targetPort,
        snap: { radius: 20 },
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        allowEdge: false,
        allowMulti: true,
      },
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox();
          return this.getNodes().filter((node) => {
            // Only consider block-nodes as potential parents
            if (node.shape !== "block-node") return false;
            const targetBBox = node.getBBox();
            return targetBBox.containsRect(bbox);
          });
        },
      },
    });

    // const node = graph.addNode({
    //   shape: "multi-ai-node",
    //   x: 300,
    //   y: 200,
    //   ports: {
    //     items: [
    //       {
    //         id: "top",
    //         group: "top",
    //       },
    //       {
    //         id: "left",
    //         group: "left",
    //       },
    //       {
    //         id: "right",
    //         group: "right",
    //       },
    //     ],
    //   },
    // });

    // Enable node movement
    graph.on("node:change:position", ({ node, options }) => {
      if (options.skipParentHandler) return;

      const parent = node.getParent();
      if (parent && parent.shape === "block-node") {
        // Keep the child node within the parent's bounds
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

      // Define the base node configuration
      let nodeConfig: any = {
        shape: nodeType,
        x: offsetX - 100, // Center the node to cursor
        y: offsetY - 20,
        ports: { items: [] },
      };

      // Customize ports based on node type
      switch (nodeType) {
        case "multi-ai-node":
          nodeConfig.ports.items = [
            { id: "left", group: "left" },
            { id: "right", group: "right" },
          ];
          break;

        case "text-node":
          nodeConfig.ports.items = [
            { id: "left", group: "left" },
            { id: "right", group: "right" },
          ];
          break;
        case "block-node":
          nodeConfig.x = offsetX - 200; // Center based on block width
          nodeConfig.y = offsetY - 150; // Center based on block height
          nodeConfig.ports.items = [
            { id: "left", group: "left" },
            { id: "right", group: "right" },
          ];
          nodeConfig.zIndex = 0;
          break;
        default:
          console.warn(`Unknown node type: ${nodeType}`);
          break;
      }

      // Add node to the graph with the specified configuration
      graphRef.current.addNode(nodeConfig);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="p-4 bg-gray-100 border-r border-gray-200 h-full">
        <h2 className="text-lg font-bold mb-4">Nodes</h2>
        {/* Block Node */}
        <div
          className="p-2 mb-2 border border-gray-300 rounded bg-white cursor-pointer"
          draggable
          onDragStart={(event) => handleDragStart(event, "block-node")}
        >
          Block Container
        </div>
        {/* Multi-AI Node */}
        <div
          className=" mb-2 border border-gray-300 rounded bg-white cursor-pointer"
          draggable
          onDragStart={(event) => handleDragStart(event, "multi-ai-node")}
        >
          <MultiAINode />
        </div>
        {/* Text Node */}
        <div
          className="p-2 mb-2 border border-gray-300 rounded bg-white cursor-pointer"
          draggable
          onDragStart={(event) => handleDragStart(event, "text-node")}
        >
          Text Node
        </div>
      </div>

      {/* Right Canvas Area */}
      <div
        ref={containerRef}
        className="flex-1 h-screen relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="absolute inset-0 border border-gray-200 rounded-lg shadow-lg bg-white" />
      </div>
    </div>
  );
};

export default GraphComponent;
