import React from 'react';

const SettingsPanel = ({
  generatorType,
  trainingCharacters,
  returnCharSetAmount,
  strictErrorMode,
  modes,
  onGeneratorTypeChange,
  onTrainingCharactersChange,
  onReturnCharSetAmountChange,
  onStrictErrorModeChange
}) => {
  return (
    <div className="row m-3 justify-content-center">
      <select
        id="mode-selector"
        className="form-select"
        onChange={onGeneratorTypeChange}
        value={generatorType}
        aria-label="select generator mode"
      >
        {modes.map((mode, index) => (
          <option key={index} value={index}>
            {mode}
          </option>
        ))}
      </select>

      <input
        className="training-characters"
        type="text"
        onChange={onTrainingCharactersChange}
        value={trainingCharacters}
        placeholder="Training characters"
      />

      <input
        className="return-char-set-amount"
        type="number"
        min="0"
        max="100"
        onChange={onReturnCharSetAmountChange}
        value={returnCharSetAmount}
        placeholder="Return char set amount"
      />

      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="strictModeToggle"
          checked={strictErrorMode}
          onChange={onStrictErrorModeChange}
        />
        <label className="form-check-label" htmlFor="strictModeToggle">
          Strict Error Mode
        </label>
      </div>
    </div>
  );
};

export default SettingsPanel;