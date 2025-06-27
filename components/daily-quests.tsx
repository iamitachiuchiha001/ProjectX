"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Star } from "lucide-react";

export default function DailyQuests() {
  const { user, addXp } = useUser();
  const { toast } = useToast();
  const [quests, setQuests] = useState([
    {
      id: "1",
      title: "Complete 3 tasks",
      description: "Complete any 3 tasks today",
      progress: 1,
      total: 3,
      xp: 50,
      completed: false,
    },
    {
      id: "2",
      title: "Add a hard task",
      description: "Create at least one hard difficulty task",
      progress: 0,
      total: 1,
      xp: 30,
      completed: false,
    },
    {
      id: "3",
      title: "Use the timer",
      description: "Use the timer feature for at least 25 minutes",
      progress: 0,
      total: 1,
      xp: 20,
      completed: false,
    },
  ]);

  const handleCompleteQuest = (id) => {
    setQuests(quests.map(quest => {
      if (quest.id === id && !quest.completed) {
        addXp(quest.xp);
        
        toast({
          title: `Daily Quest Completed!`,
          description: `+${quest.xp} XP Gained!`,
        });
        
        return { ...quest, completed: true };
      }
      return quest;
    }));
  };

  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.completed).length;
  const questProgress = (completedQuests / totalQuests) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Daily Quests</CardTitle>
            <CardDescription>
              Complete quests to earn bonus XP
            </CardDescription>
          </div>
          <Badge className="bg-amber-500/20 text-amber-500">
            <Trophy className="h-3 w-3 mr-1" />
            {completedQuests}/{totalQuests}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Daily Progress</span>
            <span>{Math.round(questProgress)}%</span>
          </div>
          <Progress value={questProgress} className="h-2" />
        </div>

        <div className="space-y-3">
          {quests.map((quest) => (
            <div 
              key={quest.id} 
              className="flex items-start justify-between p-3 rounded-md border border-border bg-card"
            >
              <div className="flex items-start space-x-3">
                <Checkbox 
                  checked={quest.completed} 
                  onCheckedChange={() => handleCompleteQuest(quest.id)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">{quest.title}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {quest.description}
                  </p>
                  {quest.progress < quest.total && (
                    <div className="mt-2 text-xs">
                      <span className="text-muted-foreground">
                        Progress: {quest.progress}/{quest.total}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {quest.xp} XP
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Quests
        </Button>
      </CardFooter>
    </Card>
  );
}