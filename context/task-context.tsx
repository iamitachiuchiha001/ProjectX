"use client";

import { createContext, useContext, useState, useEffect } from "react";

const initialTasks = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Write and submit the project proposal for the new client",
    dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    difficulty: "hard",
    category: "work",
    isRecurring: false,
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Morning workout",
    description: "30 minutes of cardio and strength training",
    dueDate: new Date(),
    difficulty: "medium",
    category: "fitness",
    isRecurring: true,
    recurringFrequency: "daily",
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Read 20 pages",
    description: "Continue reading 'Atomic Habits'",
    dueDate: new Date(),
    difficulty: "easy",
    category: "study",
    isRecurring: true,
    recurringFrequency: "daily",
    completed: true,
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: "4",
    title: "Prepare presentation",
    description: "Create slides for the team meeting",
    dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    difficulty: "medium",
    category: "work",
    isRecurring: false,
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "5",
    title: "Meditate for 10 minutes",
    description: "Practice mindfulness meditation",
    dueDate: new Date(),
    difficulty: "easy",
    category: "health",
    isRecurring: true,
    recurringFrequency: "daily",
    completed: false,
    createdAt: new Date(),
  },
];

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = (task) => {
    setTasks(prevTasks => [task, ...prevTasks]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const completeTask = (id) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, completeTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}