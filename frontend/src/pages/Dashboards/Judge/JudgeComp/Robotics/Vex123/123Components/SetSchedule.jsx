import { useState } from 'react';
import axios from 'axios';
import { Button, Input, message } from 'antd';

const SetSchedule = ({event_name}) => {
  const [gameTime, setGameTime] = useState('10:00');
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    if (!gameTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      message.error('Please enter a valid time in HH:MM format');
      return;
    }

    try {
      setLoading(true); 
      const response = await axios.post(
        // `${process.env.REACT_APP_API_URL}/core/event/${event_name}/games/schedule/`,
        
        {
          stage: "vex_123",
          game_time: gameTime
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        message.success('VEX 123 game scheduled successfully!');
      } else {
        throw new Error('Failed to schedule game');
      }
    } catch (error) {
      console.error('Error scheduling game:', error);
      message.error(error.response?.data?.message || 'Failed to schedule game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vex123-schedule">
      <div className="time-input-container" style={{ marginBottom: '16px' }}>
        <label htmlFor="game_time" style={{ display: 'block', marginBottom: '8px' }}>
          Game Time (HH:MM)
        </label>
        <Input
          id="game_time"
          type="time"
          value={gameTime}
          onChange={(e) => setGameTime(e.target.value)}
          style={{ width: '200px', marginRight: '16px' }}
        />
      </div>
      
      <Button
        type="primary"
        onClick={handleSchedule}
        loading={loading}
        disabled={!gameTime}
      >
        Schedule VEX 123 Game
      </Button>
    </div>
  );
};

export default SetSchedule;