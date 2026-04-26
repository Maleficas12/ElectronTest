import Plotly from 'plotly.js-dist-min';
import { useEffect, useRef } from 'react';

function buildSinePoints(length: number, step: number): { x: number[]; y: number[] } {
  const x: number[] = [];
  const y: number[] = [];

  for (let value = 0; value <= length; value += step) {
    x.push(value);
    y.push(Math.sin(value));
  }

  return { x, y };
}

export function SinePlot(): JSX.Element {
  const plotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!plotRef.current) return;

    const { x, y } = buildSinePoints(Math.PI * 6, 0.1);

    void Plotly.newPlot(
      plotRef.current,
      [
        {
          x,
          y,
          type: 'scatter',
          mode: 'lines',
          line: { color: '#2563eb', width: 3 },
          name: 'sin(x)'
        }
      ],
      {
        title: 'Simple Sinus Curve',
        margin: { t: 48, r: 24, b: 48, l: 48 },
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#f8fafc'
      },
      {
        responsive: true,
        displaylogo: false
      }
    );

    return () => {
      if (plotRef.current) {
        void Plotly.purge(plotRef.current);
      }
    };
  }, []);

  return <div className="plot-container" ref={plotRef} />;
}
