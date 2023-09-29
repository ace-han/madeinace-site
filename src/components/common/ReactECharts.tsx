// Inspired by
// https://dev.to/manufac/using-apache-echarts-with-react-and-typescript-353k
// https://react.dev/reference/react/PureComponent#alternatives
// https://react.dev/reference/react/forwardRef
import type { CSSProperties } from 'react';
import type { EChartsOption, ECharts, SetOptionOpts } from 'echarts';
import { useRef, useEffect, memo, forwardRef, useImperativeHandle } from 'react';
import { init, getInstanceByDom } from 'echarts';

export interface ReactEChartsProps {
  option: EChartsOption;
  style?: CSSProperties;
  opts?: SetOptionOpts;
  loading?: boolean;
  theme?: 'light' | 'dark';
}

export interface ReactEChartsRef {
  getChartInstance: () => ECharts | undefined;
}
// doing memo to make this work like a PureComponent
const ReactECharts = memo(
  forwardRef<ReactEChartsRef, ReactEChartsProps>(function ReactECharts(props, ref) {
    const { option, style, opts, loading, theme = 'dark' } = props;
    const chartRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getChartInstance() {
        return getInstanceByDom(chartRef.current!);
      },
    }));

    useEffect(() => {
      // Initialize chart
      let chart: ECharts | undefined;
      if (chartRef.current) {
        chart = init(chartRef.current, theme);
      }

      // Add chart resize listener
      // ResizeObserver is leading to a bit janky UX
      function resizeChart() {
        chart?.resize();
      }
      window.addEventListener('resize', resizeChart);

      // Return cleanup function
      return () => {
        console.info('dispose...');
        chart?.dispose();
        window.removeEventListener('resize', resizeChart);
      };
    }, [theme]);

    useEffect(() => {
      // Update chart
      if (chartRef.current) {
        const chart = getInstanceByDom(chartRef.current);
        chart!.setOption(option, opts);
      }
    }, [option, opts, theme]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

    useEffect(() => {
      // Update chart
      if (chartRef.current) {
        const chart = getInstanceByDom(chartRef.current)!;
        loading === true ? chart.showLoading() : chart.hideLoading();
      }
    }, [loading, theme]);

    const newStyle = { height: '300px', ...style };
    return <div ref={chartRef} style={newStyle} />;
  })
);

export default ReactECharts;
