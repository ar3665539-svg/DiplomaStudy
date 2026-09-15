/**
 * DiplomaStudy - Study Planner Service
 * Task planning, prioritization, scheduling and completion tracking
 */

import { storage, STORAGE_KEYS } from "../../core/storage.js";
import { events } from "../../core/events.js";
import { Toast } from "../../components/Toast.js";

const DEFAULT_TASKS = [
  {
    id: "task-1",
    title: "Revise Ohm's Law and solve numerical problems 1-10",
    subject: "Basic Electricity",
    priority: "High",
    date: new Date().toISOString().split("T")[0],
    startTime: "19:00",
    durationMinutes: 45,
    isCompleted: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "task-2",
    title: "Write C program for Matrix Multiplication",
    subject: "Computer Programming (C)",
    priority: "Medium",
    date: new Date().toISOString().split("T")[0],
    startTime: "21:00",
    durationMinutes: 60,
    isCompleted: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "task-3",
    title: "Practice Cramer's Rule determinants 3x3 questions",
    subject: "Mathematics - 1",
    priority: "High",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "20:00",
    durationMinutes: 50,
    isCompleted: false,
    createdAt: new Date().toISOString()
  }
];

class PlannerService {
  constructor() {
    this._tasks = storage.get(STORAGE_KEYS.PLANNER, DEFAULT_TASKS);
  }

  getAll() {
    return this._tasks;
  }

  getByFilter(filter = "today") {
    const todayStr = new Date().toISOString().split("T")[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    if (filter === "completed") {
      return this._tasks.filter((t) => t.isCompleted);
    }
    if (filter === "today") {
      return this._tasks.filter((t) => t.date === todayStr && !t.isCompleted);
    }
    if (filter === "tomorrow") {
      return this._tasks.filter((t) => t.date === tomorrowStr && !t.isCompleted);
    }
    if (filter === "upcoming") {
      return this._tasks.filter((t) => t.date > tomorrowStr && !t.isCompleted);
    }
    return this._tasks;
  }

  addTask({ title, subject = "Engineering", priority = "Medium", date, startTime = "19:00", durationMinutes = 45 }) {
    const newTask = {
      id: "task-" + Date.now(),
      title: title.trim(),
      subject,
      priority,
      date: date || new Date().toISOString().split("T")[0],
      startTime,
      durationMinutes: parseInt(durationMinutes, 10) || 45,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    this._tasks.unshift(newTask);
    this._save();
    Toast.show("Study task added to planner!", "success");
    events.emit("planner:changed");
    return newTask;
  }

  toggleComplete(id) {
    const task = this._tasks.find((t) => t.id === id);
    if (task) {
      task.isCompleted = !task.isCompleted;
      this._save();
      Toast.show(task.isCompleted ? "Task marked completed! 🎉" : "Task marked pending", "info");
      events.emit("planner:changed");
    }
  }

  deleteTask(id) {
    const idx = this._tasks.findIndex((t) => t.id === id);
    if (idx > -1) {
      this._tasks.splice(idx, 1);
      this._save();
      Toast.show("Task deleted", "info");
      events.emit("planner:changed");
    }
  }

  _save() {
    storage.set(STORAGE_KEYS.PLANNER, this._tasks);
  }
}

export const plannerService = new PlannerService();
