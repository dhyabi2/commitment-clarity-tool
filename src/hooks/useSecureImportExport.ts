
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { parseXML } from '@/utils/xmlUtils';

interface ExportData {
  thoughts: any[];
  commitments: any[];
  exportDate: string;
  userId: string;
}

export const useSecureImportExport = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const exportMutation = useMutation({
    mutationFn: async (): Promise<ExportData> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Explicitly filter by user_id for security
      const [thoughtsResult, commitmentsResult] = await Promise.all([
        supabase
          .from('thoughts')
          .select(`
            *,
            tags:thought_tags(
              tag:tags(*)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('commitments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (thoughtsResult.error) throw thoughtsResult.error;
      if (commitmentsResult.error) throw commitmentsResult.error;

      return {
        thoughts: thoughtsResult.data || [],
        commitments: commitmentsResult.data || [],
        exportDate: new Date().toISOString(),
        userId: user.id // Include for verification
      };
    },
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `brain-dump-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Exported ${data.thoughts.length} thoughts and ${data.commitments.length} commitments.`,
      });
    },
    onError: (error) => {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    }
  });

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const text = await file.text();
      let data: any;

      // Security: Validate file content and structure
      try {
        if (file.name.endsWith('.xml')) {
          // Enhanced XML validation
          data = parseXML(text);
          if (!data || typeof data !== 'object') {
            throw new Error('Invalid XML structure');
          }
        } else if (file.name.endsWith('.json')) {
          data = JSON.parse(text);
        } else {
          throw new Error('Unsupported file format. Please use JSON or XML.');
        }
      } catch (parseError) {
        throw new Error('Invalid file format or corrupted data.');
      }

      // Security: Validate data structure
      if (!data.thoughts && !data.commitments) {
        throw new Error('No valid thoughts or commitments found in the file.');
      }

      // Security: Sanitize and validate each item
      const sanitizedThoughts = (data.thoughts || [])
        .filter((thought: any) => thought && typeof thought.content === 'string')
        .map((thought: any) => ({
          content: String(thought.content).trim().substring(0, 10000), // Limit content length
          completed: Boolean(thought.completed),
          user_id: user.id // Force user_id to current user
        }));

      const sanitizedCommitments = (data.commitments || [])
        .filter((commitment: any) => 
          commitment && 
          typeof commitment.outcome === 'string' && 
          typeof commitment.nextaction === 'string'
        )
        .map((commitment: any) => ({
          outcome: String(commitment.outcome).trim().substring(0, 5000),
          nextaction: String(commitment.nextaction).trim().substring(0, 5000),
          completed: Boolean(commitment.completed),
          user_id: user.id // Force user_id to current user
        }));

      // Security: Check limits to prevent abuse
      if (sanitizedThoughts.length > 1000) {
        throw new Error('Too many thoughts. Maximum 1000 thoughts per import.');
      }
      if (sanitizedCommitments.length > 500) {
        throw new Error('Too many commitments. Maximum 500 commitments per import.');
      }

      const results = [];

      // Import thoughts with explicit user_id
      if (sanitizedThoughts.length > 0) {
        const { error: thoughtsError } = await supabase
          .from('thoughts')
          .insert(sanitizedThoughts);
        
        if (thoughtsError) throw thoughtsError;
        results.push(`${sanitizedThoughts.length} thoughts`);
      }

      // Import commitments with explicit user_id
      if (sanitizedCommitments.length > 0) {
        const { error: commitmentsError } = await supabase
          .from('commitments')
          .insert(sanitizedCommitments);
        
        if (commitmentsError) throw commitmentsError;
        results.push(`${sanitizedCommitments.length} commitments`);
      }

      return { 
        imported: results.join(' and '),
        thoughtsCount: sanitizedThoughts.length,
        commitmentsCount: sanitizedCommitments.length
      };
    },
    onSuccess: (result) => {
      toast({
        title: "Import Successful",
        description: `Successfully imported ${result.imported}.`,
      });
    },
    onError: (error: any) => {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import data. Please check your file format.",
        variant: "destructive",
      });
    }
  });

  return {
    exportData: exportMutation.mutate,
    importData: importMutation.mutate,
    isExporting: exportMutation.isPending,
    isImporting: importMutation.isPending,
  };
};
