import React, { useEffect, useState } from 'react';

const BlurOverlay = ({ isVisible, onClick }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div 
      className="blur-overlay"
      onClick={onClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isAnimating ? 'rgba(128, 128, 128, 0.3)' : 'rgba(128, 128, 128, 0)',
        backdropFilter: isAnimating ? 'blur(6px)' : 'blur(0px)',
        WebkitBackdropFilter: isAnimating ? 'blur(6px)' : 'blur(0px)',
        zIndex: 10,
        cursor: 'pointer',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease-in-out',
        width: '100%',
        height: '100%'
      }}
    >
      <div 
        style={{
          color: 'rgba(80, 80, 80, 0.9)',
          fontSize: '1rem',
          fontWeight: '500',
          textAlign: 'center',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: 'rgba(200, 200, 200, 0.1)',
          borderRadius: '12px',
          transition: 'all 0.3s ease-in-out',
          transform: isAnimating ? 'translateY(0) scale(1)' : 'translateY(5px) scale(0.98)',
          opacity: isAnimating ? 1 : 0,
        }}
      >
        <div style={{ 
          marginBottom: '8px', 
          fontSize: '1.5rem',
          opacity: 0.8
        }}>⌨️</div>
        <div style={{
          fontWeight: '500',
          color: 'rgba(60, 60, 60, 0.9)'
        }}>
          Click to start typing
        </div>
      </div>
    </div>
  );
};

export default BlurOverlay;