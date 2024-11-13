import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BrainDump = () => {
  const [thought, setThought] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (thought.trim()) {
      // In a real app, we'd save this to a backend
      toast({
        title: "Thought captured",
        description: "Your thought has been safely stored.",
      });
      setThought("");
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