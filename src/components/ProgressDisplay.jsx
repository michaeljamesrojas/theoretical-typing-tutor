import React from 'react';

const ProgressDisplay = ({ progressValue = 0 }) => {
  const roundedProgress = Math.round(progressValue);

  return (
    <div id="progress-bar" className="progress">
      <div
        className="progress-bar bg-success"
        role="progressbar"
        style={{ width: `${progressValue}%`, margin: "auto" }}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={roundedProgress}
      >
        {roundedProgress}%
      </div>
    </div>
  );
};

export default ProgressDisplay;