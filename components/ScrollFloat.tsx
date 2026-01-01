
import React, { useEffect, useRef } from 'react';

interface ScrollFloatProps {
  children: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  className?: string;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  animationDuration = 1,
  ease = 'back.out(2)',
  scrollStart = 'top bottom-=20%',
  scrollEnd = 'bottom center',
  stagger = 0.05,
  className = ""
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.char');
    
    // Ensure GSAP and ScrollTrigger are available
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;

    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(chars, 
      { 
        y: 100, 
        opacity: 0,
        rotateX: -90
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: animationDuration,
        ease: ease,
        stagger: stagger,
        scrollTrigger: {
          trigger: containerRef.current,
          start: scrollStart,
          end: scrollEnd,
          scrub: false,
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, [children, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  const splitText = children.split('').map((char, i) => (
    <span key={i} className="char inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
      {char}
    </span>
  ));

  return (
    <h2 ref={containerRef} className={`${className} perspective-1000`}>
      {splitText}
    </h2>
  );
};

export default ScrollFloat;
