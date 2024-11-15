import { useToast } from "@/components/ui/use-toast";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface AddThoughtParams {
  content: string;
  tags: string[];
}

interface UseBrainDumpMutationProps {
  onSuccess?: () => void;
}

export const useBrainDumpMutation = ({ onSuccess }: UseBrainDumpMutationProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const addThoughtMutation = useMutation({
    mutationFn: async ({ content, tags }: AddThoughtParams) => {
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
      toast({
        title: t('common.success'),
        description: t('brainDump.thoughtCaptured'),
      });
      onSuccess?.();
    }
  });

  return { addThoughtMutation };
};