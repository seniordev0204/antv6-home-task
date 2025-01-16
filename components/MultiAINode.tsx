import React, { Component } from "react";
import { Node } from "@antv/x6";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
//
import { EditSheet } from "./EditSheet";

export interface PortOption {
  id: string;
  label: string;
  enabled: boolean;
  icon?: React.ReactNode;
  suboptions?: SubOption[];
}

export interface MultiAINodeProps {
  node?: Node;
  isVertical?: boolean;
  updateOption?: any;
}

interface SubOption {
  id: string;
  label: string;
  enabled: boolean;
  icon?: string;
}

const DEFAULT_OPTIONS: PortOption[] = [
  {
    id: "embeddings",
    label: "Embeddings",
    enabled: false,
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

class MultiAINode extends Component<MultiAINodeProps, any> {
  constructor(props: MultiAINodeProps) {
    super(props);

    this.state = {
      options: DEFAULT_OPTIONS,
      nodeOptions: DEFAULT_NODE_OPTIONS,
      isMenuOpen: false,
      isNodeOptionsOpen: false,
      bgColor: "#1e3a5f",
      textColor: "#ffffff",
      isEditSheetOpen: false,
      heading: "Multi-AI Model",
    };
  }

  componentDidUpdate(prevProps: MultiAINodeProps, prevState: any) {
    if (this.props.node !== prevProps.node || this.state.options !== prevState.options) {
      this.props.updateOption(this.props.node, this.state.options);
    }
  }

  toggleOption = (id: string) => {
    this.setState((prevState: any) => {
      const updatedOptions = prevState.options.map((option: PortOption) => {
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
      });
      return { options: updatedOptions };
    });
  };

  toggleNodeOption = (id: string) => {
    if (id === "edit") {
      this.setState({ isEditSheetOpen: true });
    }
  };

  render() {
    const {
      options,
      nodeOptions,
      isMenuOpen,
      isNodeOptionsOpen,
      bgColor,
      textColor,
      isEditSheetOpen,
      heading,
    } = this.state;

    return (
      <div className="relative">
        <div
          className="rounded-md flex items-center justify-between min-w-[350px] h-[50px] px-2"
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-white" />
            <span className="font-medium text-sm" style={{ color: textColor }}>
              {heading}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={() => this.setState({ isMenuOpen: !isMenuOpen })}
                className="text-xl px-2 text-white"
              >
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {nodeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => this.toggleNodeOption(option.id)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <EditSheet
          isOpen={isEditSheetOpen}
          onOpenChange={(isOpen: boolean) => this.setState({ isEditSheetOpen: isOpen })}
          backgroundColor={bgColor}
          textColor={textColor}
          heading={heading}
          onBackgroundColorChange={(color: string) => this.setState({ bgColor: color })}
          onTextColorChange={(color: string) => this.setState({ textColor: color })}
          onHeadingChange={(newHeading: string) => this.setState({ heading: newHeading })}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={() => this.setState({ isNodeOptionsOpen: !isNodeOptionsOpen })}
              className="absolute bottom-[-10px] right-2 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
            >
              <PlusCircle size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {options.map((option) => (
              <React.Fragment key={option.id}>
                <label className="flex items-center gap-2 p-1.5 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={option.enabled}
                    onChange={() => this.toggleOption(option.id)}
                    className="w-4 h-4 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
}

export default MultiAINode;
