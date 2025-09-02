import React, { useState } from 'react';
import TypingIndicator from '../typingIndicator';
import CharacterDisplay from './CharacterDisplay';
import ProgressDisplay from './ProgressDisplay';
import BlurOverlay from './BlurOverlay';

const TypingArea = ({
  inputRef,
  typedChar,
  charSet,
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

  return (
    <>
      <div 
        id="core-trainer" 
        className="d-flex mx-5 align-items-center bd-highlight position-relative"
        style={{ borderRadius: '12px' }}
      >
        <div className="p-2 flex-shrink-1 bd-highlight position-relative">
          <input 
            ref={inputRef} 
            className="type-area" 
            type="text" 
            onChange={onTypeAreaChange} 
            onFocus={handleFocus}
            onBlur={handleBlur}
            value=""
            autoFocus
          />
          <TypingIndicator key={Date.now()} toDisplay={typedChar} />
        </div>

        <CharacterDisplay
          charSet={charSet}
          errorPositions={errorPositions}
          originalCharSetLength={originalCharSetLength}
          currentCharSetLength={charSet.length}
          shakerClass={shakerClass}
        />

        <BlurOverlay 
          isVisible={!isTypingAreaFocused}
          onClick={handleOverlayClick}
        />
      </div>

      <ProgressDisplay progressValue={progressValue} />

      <div className="row m-3 justify-content-center">
        <div className="col-auto">
          <button 
            className="btn btn-primary"
            onClick={onReset}
            title="Reset Timer and WPM"
          >
            &#x21BB;
          </button>
        </div>
      </div>
    </>
  );
};

export default TypingArea;