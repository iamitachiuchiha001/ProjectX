"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Sword, Shield, Book, Option as Potion, Crown } from "lucide-react";

const items = [
  {
    id: "1",
    name: "Shadow Dagger",
    type: "weapon",
    rarity: "rare",
    stats: { damage: 25, speed: 15 },
    description: "A dagger forged from shadow essence.",
    icon: Sword,
  },
  {
    id: "2",
    name: "Monarch's Crown",
    type: "artifact",
    rarity: "legendary",
    stats: { power: 50, leadership: 30 },
    description: "Symbol of the Shadow Monarch's authority.",
    icon: Crown,
  },
  {
    id: "3",
    name: "Ancient Tome",
    type: "consumable",
    rarity: "uncommon",
    stats: { intelligence: 15 },
    description: "Contains forgotten knowledge.",
    icon: Book,
  },
  {
    id: "4",
    name: "Shadow Armor",
    type: "armor",
    rarity: "epic",
    stats: { defense: 40, resistance: 25 },
    description: "Armor infused with shadow magic.",
    icon: Shield,
  },
  {
    id: "5",
    name: "Healing Potion",
    type: "consumable",
    rarity: "common",
    stats: { healing: 50 },
    description: "Restores health over time.",
    icon: Potion,
  },
];

const rarityColors = {
  common: "bg-gray-500/20 text-gray-500",
  uncommon: "bg-green-500/20 text-green-500",
  rare: "bg-blue-500/20 text-blue-500",
  epic: "bg-purple-500/20 text-purple-500",
  legendary: "bg-amber-500/20 text-amber-500",
};

export default function Inventory() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems = activeTab === "all" 
    ? items 
    : items.filter(item => item.type === activeTab);

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="weapon">Weapons</TabsTrigger>
            <TabsTrigger value="armor">Armor</TabsTrigger>
            <TabsTrigger value="artifact">Artifacts</TabsTrigger>
            <TabsTrigger value="consumable">Consumables</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <ScrollArea className="h-[450px] pr-4">
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedItem?.id === item.id ? "border-[hsl(var(--sl-blue))]" : ""
                  } hover:border-[hsl(var(--sl-blue))] card-hover-effect`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-accent">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={rarityColors[item.rarity]}>
                          {item.rarity}
                        </Badge>
                        <Badge variant="outline">{item.type}</Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <Card className="p-4">
            {selectedItem ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-accent">
                    <selectedItem.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedItem.name}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={rarityColors[selectedItem.rarity]}>
                        {selectedItem.rarity}
                      </Badge>
                      <Badge variant="outline">{selectedItem.type}</Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {selectedItem.description}
                </p>

                <div>
                  <h3 className="font-medium mb-2">Stats</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedItem.stats).map(([stat, value]) => (
                      <div
                        key={stat}
                        className="p-2 rounded-lg bg-accent flex justify-between"
                      >
                        <span className="capitalize">{stat}</span>
                        <span className="font-medium">+{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select an item to view details
              </div>
            )}
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}