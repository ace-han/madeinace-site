import '@/assets/styles/split.css';
import Chart from './Chart';
import Topology from './Topology';
import { NeuralNetworkProvider, type Chain } from './NeuralNetworkContext';

const defaultChains: Chain[] = [
  [
    {
      id: 'w1',
      enabled: true,
      value: -34.4,
      color: 'blue',
    },
    {
      id: 'sum1',
      enabled: true,
      value: null,
      color: 'blue',
    },
    {
      id: 'b1',
      enabled: true,
      value: 2.14,
      color: 'blue',
    },
    {
      id: 'af1',
      enabled: true,
      value: null,
      color: 'blue',
    },
    {
      id: 'w3',
      enabled: true,
      value: -1.3,
      color: 'blue',
    },
  ],
  [
    {
      id: 'w2',
      enabled: true,
      value: -2.52,
      color: 'cyan',
    },
    {
      id: 'sum2',
      enabled: true,
      value: null,
      color: 'cyan',
    },
    {
      id: 'b2',
      enabled: true,
      value: 1.29,
      color: 'cyan',
    },
    {
      id: 'af2',
      enabled: true,
      value: null,
      color: 'cyan',
    },
    {
      id: 'w4',
      enabled: true,
      value: 2.28,
      color: 'cyan',
    },
  ],
  [
    {
      id: 'sum3',
      enabled: true,
      value: null,
      color: 'orange',
    },
    {
      id: 'b3',
      enabled: true,
      value: -0.58,
      color: 'orange',
    },
    {
      id: 'af3',
      enabled: true,
      value: null,
      color: 'orange',
    },
  ],
];

export default function SimpleOverviewDemo() {
  return (
    <>
      <NeuralNetworkProvider defaultChains={defaultChains}>
        <Topology />
        <Chart />
      </NeuralNetworkProvider>
    </>
  );
}
