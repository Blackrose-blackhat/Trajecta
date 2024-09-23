"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  Node,
  Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";


import { generateRoadmapData, createNodesAndEdges } from "@/lib/utils";
import Component from "@/components/ui/3DRender";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

import ResourceSheet from "@/components/ui/Dialogs/ResourceSheet";
import CustomNode from "@/components/CustomNode";
import RoadmapForm from "@/components/RoadmapForm";

const nodeTypes = {
  custom: CustomNode,
};

interface RoadmapData {
  nodes: Node[];
  edges: Edge[];
}

const RoadmapPage: React.FC = () => {
  const { toast } = useToast();
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

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

  useEffect(() => {
    if (roadmapData) {
      localStorage.setItem("roadmapData", JSON.stringify(roadmapData));
    }
  }, [roadmapData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim()) return;

      setIsLoading(true);
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
              : "An error occurred while generating the roadmap",
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
          <Panel position="top-right">
            <ResourceSheet prompt={prompt} />
          </Panel>
        </ReactFlow>
      </motion.div>
    );
  }, [roadmapData, prompt]);

  return (
    <div
      className={`h-full flex flex-col w-full ${
        !hasClicked ? "items-center justify-center" : ""
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex ${
          hasClicked
            ? "flex-col-reverse md:flex-row flex-grow gap-4"
            : "flex-col items-center"
        } w-full`}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`${
            hasClicked ? "md:w-1/3" : "w-full max-w-2xl"
          } space-y-4 ${
            hasClicked ? "border rounded-md" : ""
          } p-5 flex flex-col justify-end`}
        >
          <RoadmapForm
            setRoadmapData={setRoadmapData}
            setHasClicked={setHasClicked}
            setIsLoading={setIsLoading}
          />
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