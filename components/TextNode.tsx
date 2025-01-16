import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  MoreHorizontal,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChromePicker } from "react-color";
import { EditSheet } from "./EditSheet";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export interface TextNodeProps {
  node?: any;
  heading?: string;
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

const TextNode: React.FC<TextNodeProps> = ({ node, heading }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [size, setSize] = useState({ width: 100, height: 50 });
  const [nodeOptions, setNodeOptions] =
    useState<PortOption[]>(DEFAULT_NODE_OPTIONS);
  const [isNodeOptionsOpen, setIsNodeOptionsOpen] = useState(false);
  const [bgColor, setBgColor] = useState("#c9ced6");
  const [textColor, setTextColor] = useState("#000000");
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update node size when resizing
  useEffect(() => {
    if (node) {
      node.resize(size.width, size.height);      
    }
  }, [size, node]);
  
  return (
    <>
      <div
        className="relative bg-white border border-gray-300 rounded-md shadow-md overflow-visible bg-[#1e3a5f] text-white flex justify-center items-center"
        style={{
          backgroundColor: '#1e3a5f',
          minWidth: "100px",
          minHeight: "50px",
          color: 'white'
        }}
      >
        {heading}
      </div>
      
    </>
  );
};

export default TextNode;
