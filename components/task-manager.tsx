"use client";

import { useState } from "react";
import { useTasks } from "@/context/task-context";
import { useUser } from "@/context/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Clock, Trash2, Star, Edit, Filter } from "lucide-react";
import TaskItem from "@/components/task-item";
import QuickAddTask from "@/components/quick-add-task";
import DailyQuests from "@/components/daily-quests";

export default function TaskManager() {
  const { tasks, addTask, completeTask, deleteTask } = useTasks();
  const { user, addXp } = useUser();
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: null,
    difficulty: "medium",
    category: "general",
    isRecurring: false,
    recurringFrequency: "daily",
  });
  const [activeFilter, setActiveFilter] = useState("all");

  const handleAddTask = () => {
    if (newTask.title.trim() === "") return;
    
    addTask({
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      createdAt: new Date(),
    });
    
    setNewTask({
      title: "",
      description: "",
      dueDate: null,
      difficulty: "medium",
      category: "general",
      isRecurring: false,
      recurringFrequency: "daily",
    });
    
    setShowAddTask(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === "all") return true;
    if (activeFilter === "completed") return task.completed;
    if (activeFilter === "pending") return !task.completed;
    if (activeFilter === "today") {
      if (!task.dueDate) return false;
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      return (
        dueDate.getDate() === today.getDate() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getFullYear() === today.getFullYear()
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <p className="text-muted-foreground">Manage your tasks and level up your productivity</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setActiveFilter("all")}>
            All
          </Button>
          <Button variant="outline" size="sm" onClick={() => setActiveFilter("today")}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => setActiveFilter("pending")}>
            Pending
          </Button>
          <Button variant="outline" size="sm" onClick={() => setActiveFilter("completed")}>
            Completed
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Tasks</CardTitle>
                <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                      <DialogDescription>
                        Create a new task to track your progress and earn XP.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Task title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Task description"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !newTask.dueDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newTask.dueDate ? (
                                  format(newTask.dueDate, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newTask.dueDate}
                                onSelect={(date) => setNewTask({ ...newTask, dueDate: date })}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="difficulty">Difficulty</Label>
                          <Select
                            value={newTask.difficulty}
                            onValueChange={(value) => setNewTask({ ...newTask, difficulty: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy (10 XP)</SelectItem>
                              <SelectItem value="medium">Medium (25 XP)</SelectItem>
                              <SelectItem value="hard">Hard (50 XP)</SelectItem>
                              <SelectItem value="epic">Epic (100 XP)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newTask.category}
                          onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="work">Work</SelectItem>
                            <SelectItem value="study">Study</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="fitness">Fitness</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isRecurring"
                          checked={newTask.isRecurring}
                          onCheckedChange={(checked) => 
                            setNewTask({ ...newTask, isRecurring: checked === true })
                          }
                        />
                        <Label htmlFor="isRecurring">Recurring Task</Label>
                      </div>
                      {newTask.isRecurring && (
                        <div className="space-y-2">
                          <Label htmlFor="recurringFrequency">Frequency</Label>
                          <Select
                            value={newTask.recurringFrequency}
                            onValueChange={(value) => setNewTask({ ...newTask, recurringFrequency: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddTask(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddTask}>Add Task</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {filteredTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <p className="text-muted-foreground mb-2">No tasks found</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowAddTask(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add your first task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredTasks.map((task) => (
                      <TaskItem 
                        key={task.id} 
                        task={task} 
                        onComplete={completeTask} 
                        onDelete={deleteTask} 
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Add</CardTitle>
              <CardDescription>
                Quickly add tasks without filling all details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuickAddTask onAddTask={addTask} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <DailyQuests />

          <Card>
            <CardHeader>
              <CardTitle>Current Arc</CardTitle>
              <CardDescription>
                {user.currentArc.name} • {user.currentArc.daysLeft} days left
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {user.currentArc.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{user.currentArc.progress}%</span>
                </div>
                <Progress value={user.currentArc.progress} className="h-2" />
              </div>
              <div className="mt-4 p-3 bg-accent/50 rounded-md">
                <h4 className="text-sm font-medium mb-2">Arc Bonus</h4>
                <p className="text-xs text-muted-foreground">
                  +15% XP for all tasks related to {user.currentArc.name.toLowerCase()}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Arc Details
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Motivational Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="border-l-2 pl-4 italic">
                "I don't have a lot of time. I need to get stronger, fast."
                <footer className="text-sm text-muted-foreground mt-2">
                  — Sung Jin-Woo, Solo Leveling
                </footer>
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}