import React, { useState, useEffect, useRef } from "react";
import LapContainer from "./LapContainer";

const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState({ ms: 0, s: 0, m: 0, h: 0 });
  const laps = useRef([]);
  const [currentNewTime, setCurrentNewTime] = useState({
    ms: 0,
    s: 0,
    m: 0,
    h: 0,
  });
  const [disableReset, setDisableReset] = useState(true);
  const [transitionActive, setTransitionActive] = useState(false);
  const [isBestTime, setIsBestTime] = useState(false);
  const [isWorstTime, setIsWorstTime] = useState(false);

  // Start/Stop Watch Function
  const startWatch = () => {
    setIsRunning((prev) => !prev);
    setDisableReset(false);
  };

  // Record Lap Function
  const recordLap = () => {
    let lastLapTime =
      laps.current.length > 0
        ? laps.current[0].totalTime
        : { ms: 0, s: 0, m: 0, h: 0 };

    let newLapTime = {
      ms: time.ms - lastLapTime.ms,
      s: time.s - lastLapTime.s,
      m: time.m - lastLapTime.m,
      h: time.h - lastLapTime.h,
    };

    // Adjust for negative time differences
    if (newLapTime.ms < 0) {
      newLapTime.ms += 100;
      newLapTime.s--;
    }
    if (newLapTime.s < 0) {
      newLapTime.s += 60;
      newLapTime.m--;
    }
    if (newLapTime.m < 0) {
      newLapTime.m += 60;
      newLapTime.h--;
    }

    laps.current.unshift({ totalTime: { ...time }, newLapTime });
    setCurrentNewTime(newLapTime);
    console.log("bbbbbbbbbbbbb", newLapTime);
    setTransitionActive(true);
    setTimeout(() => setTransitionActive(false), 500);
  };

  // Reset Stopwatch Function
  const resetWatch = () => {
    setTime({ ms: 0, s: 0, m: 0, h: 0 });
    setIsRunning(false);
    laps.current = [];
    setCurrentNewTime({ ms: 0, s: 0, m: 0, h: 0 });
    setDisableReset(true);
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          let { ms, s, m, h } = prevTime;
          ms++;
          if (ms === 100) {
            ms = 0;
            s++;
          }
          if (s === 60) {
            s = 0;
            m++;
          }
          if (m === 60) {
            m = 0;
            h++;
          }
          return { ms, s, m, h };
        });

        // Update current lap time
        if (laps.current.length > 0) {
          const lastLapTime = laps.current[0].totalTime;
          let updatedNewTime = {
            ms: time.ms - lastLapTime.ms,
            s: time.s - lastLapTime.s,
            m: time.m - lastLapTime.m,
            h: time.h - lastLapTime.h,
          };

          // Adjust for negative time differences
          if (updatedNewTime.ms < 0) {
            updatedNewTime.ms += 100;
            updatedNewTime.s--;
          }
          if (updatedNewTime.s < 0) {
            updatedNewTime.s += 60;
            updatedNewTime.m--;
          }
          if (updatedNewTime.m < 0) {
            updatedNewTime.m += 60;
            updatedNewTime.h--;
          }
          setCurrentNewTime(updatedNewTime);
        }
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, time]);

  console.log("xxxx", currentNewTime);
  console.log("pppp", time);

  return (
    <div className="stopwatch-container">
      <div className="overlay"></div>
      <div className="stopwatch bg-white px-5 py-4 rounded-2xl shadow-lg z-10  md:px-10 md:py-8">
        <h1 className="stopwatch-title text-center text-sm  mb-2 md:mb-4 sm:text-lg md:text-xl ">
          Online Stopwatch With Laps
        </h1>
        <div className="stopwatch-display z-10 flex justify-center gap-1 mb-2 md:mb-4 text-3xl font-semibold sm:text-5xl md:text-6xl ">
          <span className="stopwatch-display-hours">
            {time.h < 10 ? "0" : ""}
            {time.h}
          </span>
          :
          <span className="stopwatch-display-minutes">
            {time.m < 10 ? "0" : ""}
            {time.m}
          </span>
          :
          <span className="stopwatch-display-seconds">
            {time.s < 10 ? "0" : ""}
            {time.s}
          </span>
          ,
          <span className="stopwatch-display-ms">
            {time.ms < 10 ? "0" : ""}
            {time.ms}
          </span>
        </div>
        <div className="stopwatch-controls flex items-center justify-center gap-2 sm:gap-4 md:gap-8">
          <button
            className={
              isRunning
                ? "stopwatch-button lap-btn"
                : disableReset
                ? "stopwatch-button2 disabled-btn"
                : "stopwatch-button reset-btn"
            }
            onClick={isRunning ? recordLap : resetWatch}
          >
            {isRunning ? "Lap" : "Reset"}
          </button>
          <button
            className={
              isRunning
                ? "stopwatch-button stop-btn"
                : "stopwatch-button start-btn"
            }
            onClick={startWatch}
          >
            {isRunning ? "Stop" : "Start"}
          </button>
        </div>
        <span className="separator block h-[1px] bg-gray-600 mt-4 mb-2 mx-1"></span>
        <div className="laps-table-title flex justify-between items-center text-xs sm:text-sm md:text-lg font-semibold px-2 md:px-4">
          <span className="lap-number ">Lap</span>
          <span className="lap-new-time">New Time</span>
          <span className="lap-total-time whitespace-nowrap">Total Time</span>
        </div>
        <div className="stopwatch-laps-container stopwatch-laps overflow-auto h-32 md:h-36 lg:h-40  px-2 md:px-4 py-1 md:py-1 text-xs sm:text-sm md:text-lg">
          <div
            className={`stopwatch-laps mb-1 md:mb-0 flex items-stretch justify-between ${
              transitionActive ? "lap-transition-active" : "lap-transition"
            }`}
          >
            <span className="lap-number ">Lap {laps.current.length + 1}</span>
            <span className="lap-new-time  ">
              {currentNewTime.ms === 0 &&
              currentNewTime.s === 0 &&
              currentNewTime.m === 0 &&
              currentNewTime.h === 0 ? (
                <>
                  <span className="lap-new-time-hours">
                    {time.h < 10 ? "0" : ""}
                    {time.h}
                  </span>
                  :
                  <span className="lap-new-time-minutes">
                    {time.m < 10 ? "0" : ""}
                    {time.m}
                  </span>
                  :
                  <span className="lap-new-time-seconds">
                    {time.s < 10 ? "0" : ""}
                    {time.s}
                  </span>
                  ,
                  <span className="lap-new-time-ms">
                    {time.ms < 10 ? "0" : ""}
                    {time.ms}
                  </span>
                </>
              ) : (
                <>
                  <span className="lap-new-time-hours">
                    {currentNewTime.h < 10 ? "0" : ""}
                    {currentNewTime.h}
                  </span>
                  :
                  <span className="lap-new-time-minutes">
                    {currentNewTime.m < 10 ? "0" : ""}
                    {currentNewTime.m}
                  </span>
                  :
                  <span className="lap-new-time-seconds">
                    {currentNewTime.s < 10 ? "0" : ""}
                    {currentNewTime.s}
                  </span>
                  ,
                  <span className="lap-new-time-ms">
                    {currentNewTime.ms < 10 ? "0" : ""}
                    {currentNewTime.ms}
                  </span>
                </>
              )}
            </span>

            <span className="lap-total-time">
              <span className="lap-total-time-hours">
                {time.h < 10 ? "0" : ""}
                {time.h}
              </span>
              :
              <span className="lap-total-time-minutes">
                {time.m < 10 ? "0" : ""}
                {time.m}
              </span>
              :
              <span className="lap-total-time-seconds">
                {time.s < 10 ? "0" : ""}
                {time.s}
              </span>
              ,
              <span className="lap-total-time-ms">
                {time.ms < 10 ? "0" : ""}
                {time.ms}
              </span>
            </span>
          </div>
          <LapContainer laps={laps.current} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;
