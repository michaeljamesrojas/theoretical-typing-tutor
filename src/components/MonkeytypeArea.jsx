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
      return <span style={{color: '#666'}}>Loading...</span>;
    }
    
    if (charSet.length === 0) {
      return <span style={{color: '#4CAF50'}}>Complete! 🎉</span>;
    }

    // Show the full original text with proper styling based on typing progress
    return originalCharSet.split('').map((char, index) => {
      let style = { 
        display: 'inline-block',
        minWidth: '0.6em',
        textAlign: 'center'
      };
      
      if (index < currentPosition) {
        // Already typed characters
        const isError = errorPositions.includes(index);
        if (isError) {
          style = { 
            ...style,
            color: '#ff6b6b',
            backgroundColor: 'rgba(255, 107, 107, 0.15)',
            borderRadius: '3px',
            textDecoration: 'underline'
          };
        } else {
          style = {
            ...style,
            color: '#4CAF50'
          };
        }
      } else if (index === currentPosition) {
        // Current character to type (cursor position)
        style = { 
          ...style,
          color: '#666',
          position: 'relative'
        };
      } else {
        // Not yet typed
        style = {
          ...style,
          color: '#666'
        };
      }
      
      return (
        <span key={index} style={style}>
          {char}
          {index === currentPosition && (
            <span 
              style={{
                position: 'absolute',
                left: '0px',
                top: '0px',
                bottom: '0px',
                width: '2px',
                backgroundColor: '#ffeb3b',
                animation: 'cursor-blink 1s infinite',
                zIndex: 1
              }}
            />
          )}
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
          backgroundColor: 'transparent',
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
            cursor: 'text',
            color: '#e2e2e2'
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
          <div 
            className="progress" 
            style={{ 
              height: '8px', 
              backgroundColor: '#404040',
              borderRadius: '2px'
            }}
          >
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ 
                width: `${progressValue}%`,
                backgroundColor: '#4a9eff',
                borderRadius: '2px'
              }}
            ></div>
          </div>
          <div 
            className="text-center mt-2 small"
            style={{color: '#888'}}
          >
            {Math.round(progressValue)}% complete
          </div>
        </div>
      </div>

      {/* Reset button */}
      <div className="row justify-content-center">
        <div className="col-auto">
          <button 
            className="btn btn-outline-light btn-sm"
            onClick={onReset}
            title="Reset Timer and WPM"
            style={{
              backgroundColor: 'transparent',
              borderColor: '#4a9eff',
              color: '#4a9eff'
            }}
          >
            Reset ↻
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonkeytypeArea;