import { useCallback, useMemo, useState } from 'react';

const useAudioService = () => {
  const audioContext = useMemo(() => {
    return new (window.AudioContext || window.webkitAudioContext)();
  }, []);

  const [useLeftHand, setUseLeftHand] = useState(false);

  const pianoNotes = useMemo(() => ({
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00,
    'A4': 440.00,
    'B4': 493.88
  }), []);

  // Piano-like left hand (bass) and right hand (treble) note ranges
  const pianoRanges = useMemo(() => {
    // Left hand: Bass clef range (C2-B3) using C major scale primarily
    const leftHand = [
      130.81, // C2
      146.83, // D2
      164.81, // E2
      174.61, // F2
      196.00, // G2
      220.00, // A2
      246.94, // B2
      261.63, // C3
      293.66, // D3
      329.63, // E3
      349.23, // F3
      392.00, // G3
      440.00, // A3
      493.88, // B3
    ];

    // Right hand: Treble clef range (C4-B5) using C major scale primarily
    const rightHand = [
      261.63, // C4
      293.66, // D4
      329.63, // E4
      349.23, // F4
      392.00, // G4
      440.00, // A4
      493.88, // B4
      523.25, // C5
      587.33, // D5
      659.25, // E5
      698.46, // F5
      783.99, // G5
      880.00, // A5
      987.77, // B5
    ];

    return { leftHand, rightHand };
  }, []);

  // Map characters to musical notes within each hand's range
  const getCharacterNote = useCallback((character, isLeftHand) => {
    const range = isLeftHand ? pianoRanges.leftHand : pianoRanges.rightHand;
    
    // Convert character to a consistent index within the range
    const charCode = character.charCodeAt(0);
    const noteIndex = charCode % range.length;
    
    return range[noteIndex];
  }, [pianoRanges]);

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

  const playCharacterNote = useCallback((character) => {
    // Alternate between left hand (bass) and right hand (treble)
    const frequency = getCharacterNote(character, useLeftHand);
    playNote(frequency);
    
    // Toggle for next keystroke (creating left-right piano alternation)
    setUseLeftHand(prev => !prev);
  }, [getCharacterNote, useLeftHand, playNote]);

  const playErrorTone = useCallback(() => {
    // Use a low bass note (C2) for error feedback
    const errorNote = 130.81; // C2 - lowest note from left hand range
    playNote(errorNote);
  }, [playNote]);

  return {
    playNote,
    playRandomNote,
    playCharacterNote,
    playErrorTone,
    pianoNotes
  };
};

export default useAudioService;