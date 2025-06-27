"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const initialUser = {
  name: "Shadow Monarch",
  level: 1,
  currentXp: 75,
  xpToNextLevel: 100,
  title: "Novice Hunter",
  streak: 7,
  stats: {
    strength: 42,
    intelligence: 65,
    discipline: 58,
    health: 37,
  },
  currentArc: {
    name: "Rise of the Shadow Monarch",
    description: "Begin your journey to become the ultimate Shadow Monarch by mastering the basics of productivity.",
    progress: 45,
    daysLeft: 14,
  },
  titles: [
    "Novice Hunter",
    "Task Master",
    "Early Riser",
  ],
  achievements: [],
};

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(initialUser);
  const { toast } = useToast();

  const addXp = (amount) => {
    setUser(prevUser => {
      const newXp = prevUser.currentXp + amount;
      
      // Check if leveled up
      if (newXp >= prevUser.xpToNextLevel) {
        const remainingXp = newXp - prevUser.xpToNextLevel;
        const newLevel = prevUser.level + 1;
        const newXpToNextLevel = Math.floor(prevUser.xpToNextLevel * 1.5);
        
        // Update stats based on level up
        const newStats = {
          strength: prevUser.stats.strength + Math.floor(Math.random() * 5) + 1,
          intelligence: prevUser.stats.intelligence + Math.floor(Math.random() * 5) + 1,
          discipline: prevUser.stats.discipline + Math.floor(Math.random() * 5) + 1,
          health: prevUser.stats.health + Math.floor(Math.random() * 5) + 1,
        };
        
        return {
          ...prevUser,
          level: newLevel,
          currentXp: remainingXp,
          xpToNextLevel: newXpToNextLevel,
          stats: newStats,
        };
      }
      
      return {
        ...prevUser,
        currentXp: newXp,
      };
    });
  };

  const setTitle = (title) => {
    if (user.titles.includes(title)) {
      setUser(prevUser => ({
        ...prevUser,
        title,
      }));
      
      toast({
        title: "Title Changed",
        description: `You are now known as "${title}"`,
      });
    }
  };

  const addStat = (stat, amount) => {
    if (["strength", "intelligence", "discipline", "health"].includes(stat)) {
      setUser(prevUser => ({
        ...prevUser,
        stats: {
          ...prevUser.stats,
          [stat]: prevUser.stats[stat] + amount,
        },
      }));
    }
  };

  return (
    <UserContext.Provider value={{ user, addXp, setTitle, addStat }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}