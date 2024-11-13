import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { dbPromise } from '@/lib/db';

const BrainDump = () => {
  const [thought, setThought] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (thought.trim()) {
      try {
        const db = await dbPromise;
        await db.add('thoughts', {
          content: thought,
          timestamp: Date.now(),
        });
        
        toast({
          title: "Thought captured",
          description: "Your thought has been safely stored.",
        });
        setThought("");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save your thought. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4">Brain Dump</h2>
      <p className="text-gray-600 mb-4">
        Clear your mind by capturing any unfinished thoughts or tasks here.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="What's on your mind?"
          className="min-h-[150px] input-field"
        />
        <Button type="submit" className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Capture Thought
        </Button>
      </form>
    </div>
  );
};

export default BrainDump;