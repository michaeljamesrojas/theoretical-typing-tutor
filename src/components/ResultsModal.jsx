import React, { useEffect, useRef, useState } from 'react';

const ResultsModal = ({ 
  isOpen, 
  onClose, 
  netWPM, 
  rawWPM, 
  accuracy, 
  totalKeysTyped, 
  correctKeysTyped,
  onReset
}) => {
  const tryAgainButtonRef = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (isOpen && tryAgainButtonRef.current) {
      // Disable the try again button for 1 second when modal opens
      setIsButtonDisabled(true);

      // Re-enable the button after 1 second and focus it
      setTimeout(() => {
        setIsButtonDisabled(false);
        tryAgainButtonRef.current?.focus();
      }, 1000);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalStyles = {
    backgroundColor: '#2a2a2a',
    border: '1px solid #4a4a4a',
    borderRadius: '8px',
    color: '#ffffff'
  };

  const cardStyles = {
    backgroundColor: '#3a3a3a',
    border: '1px solid #4a4a4a',
    borderRadius: '6px',
    color: '#ffffff'
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop fade show"
        style={{ zIndex: 1040, backgroundColor: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        style={{ zIndex: 1050 }}
        onClick={onClose}
      >
        <div 
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: '500px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 shadow-lg" style={modalStyles}>
            {/* Header */}
            <div className="modal-header border-0 pb-2" style={{ backgroundColor: '#2a2a2a' }}>
              <h6 className="modal-title text-white d-flex align-items-center mb-0">
                <span className="me-2" style={{ color: '#ff6b6b' }}>●</span>
                Typing Results
              </h6>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
                style={{ fontSize: '0.8rem' }}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body p-3">
              {/* Average label */}
              <div className="text-center mb-3">
                <small style={{ color: '#888', fontSize: '0.85rem' }}>⚡ Average</small>
              </div>

              {/* Main Stats Grid */}
              <div className="row mb-3">
                {/* Net WPM - Large */}
                <div className="col-6">
                  <div className="text-center p-3" style={{ ...cardStyles, border: '2px solid #4ade80' }}>
                    <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '4px' }}>Net WPM</div>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffffff', lineHeight: '1' }}>
                      {netWPM}
                    </div>
                    <div style={{ color: '#888', fontSize: '0.7rem', marginTop: '4px' }}>
                      Words per minute (adjusted for errors)
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="row h-100">
                    {/* Raw WPM */}
                    <div className="col-12 mb-2">
                      <div className="text-center p-2" style={{ ...cardStyles, border: '1px solid #3b82f6' }}>
                        <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '2px' }}>Raw WPM</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3b82f6', lineHeight: '1' }}>
                          {rawWPM}
                        </div>
                        <div style={{ color: '#888', fontSize: '0.7rem' }}>Total speed</div>
                      </div>
                    </div>

                    {/* Accuracy */}
                    <div className="col-12">
                      <div className="text-center p-2" style={{ ...cardStyles, border: '1px solid #f59e0b' }}>
                        <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '2px' }}>Accuracy</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f59e0b', lineHeight: '1' }}>
                          {accuracy}%
                        </div>
                        <div style={{ color: '#888', fontSize: '0.7rem' }}>
                          {totalKeysTyped} keys
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accuracy Progress */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small style={{ color: '#888', fontSize: '0.75rem' }}>Accuracy Progress</small>
                  <small style={{ color: '#888', fontSize: '0.75rem' }}>{accuracy}%</small>
                </div>
                <div style={{ 
                  backgroundColor: '#4a4a4a', 
                  borderRadius: '4px', 
                  height: '6px',
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{ 
                      backgroundColor: accuracy >= 90 ? '#4ade80' : accuracy >= 75 ? '#f59e0b' : '#ef4444',
                      height: '100%',
                      width: `${accuracy}%`,
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="row">
                <div className="col-6">
                  <div className="text-center p-2" style={{ backgroundColor: '#4ade80', borderRadius: '4px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#000' }}>{correctKeysTyped}</div>
                    <div style={{ fontSize: '0.7rem', color: '#000' }}>Correct Keys</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-2" style={{ backgroundColor: '#f97316', borderRadius: '4px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>{totalKeysTyped - correctKeysTyped}</div>
                    <div style={{ fontSize: '0.7rem', color: '#fff' }}>Errors</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 pt-2" style={{ backgroundColor: '#2a2a2a' }}>
              <button 
                type="button" 
                className="btn btn-outline-light btn-sm me-2" 
                onClick={onClose}
                style={{ fontSize: '0.8rem' }}
              >
                Close
              </button>
              <button 
                ref={tryAgainButtonRef}
                type="button" 
                className="btn btn-primary btn-sm" 
                disabled={isButtonDisabled}
                onClick={() => {
                  onReset();
                  onClose();
                }}
                style={{ fontSize: '0.8rem' }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsModal;