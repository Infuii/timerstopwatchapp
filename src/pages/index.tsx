import { NextPage } from "next";
import { useState, useEffect } from "react";

const Home: NextPage = () => {
  const [time, setTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [pausedTimes, setPausedTimes] = useState<{ time: string; difference: number }[]>([]);
  const [previousTime, setPreviousTime] = useState<number>(0);
  let formatter = time
    ? `${Math.floor(time / 3600)
        .toString()
        .padStart(2, "0")}:${Math.floor((time % 3600) / 60)
        .toString()
        .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`
    : "00:00:00";

  useEffect(() => {
    let interval: string | number | NodeJS.Timer | undefined;
    let interval2: string | number | NodeJS.Timer | undefined;

    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
        setCount((count) => {
          if (count >= 99) {
            return 0;
          } else {
            return count + 1;
          }
        });
      }, 16.66);
    } else {
      clearInterval(interval2);
    }

    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
  }, [isActive]);

  useEffect(() => {
    if (time % 1 === 0) {
      setCount(0);
    }
  }, [time]);

  const handlePause = () => {
    setIsActive(false);
    setPreviousTime(time);
    const difference = time - previousTime;
    console.log(pausedTimes, time, previousTime)
    setPausedTimes((pausedTimes) => [...pausedTimes, { time: formatter, difference }]);
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
    setCount(0);
    setPausedTimes([]);
    setPreviousTime(0);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <title>{formatter}</title>
      <h1 className="mb-8 text-4xl font-bold">React Stopwatch</h1>
      <div className="mb-6 text-6xl font-extrabold text-blue-500">
        {isActive ? formatter : pausedTimes.length > 0 ? pausedTimes[pausedTimes.length - 1].time : formatter}
      </div>

      <div className="mb-6 text-3xl font-bold text-gray-500">{count}</div>
      <div className="mb-8 flex justify-center">
        {!isActive && (
          <button
            className="mr-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
            onClick={handleStart}
          >
            Start
          </button>
        )}
        {isActive && (
          <button
            className="mr-4 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
            onClick={handlePause}
          >
            Pause
          </button>
        )}
        <button
          className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      {pausedTimes.map((pausedTime, index) => (
        <div
          key={index}
          className="mb-6 text-center text-2xl font-bold text-gray-500"
        >
          #{index + 1} &times; {pausedTime.time}
          <br />
          {index > 0 && (
            <span className="text-gray-400">
              {Math.floor((pausedTime.difference / 3600) % 60)
                .toString()
                .padStart(2, "0")}
              :
              {Math.floor((pausedTime.difference % 3600) / 60)
                .toString()
                .padStart(2, "0")}
              :{(pausedTime.difference % 60).toString().padStart(2, "0")}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;