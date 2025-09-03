import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState, useEffect, useRef } from "react";
import ttt from "./lib/ttt";
import Timer from "./components/Timer";
import SettingsPanel from "./components/SettingsPanel";
import TypingArea from "./components/TypingArea";
import MonkeytypeArea from "./components/MonkeytypeArea";
import ResultsModal from "./components/ResultsModal";
import useAudioService from "./hooks/useAudioService";
import useTimer from "./hooks/useTimer";

function App() {
  const [trainingCharacters, setTrainingCharacters] = useState("abcdefghijklmnopqrstuvwxyz");
  const [charSet, setCharSet] = useState(ttt.getCharSet());
  const [shakerClass, setShakerClass] = useState("");
  const [generatorType, setGeneratorType] = useState(1);
  const [typedChar, setTypedChar] = useState("");
  const inputRef = useRef(null);
  const [returnCharSetAmount, setReturnCharSetAmount] = useState(1);
  const [strictErrorMode, setStrictErrorMode] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [uiMode, setUiMode] = useState("monkeytype"); // "classic" or "monkeytype"
  const [selectedTime, setSelectedTime] = useState(30);
  
  // Custom hooks
  const { playRandomNote, playCharacterNote, playErrorTone } = useAudioService();
  const {
    timerActive,
    timeRemaining,
    timerFinished,
    totalKeysTyped,
    correctKeysTyped,
    startTimer,
    resetTimer,
    incrementTotalKeys,
    incrementCorrectKeys,
    getCurrentWPM
  } = useTimer(selectedTime);

  useEffect(() => {
    ttt.setTrainingCharacters(trainingCharacters, generatorType);
    ttt.setReturnCharSetAmount(returnCharSetAmount);
    setCharSet(ttt.getCharSet());
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Show results modal when timer finishes
  useEffect(() => {
    if (timerFinished) {
      setShowResultsModal(true);
    }
  }, [timerFinished]);

  const handleResetButton = () => {
    resetTimer();
    setShowResultsModal(false);
    ttt.setTrainingCharacters(trainingCharacters, generatorType);
    setCharSet(ttt.getCharSet());
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleReturnCharSetAmountChange = (e) => {
    const amount = parseInt(e.target.value, 10);
    setReturnCharSetAmount(amount);
    ttt.setReturnCharSetAmount(amount);
    resetTimer();
  };

  const forceRender = () => {
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

    if (timerFinished) {
      return;
    }

    incrementTotalKeys();

    let eliminateSuccess = ttt.eliminateFirstLetter(typedChar, strictErrorMode);
    if (eliminateSuccess) {
      startTimer();
      incrementCorrectKeys();
      playCharacterNote(typedChar);
    } else {
      shakeError();
      playErrorTone();
      
      if (!strictErrorMode) {
        ttt.eliminateFirstLetter(ttt.getFirstLetter(), false);
      }
    }
    forceRender();
  };

  const shakeError = () => {
    setShakerClass("shakeIt");
    setTimeout(() => {
      setShakerClass("");
    }, 1000 * ttt.shakeErrorSeconds);
  };

  const generatorTypeChange = (e) => {
    const newType = parseInt(e.target.value);
    setGeneratorType(newType);
    ttt.setTrainingCharacters(trainingCharacters, newType);
    setCharSet(ttt.getCharSet());
    resetTimer();
  };

  const progressValue = ttt.getEliminationPercentage() || 0;
  const currentWPM = getCurrentWPM();
  const accuracy = totalKeysTyped > 0 ? Math.round((correctKeysTyped / totalKeysTyped) * 100) : 100;

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    resetTimer();
  };

  return (
    <>
      <div className="row m-4 mb-5 text-center position-relative">
        <div className="curveHeading position-absolute"></div>
        <div className="col position-relative">
          <h1 className="text-white">Typing Tutor Theory</h1>
          <div className="mt-3">
            <div className="btn-group" role="group" aria-label="UI Mode Toggle">
              <button
                type="button"
                className={`btn btn-sm ${uiMode === "classic" ? "btn-outline-light" : "btn-outline-secondary"}`}
                onClick={() => setUiMode("classic")}
              >
                Classic UI
              </button>
              <button
                type="button"
                className={`btn btn-sm ${uiMode === "monkeytype" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setUiMode("monkeytype")}
              >
                Monkeytype UI
              </button>
            </div>
          </div>
        </div>
      </div>

      {uiMode === "monkeytype" && (
        <div className="container-fluid mb-4">
          <div className="row justify-content-center">
            <div className="col-auto">
              <div className="d-flex gap-2 align-items-center mb-3">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedTime === 15 ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() => handleTimeSelection(15)}
                  >
                    15s
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedTime === 30 ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() => handleTimeSelection(30)}
                  >
                    30s
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedTime === 60 ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() => handleTimeSelection(60)}
                  >
                    60s
                  </button>
                </div>
                <div className="d-flex align-items-center gap-3 ms-3">
                  <select 
                    className="form-select form-select-sm" 
                    style={{width: 'auto', backgroundColor: '#2d2d2d', color: '#e2e2e2', border: '1px solid #404040'}}
                    value={generatorType}
                    onChange={generatorTypeChange}
                  >
                    <option value={0}>KEY SEQUENCE</option>
                    <option value={1}>RANDOM WORDS</option>
                  </select>
                  <input 
                    type="text" 
                    className="form-control form-control-sm"
                    style={{width: '200px', backgroundColor: '#2d2d2d', color: '#e2e2e2', border: '1px solid #404040'}}
                    value={trainingCharacters}
                    onChange={trainingCharactersChange}
                    placeholder="Training characters"
                  />
                  <input 
                    type="number" 
                    className="form-control form-control-sm"
                    style={{width: '60px', backgroundColor: '#2d2d2d', color: '#e2e2e2', border: '1px solid #404040'}}
                    value={returnCharSetAmount}
                    onChange={handleReturnCharSetAmountChange}
                    min="1"
                    max="10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {uiMode === "classic" && (
        <>
          <Timer
            timeRemaining={timeRemaining}
            timerActive={timerActive}
            timerFinished={timerFinished}
            rawWPM={currentWPM.raw}
            netWPM={currentWPM.net}
          />

          <SettingsPanel
            generatorType={generatorType}
            trainingCharacters={trainingCharacters}
            returnCharSetAmount={returnCharSetAmount}
            strictErrorMode={strictErrorMode}
            modes={ttt.getModes()}
            onGeneratorTypeChange={generatorTypeChange}
            onTrainingCharactersChange={trainingCharactersChange}
            onReturnCharSetAmountChange={handleReturnCharSetAmountChange}
            onStrictErrorModeChange={(e) => setStrictErrorMode(e.target.checked)}
          />
        </>
      )}

      {uiMode === "classic" ? (
        <TypingArea
          inputRef={inputRef}
          typedChar={typedChar}
          charSet={charSet}
          errorPositions={ttt.getErrorCharPositions()}
          originalCharSetLength={ttt.getOriginalCharSetLength()}
          shakerClass={shakerClass}
          progressValue={progressValue}
          onTypeAreaChange={typeAreaChange}
          onReset={handleResetButton}
        />
      ) : (
        <MonkeytypeArea
          inputRef={inputRef}
          typedChar={typedChar}
          charSet={charSet}
          originalCharSet={ttt.getOriginalCharSet()}
          errorPositions={ttt.getErrorCharPositions()}
          originalCharSetLength={ttt.getOriginalCharSetLength()}
          shakerClass=""
          progressValue={progressValue}
          onTypeAreaChange={typeAreaChange}
          onReset={handleResetButton}
        />
      )}

      <ResultsModal 
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        netWPM={currentWPM.net}
        rawWPM={currentWPM.raw}
        accuracy={accuracy}
        totalKeysTyped={totalKeysTyped}
        correctKeysTyped={correctKeysTyped}
        onReset={handleResetButton}
      />
    </>
  );
}

export default App;