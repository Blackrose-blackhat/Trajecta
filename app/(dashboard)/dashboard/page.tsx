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
import { TextHoverEffect } from "@/components/ui/text-hover-effect"; // Import your TextHoverEffect component
import { fetchRoadmap } from "@/actions/Generate.action";
import { IconDropletX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { LucideMoveUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

const nodeTypes = {
  custom: CustomNode,
};

interface RoadmapData {
  nodes: Node[];
  edges: Edge[];
}

const RoadmapPage: React.FC = () => {
  const { toast } = useToast();
  let router = useRouter();
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [randomId, setRoadmapId] = useState([]);
  const getRandomRoadmap = async () => {
    try {
      const res = await fetchRoadmap();
      setRoadmapId(res);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRandomRoadmap();

    const savedPrompt = localStorage.getItem("prompt");
    console.log("SavedPrompt is", savedPrompt);
    if (savedPrompt) {
      setPrompt(savedPrompt);
    }
  }, []);

  const renderFlowchart = useCallback(() => {
    if (!roadmapData) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full z-10"
      >
        <ReactFlow
          nodes={roadmapData.nodes}
          edges={roadmapData.edges}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          
          <Panel position="top-right">
            <ResourceSheet />
          </Panel>
        </ReactFlow>
      </motion.div>
    );
  }, [roadmapData, prompt]);

  return (
    <div
      className={`h-full flex flex-col w-full relative ${
        !hasClicked ? "items-center justify-center" : ""
      }`}
    >
      {/* Conditionally render TextHoverEffect when hasClicked is false */}
      {!hasClicked && (
        <div className="absolute inset-0 z-0">
          <TextHoverEffect text="TRAJECTA" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex ${
          hasClicked
            ? "flex-col-reverse md:flex-row flex-grow gap-4 "
            : "flex-col items-center w-fit"
        } w-full z-10`} // Added z-10 to ensure content is on top of background
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`${
            hasClicked ? "md:w-1/3" : "w-full max-w-2xl "
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
            This is AI Generated Content and may be inaccurate sometimes.
          </p>

          <div className="flex flex-row space-x-5">
            {!hasClicked &&
              randomId.map((roadmap, idx) => (
                <div key={idx} className="flex flex-row items-center">
                  <Button
                    onClick={() => router.push(`/dashboard/${roadmap?.id}`)}
                    variant="outline"
                    className="flex flex-row gap-2 items-center"
                  >
                    {roadmap.prompt} <LucideMoveUpRight />
                  </Button>
                </div>
              ))}
          </div>
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
