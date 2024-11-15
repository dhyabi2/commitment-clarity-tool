import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Tag as TagIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BrainDump = () => {
  const [thought, setThought] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: thoughts, isLoading } = useQuery({
    queryKey: ['thoughts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const addThoughtMutation = useMutation({
    mutationFn: async ({ content, tags }: { content: string; tags: string[] }) => {
      const { data: thoughtData, error: thoughtError } = await supabase
        .from('thoughts')
        .insert([{ content }])
        .select()
        .single();
      
      if (thoughtError) throw thoughtError;

      if (tags.length > 0) {
        const { data: tagData, error: tagError } = await supabase
          .from('tags')
          .upsert(
            tags.map(name => ({ name })),
            { onConflict: 'name' }
          )
          .select();

        if (tagError) throw tagError;

        const { data: existingTags, error: existingTagsError } = await supabase
          .from('tags')
          .select('*')
          .in('name', tags);

        if (existingTagsError) throw existingTagsError;

        const { error: relationError } = await supabase
          .from('thought_tags')
          .insert(
            existingTags.map(tag => ({
              thought_id: thoughtData.id,
              tag_id: tag.id
            }))
          );

        if (relationError) throw relationError;
      }

      return thoughtData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      toast({ description: "Thought captured" });
      setThought("");
      setTags([]);
      setTagInput("");
    }
  });

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (thought.trim()) {
      addThoughtMutation.mutate({ content: thought, tags });
    }
  };

  return (
    <div className="animate-fade-in p-4 sm:p-0">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <Textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="What's on your mind?"
          className="min-h-[120px] sm:min-h-[150px] input-field text-sm sm:text-base"
        />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TagIcon className="h-4 w-4 text-gray-500" />
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter)"
              className="flex-1"
            />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="bg-sage-100 text-sage-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-sage-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          className="w-full sm:w-auto btn-primary"
          disabled={addThoughtMutation.isPending}
        >
          <Plus className="mr-2 h-4 w-4" />
          Capture
        </Button>
      </form>
    </div>
  );
};

export default BrainDump;