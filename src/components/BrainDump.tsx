import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const BrainDump = () => {
  const [thought, setThought] = useState("");
  const queryClient = useQueryClient();

  const addThoughtMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) throw new Error("No user found");

      const { error } = await supabase.from("thoughts").insert([
        {
          content,
          user_id: session.session.user.id,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      setThought("");
      queryClient.invalidateQueries({ queryKey: ["thoughts"] });
      toast.success("Thought captured successfully");
    },
    onError: (error) => {
      toast.error("Error capturing thought");
      console.error("Error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;
    addThoughtMutation.mutate(thought);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="What's on your mind? Capture your thoughts here..."
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        className="min-h-[100px]"
      />
      <Button
        type="submit"
        className="w-full bg-sage-600 hover:bg-sage-700"
        disabled={!thought.trim() || addThoughtMutation.isPending}
      >
        {addThoughtMutation.isPending ? "Capturing..." : "Capture Thought"}
      </Button>
    </form>
  );
};

export default BrainDump;