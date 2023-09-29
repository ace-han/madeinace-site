import { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  type Node,
  type Edge,
  Position,
  Panel,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import EdgeNode, { type EdgeNodeProps } from './EdgeNode';
import ActivationNode, { type ActivationNodeProps } from './ActivationNode';
import { useNeuralNetwork } from '../NeuralNetworkContext';

const nodeTypes = {
  edge: EdgeNode,
  activation: ActivationNode,
};

const neuronNodeTemplate: Partial<Node> = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  style: {
    borderRadius: '100%',
    backgroundColor: '#EEEEEE7A',
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const annotationNodeTemplate: Partial<Node> = {
  style: {
    borderWidth: '1px',
    borderStyle: 'dashed',
    padding: '0.25em',
    width: '3em',
  },
};

const initialEdges: Edge[] = [
  {
    id: 'input-w1',
    source: 'input',
    target: 'w1',
    sourceHandle: 'right',
    targetHandle: 'bottom',
    animated: true,
    style: { stroke: 'blue' },
  },
  { id: 'w1-b1', source: 'w1', target: 'b1', sourceHandle: 'top', targetHandle: 'bottom' },
  { id: 'b1-af1', source: 'b1', target: 'af1', sourceHandle: 'top', targetHandle: 'left' },
  { id: 'input-w2', source: 'input', target: 'w2', sourceHandle: 'right', targetHandle: 'top' },
  { id: 'w2-b2', source: 'w2', target: 'b2', sourceHandle: 'bottom', targetHandle: 'top' },
  // { id: 'sum2-b2', source: 'sum2', target: 'b2', sourceHandle: 'bottom', targetHandle: 'top' },
  { id: 'b2-af2', source: 'b2', target: 'af2', sourceHandle: 'bottom', targetHandle: 'left' },
  { id: 'af1-w3', source: 'af1', target: 'w3', sourceHandle: 'right', targetHandle: 'top' },
  { id: 'w3-sum3', source: 'w3', target: 'sum3', sourceHandle: 'bottom', targetHandle: 'top' },
  { id: 'af2-w4', source: 'af2', target: 'w4', sourceHandle: 'right', targetHandle: 'bottom' },
  { id: 'w4-sum3', source: 'w4', target: 'sum3', sourceHandle: 'top', targetHandle: 'bottom' },
  { id: 'sum3-b3', source: 'sum3', target: 'b3', sourceHandle: 'right', targetHandle: 'left' },
  { id: 'b3-af3', source: 'b3', target: 'af3', sourceHandle: 'right', targetHandle: 'left' },
];

type NodeDataType = EdgeNodeProps['data'] | ActivationNodeProps['data'];

// const Flow = memo(function Flow() {
const Flow = () => {
  const [showAnnotation, setShowAnnotation] = useState(false);
  const { chains, dispatch } = useNeuralNetwork();
  const onNodeEnabledChange = useCallback((nodeId: string, enabled: boolean) => {
    dispatch({
      type: 'enable',
      id: nodeId,
      enabled,
    });
  }, []);
  const initialNodes: Node[] = [
    {
      id: 'input',
      data: { label: 'Input' },
      position: { x: 0, y: 200 },
      ...neuronNodeTemplate,
    },
    {
      id: 'w1',
      data: {
        label: '* w1',
        enabled: false,
        value: 0,
        onEnabledChange(enabled: boolean) {
          onNodeEnabledChange('w1', enabled);
        },
        // onValueChange(value) {onValueChange('w1', value)},
      },
      position: { x: 100, y: 150 },
      type: 'edge',
    },
    {
      id: 'sum1',
      data: {
        label: '∑',
      },
      hidden: true,
      position: { x: 200, y: 110 },
      ...annotationNodeTemplate,
    },
    {
      id: 'b1',
      data: {
        enabled: false,
        label: '+ b1',
        value: 0,
        onEnabledChange(enabled: boolean) {
          onNodeEnabledChange('b1', enabled);
        },
      },
      position: { x: 250, y: 50 },
      type: 'edge',
    },
    {
      id: 'af1',
      data: {
        enabled: false,
        onChange(enabled: boolean) {
          onNodeEnabledChange('af1', enabled);
        },
      },
      position: { x: 400, y: 0 },
      type: 'activation',
      ...neuronNodeTemplate,
    },
    {
      id: 'w2',
      data: {
        enabled: false,
        label: '* w2',
        value: 0,
        onEnabledChange(enabled: boolean) {
          onNodeEnabledChange('w2', enabled);
        },
      },
      position: { x: 100, y: 250 },
      type: 'edge',
    },
    {
      id: 'sum2',
      data: {
        label: '∑',
      },
      hidden: true,
      position: { x: 200, y: 320 },
      ...annotationNodeTemplate,
    },
    {
      id: 'b2',
      data: {
        enabled: false,
        label: '+ b2',
        value: 0,
        onEnabledChange(enabled: boolean) {
          onNodeEnabledChange('b2', enabled);
        },
      },
      position: { x: 250, y: 350 },
      type: 'edge',
    },
    {
      id: 'af2',
      data: {
        enabled: false,
        onChange(enabled: boolean) {
          onNodeEnabledChange('af2', enabled);
        },
      },
      position: { x: 400, y: 400 },
      type: 'activation',
      ...neuronNodeTemplate,
    },
    {
      id: 'w3',
      data: {
        enabled: false,
        label: '* w3',
        value: 0,
        onEnabledChange(enabled: boolean) {
          onNodeEnabledChange('w3', enabled);
        },
      },
      position: { x: 450, y: 100 },
      type: 'edge',
    },
    {
      id: 'w4',
      data: {
        enabled: false,
        label: '* w4',
        value: 0,
        onEnabledChange(enabled: boolean) {
          onNodeEnabledChange('w4', enabled);
        },
      },
      position: { x: 450, y: 300 },
      type: 'edge',
    },
    {
      id: 'sum3',
      data: {
        enabled: false,
        label: '∑',
        value: null,
        onEnabledChange(enabled: boolean) {
          onNodeEnabledChange('sum3', enabled);
        },
      },
      position: { x: 600, y: 200 },
      type: 'edge',
    },
    {
      id: 'b3',
      data: {
        enabled: false,
        label: '+ b3',
        value: 0,
        onEnabledChange(enabled: boolean) {
          onNodeEnabledChange('b3', enabled);
        },
      },
      position: { x: 680, y: 200 },
      type: 'edge',
    },
    {
      id: 'af3',
      data: {
        enabled: false,
        onChange(enabled: boolean) {
          onNodeEnabledChange('af3', enabled);
        },
      },
      position: { x: 850, y: 204 },
      type: 'activation',
      ...neuronNodeTemplate,
    },
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const chainNodes = chains.flat();
    const newNodes = nodes.map((node) => {
      const chainNode = chainNodes.find((cn) => cn.id === node.id);
      if (!chainNode) {
        return node;
      }
      // https://reactflow.dev/docs/examples/nodes/update-node/
      // it's important that you create a new object here
      // in order to notify react flow about the change
      const data = {
        ...node.data,
        enabled: chainNode.enabled,
        value: chainNode.value,
      };
      return {
        ...node,
        data,
      };
    });
    const newEdges = edges.map((edge) => {
      const chainNode = chainNodes.find((cn) => cn.id === edge.target);
      let animated = false;
      let style = {};
      if (chainNode) {
        animated = chainNode.enabled;
        style = chainNode.enabled ? { stroke: chainNode.color, strokeWidth: 2 } : {};
      }
      return {
        ...edge,
        animated,
        style,
      };
    });
    setNodes(newNodes);
    setEdges(newEdges);
  }, [chains]);

  useEffect(() => {
    // doing in a reducer mode to avoid initail overwriting pollution
    setNodes((prev) => {
      const newNodes = prev.map((n) => {
        if (['sum1', 'sum2'].includes(n.id)) {
          n.hidden = !showAnnotation;
        }
        return n;
      });
      return newNodes;
    });
  }, [showAnnotation]);

  const onToggleAnnotation = (enabled: boolean) => {
    setShowAnnotation(enabled);
  };

  return (
    <div style={{ height: '300px' }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls showInteractive={false} />
        <Panel position="top-left">
          <div>
            <label>
              <input
                type="checkbox"
                checked={showAnnotation}
                onChange={(event) => onToggleAnnotation(event.target.checked)}
              />
              Annotation
            </label>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
  // });
};

export default Flow;
