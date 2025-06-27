"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import TaskManager from "@/components/task-manager";
import StatsPanel from "@/components/stats-panel";
import PomodoroTimer from "@/components/timers/pomodoro";
import Stopwatch from "@/components/timers/stopwatch";
import WorldClock from "@/components/timers/world-clock";
import StickyNotes from "@/components/notes/sticky-notes";
import Reminders from "@/components/reminders/reminders";
import Inventory from "@/components/inventory/inventory";
import Journal from "@/components/journal/journal";
import GoalTracker from "@/components/goals/goal-tracker";
import { UserProvider } from "@/context/user-context";
import { TaskProvider } from "@/context/task-context";
import { useToast } from "@/hooks/use-toast";
import { LevelUpAnimation } from "@/components/animations/level-up";
import MobileNav from "@/components/mobile-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckSquare, 
  BarChart2, 
  Clock, 
  FileText, 
  Trophy, 
  Settings, 
  Bell, 
  StickyNote, 
  Sword,
  Timer,
  Globe,
  Target,
  Book
} from "lucide-react";

export default function Dashboard() {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const { toast } = useToast();

  // Demo level up animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "tasks":
        return <TaskManager />;
      case "stats":
        return <StatsPanel />;
      case "timers":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Time Management</h2>
            <Tabs defaultValue="pomodoro">
              <TabsList>
                <TabsTrigger value="pomodoro" className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Pomodoro
                </TabsTrigger>
                <TabsTrigger value="stopwatch" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Stopwatch
                </TabsTrigger>
                <TabsTrigger value="world-clock" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  World Clock
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pomodoro">
                <PomodoroTimer />
              </TabsContent>
              <TabsContent value="stopwatch">
                <Stopwatch />
              </TabsContent>
              <TabsContent value="world-clock">
                <WorldClock />
              </TabsContent>
            </Tabs>
          </div>
        );
      case "notes":
        return <StickyNotes />;
      case "reminders":
        return <Reminders />;
      case "inventory":
        return <Inventory />;
      case "goals":
        return <GoalTracker />;
      case "journal":
        return <Journal />;
      default:
        return <TaskManager />;
    }
  };

  const menuItems = [
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "stats", label: "Stats", icon: BarChart2 },
    { id: "timers", label: "Timers", icon: Clock },
    { id: "notes", label: "Notes", icon: StickyNote },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "inventory", label: "Inventory", icon: Sword },
    { id: "goals", label: "Goals", icon: Target },
    { id: "journal", label: "Journal", icon: Book },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <UserProvider>
      <TaskProvider>
        <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground relative overflow-hidden">
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} menuItems={menuItems} />
          </div>

          {/* Sidebar - Hidden on mobile */}
          <div className="hidden md:block">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} menuItems={menuItems} />
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8">
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0">
                  {renderContent()}
                </CardContent>
              </Card>
            </ScrollArea>
          </main>

          {/* Level Up Animation */}
          {showLevelUp && <LevelUpAnimation level={2} />}
        </div>
      </TaskProvider>
    </UserProvider>
  );
}