import React from 'react';

export default function LababilLogo({
  size = 24,
  className = "",
  showText = false,
  variant = "default" // "default", "gradient", "white"
}) {
  const logoColors = {
    default: "text-blue-600",
    gradient: "text-white",
    white: "text-white"
  };

  const colorClass = logoColors[variant] || logoColors.default;

  return (
    <div className={`flex items-center ${className}`}>
      {/* New Logo Image - Clean, no border/frame */}
      <div
        className="flex-shrink-0"
        style={{
          width: size,
          height: size * 0.75,
          backgroundImage: `url("/logo.png")`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          filter: variant === 'white' ? 'brightness(0) invert(1)' : 'none'
        }}
      />

      {/* Text Logo */}
      {showText && (
        <div className="ml-3">
          <div className={`font-bold text-lg leading-tight ${colorClass}`}>
            LABABIL
          </div>
          <div className={`text-sm leading-tight ${colorClass} opacity-80`}>
            solution
          </div>
        </div>
      )}
    </div>
  );
}

// Watermark version for print
export function LababilWatermark({ opacity = 0.05, size = 200 }) {
  return (
    <div
      style={{
        width: size,
        height: size * 0.75,
        backgroundImage: `url("/logo.png")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: opacity
      }}
    />
  );
}

// Logo variations for different uses
export const LogoVariants = {
  Header: (props) => <LababilLogo size={24} showText={true} variant="gradient" {...props} />,
  Print: (props) => <LababilLogo size={48} showText={true} variant="default" {...props} />,
  Footer: (props) => <LababilLogo size={32} showText={false} variant="default" {...props} />,
  Watermark: (props) => <LababilWatermark {...props} />
};
