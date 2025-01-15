import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface EditSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  backgroundColor: string;
  textColor: string;
  heading: string;
  onBackgroundColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  onHeadingChange: (newHeading: string) => void;
}

export const EditSheet: React.FC<EditSheetProps> = ({
  isOpen,
  onOpenChange,
  backgroundColor,
  textColor,
  heading,
  onBackgroundColorChange,
  onTextColorChange,
  onHeadingChange,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit Node Appearance</SheetTitle>
          <SheetDescription>
            Customize the colors and heading of your Multi-AI node.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="heading">Heading</Label>
            <Input
              id="heading"
              value={heading}
              onChange={(e) => onHeadingChange(e.target.value)}
            />
          </div>

          <ColorPicker
            label="Background Color"
            color={backgroundColor}
            onChange={onBackgroundColorChange}
          />

          <ColorPicker
            label="Text Color"
            color={textColor}
            onChange={onTextColorChange}
          />
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
