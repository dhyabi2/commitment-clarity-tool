import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThoughtsList from "@/components/thoughts/ThoughtsList";
import BrainDump from "@/components/BrainDump";
import { toast } from "sonner";

const Thoughts = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("active");

  const { data: thoughts = [], isLoading } = useQuery({
    queryKey: ["thoughts", activeTab],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) throw new Error("No user found");

      const { data, error } = await supabase
        .from("thoughts")
        .select("*")
        .eq("user_id", session.session.user.id)
        .eq("completed", activeTab === "completed")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("thoughts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thoughts"] });
      toast.success("Thought deleted successfully");
    },
    onError: (error) => {
      toast.error("Error deleting thought");
      console.error("Error:", error);
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const { error } = await supabase
        .from("thoughts")
        .update({ completed })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thoughts"] });
      toast.success("Thought updated successfully");
    },
    onError: (error) => {
      toast.error("Error updating thought");
      console.error("Error:", error);
    },
  });

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <BrainDump />
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-sage-100 data-[state=active]:text-sage-900"
            onClick={() => setActiveTab("active")}
          >
            Active Thoughts
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-sage-100 data-[state=active]:text-sage-900"
            onClick={() => setActiveTab("completed")}
          >
            Completed Thoughts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-6">
          <ThoughtsList
            thoughts={thoughts}
            onDelete={(id) => deleteMutation.mutate(id)}
            onToggleComplete={(id, completed) =>
              toggleCompleteMutation.mutate({ id, completed })
            }
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <ThoughtsList
            thoughts={thoughts}
            onDelete={(id) => deleteMutation.mutate(id)}
            onToggleComplete={(id, completed) =>
              toggleCompleteMutation.mutate({ id, completed })
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Thoughts;