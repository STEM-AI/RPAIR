import { useEffect } from 'react';
import useSound from 'use-sound';

const StartGameSound = () => {
  const [playStart] = useSound('/sounds/Start.mp3', { volume: 0.5 });

  useEffect(() => {
    playStart();
    console.log("Game Started");
  }, [playStart]);

  return null; 
};

export default StartGameSound;

