
import React, { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import ThoughtCard from '@/components/thoughts/ThoughtCard';
import { TagManager } from '@/components/thoughts/TagManager';
import { convertToXML, parseXMLData } from '@/utils/xmlUtils';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ThoughtsHeader } from '@/components/thoughts/ThoughtsHeader';
import { useThoughtsMutations } from '@/hooks/useThoughtsMutations';
import { useThoughtsQuery } from '@/hooks/useThoughtsQuery';

interface ImportedThought {
  content: string;
  completed: boolean;
  device_id: string;
  created_at: string;
  tags: { name: string; }[];
}

const Thoughts = () => {
  const { toast } = useToast();
  const { dir } = useLanguage();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);

  const { data: thoughts, isLoading } = useThoughtsQuery(selectedTag);
  const { addTagMutation, deleteThoughtMutation, toggleCompleteMutation } = useThoughtsMutations();

  // Extract unique tags from thoughts
  const uniqueTags = React.useMemo(() => {
    if (!thoughts) return [];
    const tags = thoughts.flatMap(thought => 
      thought.tags?.map(tag => tag.name) || []
    );
    return Array.from(new Set(tags)).sort();
  }, [thoughts]);

  const handleExport = () => {
    if (!thoughts || !user) return;
    
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
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to import thoughts.",
        variant: "destructive",
      });
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const xmlContent = e.target?.result as string;
        const { thoughts: importedThoughts } = parseXMLData(xmlContent) as { thoughts: ImportedThought[] };
        let importCount = 0;

        for (const thought of importedThoughts) {
          // Check for exact duplicate for this user
          const { data: existingThought } = await supabase
            .from('thoughts')
            .select('id')
            .eq('content', thought.content)
            .eq('user_id', user.id)
            .single();

          if (existingThought) {
            continue; // Skip if duplicate exists for this user
          }

          const { data: thoughtData, error: thoughtError } = await supabase
            .from('thoughts')
            .insert([{ 
              content: thought.content, 
              completed: thought.completed,
              user_id: user.id,
              created_at: thought.created_at
            }])
            .select()
            .single();

          if (thoughtError) throw thoughtError;

          if (thought.tags && thought.tags.length > 0) {
            const { error: tagError } = await supabase
              .from('tags')
              .upsert(
                thought.tags.map(tag => ({ name: tag.name })),
                { onConflict: 'name' }
              );

            if (tagError) throw tagError;

            const { data: existingTags, error: existingTagsError } = await supabase
              .from('tags')
              .select('*')
              .in('name', thought.tags.map(t => t.name));

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
          importCount++;
        }

        toast({
          title: "Import successful",
          description: `Imported ${importCount} thoughts.`,
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

  if (!user) {
    return (
      <div className="min-h-screen bg-cream p-4 flex items-center justify-center" dir={dir()}>
        <div className="text-center text-gray-600">Please sign in to view your thoughts.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream p-4" dir={dir()}>
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

  return (
    <div className="min-h-screen bg-cream p-4 pb-20 md:pb-4" dir={dir()}>
      <div className="max-w-4xl mx-auto">
        <ThoughtsHeader 
          onExport={handleExport}
          onImportClick={() => fileInputRef.current?.click()}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".xml"
          className="hidden"
        />
        <TagManager 
          allTags={uniqueTags}
          selectedTag={selectedTag}
          onTagClick={setSelectedTag}
        />
        <div className="space-y-4">
          {thoughts?.map(thought => (
            <ThoughtCard
              key={thought.id}
              thought={thought}
              onDelete={(id) => deleteThoughtMutation.mutate(id)}
              onToggleComplete={(id, completed) => toggleCompleteMutation.mutate({ thoughtId: id, completed })}
              onAddTag={(thoughtId, tag) => addTagMutation.mutate({ thoughtId, tagName: tag })}
              existingTags={uniqueTags}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Thoughts;
