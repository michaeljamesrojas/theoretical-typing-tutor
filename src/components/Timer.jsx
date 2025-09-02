import React from 'react';

const Timer = ({ 
  timeRemaining, 
  timerActive, 
  timerFinished, 
  rawWPM = 0, 
  netWPM = 0 
}) => {
  const getTimerBadgeClass = () => {
    if (timerFinished) return 'bg-danger';
    if (timeRemaining <= 10 && timerActive) return 'bg-warning text-dark';
    return 'bg-secondary';
  };

  const getTimerText = () => {
    return timerFinished ? 'Time Up!' : `${timeRemaining}s`;
  };

  return (
    <div className="row m-3 justify-content-center">
      <div className="col-auto">
        <div className="d-flex align-items-center gap-4">
          <div className="text-center">
            <h5 className="mb-1 text-primary">Timer</h5>
            <div className={`badge fs-6 ${getTimerBadgeClass()}`}>
              {getTimerText()}
            </div>
          </div>
          
          <div className="text-center">
            <h6 className="mb-1 text-success">Raw WPM</h6>
            <div className="badge bg-success fs-6">
              {rawWPM}
            </div>
          </div>
          
          <div className="text-center">
            <h6 className="mb-1 text-info">Net WPM</h6>
            <div className="badge bg-info fs-6">
              {netWPM}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;