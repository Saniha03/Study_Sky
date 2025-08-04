import React, { useState } from "react";
import { Task } from "../types/types";

interface TaskManagerProps {
  onTasksUpdate: (tasks: Task[]) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ onTasksUpdate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        priority: taskPriority,
        date: new Date().toISOString().split("T")[0],
      };
      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      onTasksUpdate(updatedTasks);
      setNewTask("");
    }
  };

  const toggleTask = (id: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    onTasksUpdate(updatedTasks);
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    onTasksUpdate(updatedTasks);
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter((task) => task.date === today);

  return (
    <div className="space-y-6 p-4">
      <div className="text-center mb-8">
        <h2 className="heading-font text-3xl font-bold pink-accent mb-2">
          <i className="fas fa-tasks mr-3 pink-accent"></i>Daily Tasks
        </h2>
        <div className="flex justify-center space-x-4 mb-4">
          <i className="fas fa-cloud floating text-white/50 text-2xl"></i>
          <i
            className="fas fa-cloud floating text-white/30 text-xl"
            style={{ animationDelay: "1s" }}
          ></i>
          <i
            className="fas fa-cloud floating text-white/50 text-2xl"
            style={{ animationDelay: "2s" }}
          ></i>
        </div>
      </div>

      {/* Add New Task */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="heading-font text-xl font-bold pink-accent mb-4">
          <i className="fas fa-plus mr-2 pink-accent"></i>Add New Task
        </h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            className="flex-1 input-glow"
            placeholder="What do you need to study today?"
          />
          <select
            value={taskPriority}
            onChange={(e) =>
              setTaskPriority(e.target.value as "low" | "medium" | "high")
            }
            className="px-4 py-3 input-glow"
          >
            <option value="low" className="text-black">
              Low Priority
            </option>
            <option value="medium" className="text-black">
              Medium Priority
            </option>
            <option value="high" className="text-black">
              High Priority
            </option>
          </select>
          <button
            onClick={addTask}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="heading-font text-xl font-bold pink-accent mb-4">
          <i className="fas fa-calendar-day mr-2 pink-accent"></i>Today's Tasks
          ({todayTasks.length})
        </h3>

        {todayTasks.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-clipboard-list text-white/50 text-4xl mb-4"></i>
            <p className="pink-accent">
              No tasks for today. Add some tasks to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/10 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleTask(task.id)}
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
                  <div
                    className={`w-3 h-3 rounded-full ${getPriorityColor(
                      task.priority
                    )}`}
                  ></div>
                  <span
                    className={`pink-accent ${
                      task.completed ? "line-through opacity-60" : ""
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-400 hover:text-red-300 px-2 py-1"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Task Summary */}
        {todayTasks.length > 0 && (
          <div className="mt-6 bg-white/10 rounded-lg p-4">
            <div className="flex justify-between pink-accent">
              <span>Progress:</span>
              <span>
                {todayTasks.filter((t) => t.completed).length} /{" "}
                {todayTasks.length} completed
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
              <div
                className="pink-bg h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (todayTasks.filter((t) => t.completed).length /
                      todayTasks.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
