"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QuickAddTask({ onAddTask }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (taskTitle.trim() === "") return;
    
    onAddTask({
      id: Date.now().toString(),
      title: taskTitle,
      description: "",
      dueDate: null,
      difficulty,
      category: "general",
      isRecurring: false,
      completed: false,
      createdAt: new Date(),
    });
    
    setTaskTitle("");
    setDifficulty("medium");
  };

  return (
    <form onSubmit={handleAddTask} className="flex space-x-2">
      <Input
        placeholder="Enter task title..."
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="flex-1"
      />
      <Select
        value={difficulty}
        onValueChange={setDifficulty}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
          <SelectItem value="epic">Epic</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Add</Button>
    </form>
  );
}