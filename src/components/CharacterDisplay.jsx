import React from 'react';

const CharacterDisplay = ({ 
  charSet = "", 
  errorPositions = [], 
  originalCharSetLength = 0,
  currentCharSetLength = 0,
  shakerClass = "",
  highlightColor = "red" 
}) => {
  const getHighlightedCharSet = () => {
    if (!Array.isArray(errorPositions) || errorPositions.length === 0) {
      return charSet;
    }

    return charSet.split('').map((char, index) => {
      const absolutePosition = index + (originalCharSetLength - currentCharSetLength);
      const isErrorPosition = errorPositions.includes(absolutePosition);
      
      return isErrorPosition ? (
        <span key={index} style={{ color: highlightColor }}>
          {char}
        </span>
      ) : (
        <span key={index}>{char}</span>
      );
    });
  };

  return (
    <div className="p-2 w-100 bd-highlight overflow-hidden">
      <h1 className={`m-0 characters-container ${shakerClass}`}>
        <pre className="m-0 overflow-hidden">
          {getHighlightedCharSet()}
        </pre>
      </h1>
    </div>
  );
};

export default CharacterDisplay;