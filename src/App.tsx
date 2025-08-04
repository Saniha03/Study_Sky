import React, { useState } from "react";
import { StudyLog, Task, WeeklyTasks } from "./types/types";
import StudyTimer from "./components/timer";
import TaskManager from "./components/taskmanager";
import WeeklyPlanning from "./components/weeklyplanning";
import MonthlyTargets from "./components/monthlyplanning";
import Statistics from "./components/statistics";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("timer");
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTasks>({});

  const handleStudyLogsUpdate = (logs: StudyLog[]) => {
    setStudyLogs(logs);
  };

  const handleTasksUpdate = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const handleWeeklyTasksUpdate = (newWeeklyTasks: WeeklyTasks) => {
    setWeeklyTasks(newWeeklyTasks);
  };

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen sky-gradient"
      style={{
        background:
          "linear-gradient(135deg, #6ad3f2 0%, #b8e6f9 50%, #6ad3f2 100%)",
      }}
    >
      {/* Desktop Navigation Sidebar */}
      <nav
        className="hidden md:block w-64 glass-effect p-6 space-y-4"
        style={{
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <h1 className="heading-font text-2xl font-bold pink-accent text-center mb-8">
          <i className="fas fa-cloud-sun mr-2 pink-accent"></i>Study Sky
        </h1>
        {[
          { tab: "timer", icon: "fa-clock", label: "Timer" },
          { tab: "tasks", icon: "fa-tasks", label: "Daily Tasks" },
          { tab: "weekly", icon: "fa-calendar-week", label: "Weekly Planning" },
          { tab: "targets", icon: "fa-bullseye", label: "Monthly Targets" },
          { tab: "stats", icon: "fa-chart-bar", label: "Statistics" },
        ].map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors duration-200 ${
              activeTab === tab
                ? "sky-blue-bg pink-accent"
                : "pink-accent hover:bg-white/10"
            }`}
          >
            <i className={`fas ${icon} mr-3 pink-accent`}></i>
            {label}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main
        className="flex-1 p-4 md:p-8 cloud-bg"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      >
        {activeTab === "timer" && (
          <StudyTimer onStudyLogsUpdate={handleStudyLogsUpdate} />
        )}
        {activeTab === "tasks" && (
          <TaskManager onTasksUpdate={handleTasksUpdate} />
        )}
        {activeTab === "weekly" && (
          <WeeklyPlanning onWeeklyTasksUpdate={handleWeeklyTasksUpdate} />
        )}
        {activeTab === "targets" && <MonthlyTargets />}
        {activeTab === "stats" && (
          <Statistics
            studyLogs={studyLogs}
            tasks={tasks}
            weeklyTasks={weeklyTasks}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 glass-effect p-4 flex justify-around items-center"
        style={{
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {[
          { tab: "timer", icon: "fa-clock", title: "Timer" },
          { tab: "tasks", icon: "fa-tasks", title: "Daily Tasks" },
          { tab: "weekly", icon: "fa-calendar-week", title: "Weekly Planning" },
          { tab: "targets", icon: "fa-bullseye", title: "Monthly Targets" },
          { tab: "stats", icon: "fa-chart-bar", title: "Statistics" },
        ].map(({ tab, icon, title }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg flex items-center transition-colors duration-200 ${
              activeTab === tab
                ? "sky-blue-bg pink-accent"
                : "pink-accent hover:bg-white/10"
            }`}
            title={title}
          >
            <i className={`fas ${icon} text-lg pink-accent`}></i>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
