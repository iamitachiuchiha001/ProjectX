"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function LevelUpAnimation({ level }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70" />
          
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20 
            }}
          >
            <motion.div
              className="text-6xl md:text-8xl font-bold text-primary mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              LEVEL UP!
            </motion.div>
            
            <motion.div
              className="flex items-center justify-center w-40 h-40 md:w-60 md:h-60 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-5xl md:text-7xl font-bold"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                delay: 0.5 
              }}
            >
              {level}
            </motion.div>
            
            <motion.div
              className="mt-6 text-xl md:text-2xl text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              New skills unlocked!
            </motion.div>
            
            {/* Particles effect */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "absolute w-3 h-3 rounded-full",
                    i % 3 === 0 ? "bg-blue-500" : 
                    i % 3 === 1 ? "bg-purple-500" : "bg-pink-500"
                  )}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0 
                  }}
                  animate={{ 
                    x: Math.random() * 500 - 250, 
                    y: Math.random() * 500 - 250, 
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0]
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2,
                    delay: 0.5 + Math.random() * 0.5,
                    ease: "easeOut",
                    times: [0, 0.5, 1]
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}