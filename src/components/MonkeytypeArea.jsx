import React, { useState } from 'react';
import BlurOverlay from './BlurOverlay';

const MonkeytypeArea = ({
  inputRef,
  typedChar,
  charSet,
  originalCharSet,
  errorPositions,
  originalCharSetLength,
  shakerClass,
  progressValue,
  onTypeAreaChange,
  onReset
}) => {
  const [isTypingAreaFocused, setIsTypingAreaFocused] = useState(true);

  const handleFocus = () => {
    setIsTypingAreaFocused(true);
  };

  const handleBlur = () => {
    setIsTypingAreaFocused(false);
  };

  const handleOverlayClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Calculate current cursor position based on how many characters have been typed
  const currentPosition = originalCharSetLength - charSet.length;
  
  const renderText = () => {
    if (!originalCharSet) {
      return <span className="text-muted">Loading...</span>;
    }
    
    if (charSet.length === 0) {
      return <span className="text-success">Complete! 🎉</span>;
    }

    // Show the full original text with proper styling based on typing progress
    return originalCharSet.split('').map((char, index) => {
      let className = '';
      let style = { 
        display: 'inline-block',
        minWidth: '0.6em',
        textAlign: 'center'
      };
      
      if (index < currentPosition) {
        // Already typed characters
        const isError = errorPositions.includes(index);
        if (isError) {
          className = 'text-danger';
          style = { 
            ...style,
            backgroundColor: 'rgba(220, 53, 69, 0.2)',
            borderRadius: '3px'
          };
        } else {
          className = 'text-success';
        }
      } else if (index === currentPosition) {
        // Current character to type (cursor position)
        className = 'bg-warning text-dark';
        style = { 
          ...style,
          animation: 'cursor-blink 1s infinite',
          borderRadius: '3px',
          boxShadow: '0 0 0 2px rgba(255, 193, 7, 0.3)'
        };
      } else {
        // Not yet typed
        className = 'text-muted';
      }
      
      return (
        <span key={index} className={className} style={style}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="container-fluid px-5">
      <div 
        className={`monkeytype-area position-relative ${shakerClass}`}
        style={{
          minHeight: '200px',
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: '12px',
          padding: '40px',
          margin: '20px 0'
        }}
      >
        {/* Hidden input for typing */}
        <input 
          ref={inputRef} 
          className="position-absolute opacity-0" 
          type="text" 
          onChange={onTypeAreaChange} 
          onFocus={handleFocus}
          onBlur={handleBlur}
          value=""
          autoFocus
          style={{ top: 0, left: 0, width: '100%', height: '100%' }}
        />
        
        {/* Text display */}
        <div 
          className="text-display"
          style={{
            fontSize: '1.5rem',
            lineHeight: '2rem',
            fontFamily: 'monospace',
            wordWrap: 'break-word',
            cursor: 'text'
          }}
        >
          {renderText()}
        </div>

        {/* Blur overlay */}
        <BlurOverlay 
          isVisible={!isTypingAreaFocused}
          onClick={handleOverlayClick}
        />
      </div>

      {/* Progress bar */}
      <div className="row justify-content-center mb-3">
        <div className="col-8">
          <div className="progress" style={{ height: '8px' }}>
            <div 
              className="progress-bar bg-success" 
              role="progressbar" 
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-muted small">
            {Math.round(progressValue)}% complete
          </div>
        </div>
      </div>

      {/* Reset button */}
      <div className="row justify-content-center">
        <div className="col-auto">
          <button 
            className="btn btn-outline-primary"
            onClick={onReset}
            title="Reset Timer and WPM"
          >
            Reset ↻
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonkeytypeArea;