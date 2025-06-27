"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, Pause, Play, RotateCcw, Clock, Focus, Coffee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/user-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timerType, setTimerType] = useState("pomodoro");
  const { toast } = useToast();
  const { addXp } = useUser();

  const timerConfigs = {
    pomodoro: { duration: 25 * 60, xp: 50 },
    short: { duration: 5 * 60, xp: 10 },
    long: { duration: 15 * 60, xp: 25 },
  };

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak) {
        // Completed a work session
        toast({
          title: "Timer Complete!",
          description: `Great work! +${timerConfigs[timerType].xp} XP`,
        });
        addXp(timerConfigs[timerType].xp);
        setIsBreak(true);
        setTimeLeft(5 * 60); // 5 minute break
      } else {
        // Completed a break
        toast({
          title: "Break Complete!",
          description: "Ready to focus again?",
        });
        setIsBreak(false);
        setTimeLeft(timerConfigs[timerType].duration);
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, timerType, toast, addXp]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(timerConfigs[timerType].duration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timerConfigs[timerType].duration - timeLeft) / timerConfigs[timerType].duration * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="card-hover-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-[hsl(var(--sl-blue))]" />
            {isBreak ? "Break Time" : "Focus Session"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pomodoro" className="mb-6" onValueChange={(value) => {
            setTimerType(value);
            setTimeLeft(timerConfigs[value].duration);
            setIsRunning(false);
            setIsBreak(false);
          }}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pomodoro" className="flex items-center gap-2">
                <Focus className="h-4 w-4" />
                Pomodoro
              </TabsTrigger>
              <TabsTrigger value="short" className="flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                Short Break
              </TabsTrigger>
              <TabsTrigger value="long" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Long Break
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col items-center space-y-4">
            <div className="text-6xl font-bold text-[hsl(var(--sl-blue))] sl-glow">
              {formatTime(timeLeft)}
            </div>
            <Progress value={progress} className="w-full h-2" />
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTimer}
                className="w-12 h-12 rounded-full"
              >
                {isRunning ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={resetTimer}
                className="w-12 h-12 rounded-full"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timer Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="text-sm font-medium">Focus Time</div>
                <div className="text-2xl font-bold mt-1">2h 45m</div>
                <div className="text-xs text-muted-foreground mt-1">Today</div>
              </div>
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="text-sm font-medium">Sessions</div>
                <div className="text-2xl font-bold mt-1">6</div>
                <div className="text-xs text-muted-foreground mt-1">Completed</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recent Sessions</h4>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Focus className="h-4 w-4 text-[hsl(var(--sl-blue))]" />
                      <div className="text-sm">Pomodoro Session</div>
                    </div>
                    <div className="text-sm text-muted-foreground">25:00</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}