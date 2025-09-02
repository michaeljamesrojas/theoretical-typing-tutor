import { useState, useEffect, useRef, useCallback } from 'react';

const useTimer = (initialTime = 30) => {
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [startTime, setStartTime] = useState(null);
  const [totalKeysTyped, setTotalKeysTyped] = useState(0);
  const [correctKeysTyped, setCorrectKeysTyped] = useState(0);
  const [timerFinished, setTimerFinished] = useState(false);
  const timerRef = useRef(null);

  const calculateWPM = useCallback((keyCount, timeElapsedInMinutes) => {
    if (timeElapsedInMinutes === 0) return 0;
    return Math.round((keyCount / 5) / timeElapsedInMinutes);
  }, []);

  const getCurrentWPM = useCallback(() => {
    if (!startTime || timeRemaining === initialTime) return { raw: 0, net: 0 };
    const timeElapsedSeconds = initialTime - timeRemaining;
    const timeElapsedMinutes = timeElapsedSeconds / 60;
    
    if (timeElapsedSeconds < 3) return { raw: 0, net: 0 };
    
    const rawWPM = calculateWPM(totalKeysTyped, timeElapsedMinutes);
    const netWPM = calculateWPM(correctKeysTyped, timeElapsedMinutes);
    return { raw: rawWPM, net: netWPM };
  }, [startTime, timeRemaining, totalKeysTyped, correctKeysTyped, initialTime, calculateWPM]);

  const startTimer = useCallback(() => {
    if (!timerActive && !timerFinished) {
      setTimerActive(true);
      setStartTime(Date.now());
    }
  }, [timerActive, timerFinished]);

  const resetTimer = useCallback(() => {
    setTimerActive(false);
    setTimeRemaining(initialTime);
    setStartTime(null);
    setTotalKeysTyped(0);
    setCorrectKeysTyped(0);
    setTimerFinished(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, [initialTime]);

  const incrementTotalKeys = useCallback(() => {
    setTotalKeysTyped(prev => prev + 1);
  }, []);

  const incrementCorrectKeys = useCallback(() => {
    setCorrectKeysTyped(prev => prev + 1);
  }, []);

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

  return {
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
  };
};

export default useTimer;