"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/user-context";
import { useTasks } from "@/context/task-context";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dumbbell, Brain, Shield, Heart, Trophy, Star, Award } from "lucide-react";

export default function StatsPanel() {
  const { user } = useUser();
  const { tasks } = useTasks();
  const [timeRange, setTimeRange] = useState("week");

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Task difficulty distribution
  const tasksByDifficulty = {
    easy: tasks.filter(task => task.difficulty === "easy").length,
    medium: tasks.filter(task => task.difficulty === "medium").length,
    hard: tasks.filter(task => task.difficulty === "hard").length,
    epic: tasks.filter(task => task.difficulty === "epic").length,
  };

  // Task category distribution
  const tasksByCategory = {
    general: tasks.filter(task => task.category === "general").length,
    work: tasks.filter(task => task.category === "work").length,
    study: tasks.filter(task => task.category === "study").length,
    health: tasks.filter(task => task.category === "health").length,
    fitness: tasks.filter(task => task.category === "fitness").length,
  };

  // Mock data for charts
  const weeklyTaskData = [
    { name: "Mon", tasks: 5 },
    { name: "Tue", tasks: 8 },
    { name: "Wed", tasks: 6 },
    { name: "Thu", tasks: 9 },
    { name: "Fri", tasks: 4 },
    { name: "Sat", tasks: 3 },
    { name: "Sun", tasks: 7 },
  ];

  const xpGainData = [
    { name: "Mon", xp: 120 },
    { name: "Tue", xp: 240 },
    { name: "Wed", xp: 180 },
    { name: "Thu", xp: 300 },
    { name: "Fri", xp: 150 },
    { name: "Sat", xp: 90 },
    { name: "Sun", xp: 210 },
  ];

  const pieChartData = [
    { name: "Easy", value: tasksByDifficulty.easy, color: "var(--chart-1)" },
    { name: "Medium", value: tasksByDifficulty.medium, color: "var(--chart-2)" },
    { name: "Hard", value: tasksByDifficulty.hard, color: "var(--chart-3)" },
    { name: "Epic", value: tasksByDifficulty.epic, color: "var(--chart-4)" },
  ];

  const categoryData = [
    { name: "General", value: tasksByCategory.general },
    { name: "Work", value: tasksByCategory.work },
    { name: "Study", value: tasksByCategory.study },
    { name: "Health", value: tasksByCategory.health },
    { name: "Fitness", value: tasksByCategory.fitness },
  ];

  // Achievements
  const achievements = [
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first task",
      progress: 100,
      completed: true,
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
    },
    {
      id: "2",
      title: "Task Master",
      description: "Complete 50 tasks",
      progress: 64,
      completed: false,
      icon: <Star className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "3",
      title: "Epic Challenger",
      description: "Complete 10 epic difficulty tasks",
      progress: 30,
      completed: false,
      icon: <Award className="h-5 w-5 text-purple-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">Track your progress and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <Progress value={completionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.level}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {user.currentXp}/{user.xpToNextLevel} XP to next level
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.streak} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep it going!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion</CardTitle>
              <Tabs defaultValue="week" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
                <TabsContent value="week" className="mt-4">
                  <BarChart
                    data={weeklyTaskData}
                    index="name"
                    categories={["tasks"]}
                    colors={["var(--chart-1)"]}
                    valueFormatter={(value) => `${value} tasks`}
                    className="h-[300px]"
                  />
                </TabsContent>
                <TabsContent value="month">
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Monthly data visualization
                  </div>
                </TabsContent>
                <TabsContent value="year">
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Yearly data visualization
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>XP Gained</CardTitle>
              <Tabs defaultValue="week" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
                <TabsContent value="week" className="mt-4">
                  <LineChart
                    data={xpGainData}
                    index="name"
                    categories={["xp"]}
                    colors={["var(--chart-2)"]}
                    valueFormatter={(value) => `${value} XP`}
                    className="h-[300px]"
                  />
                </TabsContent>
                <TabsContent value="month">
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Monthly data visualization
                  </div>
                </TabsContent>
                <TabsContent value="year">
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Yearly data visualization
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Difficulty</CardTitle>
                <CardDescription>
                  Distribution of tasks by difficulty
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={pieChartData}
                  index="name"
                  valueFormatter={(value) => `${value} tasks`}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  Distribution of tasks by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={categoryData}
                  index="name"
                  categories={["value"]}
                  colors={["var(--chart-3)"]}
                  layout="vertical"
                  valueFormatter={(value) => `${value} tasks`}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
              <CardDescription>
                Your character attributes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Dumbbell className="h-4 w-4 mr-2 text-chart-1" />
                    <span className="text-sm font-medium">Strength</span>
                  </div>
                  <span className="text-sm">{user.stats.strength}</span>
                </div>
                <Progress value={(user.stats.strength / 100) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-chart-2" />
                    <span className="text-sm font-medium">Intelligence</span>
                  </div>
                  <span className="text-sm">{user.stats.intelligence}</span>
                </div>
                <Progress value={(user.stats.intelligence / 100) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-chart-3" />
                    <span className="text-sm font-medium">Discipline</span>
                  </div>
                  <span className="text-sm">{user.stats.discipline}</span>
                </div>
                <Progress value={(user.stats.discipline / 100) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-chart-4" />
                    <span className="text-sm font-medium">Health</span>
                  </div>
                  <span className="text-sm">{user.stats.health}</span>
                </div>
                <Progress value={(user.stats.health / 100) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Your unlocked achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className="p-3 rounded-md border border-border bg-card"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <Badge variant={achievement.completed ? "default" : "outline"}>
                              {achievement.completed ? "Completed" : `${achievement.progress}%`}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {achievement.description}
                          </p>
                          {!achievement.completed && (
                            <Progress 
                              value={achievement.progress} 
                              className="h-1 mt-2" 
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Titles</CardTitle>
              <CardDescription>
                Your earned titles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-md bg-primary/10 border border-primary/20">
                  <span className="text-sm font-medium">{user.title}</span>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-md">
                  <span className="text-sm">Task Master</span>
                  <Badge variant="outline">Select</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-md">
                  <span className="text-sm">Early Riser</span>
                  <Badge variant="outline">Select</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}