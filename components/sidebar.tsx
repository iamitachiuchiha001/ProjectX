"use client";

import { useUser } from "@/context/user-context";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame, Shield, Brain, Dumbbell, Heart, DivideIcon as LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  menuItems: {
    id: string;
    label: string;
    icon: LucideIcon;
  }[];
}

export default function Sidebar({ activeTab, setActiveTab, menuItems }: SidebarProps) {
  const { user } = useUser();

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* User Profile */}
      <div className="p-4 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold">{user.name}</h3>
            <div className="text-xs text-muted-foreground flex items-center">
              <span className="text-primary font-medium">Lv. {user.level}</span>
              <span className="mx-1">•</span>
              <span>{user.title}</span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>XP: {user.currentXp}/{user.xpToNextLevel}</span>
            <span>{Math.round((user.currentXp / user.xpToNextLevel) * 100)}%</span>
          </div>
          <Progress value={(user.currentXp / user.xpToNextLevel) * 100} className="h-2" />
        </div>
      </div>

      <Separator />

      {/* Stats Overview */}
      <div className="p-4 space-y-2">
        <h4 className="text-sm font-medium">Stats</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-4 w-4 text-chart-1" />
            <div className="text-xs">
              <div className="font-medium">Strength</div>
              <div className="text-muted-foreground">{user.stats.strength}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-chart-2" />
            <div className="text-xs">
              <div className="font-medium">Intelligence</div>
              <div className="text-muted-foreground">{user.stats.intelligence}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-chart-3" />
            <div className="text-xs">
              <div className="font-medium">Discipline</div>
              <div className="text-muted-foreground">{user.stats.discipline}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-chart-4" />
            <div className="text-xs">
              <div className="font-medium">Health</div>
              <div className="text-muted-foreground">{user.stats.health}</div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Current Arc */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Current Arc</h4>
          <span className="text-xs text-primary">+15% XP</span>
        </div>
        <div className="bg-accent/50 rounded-md p-3 text-sm">
          <div className="font-medium">{user.currentArc.name}</div>
          <div className="text-xs text-muted-foreground mt-1">{user.currentArc.description}</div>
          <div className="mt-2 flex items-center text-xs">
            <Flame className="h-3 w-3 mr-1 text-chart-5" />
            <span>{user.currentArc.daysLeft} days left</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeTab === item.id ? "bg-secondary" : ""
                )}
                onClick={() => setActiveTab(item.id)}
                asChild
              >
                <Link href={`#${item.id}`}>
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Daily Streak */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Flame className="h-5 w-5 text-chart-5" />
          <div>
            <div className="text-sm font-medium">Daily Streak</div>
            <div className="text-xs text-muted-foreground">{user.streak} days</div>
          </div>
        </div>
      </div>
    </div>
  );
}