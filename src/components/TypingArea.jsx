import React from 'react';
import TypingIndicator from '../typingIndicator';
import CharacterDisplay from './CharacterDisplay';
import ProgressDisplay from './ProgressDisplay';

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
  return (
    <>
      <div id="core-trainer" className="d-flex mx-5 align-items-center bd-highlight">
        <div className="p-2 flex-shrink-1 bd-highlight position-relative">
          <input 
            ref={inputRef} 
            className="type-area" 
            type="text" 
            onChange={onTypeAreaChange} 
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