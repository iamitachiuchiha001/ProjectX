"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Timer, Play, Pause, RotateCcw, Flag } from "lucide-react";

type Lap = {
  number: number;
  time: number;
  split: number;
};

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleLap = () => {
    const lastLapTime = laps.length > 0 ? laps[0].time : 0;
    const newLap: Lap = {
      number: laps.length + 1,
      time: time,
      split: time - lastLapTime,
    };
    setLaps([newLap, ...laps]);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-[hsl(var(--sl-blue))]" />
          Stopwatch
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          <div className="text-6xl font-bold font-mono text-[hsl(var(--sl-blue))] sl-glow">
            {formatTime(time)}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={handleStartStop}
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
              className="w-12 h-12 rounded-full"
              onClick={handleLap}
              disabled={!isRunning}
            >
              <Flag className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={handleReset}
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>

          <div className="w-full">
            <h3 className="text-sm font-medium mb-2">Laps</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {laps.map((lap) => (
                  <div
                    key={lap.number}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">Lap {lap.number}</span>
                      <span className="text-sm font-mono">{formatTime(lap.split)}</span>
                    </div>
                    <span className="text-sm font-mono text-muted-foreground">
                      {formatTime(lap.time)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}