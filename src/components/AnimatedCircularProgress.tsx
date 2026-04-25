import { useEffect, useRef, useState } from 'react'

interface AnimatedCircularProgressProps {
  percentage: number
}

export default function AnimatedCircularProgress({ percentage }: AnimatedCircularProgressProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * percentage));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isVisible, percentage]);

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isVisible ? circumference - (percentage / 100) * circumference : circumference;

  return (
    <div ref={ref} className="relative w-16 h-16 mb-3 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90 transform">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
          fill="transparent"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="white"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.165, 0.84, 0.44, 1)' }}
        />
      </svg>
      <span className="text-white font-bold text-xl relative z-10">{count}%</span>
    </div>
  );
}
