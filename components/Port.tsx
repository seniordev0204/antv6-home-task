import React, { Component } from "react";
import { cn } from "@/lib/utils";

interface PortProps {
  label: string;
  className?: string;
}

interface PortState {}

class Port extends Component<PortProps, PortState> {
  render() {
    const { label, className } = this.props;
    return (
      <div className={cn("flex flex-col items-center", className)}>
        <div className="w-[2px] h-4 bg-gray-300" />
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span className="text-xs text-gray-600 mt-1">{label}</span>
      </div>
    );
  }
}

export default Port;
