"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user-context";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DivideIcon as LucideIcon } from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  menuItems: {
    id: string;
    label: string;
    icon: LucideIcon;
  }[];
}

export default function MobileNav({ activeTab, setActiveTab, menuItems }: MobileNavProps) {
  const { user } = useUser();

  return (
    <div className="w-full">
      {/* User Profile Bar */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
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
          <div className="text-xs font-medium">
            {user.currentXp}/{user.xpToNextLevel} XP
          </div>
        </div>
        <Progress 
          value={(user.currentXp / user.xpToNextLevel) * 100} 
          className="h-2 mt-2" 
        />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10">
        <ScrollArea className="pb-safe">
          <div className="flex">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`flex-1 py-3 rounded-none ${
                    activeTab === item.id ? "text-[hsl(var(--sl-blue))] border-t-2 border-[hsl(var(--sl-blue))]" : ""
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}