import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState, useEffect, useRef } from "react";
import ttt from "./lib/ttt";
import Timer from "./components/Timer";
import SettingsPanel from "./components/SettingsPanel";
import TypingArea from "./components/TypingArea";
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
  
  // Custom hooks
  const { playRandomNote } = useAudioService();
  const {
    timerActive,
    timeRemaining,
    timerFinished,
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

  const handleResetButton = () => {
    resetTimer();
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
      playRandomNote();
    } else {
      shakeError();
      
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

  return (
    <>
      <div className="row m-4 mb-5 text-center position-relative">
        <div className="curveHeading position-absolute"></div>
        <div className="col position-relative">
          <h1 className="text-white">Typing Tutor Theory</h1>
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
    </>
  );
}

export default App;