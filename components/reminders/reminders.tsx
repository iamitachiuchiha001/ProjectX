"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Bell, X, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("09:00");
  const [priority, setPriority] = useState("medium");
  const { toast } = useToast();

  const addReminder = () => {
    if (!title || !date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const reminder = {
      id: Date.now().toString(),
      title,
      date,
      time,
      priority,
      completed: false,
    };

    setReminders([...reminders, reminder]);
    setTitle("");
    setDate(null);
    setTime("09:00");
    setPriority("medium");

    // Schedule notification
    const reminderDate = new Date(date);
    const [hours, minutes] = time.split(":");
    reminderDate.setHours(parseInt(hours), parseInt(minutes));

    if (reminderDate > new Date()) {
      const timeUntilReminder = reminderDate.getTime() - new Date().getTime();
      setTimeout(() => {
        toast({
          title: "Reminder",
          description: title,
        });
      }, timeUntilReminder);
    }

    toast({
      title: "Reminder Added",
      description: "Your reminder has been set successfully",
    });
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast({
      title: "Reminder Deleted",
      description: "Your reminder has been removed",
    });
  };

  const toggleReminder = (id) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-500";
      case "medium":
        return "bg-yellow-500/20 text-yellow-500";
      case "low":
        return "bg-green-500/20 text-green-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[hsl(var(--sl-blue))]" />
            Add Reminder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Reminder title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={addReminder} className="w-full">
              Add Reminder
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-[hsl(var(--sl-blue))]" />
            Active Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {reminders.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No reminders set
                </div>
              ) : (
                reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={cn(
                      "p-4 rounded-lg border flex items-center justify-between transition-all card-hover-effect",
                      reminder.completed ? "bg-muted/50" : ""
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleReminder(reminder.id)}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2",
                          reminder.completed 
                            ? "bg-[hsl(var(--sl-blue))] border-[hsl(var(--sl-blue))]"
                            : "border-muted-foreground"
                        )} />
                      </Button>
                      <div>
                        <h3 className={cn(
                          "font-medium",
                          reminder.completed && "line-through text-muted-foreground"
                        )}>
                          {reminder.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(reminder.date, "PPP")}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {reminder.time}
                          </Badge>
                          <Badge className={getPriorityColor(reminder.priority)}>
                            {reminder.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteReminder(reminder.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}