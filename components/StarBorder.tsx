
import React from 'react';

interface StarBorderProps {
  as?: React.ElementType;
  children: React.ReactNode;
  color?: string;
  speed?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const StarBorder: React.FC<StarBorderProps> = ({
  as: Component = 'div',
  children,
  color = '#FF9FFC',
  speed = '4s',
  className = '',
  ...props
}) => {
  return (
    <Component
      className={`group relative p-[1px] overflow-hidden rounded-[inherit] transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Base Visible Border - Subtle when not hovered */}
      <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-[inherit] transition-opacity duration-300 group-hover:opacity-0" />
      
      {/* Rotating Star Effect (Only visible on hover) */}
      <div
        className="absolute inset-0 w-[200%] h-[200%] left-[-50%] top-[-50%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, transparent 20%, ${color} 25%, transparent 30%, transparent 70%, ${color} 75%, transparent 80%, transparent 100%)`,
          animation: `star-rotate ${speed} linear infinite`,
        }}
      />
      
      {/* Content Container - Ensure it clips correctly */}
      <div className="relative z-10 bg-black rounded-[inherit] w-full h-full overflow-hidden">
        {children}
      </div>
      
      <style>{`
        @keyframes star-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Component>
  );
};

export default StarBorder;
