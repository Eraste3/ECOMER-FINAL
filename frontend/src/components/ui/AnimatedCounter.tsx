import React, { useEffect, useRef, useState } from 'react';
import { formatNumber } from '../../utils/format';

export function AnimatedCounter({
  value,
  duration = 1100,
  decimals = 0




}: {value: number;duration?: number;decimals?: number;}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(value * eased);
        if (p < 1) requestAnimationFrame(tick);else
        setDisplay(value);
      };
      requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  const shown =
  decimals > 0 ?
  display.toFixed(decimals).replace('.', ',') :
  formatNumber(Math.round(display));

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>);

}