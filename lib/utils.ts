import { MarkerType } from "@xyflow/react";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateRoadmapData = async (prompt) => {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate roadmap");
  }

  const { topics, connections } = data.flowchartData;
  const {projects} = data.flowchartData;
  localStorage.setItem("projects",JSON.stringify(projects));


  if (!topics || !connections) {
    throw new Error("Invalid roadmap data received");
  }

  return { topics, connections };
};

export const createNodesAndEdges = (topics, connections) => {

  const nodes = topics.map((topic, index) => ({
    id: topic.name,
    data: {
      label: topic.name,
      description: topic.description,
      resources: topic.resources,
      timeTaken: topic.time_taken,
    },
    position: { x: 0, y: index * 300 },
    type: "custom",
  }));

  const edges = connections.map((connection) => ({
    id: `${connection.from}-${connection.to}`,
    source: connection.from,
    target: connection.to,
    type: 'smoothstep',
    animated: false,
  
   
  }));

  return { nodes, edges };
};

export const truncatePrompt = (prompt: string) => {
  return prompt?.length > 18 ? `${prompt.substring(0, 18)}...` : prompt;
};