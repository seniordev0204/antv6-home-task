import React, { Component } from "react";

export interface TextNodeProps {
  node?: any;
  heading?: string;
}

export interface TextNodeState {
  size: { width: number; height: number };
}

class TextNode extends Component<TextNodeProps, TextNodeState> {
  constructor(props: TextNodeProps) {
    super(props);
    this.state = {
      size: { width: 100, height: 50 },
    };
  }

  componentDidUpdate(prevProps: TextNodeProps, prevState: TextNodeState) {
    const { node } = this.props;
    const { size } = this.state;

    if (node && size !== prevState.size) {
      node.resize(size.width, size.height);
    }
  }

  componentDidMount(): void {
    const { node } = this.props;
    const { size } = this.state;

    if (node) {
      node.resize(size.width, size.height);
    }
  }

  render() {
    const { heading } = this.props;

    return (
      <div
        className="relative bg-white border border-gray-300 rounded-md shadow-md overflow-visible bg-[#1e3a5f] text-white flex justify-center items-center"
        style={{
          backgroundColor: "#1e3a5f",
          minWidth: "100px",
          minHeight: "50px",
          color: "white",
        }}
      >
        {heading}
      </div>
    );
  }
}

export default TextNode;