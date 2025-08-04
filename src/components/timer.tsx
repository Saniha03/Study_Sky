import React, { useState, useEffect, useRef } from "react";
import { StudyLog } from "../types/types";

interface StudyTimerProps {
  onStudyLogsUpdate: (logs: StudyLog[]) => void;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onStudyLogsUpdate }) => {
  const [customMinutes, setCustomMinutes] = useState<number>(25);
  const [pomodoroMinutes, setPomodoroMinutes] = useState<number>(25);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  const [currentTimer, setCurrentTimer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timerType, setTimerType] = useState<string>("custom");
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
  const [logHours, setLogHours] = useState<string>("");
  const [logSubject, setLogSubject] = useState<string>("");
  const [logDate, setLogDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (timerType === "pomodoro") {
      if (!isBreak) {
        setPomodoroCount((prev) => prev + 1);
        setIsBreak(true);
        setTimeLeft(breakMinutes * 60);
      } else {
        setIsBreak(false);
        setTimeLeft(pomodoroMinutes * 60);
      }
    }
  };

  const startTimer = (type: string) => {
    setTimerType(type);
    if (type === "custom") {
      setTimeLeft(customMinutes * 60);
    } else {
      setTimeLeft(pomodoroMinutes * 60);
      setIsBreak(false);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsBreak(false);
  };

  const addStudyLog = () => {
    if (logHours && logSubject && logDate) {
      const newLog: StudyLog = {
        id: Date.now(),
        date: logDate,
        hours: parseFloat(logHours),
        subject: logSubject,
      };
      const updatedLogs = [...studyLogs, newLog];
      setStudyLogs(updatedLogs);
      onStudyLogsUpdate(updatedLogs);
      setLogHours("");
      setLogSubject("");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="text-center mb-8">
        <h2 className="heading-font text-3xl font-bold pink-accent mb-2">
          <i className="fas fa-clock mr-3 pink-accent"></i>Study Timer
        </h2>
        <div className="flex justify-center space-x-4 mb-4">
          <i className="fas fa-star twinkling text-yellow-300 text-lg"></i>
          <i className="fas fa-moon twinkling text-yellow-200 text-lg"></i>
          <i className="fas fa-star twinkling text-yellow-300 text-lg"></i>
        </div>
      </div>

      {/* Timer Display */}
      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="text-6xl font-bold pink-accent mb-4 accent-font">
          {formatTime(timeLeft)}
        </div>
        {timerType === "pomodoro" && (
          <div className="text-lg mb-4">
            <span
              className={`px-3 py-1 rounded-full ${
                isBreak ? "pink-bg" : "sky-blue-bg"
              } pink-accent`}
            >
              {isBreak ? "Break Time" : "Study Time"} | Pomodoros:{" "}
              {pomodoroCount}
            </span>
          </div>
        )}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => startTimer("custom")}
            disabled={isRunning}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
          >
            <i className="fas fa-play mr-2"></i>Start Custom
          </button>
          <button
            onClick={() => startTimer("pomodoro")}
            disabled={isRunning}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            <i className="fas fa-play mr-2"></i>Start Pomodoro
          </button>
          <button
            onClick={pauseTimer}
            disabled={!isRunning}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg disabled:opacity-50"
          >
            <i className="fas fa-pause mr-2"></i>Pause
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            <i className="fas fa-stop mr-2"></i>Reset
          </button>
        </div>
      </div>

      {/* Timer Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="heading-font text-xl font-bold pink-accent mb-4">
            <i className="fas fa-cog mr-2 pink-accent"></i>Custom Timer
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block pink-accent mb-2">Minutes:</label>
              <input
                type="number"
                value={customMinutes}
                onChange={(e) =>
                  setCustomMinutes(parseInt(e.target.value) || 0)
                }
                className="w-full input-glow"
                min="1"
                max="180"
              />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="heading-font text-xl font-bold pink-accent mb-4">
            <i className="fas fa-tomato mr-2 pink-accent"></i>Pomodoro Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block pink-accent mb-2">Study Minutes:</label>
              <input
                type="number"
                value={pomodoroMinutes}
                onChange={(e) =>
                  setPomodoroMinutes(parseInt(e.target.value) || 25)
                }
                className="w-full input-glow"
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="block pink-accent mb-2">Break Minutes:</label>
              <input
                type="number"
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(parseInt(e.target.value) || 5)}
                className="w-full input-glow"
                min="1"
                max="30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Manual Study Log */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="heading-font text-xl font-bold pink-accent mb-4">
          <i className="fas fa-pencil-alt mr-2 pink-accent"></i>Manual Study Log
        </h3>
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block pink-accent mb-2">Date:</label>
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full input-glow"
            />
          </div>
          <div>
            <label className="block pink-accent mb-2">Hours:</label>
            <input
              type="number"
              step="0.25"
              value={logHours}
              onChange={(e) => setLogHours(e.target.value)}
              className="w-full input-glow"
              placeholder="e.g., 2.5"
            />
          </div>
          <div>
            <label className="block pink-accent mb-2">Subject:</label>
            <input
              type="text"
              value={logSubject}
              onChange={(e) => setLogSubject(e.target.value)}
              className="w-full input-glow"
              placeholder="Subject/Task"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addStudyLog}
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              <i className="fas fa-plus mr-2"></i>Add Log
            </button>
          </div>
        </div>

        {/* Study Logs Display */}
        {studyLogs.length > 0 && (
          <div className="mt-6">
            <h4 className="pink-accent font-semibold mb-3">
              Recent Study Logs:
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {studyLogs
                .slice(-5)
                .reverse()
                .map((log) => (
                  <div key={log.id} className="bg-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-center pink-accent">
                      <span>{log.date}</span>
                      <span>
                        {log.hours}h - {log.subject}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTimer;
