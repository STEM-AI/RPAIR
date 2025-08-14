import useSound from 'use-sound';

const EndGameSound = () => {
  const [playEnd] = useSound('/sounds/end.mp3', { volume: 0.5 });

  const handleEnd = () => {
    playEnd();
    console.log("Game Ended");
  };

  return (
    <button
      onClick={handleEnd}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      End Game
    </button>
  );
};

export default EndGameSound;
