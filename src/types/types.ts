export interface StudyLog {
  id: number;
  date: string;
  hours: number;
  subject: string;
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  date: string;
}

export interface WeeklyTasks {
  [date: string]: {
    id: number;
    text: string;
    completed: boolean;
  }[];
}

export interface MonthlyTarget {
  id: number;
  text: string;
  hours: number;
  month: string;
  completed: boolean;
}
