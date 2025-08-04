import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { StudyLog, Task, WeeklyTasks } from "../types/types";

Chart.register(...registerables);

interface StatisticsProps {
  studyLogs: StudyLog[];
  tasks: Task[];
  weeklyTasks: WeeklyTasks;
}

const Statistics: React.FC<StatisticsProps> = ({
  studyLogs,
  tasks,
  weeklyTasks,
}) => {
  const weeklyChartRef = useRef<Chart | null>(null);
  const monthlyChartRef = useRef<Chart | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    // Weekly Chart
    const getWeekDates = () => {
      const date = new Date(selectedWeek);
      const currentDay = date.getDay();
      const monday = new Date(date);
      monday.setDate(date.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d.toISOString().split("T")[0];
      });
    };

    const weekDates = getWeekDates();
    const weeklyData = weekDates.map((date) => {
      const hours = studyLogs
        .filter((log) => log.date === date)
        .reduce((sum, log) => sum + log.hours, 0);
      return hours;
    });

    if (weeklyChartRef.current) {
      weeklyChartRef.current.destroy();
    }

    const ctxWeekly = (
      document.getElementById("weeklyChart") as HTMLCanvasElement
    ).getContext("2d");
    if (ctxWeekly) {
      weeklyChartRef.current = new Chart(ctxWeekly, {
        type: "bar",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Study Hours",
              data: weeklyData,
              backgroundColor: "#6ad3f2",
              borderColor: "#f672e4",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Hours",
                color: "#f672e4",
              },
              ticks: { color: "#f672e4" },
            },
            x: {
              ticks: { color: "#f672e4" },
            },
          },
          plugins: {
            legend: {
              labels: { color: "#f672e4" },
            },
          },
        },
      });
    }

    // Monthly Chart
    const getMonthDates = () => {
      const [year, month] = selectedMonth.split("-");
      const daysInMonth = new Date(
        parseInt(year),
        parseInt(month),
        0
      ).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(parseInt(year), parseInt(month) - 1, i + 1);
        return d.toISOString().split("T")[0];
      });
    };

    const monthDates = getMonthDates();
    const monthlyData = monthDates.map((date) => {
      const hours = studyLogs
        .filter((log) => log.date === date)
        .reduce((sum, log) => sum + log.hours, 0);
      return hours;
    });

    if (monthlyChartRef.current) {
      monthlyChartRef.current.destroy();
    }

    const ctxMonthly = (
      document.getElementById("monthlyChart") as HTMLCanvasElement
    ).getContext("2d");
    if (ctxMonthly) {
      monthlyChartRef.current = new Chart(ctxMonthly, {
        type: "line",
        data: {
          labels: monthDates.map((_, i) => i + 1),
          datasets: [
            {
              label: "Study Hours",
              data: monthlyData,
              backgroundColor: "#f672e4",
              borderColor: "#6ad3f2",
              fill: false,
              tension: 0.3,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Hours",
                color: "#f672e4",
              },
              ticks: { color: "#f672e4" },
            },
            x: {
              title: {
                display: true,
                text: "Day of Month",
                color: "#f672e4",
              },
              ticks: { color: "#f672e4" },
            },
          },
          plugins: {
            legend: {
              labels: { color: "#f672e4" },
            },
          },
        },
      });
    }

    return () => {
      if (weeklyChartRef.current) weeklyChartRef.current.destroy();
      if (monthlyChartRef.current) monthlyChartRef.current.destroy();
    };
  }, [studyLogs, selectedWeek, selectedMonth]);

  return (
    <div className="space-y-6 p-4">
      <div className="text-center mb-8">
        <h2 className="heading-font text-3xl font-bold pink-accent mb-2">
          <i className="fas fa-chart-bar mr-3 pink-accent"></i>Statistics
        </h2>
        <div className="flex justify-center space-x-4 mb-4">
          <i className="fas fa-star twinkling text-yellow-300 text-lg"></i>
          <i className="fas fa-cloud floating text-white/50 text-2xl"></i>
          <i className="fas fa-star twinkling text-yellow-300 text-lg"></i>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="heading-font text-xl font-bold pink-accent mb-4">
          <i className="fas fa-calendar-week mr-2 pink-accent"></i>Weekly Study
          Hours
        </h3>
        <input
          type="date"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="w-full md:w-1/3 input-glow mb-4"
        />
        <canvas id="weeklyChart" className="max-h-64"></canvas>
      </div>

      {/* Monthly Stats */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="heading-font text-xl font-bold pink-accent mb-4">
          <i className="fas fa-calendar-alt mr-2 pink-accent"></i>Monthly Study
          Hours
        </h3>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full md:w-1/3 input-glow mb-4"
        />
        <canvas id="monthlyChart" className="max-h-64"></canvas>
      </div>
    </div>
  );
};

export default Statistics;
