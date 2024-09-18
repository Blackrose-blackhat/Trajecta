"use client";

import { useState, useCallback, useEffect } from "react";
import ReactFlow, { Background, Controls } from "react-flow-renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaLink } from "react-icons/fa";
import { generateRoadmapData, createNodesAndEdges } from "@/lib/utils";
import Component from "@/components/ui/3DRender";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const CustomNode = ({ data }) => {
  const { label, description = "No description available", resources = [] } = data;

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white shadow-md">
      <h3 className="font-bold mb-2 text-lg text-gray-800">{label}</h3>
      <p className="mb-3 text-sm text-gray-600">{description}</p>
      <div>
        {resources.length > 0 ? (
          resources.map((resource, index) => (
            <a
              key={index}
              href={resource}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-500 text-sm mb-1 hover:underline"
            >
              <FaLink className="inline-block mr-1" /> Resource {index + 1}
            </a>
          ))
        ) : (
          <p className="text-sm text-gray-400">No resources available</p>
        )}
      </div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const RoadmapPage = () => {
  const { toast } = useToast();
  const [roadmapData, setRoadmapData] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  // Use effect to load roadmap data from localStorage if available
  useEffect(() => {
    const savedRoadmap = localStorage.getItem("roadmapData");
    const savedPrompt = localStorage.getItem("prompt");
    if (savedRoadmap) {
      setRoadmapData(JSON.parse(savedRoadmap));
      setHasClicked(true);
    }
    if (savedPrompt) {
      setPrompt(savedPrompt);
    }
  }, []);

  // Save roadmap data to localStorage whenever it changes
  useEffect(() => {
    if (roadmapData) {
      localStorage.setItem("roadmapData", JSON.stringify(roadmapData));
    }
  }, [roadmapData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!prompt.trim()) return;

      setIsLoading(true);
      setHasClicked(true);
      setRoadmapData(null);

      try {
        const { topics, connections } = await generateRoadmapData(prompt);
        const { nodes, edges } = createNodesAndEdges(topics, connections);
        setRoadmapData({ nodes, edges });
        localStorage.setItem("prompt", prompt); // Store the prompt
      } catch (err) {
        console.error("Error generating roadmap:", err);
        toast({
          title: "An error occurred",
          description: err.message || "An error occurred while generating the roadmap",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setPrompt("");
      }
    },
    [prompt, toast]
  );

  const renderFlowchart = useCallback(() => {
    if (!roadmapData) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <ReactFlow
          nodes={roadmapData.nodes}
          edges={roadmapData.edges}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </motion.div>
    );
  }, [roadmapData]);

  return (
    <div className={`h-full flex flex-col w-full ${!hasClicked ? 'items-center justify-center' : ''}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex ${hasClicked ? 'flex-col-reverse md:flex-row flex-grow gap-4' : 'flex-col items-center'} w-full`}

      >
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`${hasClicked ? 'md:w-1/3' : 'w-full max-w-2xl'} space-y-4 ${hasClicked ? 'border rounded-md' : ''} p-5 flex flex-col justify-end`}
        >
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

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Generating..." : "Generate Roadmap"}
              </Button>
            </motion.div>
          </form>
          <p className="text-sm text-neutral-400 text-center">
            This is an AI Generated Content and it may be inaccurate sometimes.
          </p>
        </motion.div>
        {hasClicked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-grow border rounded-md shadow-md overflow-hidden"
          >
            {isLoading ? <Component /> : renderFlowchart()}
          </motion.div>
        )}

        
      </motion.div>
    </div>
  );
};

export default RoadmapPage;