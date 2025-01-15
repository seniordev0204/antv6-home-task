import React, { useEffect, useRef, useState } from "react";
import { Bot, Check, CirclePlus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EditSheet } from "./EditSheet";
export interface PortOption {
  id: string;
  label: string;
  enabled: boolean;
  icon?: React.ReactNode;
  suboptions?: SubOption[];
}

export interface MultiAINodeProps {
  node?: any;
  layoutDirection?: "vertical" | "horizontal";
}
interface SubOption {
  id: string;
  label: string;
  enabled: boolean;
  icon?: string;
}

const DEFAULT_OPTIONS: PortOption[] = [
  // { id: "embeddings", label: "Embeddings", enabled: false },
  {
    id: "embeddings",
    label: "Embeddings",
    enabled: false,
    suboptions: [
      {
        id: "google-embeddings",
        label: "Google Embeddings",
        enabled: false,
        icon: "https://www.gstatic.com/lamda/images/favicon_v1_150160cddff7f294ce30.svg",
      },
      {
        id: "facebook-embeddings",
        label: "Facebook Embeddings",
        enabled: false,
        icon: "https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico",
      },
      {
        id: "openai-embeddings",
        label: "OpenAI Embeddings",
        enabled: false,
        icon: "https://openai.com/favicon.ico",
      },
      {
        id: "cohere-embeddings",
        label: "Cohere Embeddings",
        enabled: false,
        icon: "https://cohere.com/favicon.ico",
      },
    ],
  },
  { id: "memory", label: "Memory", enabled: false },
  { id: "tool", label: "Tool", enabled: false },
  { id: "apps", label: "Apps", enabled: false },
  { id: "text", label: "Text", enabled: false },
  { id: "image", label: "Image", enabled: false },
  { id: "chat", label: "Chat", enabled: false },
];

const DEFAULT_NODE_OPTIONS: PortOption[] = [
  { id: "colors", label: "Colors", enabled: false },
  { id: "edit", label: "Edit", enabled: false },
  { id: "delete", label: "Delete", enabled: false },
];

const INITIAL_NODE_HEIGHT = 50;
const DEFAULT_PORT_OFFSET = 0;
const ADJUSTED_PORT_OFFSET = -15;
const VERTICAL_PORT_SPACING = 30;

const MultiAINode: React.FC<MultiAINodeProps> = ({
  node,
  layoutDirection = "horizontal",
}) => {
  const [options, setOptions] = useState<PortOption[]>(DEFAULT_OPTIONS);
  const [nodeOptions, setNodeOptions] =
    useState<PortOption[]>(DEFAULT_NODE_OPTIONS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNodeOptionsOpen, setIsNodeOptionsOpen] = useState(false);
  const [bgColor, setBgColor] = useState("#1e3a5f");
  const [textColor, setTextColor] = useState("#ffffff");
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const updateNodePorts = (updatedOptions: PortOption[]) => {
    if (!node) return;

    // Remove all existing ports
    const existingPorts = node.getPorts();
    existingPorts.forEach((port: any) => {
      node.removePort(port);
    });

    // Calculate enabled ports
    const enabledPorts: { id: string; label: string }[] = [];
    updatedOptions.forEach((option) => {
      if (option.suboptions) {
        option.suboptions.forEach((sub) => {
          if (sub.enabled) {
            enabledPorts.push({ id: sub.id, label: sub.label });
          }
        });
      } else if (option.enabled) {
        enabledPorts.push({ id: option.id, label: option.label });
      }
    });

    // // Determine vertical offset for side ports based on whether bottom ports exist
    // const verticalOffset =
    //   enabledPorts.length > 0 ? ADJUSTED_PORT_OFFSET : DEFAULT_PORT_OFFSET;

    // // Add left and right ports with dynamic positioning
    // node.addPort({
    //   id: "left-port",
    //   group: "left",
    //   position: {
    //     name: "left",
    //   },
    //   attrs: {
    //     circle: {
    //       magnet: true,
    //       cy: verticalOffset,
    //     },
    //   },
    // });

    // node.addPort({
    //   id: "right-port",
    //   group: "right",
    //   position: {
    //     name: "right",
    //   },
    //   attrs: {
    //     circle: {
    //       magnet: true,
    //       cy: verticalOffset,
    //     },
    //   },
    // });

    // Determine port layout based on direction
    if (layoutDirection === "vertical") {
      // Add single right port for connection point
      node.addPort({
        id: "right-main",
        group: "right",
        attrs: {
          circle: {
            magnet: true,
            r: 6,
            stroke: "#2d8cf0",
            fill: "#fff",
            strokeWidth: 1,
          },
        },
      });

      // Add vertical ports on the right
      enabledPorts.forEach((port, index) => {
        const yOffset = (index + 1) * VERTICAL_PORT_SPACING;
        node.addPort({
          id: `port-${port.id}`,
          group: "custom-right",
          position: {
            name: "absolute",
            args: { x: "100%", y: yOffset },
          },
          attrs: {
            circle: {
              magnet: true,
              r: 6,
              stroke: "#2d8cf0",
              fill: "#fff",
              strokeWidth: 1,
            },
            label: {
              text: port.label,
              fill: "#666",
              fontSize: 12,
              refX: 15,
              refY: 0,
              textAnchor: "start",
              textVerticalAnchor: "middle",
            },
          },
          markup: [
            {
              tagName: "circle",
              selector: "circle",
            },
            {
              tagName: "text",
              selector: "label",
            },
          ],
        });
      });

      // Update node height for vertical layout
      const nodeHeight = Math.max(
        INITIAL_NODE_HEIGHT,
        (enabledPorts.length + 1) * VERTICAL_PORT_SPACING
      );
      node.resize(350, nodeHeight);
    } else {
      // Horizontal layout (original behavior)
      const verticalOffset =
        enabledPorts.length > 0 ? ADJUSTED_PORT_OFFSET : DEFAULT_PORT_OFFSET;

      // Add left and right ports
      node.addPort({
        id: "left-port",
        group: "left",
        attrs: {
          circle: {
            magnet: true,
            cy: verticalOffset,
            r: 6,
            stroke: "#2d8cf0",
            fill: "#fff",
            strokeWidth: 1,
          },
        },
      });

      node.addPort({
        id: "right-port",
        group: "right",
        attrs: {
          circle: {
            magnet: true,
            cy: verticalOffset,
            r: 6,
            stroke: "#2d8cf0",
            fill: "#fff",
            strokeWidth: 1,
          },
        },
      });

      // Add bottom ports
      enabledPorts.forEach((port) => {
        node.addPort({
          id: `port-${port.id}`,
          group: "bottom",
        });
      });
      // Update node height for horizontal layout
      const nodeHeight =
        INITIAL_NODE_HEIGHT + (enabledPorts.length > 0 ? 30 : 0);
      node.resize(350, nodeHeight);
    }
  };

  useEffect(() => {
    updateNodePorts(options);
  }, [options, node, layoutDirection]);

  const toggleSubOption = (optionId: string, subOptionId: string) => {
    setOptions((currentOptions) =>
      currentOptions.map((option) => {
        if (option.id === optionId && option.suboptions) {
          const updatedSuboptions = option.suboptions.map((subOption) =>
            subOption.id === subOptionId
              ? { ...subOption, enabled: !subOption.enabled }
              : subOption
          );
          const hasEnabledSuboption = updatedSuboptions.some(
            (sub) => sub.enabled
          );
          return {
            ...option,
            enabled: hasEnabledSuboption,
            suboptions: updatedSuboptions,
          };
        }
        return option;
      })
    );
  };

  const toggleOption = (id: string) => {
    setOptions((currentOptions) =>
      currentOptions.map((option) => {
        if (option.id === id) {
          if (option.suboptions) {
            const newEnabled = !option.enabled;
            return {
              ...option,
              enabled: newEnabled,
              suboptions: option.suboptions.map((sub) => ({
                ...sub,
                enabled: newEnabled,
              })),
            };
          }
          return { ...option, enabled: !option.enabled };
        }
        return option;
      })
    );
  };

  const toggleNodeOption = (id: string) => {
    if (id === "edit") {
      setIsEditSheetOpen(true);
    } else {
      console.log(`Node option ${id} toggled`);
    }
  };

  const getEnabledPorts = () => {
    const ports: { id: string; label: string }[] = [];
    options.forEach((option) => {
      if (option.suboptions) {
        option.suboptions.forEach((sub) => {
          if (sub.enabled) {
            ports.push({ id: sub.id, label: sub.label });
          }
        });
      } else if (option.enabled) {
        ports.push({ id: option.id, label: option.label });
      }
    });
    return ports;
  };

  const enabledPorts = getEnabledPorts();

  return (
    <div className="relative">
      <div
        className="bg-[#1e3a5f] text-white rounded-md flex items-center justify-between min-w-[350px] h-[50px] px-2"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-white" />
          <span className="font-medium text-sm" style={{ color: textColor }}>
            Multi-AI Model
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-xl px-2"
            >
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {nodeOptions.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onClick={() => toggleNodeOption(option.id)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <EditSheet
        isOpen={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        backgroundColor={bgColor}
        textColor={textColor}
        onBackgroundColorChange={setBgColor}
        onTextColorChange={setTextColor}
      />
      {layoutDirection === "horizontal" && (
        <div
          className="absolute left-0 right-0 bottom-0 flex justify-around"
          style={{ marginBottom: "-20px" }}
        >
          {enabledPorts.map((port) => (
            <div key={port.id} className="flex flex-col items-center">
              <div className="w-[2px] h-[20px] bg-black"></div>
              <div className="border-1 bg-white"></div>
            </div>
          ))}
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={() => setIsNodeOptionsOpen(!isNodeOptionsOpen)}
            className="absolute bottom-[-10px] right-2 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
          >
            <CirclePlus />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {options.map((option) => (
            <React.Fragment key={option.id}>
              {option.suboptions ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex items-center gap-2 p-1.5">
                    <input
                      type="checkbox"
                      checked={option.enabled}
                      onChange={() => toggleOption(option.id)}
                      className="w-4 h-4 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-56">
                    {option.suboptions.map((subOption) => (
                      <DropdownMenuItem
                        key={subOption.id}
                        className="flex items-center gap-2 p-1.5"
                        onClick={() => toggleSubOption(option.id, subOption.id)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {subOption.icon && (
                            <img
                              src={subOption.icon}
                              alt={`${subOption.label} icon`}
                              className="w-4 h-4"
                            />
                          )}
                          <span className="text-sm text-gray-700">
                            {subOption.label}
                          </span>
                        </div>
                        {subOption.enabled && (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <label className="flex items-center gap-2 p-1.5 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={option.enabled}
                    onChange={() => toggleOption(option.id)}
                    className="w-4 h-4 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              )}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MultiAINode;
