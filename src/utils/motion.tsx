import React from 'react';

interface MotionProps {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
}

// Functional component wrapper with animation props
export const motion = {
  div: ({ 
    children, 
    className, 
    initial, 
    animate, 
    transition, 
    ...props 
  }: React.HTMLProps<HTMLDivElement> & MotionProps) => {
    return (
      <div
        className={className}
        style={{
          transition: `transform ${transition?.duration || 0.3}s ease, opacity ${transition?.duration || 0.3}s ease`,
          transform: animate?.y ? `translateY(${animate.y}px)` : undefined,
          opacity: animate?.opacity,
          ...props.style
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
};