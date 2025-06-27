"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Clock, Edit, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";

export default function TaskItem({ task, onComplete, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);
  const { addXp } = useUser();
  const { toast } = useToast();
  const [showXpGain, setShowXpGain] = useState(false);

  const handleComplete = () => {
    if (!task.completed) {
      let xpAmount = 0;
      
      switch (task.difficulty) {
        case "easy":
          xpAmount = 10;
          break;
        case "medium":
          xpAmount = 25;
          break;
        case "hard":
          xpAmount = 50;
          break;
        case "epic":
          xpAmount = 100;
          break;
        default:
          xpAmount = 10;
      }
      
      setShowXpGain(true);
      setTimeout(() => setShowXpGain(false), 1500);
      
      addXp(xpAmount);
      
      toast({
        title: `Task Completed!`,
        description: (
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>+{xpAmount} XP Gained!</span>
          </div>
        ),
      });
    }
    
    onComplete(task.id);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-500/20 text-emerald-500";
      case "medium":
        return "bg-blue-500/20 text-blue-500";
      case "hard":
        return "bg-amber-500/20 text-amber-500";
      case "epic":
        return "bg-purple-500/20 text-purple-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "work":
        return "bg-blue-500/20 text-blue-500";
      case "study":
        return "bg-indigo-500/20 text-indigo-500";
      case "health":
        return "bg-emerald-500/20 text-emerald-500";
      case "fitness":
        return "bg-rose-500/20 text-rose-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getDifficultyStars = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return 1;
      case "medium":
        return 2;
      case "hard":
        return 3;
      case "epic":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <>
      <div 
        className={cn(
          "relative flex items-start justify-between p-4 rounded-lg border transition-all card-hover-effect",
          task.completed ? "bg-muted/50 opacity-70" : "bg-card hover:border-[hsl(var(--sl-blue))]"
        )}
      >
        {showXpGain && (
          <div className="absolute -top-4 right-4 text-[hsl(var(--sl-blue))] font-bold animate-bounce">
            +{task.difficulty === "easy" ? 10 : task.difficulty === "medium" ? 25 : task.difficulty === "hard" ? 50 : 100} XP
          </div>
        )}
        
        <div className="flex items-start space-x-3">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={handleComplete}
            className="mt-1"
          />
          <div>
            <div 
              className={cn(
                "font-medium",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </div>
            {task.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {task.dueDate && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {format(new Date(task.dueDate), "MMM d")}
                </Badge>
              )}
              <Badge className={cn("text-xs sl-glow", getDifficultyColor(task.difficulty))}>
                {Array(getDifficultyStars(task.difficulty))
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="h-3 w-3 inline" />
                  ))}
              </Badge>
              <Badge className={cn("text-xs", getCategoryColor(task.category))}>
                {task.category}
              </Badge>
              {task.isRecurring && (
                <Badge variant="outline" className="text-xs">
                  {task.recurringFrequency}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => setShowDetails(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive" 
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
            <DialogDescription>
              Created on {format(new Date(task.createdAt), "PPP")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {task.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Due Date</h4>
                <p className="text-sm text-muted-foreground">
                  {task.dueDate ? format(new Date(task.dueDate), "PPP") : "No due date"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Difficulty</h4>
                <Badge className={cn("text-xs sl-glow", getDifficultyColor(task.difficulty))}>
                  {task.difficulty}
                  {" "}
                  {Array(getDifficultyStars(task.difficulty))
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="h-3 w-3 inline ml-1" />
                    ))}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Category</h4>
                <Badge className={cn("text-xs", getCategoryColor(task.category))}>
                  {task.category}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Recurring</h4>
                <p className="text-sm text-muted-foreground">
                  {task.isRecurring ? task.recurringFrequency : "No"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Status</h4>
              <Badge variant={task.completed ? "default" : "outline"}>
                {task.completed ? "Completed" : "Pending"}
              </Badge>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            {!task.completed && (
              <Button onClick={() => {
                handleComplete();
                setShowDetails(false);
              }}>
                Mark as Completed
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}