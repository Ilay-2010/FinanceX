
import React, { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  stagger = 0.08,
  delay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const target = containerRef.current;
    const elements = target.children.length > 0 ? Array.from(target.children) : [target];

    const ctx = gsap.context(() => {
      gsap.fromTo(elements, 
        { 
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: delay,
          stagger: stagger,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: target,
            start: 'top bottom-=5%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }, target);

    return () => ctx.revert();
  }, [stagger, delay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
