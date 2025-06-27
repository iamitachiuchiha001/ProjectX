"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Target, Calendar as CalendarIcon, Trophy, Flag, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Goal = {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  progress: number;
  type: "short" | "mid" | "long";
  status: "active" | "completed" | "failed";
  milestones: {
    id: string;
    title: string;
    completed: boolean;
  }[];
};

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    deadline: new Date(),
    type: "short",
    milestones: [],
  });
  const [selectedTab, setSelectedTab] = useState("short");

  const addGoal = () => {
    if (!newGoal.title) return;

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      progress: 0,
      status: "active",
      milestones: newGoal.milestones.map(m => ({
        ...m,
        id: Date.now().toString() + Math.random(),
      })),
    };

    setGoals([goal, ...goals]);
    setNewGoal({
      title: "",
      description: "",
      deadline: new Date(),
      type: "short",
      milestones: [],
    });
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, progress } : goal
    ));
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const progress = (updatedMilestones.filter(m => m.completed).length / goal.milestones.length) * 100;
        return { ...goal, milestones: updatedMilestones, progress };
      }
      return goal;
    }));
  };

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case "short":
        return <Flag className="h-4 w-4" />;
      case "mid":
        return <Target className="h-4 w-4" />;
      case "long":
        return <Trophy className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  const filteredGoals = goals.filter(goal => goal.type === selectedTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Goal Tracker</h2>
          <p className="text-muted-foreground">Track and manage your goals</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Goal</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Goal title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Goal description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newGoal.deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newGoal.deadline ? format(newGoal.deadline, "PPP") : <span>Pick a deadline</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newGoal.deadline}
                      onSelect={(date) => date && setNewGoal({ ...newGoal, deadline: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Tabs value={newGoal.type} onValueChange={(value: any) => setNewGoal({ ...newGoal, type: value })}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="short">Short Term</TabsTrigger>
                    <TabsTrigger value="mid">Mid Term</TabsTrigger>
                    <TabsTrigger value="long">Long Term</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Button onClick={addGoal} className="w-full">Create Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="short" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="short" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Short Term
          </TabsTrigger>
          <TabsTrigger value="mid" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Mid Term
          </TabsTrigger>
          <TabsTrigger value="long" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Long Term
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {filteredGoals.map((goal) => (
                <Card key={goal.id} className="card-hover-effect">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getGoalTypeIcon(goal.type)}
                        {goal.title}
                      </CardTitle>
                      <Badge
                        variant={goal.status === "completed" ? "default" : "outline"}
                        className={cn(
                          goal.status === "completed" && "bg-green-500/20 text-green-500",
                          goal.status === "failed" && "bg-red-500/20 text-red-500"
                        )}
                      >
                        {goal.status}
                      </Badge>
                    </div>
                    <CardDescription>{goal.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Deadline: {format(new Date(goal.deadline), "PPP")}
                        </div>
                        <span>{Math.round(goal.progress)}% complete</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Milestones</h4>
                        {goal.milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className="flex items-center justify-between p-2 rounded-lg border"
                          >
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleMilestone(goal.id, milestone.id)}
                              >
                                {milestone.completed ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                              <span className={cn(
                                "text-sm",
                                milestone.completed && "line-through text-muted-foreground"
                              )}>
                                {milestone.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}