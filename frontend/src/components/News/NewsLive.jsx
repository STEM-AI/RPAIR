

import React, { useEffect, useState } from "react";
import { NavHashLink } from "react-router-hash-link";

const NewsTicker = () => {
  const [news, setNews] = useState("Loading news...");

  // useEffect(() => {
   

  //   let socket;
  //   let reconnectInterval = 5000;

  //   const connectWebSocket = () => {
  //     socket = new WebSocket(`${process.env.REACT_APP_API_URL}/ws/news/`);

  //     socket.onmessage = (event) => {
  //       const data = JSON.parse(event.data);
  //       setNews(data.message);
  //     };

  //     socket.onerror = (error) => {
  //       console.error("WebSocket error:", error);
  //     };

  //     socket.onclose = () => {
  //       console.log("WebSocket connection closed, retrying...");
  //       setTimeout(connectWebSocket, reconnectInterval);
  //     };
  //   };

  //   connectWebSocket();

  //   return () => {
  //     if (socket) {
  //       socket.close();
  //     }
  //   };
  // });

  useEffect(() => {
    const fetchLatestNews = async () => {

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/admin/news/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        const latestNews = data[0]?.content || "No news available.";
        setNews(latestNews);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews("Failed to load news.");
      }
    };

    fetchLatestNews();
  });

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
