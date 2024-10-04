import React from "react";

const LapContainer = (props) => {
  const bestLapIndex = props.laps.reduce((bestLapIndex, lap, index, array) => {
    const bestTime = array[bestLapIndex]?.newLapTime || {};
    const currentTime = lap.newLapTime || {};
    const bestTotalTime =
      bestTime.h * 360000 + bestTime.m * 6000 + bestTime.s * 100 + bestTime.ms;
    const currentTotalTime =
      currentTime.h * 360000 +
      currentTime.m * 6000 +
      currentTime.s * 100 +
      currentTime.ms;

    return currentTotalTime < bestTotalTime ? index : bestLapIndex;
  }, 0);
  const worstLapIndex = props.laps.reduce((worstIndex, lap, index, array) => {
    const worstTime = array[worstIndex]?.newLapTime || {};
    const currentTime = lap.newLapTime || {};

    const worstTotalTime =
      worstTime.h * 360000 +
      worstTime.m * 6000 +
      worstTime.s * 100 +
      worstTime.ms;
    const currentTotalTime =
      currentTime.h * 360000 +
      currentTime.m * 6000 +
      currentTime.s * 100 +
      currentTime.ms;

    return currentTotalTime > worstTotalTime ? index : worstIndex;
  }, 0);

  const content = props.laps.map((lap, index) => {
    const isBestLap = index === bestLapIndex;
    const isWorstLap = index === worstLapIndex;
    return (
      <div
        key={index}
        className={`stopwatch-laps mb-1 md:mb-0 flex items-stretch justify-between ${
          isBestLap ? "text-green-500" : isWorstLap ? "text-red-500" : ""
        }`}
        style={{ transition: "all 0s" }}
      >
        <span className="lap-number">Lap {props.laps.length - index}</span>
        <span className="lap-new-time ">
          <span className="lap-new-time-hours">
            {lap.newLapTime.h < 10 ? "0" : ""}
            {lap.newLapTime.h}
          </span>
          :
          <span className="lap-new-time-minutes">
            {lap.newLapTime.m < 10 ? "0" : ""}
            {lap.newLapTime.m}
          </span>
          :
          <span className="lap-new-time-seconds">
            {lap.newLapTime.s < 10 ? "0" : ""}
            {lap.newLapTime.s}
          </span>
          ,
          <span className="lap-new-time-ms">
            {lap.newLapTime.ms < 10 ? "0" : ""}
            {lap.newLapTime.ms}
          </span>
        </span>
        <span className="lap-total-time ">
          <span className="lap-total-time-hours">
            {lap.totalTime.h < 10 ? "0" : ""}
            {lap.totalTime.h}
          </span>
          :
          <span className="lap-total-time-minutes">
            {lap.totalTime.m < 10 ? "0" : ""}
            {lap.totalTime.m}
          </span>
          :
          <span className="lap-total-time-seconds">
            {lap.totalTime.s < 10 ? "0" : ""}
            {lap.totalTime.s}
          </span>
          ,
          <span className="lap-total-time-ms">
            {lap.totalTime.ms < 10 ? "0" : ""}
            {lap.totalTime.ms}
          </span>
        </span>
      </div>
    );
  });

  return (
    <>
      {props.laps.length === 0 ? (
        <span className="text-gray-900"></span>
      ) : (
        content
      )}
    </>
  );
};

export default LapContainer;
