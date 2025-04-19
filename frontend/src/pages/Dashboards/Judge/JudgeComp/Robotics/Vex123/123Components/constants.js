export const INITIAL_TIME = 5 * 60; // 5 minutes in seconds
export const GAME_MODES = [
  {
    name: "Manual",
    missions: [
      { step: "Mission 1", description: "From Point 1 to Point 2", points: 5 },
      { step: "Mission 2", description: "From Point 2 to Point 3", points: 5 },
      { step: "Mission 3", description: "From Point 3 to Point 4", points: 5 }
    ]
  },
  {
    name: "Coder Card",
    missions: [
      { step: "Mission 4", description: "From Point 4 to Point 5", points: 10 },
      { step: "Mission 5", description: "From Point 5 to Point 6", points: 5 }
    ]
  },
  {
    name: "Programming",
    missions: [
      { step: "Mission 6", description: "From Point 6 to the End Line", points: 10 }
    ]
  }
];

export const getModeKey = (modeName) => modeName.toLowerCase().replace(/\s+/g, '');
export const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};