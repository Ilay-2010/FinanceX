
import React, { useEffect, useRef } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  className?: string;
}

const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 1.5,
  decimals = 2,
  prefix = '',
  className = ''
}) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(from);

  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap || !elementRef.current) return;

    const obj = { value: prevValue.current };
    
    gsap.to(obj, {
      value: to,
      duration: duration,
      ease: 'power3.out',
      onUpdate: () => {
        if (elementRef.current) {
          elementRef.current.textContent = `${prefix}${obj.value.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}`;
        }
      }
    });

    prevValue.current = to;
  }, [to, duration, decimals, prefix]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}{from.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
};

export default CountUp;
