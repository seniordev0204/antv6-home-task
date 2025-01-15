import React from 'react';
import { Node } from '@antv/x6';

export interface PortConfig {
  position: 'top' | 'right' | 'bottom' | 'left';
  enabled: boolean;
}

export interface CustomNodeProps {
  node?: Node;
  title: string;
  ports: PortConfig[];
}

const CustomNode: React.FC<CustomNodeProps> = ({ title, ports }) => {
  return (
    <div className="relative w-full h-full bg-white border-2 border-blue-600 rounded-md p-4">
      <div className="text-center font-medium text-gray-800">{title}</div>
      
      {/* Port indicators */}
      {ports.map((port, index) => {
        if (!port.enabled) return null;
        
        const portStyle = {
          position: 'absolute',
          width: '12px',
          height: '12px',
          backgroundColor: '#4299e1',
          border: '2px solid #2b6cb0',
          borderRadius: '50%',
          cursor: 'pointer',
        } as const;

        const portPosition = {
          top: port.position === 'top' ? '-6px' : 'auto',
          right: port.position === 'right' ? '-6px' : 'auto',
          bottom: port.position === 'bottom' ? '-6px' : 'auto',
          left: port.position === 'left' ? '-6px' : 'auto',
          ...(port.position === 'top' || port.position === 'bottom' 
            ? { left: '50%', transform: 'translateX(-50%)' }
            : {}),
          ...(port.position === 'left' || port.position === 'right'
            ? { top: '50%', transform: 'translateY(-50%)' }
            : {}),
        } as const;

        return (
          <div
            key={`${port.position}-${index}`}
            style={{ ...portStyle, ...portPosition }}
            className="port-indicator"
          />
        );
      })}
    </div>
  );
};

export default CustomNode;