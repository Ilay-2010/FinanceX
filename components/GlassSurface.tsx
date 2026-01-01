
import React from 'react';

interface GlassSurfaceProps {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  className?: string;
  displace?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  brightness?: number;
  opacity?: number;
  mixBlendMode?: string;
}

const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  width = 'auto',
  height = 'auto',
  borderRadius = 24,
  className = "",
  displace = 0,
  distortionScale = 0,
  redOffset = 0,
  greenOffset = 0,
  blueOffset = 0,
  brightness = 100,
  opacity = 1,
  mixBlendMode = 'normal'
}) => {
  const containerStyle: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: `${borderRadius}px`,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: `rgba(255, 255, 255, ${0.03 * opacity})`,
    backdropFilter: `blur(24px) brightness(${brightness}%) saturate(150%)`,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    mixBlendMode: mixBlendMode as any,
  };

  const distortionStyle: React.CSSProperties = distortionScale !== 0 ? {
    filter: `url(#glass-distortion)`,
    transform: `scale(${1 + (distortionScale / 1000)})`,
  } : {};

  return (
    <div 
      className={`glass-container ${className}`}
      style={containerStyle}
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `linear-gradient(45deg, transparent, rgba(255,0,0,${redOffset/100}), rgba(0,255,0,${greenOffset/100}), rgba(0,0,255,${blueOffset/100}), transparent)`,
          transform: `translate(${displace}px, ${displace}px)`
        }}
      />
      <div className="relative z-10 w-full h-full p-1" style={distortionStyle}>
        {children}
      </div>
    </div>
  );
};

export default GlassSurface;
