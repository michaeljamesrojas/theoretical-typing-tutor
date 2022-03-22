import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import ttt from "./lib/ttt";

function App() {
  const [trainingCharacters, setTrainingCharacters] = useState("abcdefghijklmnopqrstuvwxyz");
  const [charSet, setCharSet] = useState(ttt.getCharSet());
  const [shakerClass, setShakerClass] = useState("");
  const [generatorType, setGeneratorType] = useState(1);

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
    forceRender();
    setGeneratorType(parseInt(e.target.value));
  };

  const progressValue = ttt.getEliminationPercentage() || 0;

  return (
    <>
      <div className="row m-4 mb-5 text-center">
        <div className="col">
          <h1>Typing Tutor Theory</h1>
        </div>
      </div>

      <div class="row m-3 justify-content-center">
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
      </div>

      <div id="core-trainer" class="d-flex mx-5 align-items-center bd-highlight">
        <div class="p-2 flex-shrink-1 bd-highlight">
          <input className="type-area" type="text" onChange={typeAreaChange} value={""}></input>
        </div>

        <div class="p-2 w-100 bd-highlight overflow-hidden">
          <h1 className={`m-0 characters-container ${shakerClass}`}>
            <pre className="m-0 overflow-hidden">
              {getHighlightedCharSet(charSet, ttt.getErrorCharPositions())}
            </pre>
          </h1>

          <div id="progress-bar" class="progress">
            <div
              class="progress-bar bg-success"
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
    </>
  );
}

export default App;
