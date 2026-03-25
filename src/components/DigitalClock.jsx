import React, { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="font-mono text-[10px] tracking-widest text-nhubx-glow-primary flex items-center gap-2 mt-1">
      <span className="w-1.5 h-1.5 rounded-full bg-nhubx-glow-primary animate-pulse" />
      <span className="glow-text-primary font-bold">{formatTime(time)}</span>
    </div>
  );
};

export default DigitalClock;
