"use client"
import React, { Component, createRef } from "react";
import { Graph, Node } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import MultiAINode, { PortOption } from "./MultiAINode";
import TextNode from "./TextNode";
import Oracle from "./orancle";
import Chatbot from "./chatbot";

class GraphComponent extends Component {
  containerRef = createRef<HTMLDivElement>();
  graphRef: React.RefObject<Graph | null> = createRef();
  state = {
    isVertical: false,
  };

  updateOracleOption = (node: Node, options: PortOption[]) => {
    if (!node || options.length === 0) return;

    this.graphRef.current?.getNodes().forEach((_node) => {
      let data = _node.getData();
      if (data?.parentId === node.id) {
        this.graphRef.current?.removeNode(_node.id);
      }
    });

    let parentX = node.getBBox().x;
    let parentY = node.getBBox().y;
    const offset = 50;
    let parentWidth = node.getBBox().width;
    let totalChildrenWidth = options.filter(option => option.enabled).length * 100 + 50 * (options.filter(option => option.enabled).length - 1);

    let startX = parentX + (parentWidth - totalChildrenWidth) / 2;
    let baseY = parentY + 200;

    options.filter(option => option.enabled).map((option, index) => {
      let x = startX + index * (100 + offset);
      let y = baseY;

      let nodeConfig: any = {
        shape: 'text-3',
        x,
        y,
        ports: { items: [] },
      };

      nodeConfig.ports.items = [
        { id: "left", group: "left" },
        { id: "right", group: "right" },
        { id: "top", group: "top" },
        { id: "bottom", group: "bottom" }
      ];

      const newNode = this.graphRef.current?.addNode(nodeConfig);
      newNode?.setData({ parentId: node.id, heading: option.label });

      const bottomPortId = node.getPorts().find((port) => port.group === "bottom")?.id;
      const topPortId = newNode?.getPorts().find((port) => port.group === "top")?.id;

      if (bottomPortId && topPortId) {
        this.graphRef.current?.addEdge({
          source: { cell: node.id, port: bottomPortId },
          target: { cell: newNode.id, port: topPortId },
          connector: {
            name: 'smooth',
            args: {
              direction: 'V',
              radius: 120,
              smooth: true
            },
          },
          attrs: {
            line: {
              strokeWidth: 2,
            },
          },
        });
      }
    });
  }

  updateOption = (node: Node, options: PortOption[]) => {
    if (!node || options.length === 0) return;

    this.graphRef.current?.getNodes().forEach((_node) => {
      let data = _node.getData();
      if (data?.parentId === node.id) {
        this.graphRef.current?.removeNode(_node.id);
      }
    });

    let parentX = node.getBBox().x;
    let parentY = node.getBBox().y;
    const offset = 200;
    let parentWidth = node.getBBox().width;
    let totalChildrenWidth = options.filter(option => option.enabled).length * 200 + offset * (options.filter(option => option.enabled).length - 1);

    let startX = parentX + (parentWidth - totalChildrenWidth) / 2;
    let baseY = parentY + 200;

    options.filter(option => option.enabled).map((option, index) => {
      let x = startX + index * (200 + offset);
      let y = baseY;

      let nodeConfig: any = {
        shape: 'oracle',
        x: x,
        y: y,
        ports: { items: [] },
      };

      nodeConfig.ports.items = [
        { id: "left", group: "left" },
        { id: "right", group: "right" },
        { id: "top", group: "top" },
        { id: "bottom", group: "bottom" }
      ];

      const newNode = this.graphRef.current?.addNode(nodeConfig);
      newNode?.setData({ parentId: node.id, heading: option.label });

      const bottomPortId = node.getPorts().find((port) => port.group === "bottom")?.id;
      const topPortId = newNode?.getPorts().find((port) => port.group === "top")?.id;

      if (bottomPortId && topPortId) {
        this.graphRef.current?.addEdge({
          source: { cell: node.id, port: bottomPortId },
          target: { cell: newNode.id, port: topPortId },
          connector: {
            name: 'smooth',
            args: {
              direction: 'V',
              radius: 120,
              smooth: true
            },
          },
          attrs: {
            line: {
              strokeWidth: 2,
            },
          },
        });
      }
    });
  }

  componentDidMount() {
    if (!this.containerRef.current) return;

    register({
      shape: "multi-ai-node",
      width: 350,
      height: 50,
      component: ({ node }) => <MultiAINode node={node} updateOption={this.updateOption} />,
      ports: {
        groups: {
          left: {
            position: "left",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "white",
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
                fill: "white",
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
                fill: "white",
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
                fill: "white",
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
        return <Oracle node={node} heading={data?.heading} updateOracleOption={this.updateOracleOption} />
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
                fill: "white",
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
                fill: "white",
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
                fill: "white",
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
                fill: "white",
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
      component: ({ node }) => {
        return <TextNode node={node} heading="Text 1" />
      },
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
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "white",
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
          bottom: {
            position: "bottom",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "white",
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
          left: {
            position: "left",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "white",
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
                fill: "white",
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
      component: ({ node }) => {
        const data = node.getData();
        return <TextNode node={node} heading="Text 2" />
      },
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
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "white",
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
          bottom: {
            position: "bottom",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "white",
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
          left: {
            position: "left",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "white",
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
                fill: "white",
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
      component: ({ node }) => {
        const data = node.getData();
        return <TextNode node={node} heading={data?.heading} />
      },
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
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "white",
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
          bottom: {
            position: "bottom",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "white",
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
          left: {
            position: "left",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#2d8cf0",
                fill: "white",
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
                fill: "white",
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
      container: this.containerRef.current,
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
        connector: {
          name: 'smooth',
          args: {
            radius: -20,
            smooth: true
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
            if (node.shape !== "block-node") return false;
            const targetBBox = node.getBBox();
            return targetBBox.containsRect(bbox);
          });
        },
      },
    });

    graph.on('edge:connected', ({ edge, isNew }) => {
      if (isNew) {
        const sourceNode = edge.getSourceNode();
        const targetNode = edge.getTargetNode();

        if (sourceNode && targetNode) {
          const sourceShape = sourceNode.shape;
          const targetShape = targetNode.shape;

          if (sourceShape === 'text-1' || targetShape === 'text-1') {
            edge.setConnector({
              name: 'smooth',
              args: {
                direction: 'H',
                radius: 120,
                smooth: true
              }
            });
          } else if (sourceShape === 'text-2' || targetShape === 'text-2') {
            edge.setConnector({
              name: 'smooth',
              args: {
                direction: 'V',
                radius: 120,
                smooth: true
              }
            });
          }
        }
      }
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

    this.graphRef.current = graph;
  }

  handleDragStart = (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData("nodeType", type);
  };

  handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData("nodeType");

    if (nodeType && this.graphRef.current) {
      const { offsetX, offsetY } = event.nativeEvent;
      const point = this.graphRef.current.clientToLocal({ x: offsetX, y: offsetY });

      let nodeConfig: any = {
        shape: nodeType,
        x: offsetX - 100,
        y: offsetY - 20,
        ports: { items: [] },
      };

      switch (nodeType) {
        case "multi-ai-node":
          nodeConfig.ports.items = [
            { id: "left", group: "left" },
            { id: "right", group: "right" },
            { id: "top", group: "top" },
            { id: "bottom", group: "bottom" }
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
          ];
          break;
        default:
          console.warn(`Unknown node type: ${nodeType}`);
          break;
      }
      this.graphRef.current.addNode(nodeConfig);
    }
  };

  handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  render() {
    return (
      <div className="flex h-screen">
        <div className="p-4 bg-gray-100 border-r border-gray-200 h-full">
          <h2 className="text-lg font-bold mb-4">Nodes</h2>
          <div
            className="mb-2 border border-gray-300 rounded bg-white cursor-pointer"
            draggable
            onDragStart={(event) => this.handleDragStart(event, "multi-ai-node")}
          >
            <MultiAINode isVertical={this.state.isVertical} updateOption={this.updateOption} />
          </div>
          <div
            className="p-2 mb-2 border border-gray-300 rounded bg-white cursor-pointer"
            draggable
            onDragStart={(event) => this.handleDragStart(event, "text-1")}
          >
            Text - 1
          </div>

          <div
            className="p-2 mb-2 border border-gray-300 rounded bg-white cursor-pointer"
            draggable
            onDragStart={(event) => this.handleDragStart(event, "text-2")}
          >
            Text - 2
          </div>
        </div>

        <div className="flex-1 h-screen relative">
          <Chatbot />

          <div
            ref={this.containerRef}
            className="w-full h-full"
            onDrop={this.handleDrop}
            onDragOver={this.handleDragOver}
          />
        </div>
      </div>
    );
  }
}

export default GraphComponent;
