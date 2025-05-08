

import React, { useEffect, useState } from "react";
import { NavHashLink } from "react-router-hash-link";

const NewsTicker = () => {
  const [news, setNews] = useState("Loading news...");

  useEffect(() => {
    let socket;
    let reconnectInterval = 5000;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
      if (!process.env.REACT_APP_WS_URL) {
        console.error("WebSocket URL is not defined");
        return;
      }

      socket = new WebSocket(`${process.env.REACT_APP_WS_URL}/ws/news/`);

      socket.onopen = () => {
        console.log("WebSocket connection established");
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setNews(data.message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          console.log(`WebSocket connection closed, retrying... (attempt ${reconnectAttempts})`);
          setTimeout(connectWebSocket, reconnectInterval);
        } else {
          console.error("Max reconnection attempts reached");
          setNews("Connection to news feed lost");
        }
      };
    };

    connectWebSocket();

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const fetchLatestNews = async () => {
      if (!process.env.REACT_APP_API_URL) {
        console.error("API URL is not defined");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/admin/news/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const latestNews = data[0]?.content || "No news available.";
        setNews(latestNews);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews("Failed to load news.");
      }
    };

    fetchLatestNews();
  }, []); // Empty dependency array means this runs once on mount


  return (
    news !== "No news available." &&
    news !== "Failed to load news." &&
     (
      <div className="w-full backdrop-blur-sm bg-black/40 text-white flex items-center z-50 fixed bottom-0 overflow-hidden">
        <div className="px-4 py-2 font-bold text-black bg-cyan-500 z-30">News</div>

        <div className="w-full flex overflow-hidden whitespace-nowrap group">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
            {[...Array(4)].map((_, index) => ( 
      <NavHashLink key={index} to="/#challenges" className="flex-shrink-0">
        <span className="mx-4">
          🔥 Exciting News! A Rpair New competition is here!{" "}
          <span className="font-bold text-xl text-red-600 uppercase">#{news}</span>
          🏆 Test your skills, challenge yourself, and stand a chance to win amazing prizes.
          Stay tuned for more details! 🚀{" "}
          <span className="font-bold text-xl text-red-600 uppercase">#{news}</span>
          #ChallengeYourself
        </span>
      </NavHashLink>
    ))}
          </div>
        </div>

        {/* <div className="w-full flex overflow-hidden whitespace-nowrap group">
  <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
    {[...Array(4)].map((_, index) => (
      <NavHashLink key={index} to="/#challenges" className="flex-shrink-0">
        <span className="mx-4">
          🔥 Exciting News! A brand-new competition is here!{" "}
          <span className="font-bold text-xl text-red-600 uppercase">#{news}</span>
          🏆 Test your skills, challenge yourself, and stand a chance to win amazing prizes.
          Stay tuned for more details! 🚀{" "}
          <span className="font-bold text-xl text-red-600 uppercase">#{news}</span>
          #ChallengeYourself
        </span>
      </NavHashLink>
    ))}
  </div>
</div> */}

      </div>
    )
  );
};

export default NewsTicker;
