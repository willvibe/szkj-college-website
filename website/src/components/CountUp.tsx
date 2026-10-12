"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUp({ value, suffix = "", duration = 900 }: { value: number; suffix?: string; duration?: number }) {
  // 非有限数值（后台误填文本）兜底为 0，避免前台渲染 "NaN"
  const safe = Number.isFinite(value) ? value : 0;
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const raf = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.round(safe * eased * 100) / 100);
          if (p < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current); // 卸载后终止 rAF 链，防止 setState on unmounted
    };
  }, [safe, duration]);

  const isFloat = !Number.isInteger(safe);
  return (
    <span ref={ref}>
      {isFloat ? display.toFixed(2) : Math.round(display)}
      {suffix}
    </span>
  );
}
