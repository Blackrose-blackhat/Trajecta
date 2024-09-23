"use client";

import { fetchRoadmapById } from "@/actions/Generate.action";
import React, { useEffect, useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  Node,
  Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import ResourceSheet from "@/components/ui/Dialogs/ResourceSheet";
import { createNodesAndEdges } from "@/lib/utils";
import CustomNode from "@/components/CustomNode";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

interface RoadmapData {
  nodes: Node[];
  edges: Edge[];
}
const nodeTypes = {
  custom: CustomNode,
};
export default function Page({ params }: { params: { id: string } }) {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const getRoadmapData = async () => {
    try {
      const res = await fetchRoadmapById(params.id);

      setPrompt(res.prompt);
      localStorage.setItem("prompt",res.prompt);
      const content = res.content;
      const topics = content.topics;
      const connections = content.connections;
      const projects = content.projects;
      console.log(projects);
      localStorage.setItem("projects", JSON.stringify(projects));
      console.log(topics, connections);
      const { nodes, edges } = createNodesAndEdges(topics, connections);
      setRoadmapData({ nodes, edges });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch roadmap data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRoadmapData();
  }, [params.id]);

  const renderFlowchart = useCallback(() => {
    if (!roadmapData) return null;

    return (
      <ReactFlow
        nodes={roadmapData.nodes}
        edges={roadmapData.edges}
        fitView
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <ResourceSheet prompt={prompt} />
        </Panel>
        <Panel position="top-left">
          <Button variant="outline" className="rounded-md">
            <Upload /> Share
          </Button>
        </Panel>
      </ReactFlow>
    );
  }, [roadmapData]);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      {isLoading && <Spinner />}
      {error && <p className="text-red-500">{error}</p>}
      {roadmapData && renderFlowchart()}
    </div>
  );
}
