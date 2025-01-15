"use client";
import React, { useEffect, useRef, useState } from "react";
import { Graph, Node } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import MultiAINode, { PortOption } from "./MultiAINode";
import { ArrowDown, ArrowRight } from "lucide-react";
import TextNode from "./TextNode";
import Oracle from "./orancle";

////
const GraphComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const [isVertical, setIsVertical] = useState(false);

  const updateOracleOption = (node: Node, options: PortOption[]) => {
    if (!node || options.length === 0) return;

    graphRef.current?.getNodes().forEach((_node) => {
      let data = _node.getData();
      if (data?.parentId === node.id) {
        graphRef.current?.removeNode(_node.id);
      }
    });

    let parentX = node.getBBox().x;
    let parentY = node.getBBox().y;

    const offset = 50;
    let parentWidth = node.getBBox().width; // Width of the parent node
    let totalChildrenWidth = options.filter(option => option.enabled).length * 100 + 50 * (options.filter(option => option.enabled).length - 1); // Each child is 200px wide
  
    // Calculate the starting X position for the child nodes to be centered
    let startX = parentX + (parentWidth - totalChildrenWidth) / 2;
  
    let baseY = parentY + 100; // Vertical offset for spacing child nodes

    options.filter(option => option.enabled).map((option, index) => {
      let x = startX + index * (100 + offset); // 200px width for each child node plus the offset
      let y = baseY;

      let nodeConfig: any = {
        shape: 'text-3',
        x,  // Adjusted X based on position in the array with offset
        y,
        ports: { items: [] },
      };

      nodeConfig.ports.items = [
        { id: "left", group: "left" },
        { id: "right", group: "right" },
        { id: "top", group: "top" },
        { id: "bottom", group: "bottom" }
      ];

      const newNode = graphRef.current?.addNode(nodeConfig);
      newNode?.setData({ parentId: node.id });

      const bottomPortId = node.getPorts().find((port) => port.group === "bottom")?.id;
      const topPortId = newNode?.getPorts().find((port) => port.group === "top")?.id;

      if (bottomPortId && topPortId) {
        graphRef.current?.addEdge({
          source: { cell: node.id, port: bottomPortId },
          target: { cell: newNode.id, port: topPortId },
          connector: {
            name: 'rounded',
            args: { radius: 40 },
          },
          attrs: {
            line: {
              stroke: "#5F95FF",
              strokeWidth: 2,
            },
          },
        });
      }
    });
  }

  const updateOption = (node: Node, options: PortOption[]) => {
    
    if (!node || options.length === 0) return;

    graphRef.current?.getNodes().forEach((_node) => {
      let data = _node.getData();
      if (data?.parentId === node.id) {
        graphRef.current?.removeNode(_node.id);
      }
    });
  
    // Set base X and Y positions based on the parent node's location
    let parentX = node.getBBox().x;
    let parentY = node.getBBox().y;

    const offset = 200;
    let parentWidth = node.getBBox().width; // Width of the parent node
    let totalChildrenWidth = options.filter(option => option.enabled).length * 200 + 50 * (options.filter(option => option.enabled).length - 1); // Each child is 200px wide
  
    // Calculate the starting X position for the child nodes to be centered
    let startX = parentX + (parentWidth - totalChildrenWidth) / 2;
  
    let baseY = parentY + 100; // Vertical offset for spacing child nodes
  
    // Define an offset value for horizontal spacing
     // Add an offset of 50px between child nodes
  
    options.filter(option => option.enabled).map((option, index) => {
      // Calculate the X position for each child node with the offset
      let x = startX + index * (200 + offset); // 200px width for each child node plus the offset
      let y = baseY;
  
      let nodeConfig: any = {
        shape: 'oracle',
        x: x,  // Adjusted X based on position in the array with offset
        y: y,
        ports: { items: [] },
      };
  
      // Define the ports for the new node
      nodeConfig.ports.items = [
        { id: "left", group: "left" },
        { id: "right", group: "right" },
        { id: "top", group: "top" },
        { id: "bottom", group: "bottom" }
      ];
  
      // Create the new node
      const newNode = graphRef.current?.addNode(nodeConfig);
      newNode?.setData({ parentId: node.id, heading: option.label });
  
      // Find the bottom port of the parent node and top port of the new node
      const bottomPortId = node.getPorts().find((port) => port.group === "bottom")?.id;
      const topPortId = newNode?.getPorts().find((port) => port.group === "top")?.id;
  
      // If both ports exist, create an edge between the nodes
      if (bottomPortId && topPortId) {
        graphRef.current?.addEdge({
          source: { cell: node.id, port: bottomPortId },
          target: { cell: newNode.id, port: topPortId },
          connector: {
            name: 'rounded',
            args: { radius: 40 },
          },
          attrs: {
            line: {
              stroke: "#5F95FF",
              strokeWidth: 2,
            },
          },
        });
      }
    });
  }

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
      component: ({ node }) => <MultiAINode node={node} updateOption={updateOption} />,
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
          top: {
            position: {
              name: "top",
              args: {
                x: "33%",
                y: 0,
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
            },
            markup: [
              {
                tagName: "circle",
                selector: "circle",
              },
            ],
          },
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

    register({
      shape: "oracle",
      width: 200,
      height: 50,
      component: ({ node }) => {
        const data = node.getData();
        return <Oracle node={node} heading={data?.heading} updateOracleOption={updateOracleOption} />
      },
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
          top: {
            position: {
              name: "top",
              args: {
                x: "33%",
                y: 0,
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
            },
            markup: [
              {
                tagName: "circle",
                selector: "circle",
              },
            ],
          },
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

    register({
      shape: "text-1",
      width: 200,
      height: 50,
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
      shape: "text-2",
      width: 200,
      height: 50,
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
      shape: "text-3",
      width: 200,
      height: 50,
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

    const graph = new Graph({
      container: containerRef.current,
      // grid: true,
      panning: {
        enabled: true,
        eventTypes: ["leftMouseDown", "mouseWheel"],
      },
      mousewheel: {
        enabled: true,
        modifiers: "ctrl",
        factor: 1.1,
        maxScale: 1.5,
        minScale: 0.5,
      },
      highlighting: {
        magnetAdsorbed: {
          name: "stroke",
          args: {
            attrs: {
              fill: "#fff",
              stroke: "#31d0c6",
              strokeWidth: 4,
            },
          },
        },
      },
      width: 1400,
      height: 900,
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
          name: "smooth",
          args: {
            // radius: 50,
          },
        },
        anchor: "center",
        connectionPoint: {
          name: "boundary",
          args: {
            sticky: true,
          },
        },

        validateConnection: ({ sourcePort, targetPort, targetMagnet }) => {
          return (
            !!targetMagnet &&
            sourcePort !== targetPort &&
            targetMagnet.getAttribute("magnet") === "true"
          );
        },

        snap: { radius: 20 },
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        allowEdge: false,
        allowMulti: true,
        highlight: true,
      },

      interacting: {
        magnetConnectable: true,
        nodeMovable: true,
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
            // { id: "left-2", group: "left-2" },
            { id: "right", group: "right" },
            { id: "top", group: "top" },
            { id: "bottom", group: "bottom" }
            // { id: "top-2", group: "top-2" },
          ];
          break;

        case "text-1":
          nodeConfig.ports.items = [
            { id: "left", group: "left" },
            { id: "right", group: "right" },
          ];
          break;
        case "text-2":
          nodeConfig.ports.items = [
            { id: 'top', group: 'top' },
            { id: 'bottom', group: 'bottom' }
          ]
          break;
        default:
          console.warn(`Unknown node type: ${nodeType}`);
          break;
      }
      graphRef.current.addNode(nodeConfig);
      console.log(graphRef.current.getNodes()[0].prop());
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
        <h2 className="text-lg font-bold mb-4">Nodes</h2>
        {/* Block Node */}
        <div
          className="mb-2 border border-gray-300 rounded bg-white cursor-pointer"
          draggable
          onDragStart={(event) => handleDragStart(event, "multi-ai-node")}
        >
          <MultiAINode isVertical={isVertical} updateOption={updateOption} />
        </div>
        <div
          className="p-2 mb-2 border border-gray-300 rounded bg-white cursor-pointer"
          draggable
          onDragStart={(event) => handleDragStart(event, "text-1")}
        >
          Text - 1
        </div>

        <div
          className="p-2 mb-2 border border-gray-300 rounded bg-white cursor-pointer"
          draggable
          onDragStart={(event) => handleDragStart(event, "text-2")}
        >
          Text - 2
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
