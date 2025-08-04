import React, { useState } from "react";
import { WeeklyTasks } from "../types/types";

interface WeeklyPlanningProps {
  onWeeklyTasksUpdate: (weeklyTasks: WeeklyTasks) => void;
}

const WeeklyPlanning: React.FC<WeeklyPlanningProps> = ({
  onWeeklyTasksUpdate,
}) => {
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTasks>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [newWeeklyTask, setNewWeeklyTask] = useState<string>("");

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    return daysOfWeek.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        day,
        date: date.toISOString().split("T")[0],
        displayDate: date.toLocaleDateString(),
      };
    });
  };

  const weekDates = getCurrentWeekDates();

  const addWeeklyTask = (dayDate: string) => {
    if (newWeeklyTask.trim()) {
      const task = {
        id: Date.now(),
        text: newWeeklyTask.trim(),
        completed: false,
      };
      const updatedTasks = {
        ...weeklyTasks,
        [dayDate]: [...(weeklyTasks[dayDate] || []), task],
      };
      setWeeklyTasks(updatedTasks);
      onWeeklyTasksUpdate(updatedTasks);
      setNewWeeklyTask("");
    }
  };

  const toggleWeeklyTask = (dayDate: string, taskId: number) => {
    const updatedTasks = {
      ...weeklyTasks,
      [dayDate]: (weeklyTasks[dayDate] || []).map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    };
    setWeeklyTasks(updatedTasks);
    onWeeklyTasksUpdate(updatedTasks);
  };

  const deleteWeeklyTask = (dayDate: string, taskId: number) => {
    const updatedTasks = {
      ...weeklyTasks,
      [dayDate]: (weeklyTasks[dayDate] || []).filter(
        (task) => task.id !== taskId
      ),
    };
    setWeeklyTasks(updatedTasks);
    onWeeklyTasksUpdate(updatedTasks);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="text-center mb-8">
        <h2 className="heading-font text-3xl font-bold pink-accent mb-2">
          <i className="fas fa-calendar-week mr-3 pink-accent"></i>Weekly
          Planning
        </h2>
        <div className="flex justify-center space-x-2 mb-4">
          {[...Array(7)].map((_, i) => (
            <i
              key={i}
              className="fas fa-star twinkling text-yellow-300 text-sm"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></i>
          ))}
        </div>
      </div>

      {/* Week Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {weekDates.map(({ day, date, displayDate }) => {
          const dayTasks = weeklyTasks[date] || [];
          const completedTasks = dayTasks.filter((t) => t.completed).length;
          const isToday = date === new Date().toISOString().split("T")[0];

          return (
            <div
              key={date}
              className={`glass-effect rounded-xl p-4 cursor-pointer transition-all hover:scale-105
                ${isToday ? "ring-2 ring-yellow-400" : ""}
                ${selectedDay === date ? "ring-2 ring-pink-400" : ""}`}
              onClick={() => setSelectedDay(selectedDay === date ? null : date)}
            >
              <div className="text-center">
                <h3 className="heading-font text-lg font-bold pink-accent mb-1">
                  {day}
                </h3>
                <p className="pink-accent/70 text-sm mb-3">{displayDate}</p>

                {isToday && (
                  <div className="text-yellow-400 mb-2">
                    <i className="fas fa-sun"></i> Today
                  </div>
                )}

                <div className="pink-accent text-sm">
                  <i className="fas fa-tasks mr-1"></i>
                  {completedTasks}/{dayTasks.length} tasks
                </div>

                {dayTasks.length > 0 && (
                  <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                    <div
                      className="pink-bg h-1 rounded-full transition-all duration-300"
                      style={{
                        width: `${(completedTasks / dayTasks.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="heading-font text-2xl font-bold pink-accent">
              <i className="fas fa-calendar-day mr-2 pink-accent"></i>
              {weekDates.find((d) => d.date === selectedDay)?.day} -{" "}
              {weekDates.find((d) => d.date === selectedDay)?.displayDate}
            </h3>
            <button
              onClick={() => setSelectedDay(null)}
              className="pink-accent/70 hover:pink-accent"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {/* Add Task for Selected Day */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={newWeeklyTask}
              onChange={(e) => setNewWeeklyTask(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && addWeeklyTask(selectedDay)
              }
              className="flex-1 input-glow"
              placeholder="Add a task for this day..."
            />
            <button
              onClick={() => addWeeklyTask(selectedDay)}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>

          {/* Tasks for Selected Day */}
          <div className="space-y-3">
            {(weeklyTasks[selectedDay] || []).length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-clipboard-list text-white/50 text-4xl mb-4"></i>
                <p className="pink-accent">
                  No tasks for this day. Add some tasks to get started!
                </p>
              </div>
            ) : (
              (weeklyTasks[selectedDay] || []).map((task) => (
                <div
                  key={task.id}
                  className="bg-white/10 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleWeeklyTask(selectedDay, task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${
                          task.completed
                            ? "bg-green-500 border-green-500"
                            : "border-white/50 hover:border-white"
                        }`}
                    >
                      {task.completed && (
                        <i className="fas fa-check text-white text-xs"></i>
                      )}
                    </button>
                    <span
                      className={`pink-accent ${
                        task.completed ? "line-through opacity-60" : ""
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteWeeklyTask(selectedDay, task.id)}
                    className="text-red-400 hover:text-red-300 px-2 py-1"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlanning;
