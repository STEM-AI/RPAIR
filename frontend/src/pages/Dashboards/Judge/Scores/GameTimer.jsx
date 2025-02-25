import React, { useState, useEffect, useRef } from "react";

const GameTimer = () => {
    const [gameId, setGameId] = useState("");
    const [remainingTime, setRemainingTime] = useState(60);
    const [gameActive, setGameActive] = useState(false);
    const [gamePaused, setGamePaused] = useState(false);
    const [score, setScore] = useState("");
    const [scoreVisible, setScoreVisible] = useState(false);
    const socketRef = useRef(null);
    let eventName = localStorage.getItem('selected_event_name')
    // let gameId = localStorage.getItem('gameId')
    const startGame = () => {
        console.log("start");
        
        if (!gameId) {
            alert("Please enter a valid Game ID.");
            return;
        }

        setGameActive(true);
        setGamePaused(false);
        setScoreVisible(false);

       
        console.log("brfotr socket");
        
        socketRef.current = new WebSocket(`ws://147.93.56.71:8000/ws/competition_event/next_event/game/426/`);
        // console.log("eventName", eventName)
        // console.log("gameId", gameId)
    
        socketRef.current.onopen = () => {
            console.log("WebSocket connection established");
            socketRef.current.send(
                JSON.stringify({ action: "start_game", event_name: 'next_event', game_id: '426' })
            );
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message:", data);

            if (data.status === "paused") {
                setGamePaused(true);
                return;
            }
            if (data.status === "resume") {
                setGamePaused(false);
                return;
            }
            if (data.remaining_time !== undefined) {
                setRemainingTime(Math.round(data.remaining_time));
                if (data.remaining_time <= 0) {
                    setScoreVisible(true);
                    setGameActive(false);
                }
            }
        };

        socketRef.current.onerror = (error) => console.error("WebSocket error:", error);
        socketRef.current.onclose = () => console.log("WebSocket connection closed");
    };

    const pauseGame = () => {
        if (!gameActive || gamePaused) return;
        socketRef.current.send(JSON.stringify({ action: "pause_game", event_name: eventName, game_id: gameId }));
        setGamePaused(true);
    };

    const resumeGame = () => {
        if (!gameActive || !gamePaused) return;
        socketRef.current.send(JSON.stringify({ action: "resume_game", event_name: eventName, game_id: gameId }));
        setGamePaused(false);
    };

    const restartGame = () => {
        if (!gameId) {
            alert("Game ID is missing. Start a game first.");
            return;
        }
        socketRef.current.send(JSON.stringify({ action: "restart_game", event_name: eventName, game_id: gameId }));
        setRemainingTime(60);
        setGamePaused(false);
        setScoreVisible(false);
    };

    const submitScore = () => {
        if (!score) {
            alert("Please enter a valid score.");
            return;
        }
        const authToken = "your-auth-token-here";
        fetch(`${process.env.REACT_APP_API_URL}/game/set-game-score/${gameId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ event_name: eventName, score }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Score submitted successfully:", data);
                alert("Score submitted successfully!");
            })
            .catch((error) => {
                console.error("Error submitting score:", error);
                alert("Failed to submit score. Please try again.");
            });
    };

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>Game Timer</h1>
            <input
                type="number"
                placeholder="Enter Game ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                disabled={gameActive}
            />
            <br />
            <button onClick={startGame} disabled={gameActive}>Start Game</button>
            <button onClick={pauseGame} disabled={!gameActive || gamePaused}>Pause</button>
            <button onClick={resumeGame} disabled={!gamePaused}>Resume</button>
            <button onClick={restartGame} disabled={!gameActive}>Restart</button>
            
            <div style={{ fontSize: "2em", marginTop: "20px" }}>
                {gamePaused ? "Game Paused" : `Remaining Time: ${remainingTime} seconds`}
            </div>

            {scoreVisible && (
                <div style={{ marginTop: "20px" }}>
                    <input
                        type="number"
                        placeholder="Enter Score"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                    />
                    <button onClick={submitScore}>Submit Score</button>
                </div>
            )}
        </div>
    );
};

export default GameTimer;
