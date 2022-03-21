import "./App.css";
import { useState } from "react";
import ttt from "./lib/ttt";
import ProgressBar from "react-bootstrap/ProgressBar";

function App() {
  const [trainingCharacters, setTrainingCharacters] = useState(ttt.getTrainingCharacters());
  const [charSet, setCharSet] = useState(ttt.getCharSet());
  const [shakerClass, setShakerClass] = useState("");
  const [generatorType, setGeneratorType] = useState(3);

  var forceRender = () => {
    setTrainingCharacters(ttt.getTrainingCharacters());
    setCharSet(ttt.getCharSet());
  };

  const trainingCharactersChange = (e) => {
    const trainingChars = e.target.value;

    setTrainingCharacters(trainingChars);

    ttt.setTrainingCharacters(trainingChars, generatorType);

    setCharSet(ttt.getCharSet());
  };

  const typeAreaChange = (e) => {
    const typedChar = e.target.value;

    console.info({ typedChar });

    let eliminateSuccess = ttt.eliminateFirstLetter(typedChar, true);
    if (!!!eliminateSuccess) {
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
    setGeneratorType(parseInt(e.target.value));
  };
  return (
    <>
      <input
        className=""
        type="number"
        onChange={generatorTypeChange}
        value={generatorType}
      ></input>
      <input
        className="training-characters"
        type="text"
        onChange={trainingCharactersChange}
        value={trainingCharacters}
      ></input>

      <br />
      <input className="type-area" type="text" onChange={typeAreaChange} value={""}></input>

      <ProgressBar variant="success" now={40} />

      <h1 className={`characters-container ${shakerClass}`}>
        <pre>{getHighlightedCharSet(charSet, ttt.getErrorCharPositions())}</pre>
      </h1>
      <h1 className="elimination-percentage">{Math.round(ttt.getEliminationPercentage()) || 0}%</h1>
    </>
  );
}

export default App;
