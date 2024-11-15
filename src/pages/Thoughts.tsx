import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import ThoughtCard from '@/components/thoughts/ThoughtCard';
import { TagManager } from '@/components/thoughts/TagManager';
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { convertToXML, parseXMLData } from '@/utils/xmlUtils';

const Thoughts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: thoughts, isLoading } = useQuery({
    queryKey: ['thoughts', 'active', selectedTag],
    queryFn: async () => {
      let query = supabase
        .from('thoughts')
        .select(`
          *,
          tags:thought_tags(
            tag:tags(*)
          )
        `)
        .eq('completed', false)
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;

      const transformedData = data.map(thought => ({
        ...thought,
        tags: thought.tags
          ?.map(t => t.tag)
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name))
      }));

      if (selectedTag) {
        return transformedData.filter(thought => 
          thought.tags?.some(tag => tag.name === selectedTag)
        );
      }

      return transformedData;
    }
  });

  const addTagMutation = useMutation({
    mutationFn: async ({ thoughtId, tagName }: { thoughtId: number; tagName: string }) => {
      // First, insert or get the tag
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .upsert({ name: tagName }, { onConflict: 'name' })
        .select()
        .single();
      
      if (tagError) throw tagError;

      // Then create the relationship
      const { error: relationError } = await supabase
        .from('thought_tags')
        .insert({ thought_id: thoughtId, tag_id: tagData.id });

      if (relationError) throw relationError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      toast({
        title: "Tag added",
        description: "The tag has been added to your thought.",
      });
    }
  });

  const deleteThoughtMutation = useMutation({
    mutationFn: async (thoughtId: number) => {
      const { error } = await supabase
        .from('thoughts')
        .delete()
        .eq('id', thoughtId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      toast({
        title: "Thought deleted",
        description: "Your thought has been successfully removed.",
      });
    }
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ thoughtId, completed }: { thoughtId: number; completed: boolean }) => {
      const { error } = await supabase
        .from('thoughts')
        .update({ completed })
        .eq('id', thoughtId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      queryClient.invalidateQueries({ queryKey: ['completed-thoughts'] });
      toast({
        title: "Thought updated",
        description: "The thought status has been updated.",
      });
    }
  });

  const handleExport = () => {
    if (!thoughts) return;
    
    const xmlContent = convertToXML(thoughts);
    const blob = new Blob([xmlContent], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'thoughts.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const xmlContent = e.target?.result as string;
        const { thoughts } = parseXMLData(xmlContent);

        // Import thoughts
        for (const thought of thoughts) {
          const { data: thoughtData, error: thoughtError } = await supabase
            .from('thoughts')
            .insert([{ content: thought.content, completed: thought.completed }])
            .select()
            .single();

          if (thoughtError) throw thoughtError;

          // Import tags for the thought
          if (thought.tags && thought.tags.length > 0) {
            const { data: tagData, error: tagError } = await supabase
              .from('tags')
              .upsert(
                thought.tags.map(tag => ({ name: tag.name })),
                { onConflict: 'name' }
              )
              .select();

            if (tagError) throw tagError;

            // Create thought-tag relationships
            const { error: relationError } = await supabase
              .from('thought_tags')
              .insert(
                tagData.map(tag => ({
                  thought_id: thoughtData.id,
                  tag_id: tag.id
                }))
              );

            if (relationError) throw relationError;
          }
        }

        queryClient.invalidateQueries();
        toast({
          title: "Import successful",
          description: "Your data has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "There was an error importing your data. Please try again.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-sage-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Get unique tags from all thoughts
  const allTags = Array.from(
    new Set(thoughts?.flatMap(thought => thought.tags?.map(tag => tag.name) || []))
  ).sort();

  return (
    <div className="min-h-screen bg-cream p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-sage-600">Your Thoughts</h1>
            <div className="flex gap-2">
              <Button
                onClick={handleExport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".xml"
                className="hidden"
              />
            </div>
          </div>
          <p className="text-sage-500 mb-6">
            Review and clarify your thoughts to turn them into actionable commitments
          </p>
          <TagManager 
            allTags={allTags}
            selectedTag={selectedTag}
            onTagClick={handleTagClick}
          />
          <div className="space-y-4">
            {thoughts?.map(thought => (
              <ThoughtCard
                key={thought.id}
                thought={thought}
                onDelete={(id) => deleteThoughtMutation.mutate(id)}
                onToggleComplete={(id, completed) => toggleCompleteMutation.mutate({ thoughtId: id, completed })}
                onAddTag={(thoughtId, tag) => addTagMutation.mutate({ thoughtId, tagName: tag })}
                existingTags={allTags}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thoughts;