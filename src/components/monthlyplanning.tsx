import React, { useState } from "react";
import { MonthlyTarget } from "../types/types";

const MonthlyTargets: React.FC = () => {
  const [targets, setTargets] = useState<MonthlyTarget[]>([]);
  const [newTarget, setNewTarget] = useState<string>("");
  const [targetHours, setTargetHours] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  const addTarget = () => {
    if (newTarget.trim() && targetHours && selectedMonth) {
      const target: MonthlyTarget = {
        id: Date.now(),
        text: newTarget.trim(),
        hours: parseFloat(targetHours),
        month: selectedMonth,
        completed: false,
      };
      setTargets((prev) => [...prev, target]);
      setNewTarget("");
      setTargetHours("");
    }
  };

  const toggleTarget = (id: number) => {
    setTargets((prev) =>
      prev.map((target) =>
        target.id === id ? { ...target, completed: !target.completed } : target
      )
    );
  };

  const deleteTarget = (id: number) => {
    setTargets((prev) => prev.filter((target) => target.id !== id));
  };

  const currentMonthTargets = targets.filter(
    (target) => target.month === selectedMonth
  );

  return (
    <div className="space-y-6 p-4">
      <div className="text-center mb-8">
        <h2 className="heading-font text-3xl font-bold pink-accent mb-2">
          <i className="fas fa-bullseye mr-3 pink-accent"></i>Monthly Targets
        </h2>
        <div className="flex justify-center space-x-4 mb-4">
          <i className="fas fa-cloud-moon floating text-white/50 text-2xl"></i>
          <i className="fas fa-star twinkling text-yellow-300 text-lg"></i>
          <i
            className="fas fa-cloud-moon floating text-white/50 text-2xl"
            style={{ animationDelay: "1s" }}
          ></i>
        </div>
      </div>

      {/* Month Selector */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="heading-font text-xl font-bold pink-accent mb-4">
          <i className="fas fa-calendar mr-2 pink-accent"></i>Select Month
        </h3>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full md:w-1/3 input-glow"
        />
      </div>

      {/* Add New Target */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="heading-font text-xl font-bold pink-accent mb-4">
          <i className="fas fa-plus mr-2 pink-accent"></i>Add New Target
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block pink-accent mb-2">Target:</label>
            <input
              type="text"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTarget()}
              className="w-full input-glow"
              placeholder="e.g., Complete Math Book"
            />
          </div>
          <div>
            <label className="block pink-accent mb-2">Hours:</label>
            <input
              type="number"
              step="0.5"
              value={targetHours}
              onChange={(e) => setTargetHours(e.target.value)}
              className="w-full input-glow"
              placeholder="e.g., 20"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addTarget}
              className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              <i className="fas fa-plus mr-2"></i>Add Target
            </button>
          </div>
        </div>
      </div>

      {/* Current Month Targets */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="heading-font text-xl font-bold pink-accent mb-4">
          <i className="fas fa-bullseye mr-2 pink-accent"></i>Targets for{" "}
          {new Date(selectedMonth + "-01").toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        {currentMonthTargets.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-bullseye text-white/50 text-4xl mb-4"></i>
            <p className="pink-accent">
              No targets set for this month. Add some to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentMonthTargets.map((target) => (
              <div
                key={target.id}
                className="bg-white/10 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleTarget(target.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${
                        target.completed
                          ? "bg-green-500 border-green-500"
                          : "border-white/50 hover:border-white"
                      }`}
                  >
                    {target.completed && (
                      <i className="fas fa-check text-white text-xs"></i>
                    )}
                  </button>
                  <span
                    className={`pink-accent ${
                      target.completed ? "line-through opacity-60" : ""
                    }`}
                  >
                    {target.text} ({target.hours} hours)
                  </span>
                </div>
                <button
                  onClick={() => deleteTarget(target.id)}
                  className="text-red-400 hover:text-red-300 px-2 py-1"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyTargets;
