import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState, useEffect, useRef } from "react";
import ttt from "./lib/ttt";
import TypingIndicator from "./typingIndicator";

function App() {
  const [trainingCharacters, setTrainingCharacters] = useState("abcdefghijklmnopqrstuvwxyz");
  const [charSet, setCharSet] = useState(ttt.getCharSet());
  const [shakerClass, setShakerClass] = useState("");
  const [generatorType, setGeneratorType] = useState(1);
  const [typedChar, setTypedChar] = useState("");
  const inputRef = useRef(null);
  const [returnCharSetAmount, setReturnCharSetAmount] = useState(1);
  
  // Timer and WPM states
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [startTime, setStartTime] = useState(null);
  const [totalKeysTyped, setTotalKeysTyped] = useState(0);
  const [correctKeysTyped, setCorrectKeysTyped] = useState(0);
  const [timerFinished, setTimerFinished] = useState(false);
  const timerRef = useRef(null);


  useEffect(() => {
    ttt.setTrainingCharacters(trainingCharacters, generatorType);
    ttt.setReturnCharSetAmount(returnCharSetAmount);
    setCharSet(ttt.getCharSet());
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      setTimerActive(false);
      setTimerFinished(true);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerActive, timeRemaining]);

  // Reset timer when settings change (without focusing)
  const resetTimer = () => {
    setTimerActive(false);
    setTimeRemaining(30);
    setStartTime(null);
    setTotalKeysTyped(0);
    setCorrectKeysTyped(0);
    setTimerFinished(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // Reset everything including words and focus back to typing area (for reset button)
  const handleResetButton = () => {
    resetTimer();
    // Reset the character set/words in queue
    ttt.setTrainingCharacters(trainingCharacters, generatorType);
    setCharSet(ttt.getCharSet());
    // Focus back to typing area
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Start timer on first correct keystroke
  const startTimer = () => {
    if (!timerActive && !timerFinished) {
      setTimerActive(true);
      setStartTime(Date.now());
    }
  };

  // Calculate WPM
  const calculateWPM = (keyCount, timeElapsedInMinutes) => {
    if (timeElapsedInMinutes === 0) return 0;
    return Math.round((keyCount / 5) / timeElapsedInMinutes);
  };

  const getCurrentWPM = () => {
    if (!startTime || timeRemaining === 30) return { raw: 0, net: 0 };
    const timeElapsedSeconds = 30 - timeRemaining;
    const timeElapsedMinutes = timeElapsedSeconds / 60;
    
    // Don't calculate WPM until at least 3 seconds have passed to avoid extreme values
    if (timeElapsedSeconds < 3) return { raw: 0, net: 0 };
    
    const rawWPM = calculateWPM(totalKeysTyped, timeElapsedMinutes);
    const netWPM = calculateWPM(correctKeysTyped, timeElapsedMinutes);
    return { raw: rawWPM, net: netWPM };
  };

  const handleReturnCharSetAmountChange = (e) => {
    const amount = parseInt(e.target.value, 10);
    setReturnCharSetAmount(amount);
    ttt.setReturnCharSetAmount(amount);
    resetTimer();
  };
  

  var forceRender = () => {
    setTrainingCharacters(ttt.getTrainingCharacters());
    setCharSet(ttt.getCharSet());
  };

  const trainingCharactersChange = (e) => {
    const trainingChars = e.target.value;

    setTrainingCharacters(trainingChars);

    ttt.setTrainingCharacters(trainingChars, generatorType);

    setCharSet(ttt.getCharSet());
    resetTimer();
  };

  const typeAreaChange = (e) => {
    const typedChar = e.target.value;
    setTypedChar(typedChar);

    // Don't process if timer has finished
    if (timerFinished) {
      return;
    }

    // Count all keystrokes
    setTotalKeysTyped(prev => prev + 1);

    let eliminateSuccess = ttt.eliminateFirstLetter(typedChar, true);
    if (eliminateSuccess) {
      // Start timer on first correct keystroke
      startTimer();
      
      // Count correct keystrokes
      setCorrectKeysTyped(prev => prev + 1);
      
      // Play a random note from pianoNotes when correct
      const notes = Object.values(pianoNotes);
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      playNote(randomNote);
    } else {
      shakeError();
    }
    forceRender();
  };

  const shakeError = (e) => {
    setShakerClass("shakeIt");

    setTimeout(() => {
      setShakerClass("");
    }, 1000 * ttt.shakeErrorSeconds);
  };

  const getHighlightedCharSet = (charSet, highlightLocations, color = "red") => {
    let newCharSet = charSet;

    if (
      Array.isArray(highlightLocations) &&
      highlightLocations.length > 0 &&
      typeof color === "string"
    ) {
      newCharSet = <></>;

      for (let i = 0; i < charSet.length; i++) {
        const currentChar = charSet[i];
        if (
          !!!highlightLocations.includes(
            i + (ttt.getOriginalCharSetLength() - ttt.getCharSet().length)
          )
        ) {
          newCharSet = (
            <>
              {newCharSet}
              {currentChar}
            </>
          );
        } else {
          newCharSet = (
            <>
              {newCharSet}
              <span style={{ color }}>{currentChar}</span>
            </>
          );
        }
      }
    }

    return <>{newCharSet}</>;
  };

  const generatorTypeChange = (e) => {
    forceRender();
    setGeneratorType(parseInt(e.target.value));
    resetTimer();
  };

  const progressValue = ttt.getEliminationPercentage() || 0;
  const currentWPM = getCurrentWPM();

  return (
    <>
      <div className="row m-4 mb-5 text-center position-relative">
        <div className="curveHeading position-absolute"></div>
        <div className="col position-relative">
          <h1 className="text-white">Typing Tutor Theory</h1>
        </div>
      </div>

      {/* Timer and WPM Display */}
      <div className="row m-3 justify-content-center">
        <div className="col-auto">
          <div className="d-flex align-items-center gap-4">
            <div className="text-center">
              <h5 className="mb-1 text-primary">Timer</h5>
              <div className={`badge fs-6 ${timeRemaining <= 10 && timerActive ? 'bg-warning text-dark' : timerFinished ? 'bg-danger' : 'bg-secondary'}`}>
                {timerFinished ? 'Time Up!' : `${timeRemaining}s`}
              </div>
            </div>
            
            <div className="text-center">
              <h6 className="mb-1 text-success">Raw WPM</h6>
              <div className="badge bg-success fs-6">
                {currentWPM.raw}
              </div>
            </div>
            
            <div className="text-center">
              <h6 className="mb-1 text-info">Net WPM</h6>
              <div className="badge bg-info fs-6">
                {currentWPM.net}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="row m-3 justify-content-center">
        <select
          id="mode-selector"
          className="form-select"
          onChange={generatorTypeChange}
          aria-label="select generator mode"
        >
          {ttt.getModes().map((eachMode, i) => (
            <option key={i} value={i} selected={i === generatorType}>
              {eachMode}
            </option>
          ))}
        </select>

        <input
          className="training-characters"
          type="text"
          onChange={trainingCharactersChange}
          value={trainingCharacters}
        />

        <input
            className="return-char-set-amount"
            type="number"
            min="0"
            max="100"
            onChange={handleReturnCharSetAmountChange}
            value={returnCharSetAmount}
            placeholder="Return char set amount"
          />
      </div>

      <div id="core-trainer" className="d-flex mx-5 align-items-center bd-highlight">
        <div className="p-2 flex-shrink-1 bd-highlight position-relative">
          <input ref={inputRef} className="type-area" type="text" onChange={typeAreaChange} value={""}></input>
          <TypingIndicator key={Date.now()} toDisplay={typedChar} />
        </div>

        <div className="p-2 w-100 bd-highlight overflow-hidden">
          <h1 className={`m-0 characters-container ${shakerClass}`}>
            <pre className="m-0 overflow-hidden">
              {getHighlightedCharSet(charSet, ttt.getErrorCharPositions())}
            </pre>
          </h1>

          <div id="progress-bar" className="progress">
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${progressValue}%`, margin: "auto" }}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {Math.round(progressValue)}%
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button at Bottom */}
      <div className="row m-3 justify-content-center">
        <div className="col-auto">
          <button 
            className="btn btn-primary"
            onClick={handleResetButton}
            title="Reset Timer and WPM"
          >
            &#x21BB; {/* Unicode reload/refresh icon */}
          </button>
        </div>
      </div>
    </>
  );
}

export default App;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const pianoNotes = {
  'C4': 261.63,
  'D4': 293.66,
  'E4': 329.63,
  'F4': 349.23,
  'G4': 392.00,
  'A4': 440.00,
  'B4': 493.88
};

const playNote = (frequency) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);
};
