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
  const [uiMode, setUiMode] = useState("classic"); // "classic" or "monkeytype"
  
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
  } = useTimer(30);

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
                className={`btn ${uiMode === "classic" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setUiMode("classic")}
              >
                Classic UI
              </button>
              <button
                type="button"
                className={`btn ${uiMode === "monkeytype" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setUiMode("monkeytype")}
              >
                Monkeytype UI
              </button>
            </div>
          </div>
        </div>
      </div>

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