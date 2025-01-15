"use client";

import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChromePicker } from "react-color";
import { EditSheet } from "./EditSheet";

export interface BlockNodeProps {
  node?: any;
}
export interface PortOption {
  id: string;
  label: string;
  enabled: boolean;
}

const DEFAULT_NODE_OPTIONS: PortOption[] = [
  { id: "colors", label: "Colors", enabled: false },
  { id: "edit", label: "Edit", enabled: false },
  { id: "delete", label: "Delete", enabled: false },
];

const BlockNode: React.FC<BlockNodeProps> = ({ node }) => {
  const [size, setSize] = useState({ width: 400, height: 300 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [nodeOptions, setNodeOptions] =
    useState<PortOption[]>(DEFAULT_NODE_OPTIONS);
  const [isNodeOptionsOpen, setIsNodeOptionsOpen] = useState(false);
  const [bgColor, setBgColor] = useState("#c9ced6");
  const [textColor, setTextColor] = useState("#000000");
  const [heading, setHeading] = useState("Block Container");
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const colorPickerContainerRef = useRef<HTMLDivElement>(null);
  // Update node size when resizing
  useEffect(() => {
    if (node) {
      node.resize(size.width, size.height);
    }
  }, [size, node]);

  useEffect(() => {
    // Prevent node dragging when interacting with color picker
    if (showColorPicker && node) {
      const originalDraggable = node.draggable;
      node.draggable = false;
      return () => {
        node.draggable = originalDraggable;
      };
    }
  }, [showColorPicker, node]);

  // Handle resizing logic
  const handleResize = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    const startWidth = size.width;
    const startHeight = size.height;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      moveEvent.stopPropagation();

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newWidth = Math.max(200, startWidth + deltaX);
      const newHeight = Math.max(100, startHeight + deltaY);

      setSize({
        width: newWidth,
        height: newHeight,
      });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const toggleNodeOption = (id: string) => {
    if (id === "edit") {
      setIsEditSheetOpen(true);
    } else {
      console.log(`Node option ${id} toggled`);
    }
  };

  const handleColorChange = (color: any) => {
    setBgColor(color.hex);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      showColorPicker &&
      colorPickerContainerRef.current &&
      !colorPickerContainerRef.current.contains(event.target as Node)
    ) {
      setShowColorPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showColorPicker]);

  const handleColorPickerMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className="relative bg-gray-50/50 border-2 border-dashed border-gray-300 rounded-lg shadow-sm overflow-visible"
        style={{
          width: size.width,
          height: size.height,
          minWidth: "400px",
          minHeight: "300px",
          zIndex: 0,
          backgroundColor: bgColor,
        }}
      >
        {/* Header with Dropdown */}
        <div className="flex justify-between items-center bg-gray-100/80 px-3 py-2 rounded-t-lg border-b border-gray-200">
          <span
            className="font-medium text-sm text-gray-700"
            style={{ color: textColor }}
          >
            {heading}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-black text-xl px-2"
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

        {/* Content Area */}
        <div className="w-full h-[calc(100%-40px)] p-4">
          {/* This area will contain other nodes */}
        </div>

        {/* Resize Handle */}
        <div
          className="absolute bottom-1 right-1 w-3 h-3 bg-gray-400 cursor-se-resize rounded-sm hover:bg-gray-600"
          onMouseDown={handleResize}
        />

        {/* Port Containers */}
        <div className="absolute left-0 top-0 bottom-0 flex items-center -translate-x-[6px]">
          <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 flex items-center translate-x-[6px]">
          <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full" />
        </div>
      </div>
      <EditSheet
        isOpen={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        backgroundColor={bgColor}
        textColor={textColor}
        heading={heading}
        onBackgroundColorChange={setBgColor}
        onTextColorChange={setTextColor}
        onHeadingChange={setHeading}
      />
    </>
  );
};

export default BlockNode;
