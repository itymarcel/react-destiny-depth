import React, { useEffect, useState } from 'react'
import { Maximize2, Tally5, Spline, CircleDashedIcon  } from 'lucide-react';
import ThreeDLayers from './components/ThreeDLayers';

const App = () => {
  const [count, setCount] = useState<number>(() => {
    const savedValue = localStorage.getItem('count');
    return savedValue !== null ? Number(savedValue) : 30;
  });

  const [easingValue, setEasingValue] = useState<number>(() => {
    const savedValue = localStorage.getItem('easingValue');
    return savedValue !== null ? Number(savedValue) : 0.02;
  });

  const [blurAmount, setBlurAmount] = useState<number>(() => {
    const savedValue = localStorage.getItem('blurAmount');
    return savedValue !== null ? Number(savedValue) : 1;
  });

  const [circleSize, setCircleSize] = useState<number>(() => {
    const savedValue = localStorage.getItem('circleSize');
    return savedValue !== null ? Number(savedValue) : 0.2;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('count', count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem('easingValue', easingValue.toString());
  }, [easingValue]);

  useEffect(() => {
    localStorage.setItem('blurAmount', blurAmount.toString());
  }, [blurAmount]);

  useEffect(() => {
    localStorage.setItem('circleSize', circleSize.toString());
  }, [circleSize]);
  return (
    <div className="App w-screen h-screen bg-black">
      <ThreeDLayers numLayers={count} easingFactor={easingValue} blurAmount={blurAmount} circleSize={circleSize}/>
      <div className='settings absolute flex flex-col gap-1 top-0 left-0 h-12 border-red p-4'>
        <div className='flex items-center gap-2'>
          <Tally5 className='h-4 w-4 text-white' />
          <input type='range' min={1} max={1000} step={1} value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </div>
        <div className='flex items-center gap-2'>
          <Spline className='h-4 w-4 text-white' />
          <input type='range' min={0} max={0.01} step={0.0001} value={easingValue} onChange={(e) => setEasingValue(Number(e.target.value))} />
        </div>
        <div className='flex items-center gap-2'>
        <CircleDashedIcon className='h-4 w-4 text-white' />
          <input type='range' min={0} max={3} step={0.01} value={blurAmount} onChange={(e) => setBlurAmount(Number(e.target.value))} />
        </div>
        <div className='flex items-center gap-2'>
          <Maximize2 className='h-4 w-4 text-white' />
          <input type='range' min={0} max={3} step={0.01} value={circleSize} onChange={(e) => setCircleSize(Number(e.target.value))} />
        </div>
      </div>
    </div>
  );
}

export default App;
