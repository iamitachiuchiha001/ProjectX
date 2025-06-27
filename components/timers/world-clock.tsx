"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe, Plus, X, Clock } from "lucide-react";

type TimeZone = {
  id: string;
  name: string;
  offset: number;
  city: string;
};

const timeZones: TimeZone[] = [
  { id: "1", name: "IST", offset: 5.5, city: "Mumbai" },
  { id: "2", name: "UTC", offset: 0, city: "London" },
  { id: "3", name: "EST", offset: -5, city: "New York" },
  { id: "4", name: "CST", offset: 8, city: "Beijing" },
  { id: "5", name: "PST", offset: -8, city: "Los Angeles" },
  { id: "6", name: "JST", offset: 9, city: "Tokyo" },
  { id: "7", name: "AEST", offset: 10, city: "Sydney" },
  { id: "8", name: "CET", offset: 1, city: "Paris" },
];

export default function WorldClock() {
  const [selectedTimeZones, setSelectedTimeZones] = useState<TimeZone[]>([
    timeZones[0],
    timeZones[1],
    timeZones[2],
    timeZones[3],
  ]);
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addTimeZone = (timeZone: TimeZone) => {
    if (!selectedTimeZones.find(tz => tz.id === timeZone.id)) {
      setSelectedTimeZones([...selectedTimeZones, timeZone]);
    }
    setSearch("");
  };

  const removeTimeZone = (id: string) => {
    setSelectedTimeZones(selectedTimeZones.filter(tz => tz.id !== id));
  };

  const getTimeInTimeZone = (offset: number) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    return new Date(utc + offset * 3600000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const filteredTimeZones = timeZones.filter(tz =>
    tz.city.toLowerCase().includes(search.toLowerCase()) ||
    tz.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-[hsl(var(--sl-blue))]" />
          World Clock
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <div className="absolute w-full mt-1 p-2 bg-card border rounded-md shadow-lg z-10">
                <ScrollArea className="h-[200px]">
                  {filteredTimeZones.map((tz) => (
                    <Button
                      key={tz.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => addTimeZone(tz)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {tz.city} ({tz.name})
                    </Button>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>

          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-2 gap-2">
              {selectedTimeZones.map((tz) => (
                <div
                  key={tz.id}
                  className="flex flex-col items-center justify-between p-4 rounded-lg border"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[hsl(var(--sl-blue))]" />
                      <span className="font-medium">{tz.city}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {tz.name} (UTC{tz.offset >= 0 ? "+" : ""}{tz.offset})
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-mono">
                      {formatTime(getTimeInTimeZone(tz.offset))}
                    </span>
                    {tz.id !== "1" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTimeZone(tz.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}