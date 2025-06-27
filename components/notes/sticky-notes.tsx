"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const colors = [
  "bg-blue-500/10 hover:bg-blue-500/20",
  "bg-purple-500/10 hover:bg-purple-500/20",
  "bg-green-500/10 hover:bg-green-500/20",
  "bg-yellow-500/10 hover:bg-yellow-500/20",
  "bg-pink-500/10 hover:bg-pink-500/20",
];

export default function StickyNotes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const addNote = () => {
    if (newNote.title.trim() === "" && newNote.content.trim() === "") return;
    
    setNotes([
      ...notes,
      {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
    ]);
    setNewNote({ title: "", content: "" });
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setNotes(items);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardContent className="p-4 flex-1">
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <Textarea
              placeholder="Write your note..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="h-20"
            />
            <Button onClick={addNote} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="notes">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {notes.map((note, index) => (
                      <Draggable
                        key={note.id}
                        draggableId={note.id}
                        index={index}
                      >
                        {(provided) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`p-4 rounded-lg ${note.color} relative group`}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => deleteNote(note.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <h3 className="font-medium mb-2">{note.title}</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {note.content}
                            </p>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}