import React, { useEffect, useState } from "react";
import {
  Bot,
  Check,
  CirclePlus,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { EditSheet } from "./EditSheet";

export interface PortOption {
  id: string;
  label: string;
  enabled: boolean;
  icon?: React.ReactNode;
  suboptions?: SubOption[];
}

export interface MultiAINodeProps {
  node?: any;
  isVertical?: boolean;
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
  { id: "edit", label: "Edit", enabled: false },
];

const INITIAL_NODE_HEIGHT = 50;
const DEFAULT_PORT_OFFSET = 0;
const ADJUSTED_PORT_OFFSET = -15;
const VERTICAL_PORT_SPACING = 30;
const HORIZONTAL_LINE_LENGTH = 80;
const VERTICAL_INITIAL_NODE_HEIGHT = -10;
const VERTICAL_LINE_LENGTH = 30;
const ANGLE_INCREMENT = 20;
const PORT_SIZE = 16;
const VERTICAL_PORT_MARGIN = 20;
const NODE_WIDTH = 350;
const V_NODE_WIDTH = 150;

const MultiAINode: React.FC<MultiAINodeProps> = ({
  node,
  isVertical = true,
}) => {
  const [options, setOptions] = useState<PortOption[]>(DEFAULT_OPTIONS);
  const [nodeOptions, setNodeOptions] =
    useState<PortOption[]>(DEFAULT_NODE_OPTIONS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNodeOptionsOpen, setIsNodeOptionsOpen] = useState(false);
  const [bgColor, setBgColor] = useState("#1e3a5f");
  const [textColor, setTextColor] = useState("#ffffff");
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [orientation, setOrientation] = useState(isVertical);

  useEffect(() => {
    // setOrientation(isVertical);
  }, [isVertical]);

  const updateNodePorts = (updatedOptions: PortOption[]) => {
    if (!node) return;

    // Remove existing ports
    const existingPorts = node.getPorts();
    existingPorts.forEach((port: any) => {
      node.removePort(port);
    });

    // Get enabled ports
    const enabledPorts = getEnabledPorts();
    const totalPorts = enabledPorts.length;
    // if (totalPorts === 0) return;
    // Calculate the vertical center point
    const usableWidth = V_NODE_WIDTH - 2 * VERTICAL_PORT_MARGIN;
    const portSpacing = totalPorts > 1 ? usableWidth / (totalPorts - 1) : 0;

    // Add ports with lines originating from center
    enabledPorts.forEach((port, index) => {
      // const totalPorts = enabledPorts.length;
      // const startAngle = -((totalPorts - 1) * ANGLE_INCREMENT) / 2;
      // const angle = startAngle + index * ANGLE_INCREMENT;
      // const radians = (angle * Math.PI) / 180;

      let portMarkup;
      let position;

      // // Calculate end point of the line
      // const endX = LINE_LENGTH * Math.cos(radians);
      // const endY = LINE_LENGTH * Math.sin(radians);

      if (orientation) {
        // Vertical layout - ports at bottom
        const startY = VERTICAL_INITIAL_NODE_HEIGHT;
        // const spacing = vertical_nodeWidth;
        const portX =
          totalPorts === 1
            ? V_NODE_WIDTH / 2 // Center single port
            : VERTICAL_PORT_MARGIN + index * portSpacing; // Distribute multiple ports

        portMarkup = [
          {
            tagName: "path",
            selector: "line",
            attrs: {
              d: `M ${portX} ${startY} L ${portX} ${
                startY + VERTICAL_LINE_LENGTH
              }`,
              stroke: "#000000",
              strokeWidth: 2,
            },
          },
          {
            tagName: "circle",
            selector: "circle",
            attrs: {
              cx: portX,
              cy: startY + VERTICAL_LINE_LENGTH,
              r: PORT_SIZE / 2,
              fill: "#fff",
              stroke: "#2d8cf0",
              strokeWidth: 2,
              cursor: "pointer",
            },
          },
          {
            tagName: "path",
            selector: "plus",
            attrs: {
              d: "M -4 0 L 4 0 M 0 -4 L 0 4",
              stroke: "#2d8cf0",
              strokeWidth: 2,
              transform: `translate(${portX}, ${
                startY + VERTICAL_LINE_LENGTH
              })`,
              pointerEvents: "none",
            },
          },
          {
            tagName: "text",
            selector: "label",
            attrs: {
              x: portX,
              y: startY + VERTICAL_LINE_LENGTH + PORT_SIZE,
              text: port.label,
              fill: "#666",
              fontSize: 12,
              textAnchor: "middle",
              textVerticalAnchor: "top",
            },
          },
        ];

        position = {
          name: "absolute",
          args: { x: portX, y: startY },
        };
      } else {
        // Horizontal layout - ports on right
        const centerY = INITIAL_NODE_HEIGHT / 2;
        const startAngle = -((totalPorts - 1) * ANGLE_INCREMENT) / 2;
        const angle = startAngle + index * ANGLE_INCREMENT;
        const radians = (angle * Math.PI) / 180;
        const endX = HORIZONTAL_LINE_LENGTH * Math.cos(radians);
        const endY = HORIZONTAL_LINE_LENGTH * Math.sin(radians);

        portMarkup = [
          {
            tagName: "path",
            selector: "line",
            attrs: {
              d: `M 0 0 L ${endX} ${endY}`,
              stroke: "#000000",
              strokeWidth: 2,
            },
          },
          {
            tagName: "circle",
            selector: "circle",
            attrs: {
              cx: endX,
              cy: endY,
              r: PORT_SIZE / 2,
              fill: "#fff",
              stroke: "#2d8cf0",
              strokeWidth: 2,
              cursor: "pointer",
            },
          },
          {
            tagName: "path",
            selector: "plus",
            attrs: {
              d: "M -4 0 L 4 0 M 0 -4 L 0 4",
              stroke: "#000000",
              strokeWidth: 2,
              transform: `translate(${endX}, ${endY})`,
              pointerEvents: "none",
            },
          },
          {
            tagName: "text",
            selector: "label",
            attrs: {
              x: endX + PORT_SIZE,
              y: endY,
              text: port.label,
              fill: "#666",
              fontSize: 12,
              textAnchor: "start",
              textVerticalAnchor: "middle",
            },
          },
        ];

        position = {
          name: "absolute",
          args: { x: "100%", y: centerY },
        };
      }

      node.addPort({
        id: `port-${port.id}`,
        group: isVertical ? "bottom" : "right",
        attrs: {
          root: {
            magnet: true,
          },
        },
        position,
        markup: portMarkup,
      });
    });

    // Update node size
    const nodeHeight = isVertical
      ? VERTICAL_INITIAL_NODE_HEIGHT + VERTICAL_LINE_LENGTH + PORT_SIZE + 20 // Add some padding for labels
      : INITIAL_NODE_HEIGHT;

    node.resize(NODE_WIDTH, nodeHeight);
  };

  useEffect(() => {
    updateNodePorts(options);
  }, [options, node, orientation]);

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

  return (
    <div className="relative">
      <div
        className="rounded-md flex items-center justify-between min-w-[350px] h-[50px] px-2"
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
              className="text-xl px-2 text-white"
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={() => setIsNodeOptionsOpen(!isNodeOptionsOpen)}
            className="absolute bottom-[-10px] right-2 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
          >
            <PlusCircle size={16} />
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
