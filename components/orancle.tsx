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
  node?: any;
  isVertical?: boolean;
  heading?: string;
  updateOracleOption?: any;
}

interface SubOption {
  id: string;
  label: string;
  enabled: boolean;
  icon?: string;
}

const DEFAULT_OPTIONS: PortOption[] = [
  { id: "memory", label: "Memory", enabled: false },
  { id: "tool", label: "Tool", enabled: false },
  { id: "apps", label: "Apps", enabled: false }
];

const DEFAULT_NODE_OPTIONS: PortOption[] = [
  { id: "edit", label: "Edit", enabled: false },
];

const Oracle: React.FC<MultiAINodeProps> = ({ node, isVertical = true, heading = "Oracle", updateOracleOption }) => {
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
    updateOracleOption(node, options);
  }, [options, node]);

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
        className="rounded-md flex items-center justify-between min-w-[200px] h-[50px] px-2"
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
        heading={heading}
        onBackgroundColorChange={setBgColor}
        onTextColorChange={setTextColor}
        onHeadingChange={() => {}}
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

export default Oracle;
//
