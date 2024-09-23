import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generateRoadmapData, createNodesAndEdges } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface RoadmapFormProps {
  setRoadmapData: (data: any) => void;
  setIsLoading: (loading: boolean) => void;
  setHasClicked: (clicked: boolean) => void;
}

const RoadmapForm: React.FC<RoadmapFormProps> = ({ setRoadmapData, setIsLoading, setHasClicked }) => {
  const [isLoading, setIsLoadingState] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim()) return;

      setIsLoading(true);
      setIsLoadingState(true);
      setHasClicked(true);
      setRoadmapData(null);

      try {
        const { topics, connections } = await generateRoadmapData(prompt);
        const { nodes, edges } = createNodesAndEdges(topics, connections);
        setRoadmapData({ nodes, edges });
        localStorage.setItem("prompt", prompt);
      } catch (err) {
        console.error("Error generating roadmap:", err);
        toast({
          title: "An error occurred",
          description:
            err instanceof Error
              ? err.message
              : "Failed to generate roadmap",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsLoadingState(false);
        setPrompt("");
      }
    },
    [prompt, setRoadmapData, setIsLoading, setHasClicked, toast]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter prompt (e.g., Learn Java)"
                className="w-full"
                disabled={isLoading}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Generating..." : "Generate Roadmap"}
              </Button>
            </motion.div>
          </form>
  );
};

export default RoadmapForm;
