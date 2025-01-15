"use client";

import React, { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChromePicker } from "react-color";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPickerFieldProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerFieldProps> = ({
  label,
  color,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="flex gap-2">
            <Input
              value={color}
              readOnly
              className="cursor-pointer"
              onClick={() => setIsOpen(true)}
            />
            <div
              className="w-10 h-10 rounded border cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => setIsOpen(true)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-none shadow-none">
          <ChromePicker
            color={color}
            onChange={(color) => onChange(color.hex)}
            disableAlpha={true}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
