import { memo } from 'react';
import { Handle, Position } from 'reactflow';

export type EdgeNodeProps = {
  data: {
    enabled?: boolean;
    label: string;
    value?: number | null;
    onEnabledChange?: (enabled: boolean) => void;
    onValueChange?: (value: number) => void;
  };
  isConnectable: boolean;
};

const noop = () => {};

const EdgeNode = memo(({ data, isConnectable }: EdgeNodeProps) => {
  const { enabled = false, label, value = null, onEnabledChange = noop, onValueChange = noop } = data;
  return (
    <div className="p-1 border border-blue-200 border-dashed">
      <Handle type="source" position={Position.Top} id="top" isConnectable={isConnectable} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="right" isConnectable={isConnectable} style={{ opacity: 0 }} />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
        style={{ opacity: 0 }}
      />
      <Handle type="source" position={Position.Left} id="left" isConnectable={isConnectable} style={{ opacity: 0 }} />
      <label className="flex space-x-1">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => onEnabledChange(event.target.checked)}
          className="nodrag"
        />
        <div>
          {label}
          {value === null ? '' : `=${value}`}
        </div>
      </label>
      <Handle type="target" position={Position.Top} id="top" isConnectable={isConnectable} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} id="right" isConnectable={isConnectable} style={{ opacity: 0 }} />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
        style={{ opacity: 0 }}
      />
      <Handle type="target" position={Position.Left} id="left" isConnectable={isConnectable} style={{ opacity: 0 }} />
    </div>
  );
});

export default EdgeNode;
