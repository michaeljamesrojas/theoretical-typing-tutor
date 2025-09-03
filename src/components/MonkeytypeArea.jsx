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

    // Calculate characters per line (approximately) and lines to show
    const charsPerLine = 50; // Approximate characters per line
    const linesToShow = 3;
    const totalCharsToShow = charsPerLine * linesToShow;
    
    // Calculate the start position for the visible text window
    const currentLine = Math.floor(currentPosition / charsPerLine);
    const startLine = Math.max(0, currentLine - 1); // Show current line and one above
    const startIndex = startLine * charsPerLine;
    const endIndex = Math.min(originalCharSet.length, startIndex + totalCharsToShow);
    
    // Get the visible portion of text
    const visibleText = originalCharSet.slice(startIndex, endIndex);
    
    return visibleText.split('').map((char, relativeIndex) => {
      const absoluteIndex = startIndex + relativeIndex;
      let style = { 
        display: 'inline-block',
        minWidth: '0.8em',
        textAlign: 'center'
      };
      
      if (absoluteIndex < currentPosition) {
        // Already typed characters
        const isError = errorPositions.includes(absoluteIndex);
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
      } else if (absoluteIndex === currentPosition) {
        // Current character to type (cursor position)
        style = { 
          ...style,
          color: '#e2e2e2',
          position: 'relative'
        };
      } else {
        // Not yet typed
        style = {
          ...style,
          color: '#666'
        };
      }
      
      // Add line breaks approximately every charsPerLine characters
      const shouldBreak = relativeIndex > 0 && relativeIndex % charsPerLine === 0;
      
      return (
        <span key={absoluteIndex}>
          {shouldBreak && <br />}
          <span style={style}>
            {char}
            {absoluteIndex === currentPosition && (
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
            fontSize: '2rem',
            lineHeight: '3rem',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            wordWrap: 'break-word',
            cursor: 'text',
            color: '#e2e2e2',
            textAlign: 'left',
            maxHeight: '9rem', // 3 lines × 3rem line height
            overflow: 'hidden'
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