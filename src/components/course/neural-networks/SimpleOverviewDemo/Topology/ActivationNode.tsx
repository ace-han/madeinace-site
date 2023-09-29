import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';

const noop = () => {};

function softplus(x: number) {
  return Math.log(1 + Math.exp(x));
}

function prepareSoftPlusDataPoints() {
  // Generate the points for the curve
  const points: [number, number][] = [];
  for (let x = -4; x <= 4; x += 0.1) {
    const y = softplus(x);
    // since javascript y-axis strenches max to bottom
    // we need y = -1 * y
    points.push([x, -y]);
  }

  // Normalize the points to fit within the SVG
  const minX = Math.min(...points.map((p) => p[0]));
  const maxX = Math.max(...points.map((p) => p[0]));
  const minY = Math.min(...points.map((p) => p[1]));
  const maxY = Math.max(...points.map((p) => p[1]));
  return points.map((p) => [((p[0] - minX) / (maxX - minX)) * 100, ((p[1] - minY) / (maxY - minY)) * 100]);
}

export type ActivationNodeProps = {
  data: {
    enabled?: boolean;
    onChange?: (enabled: boolean) => void;
  };
  isConnectable: boolean;
};

const ActivationNode = memo(({ data, isConnectable }: ActivationNodeProps) => {
  const { enabled = false, onChange = noop } = data;
  const [path] = useState(() => {
    const points = prepareSoftPlusDataPoints();
    // Create the SVG path
    const result = 'M' + points.map((p) => p.join(',')).join(' L');
    return result;
  });
  return (
    <>
      <Handle type="source" position={Position.Right} id="right" isConnectable={isConnectable} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} id="left" isConnectable={isConnectable} style={{ opacity: 0 }} />
      <div className="flex space-x-1">
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => onChange(event.target.checked)}
            className="nodrag"
          />
        </label>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="min-w-[1.6rem]">
          <path d={path} fill="none" stroke="black" strokeWidth="3" />
        </svg>
      </div>
      <Handle type="target" position={Position.Right} id="right" isConnectable={isConnectable} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="left" isConnectable={isConnectable} style={{ opacity: 0 }} />
    </>
  );
});

export default ActivationNode;
