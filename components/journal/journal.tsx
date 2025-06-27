"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Book, CalendarIcon, Search, Tag, Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  date: Date;
  tags: string[];
  mood: string;
};

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    date: new Date(),
    tags: [],
    mood: "neutral",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addEntry = () => {
    if (!newEntry.title || !newEntry.content) return;

    if (editingId) {
      setEntries(entries.map(entry =>
        entry.id === editingId
          ? { ...newEntry, id: editingId }
          : entry
      ));
      setEditingId(null);
    } else {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        ...newEntry,
      };
      setEntries([entry, ...entries]);
    }

    setNewEntry({
      title: "",
      content: "",
      date: new Date(),
      tags: [],
      mood: "neutral",
    });
    setIsEditing(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const editEntry = (entry: JournalEntry) => {
    setNewEntry({
      title: entry.title,
      content: entry.content,
      date: entry.date,
      tags: entry.tags,
      mood: entry.mood,
    });
    setEditingId(entry.id);
    setIsEditing(true);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = selectedDate
      ? format(entry.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      : true;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5 text-[hsl(var(--sl-blue))]" />
            {isEditing ? "Edit Entry" : "New Entry"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Entry title..."
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            />

            <Textarea
              placeholder="Write your thoughts..."
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              className="min-h-[200px]"
            />

            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !newEntry.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEntry.date ? format(newEntry.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newEntry.date}
                    onSelect={(date) => date && setNewEntry({ ...newEntry, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Input
                placeholder="Add tags (comma separated)"
                value={newEntry.tags.join(", ")}
                onChange={(e) => setNewEntry({
                  ...newEntry,
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                })}
              />
            </div>

            <div className="flex justify-end gap-2">
              {isEditing && (
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  setNewEntry({
                    title: "",
                    content: "",
                    date: new Date(),
                    tags: [],
                    mood: "neutral",
                  });
                }}>
                  Cancel
                </Button>
              )}
              <Button onClick={addEntry}>
                {isEditing ? "Update Entry" : "Add Entry"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Book className="h-5 w-5 text-[hsl(var(--sl-blue))]" />
              Journal Entries
            </span>
          </CardTitle>
          <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {filteredEntries.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No entries found
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <Card key={entry.id} className="card-hover-effect">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{entry.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editEntry(entry)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteEntry(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        {format(new Date(entry.date), "PPP")}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{entry.content}</ReactMarkdown>
                      </div>
                      {entry.tags.length > 0 && (
                        <div className="flex items-center gap-2 mt-4">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}