// inspired by
// https://pjchender.dev/react/react-context-provider-api/
import { createContext, useReducer, type Dispatch, type ReactNode, useContext } from 'react';

export type ChainNode = {
  id: string;
  enabled: boolean;
  value: number | null;
  color: 'blue' | 'cyan' | 'orange';
};

export type Chain = ChainNode[];

type EnableAction = {
  type: 'enable';
  id: string;
  enabled: boolean;
};

type SetValueAction = {
  type: 'setValue';
  id: string;
  value: number;
};

type NeuralNetworkReducerAction = EnableAction | SetValueAction;

type NeuralNetworkContextProps = {
  chains: Chain[];
  dispatch: Dispatch<NeuralNetworkReducerAction>;
};

function networkReducer(state: Chain[], action: NeuralNetworkReducerAction) {
  const newState = state.map((innerArray) => [...innerArray]);
  switch (action.type) {
    case 'enable': {
      const chainNodes = newState.find((chainNodes) => chainNodes.find((cn) => cn.id === action.id));
      if (chainNodes) {
        const index = chainNodes.findIndex((cn) => cn.id === action.id);

        // if enabled, nodes before it should be enabled
        // otherwise, nodes after it should be disabled
        const [start, end] = action.enabled ? [0, index + 1] : [index, chainNodes.length];
        chainNodes.slice(start, end).forEach((chainNode) => {
          chainNode.enabled = action.enabled;
        });
      }
      break;
    }
    case 'setValue': {
      const node = newState.flat().find((cn) => cn.id === action.id);
      if (node) {
        node.value = action.value;
      }
      break;
    }
    default:
    // do noop
  }
  return [...newState];
}

const NeuralNetworkContext = createContext<NeuralNetworkContextProps | null>(null);

type NeuralNetworkProviderProps = {
  defaultChains?: Chain[];
  children: ReactNode;
};

export function NeuralNetworkProvider(props: NeuralNetworkProviderProps) {
  const { defaultChains = [], children } = props;
  const [chains, dispatch] = useReducer(networkReducer, defaultChains, (arg) => {
    return arg.length ? arg : [];
  });
  return (
    <NeuralNetworkContext.Provider
      value={{
        chains,
        dispatch,
      }}
    >
      {children}
    </NeuralNetworkContext.Provider>
  );
}

export function useNeuralNetwork() {
  const result = useContext(NeuralNetworkContext);

  if (result === null) {
    throw new Error('useCounter must be used within a CounterProvider');
  }

  return result;
}
