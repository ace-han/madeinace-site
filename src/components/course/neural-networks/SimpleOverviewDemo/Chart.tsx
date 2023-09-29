import { useEffect, useRef, useState } from 'react';
import ReactECharts, { type ReactEChartsRef } from '@/components/common/ReactECharts';
import type { EChartsOption, LineSeriesOption } from 'echarts';
import { useNeuralNetwork, type Chain } from './NeuralNetworkContext';

type ActivationFunction = (value: number) => number;
// refer to
// https://www.freecodecamp.org/news/javascript-range-create-an-array-of-numbers-with-the-from-method/
const xStart = 0;
const xStop = 1.01;
const xStep = 0.01;
const inputs = Array.from({ length: (xStop - xStart) / xStep + 1 }, (_, index) => xStart + index * xStep);

const relu: ActivationFunction = (x) => {
  return Math.max(0, x);
};
const softplus: ActivationFunction = (x) => {
  return Math.log(1 + Math.exp(x));
};
const identity: ActivationFunction = (x) => {
  return x;
};

const ACTIVATION_NAME = 'softplus';
const ECHARTS_OPTS = {
  replaceMerge: ['series'],
};
// const Chart = memo(function Chart() {
const Chart = () => {
  console.info('Chart memo');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const chartRef = useRef<ReactEChartsRef>(null);
  const { chains } = useNeuralNetwork();

  const [chain1, chain2, chain3] = chains;

  const [option, setOption] = useState<EChartsOption>(() => {
    // using softplus we will get a squiggle which is more persuasive
    const [c1Values] = forward([inputs], chain1, ACTIVATION_NAME);
    const [c2Values] = forward([inputs], chain2, ACTIVATION_NAME);
    const [c3Values] = forward([c1Values, c2Values], chain3, ACTIVATION_NAME);
    const series: LineSeriesOption[] = [
      {
        type: 'line',
        name: 'Blue',
        data: inputs.map((v, i) => [v, c1Values[i]]),
      },
      {
        type: 'line',
        name: 'Green',
        data: inputs.map((v, i) => [v, c2Values[i]]),
      },
      {
        type: 'line',
        name: 'Output',
        data: inputs.map((v, i) => [v, c3Values[i]]),
      },
    ];
    return {
      animation: true,
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          // startValue: 0.45,
          // endValue: 0.55,
        },
      ],
      legend: {
        type: 'scroll',
      },
      series,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        confine: true,
        extraCssText: 'max-height:60%;overflow:auto',
        enterable: true,
      },
      xAxis: {
        type: 'value',
        name: 'x',
        // min: -1.1,
        // max: 1.1,
        minorTick: {
          show: false,
        },
        minorSplitLine: {
          show: false,
        },
        axisLabel: {
          formatter(value: number) {
            return value.toFixed(2);
          },
        },
      },
      yAxis: {
        name: 'y',
        minorTick: {
          show: true,
        },
        minorSplitLine: {
          show: true,
        },
        axisLabel: {
          formatter(value: number) {
            return value.toFixed(2);
          },
        },
      },
    };
  });

  useEffect(() => {
    const t = resolveCurrentTheme(document.documentElement);
    if (t !== theme) {
      setTheme(t);
    }
    // class watcher
    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    // https://stackoverflow.com/questions/10612024/event-trigger-on-a-class-change
    const observer = new MutationObserver((mutationList, observer) => {
      mutationList.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const t = resolveCurrentTheme(mutation.target as Element);
          const chartInstance = chartRef.current?.getChartInstance();
          if (chartInstance) {
            const prevOption = chartInstance.getOption() as EChartsOption;
            setOption({
              ...option,
              series: prevOption.series,
            });
          }
          setTheme(t);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => {
      observer.disconnect();
    };
  }, []);

  const updateSeries = (x: number[][], chain: Chain, seriesName: string) => {
    const chartInstance = chartRef.current?.getChartInstance();
    if (!chartInstance) {
      console.warn('chartInstance is null');
      return;
    }
    const prevOption = chartInstance.getOption();
    const newSeries = [...(prevOption.series as LineSeriesOption[])];
    // using softplus we will get a squiggle which is more persuasive
    // const values = forward([inputs], neuron1.weights, neuron1.bias, relu);
    const [values] = forward(x, chain, ACTIVATION_NAME);
    const seriesIndex = newSeries.findIndex((item) => item.name === seriesName);
    newSeries[seriesIndex] = {
      ...newSeries[seriesIndex],
      data: inputs.map((v, i) => [v, values[i]]),
    };
    chartInstance.setOption({
      series: newSeries,
    });
  };

  useEffect(() => {
    updateSeries([inputs], chain1, 'Blue');
  }, [chain1]);
  useEffect(() => {
    updateSeries([inputs], chain2, 'Green');
  }, [chain2]);
  useEffect(() => {
    const [c1Values] = forward([inputs], chain1, ACTIVATION_NAME);
    const [c2Values] = forward([inputs], chain2, ACTIVATION_NAME);
    updateSeries([c1Values, c2Values], chain3, 'Output');
  }, [chain1, chain2, chain3]);

  return (
    <>
      <ReactECharts ref={chartRef} option={option} opts={ECHARTS_OPTS} theme={theme} />
    </>
  );
  // });
};

function resolveCurrentTheme(elem: Element) {
  return elem.classList.contains('dark') ? 'dark' : 'light';
}

function weightForward(inputs: number[][], weights: number[]) {
  const result = inputs.map((input, i) => input.map((x) => x * weights[i]));
  return result;
}

function sumForward(inputs: number[][]) {
  const notEmptyInputs = inputs.filter((arr) => arr.length);
  // Sum array of arrays (matrix) vertically efficiently
  // refer to
  // https://stackoverflow.com/questions/32139773/sum-array-of-arrays-matrix-vertically-efficiently-elegantly
  const result = notEmptyInputs.reduce((acc, arr) => acc.map((v, i) => v + arr[i]));
  return [result];
}

function biasForward(inputs: number[][], bias: number) {
  const result = inputs.map((input, i) => input.map((x) => x + bias));
  return result;
}

function activationForward(inputs: number[][], activationName: string) {
  let activationFunc = identity;
  switch (activationName) {
    case 'relu': {
      activationFunc = relu;
      break;
    }
    case 'softplus': {
      activationFunc = softplus;
      break;
    }
    default:
      activationFunc = identity;
  }
  const result = inputs.map((values) => values.map(activationFunc));
  return result;
}

function forward(inputs: number[][], chain: Chain, actionName: string) {
  const enabledNodes = chain.filter((cn) => cn.enabled);
  const result = enabledNodes.reduce<number[][]>(
    (acc, node) => {
      if (node.id.startsWith('w')) {
        acc = weightForward(acc, [node.value!]);
      } else if (node.id.startsWith('sum')) {
        acc = sumForward(acc);
      } else if (node.id.startsWith('b')) {
        acc = biasForward(acc, node.value!);
      } else if (node.id.startsWith('a')) {
        acc = activationForward(acc, actionName);
      } else {
        throw Error(`Not supported node: ${node.id}`);
      }
      return acc;
    },
    enabledNodes.length ? inputs : [new Array()]
  );
  return result;
}
export default Chart;
