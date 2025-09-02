import { useCallback, useMemo } from 'react';

const useAudioService = () => {
  const audioContext = useMemo(() => {
    return new (window.AudioContext || window.webkitAudioContext)();
  }, []);

  const pianoNotes = useMemo(() => ({
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00,
    'A4': 440.00,
    'B4': 493.88
  }), []);

  const playNote = useCallback((frequency) => {
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
  }, [audioContext]);

  const playRandomNote = useCallback(() => {
    const notes = Object.values(pianoNotes);
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    playNote(randomNote);
  }, [pianoNotes, playNote]);

  return {
    playNote,
    playRandomNote,
    pianoNotes
  };
};

export default useAudioService;