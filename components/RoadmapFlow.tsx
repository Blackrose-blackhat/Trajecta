import React, { useCallback } from "react";
import { ReactFlow, Background, Controls, Panel, Node, Edge } from "@xyflow/react";
import { motion } from "framer-motion";
import ResourceSheet from "@/components/ui/Dialogs/ResourceSheet";
import CustomNode from "./CustomNode";

interface RoadmapFlowProps {
  roadmapData: { nodes: Node[]; edges: Edge[] } | null;
  savedPrompt: string | null;
}

const RoadmapFlow: React.FC<RoadmapFlowProps> = ({ roadmapData, savedPrompt }) => {
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
          fitView
          nodeTypes={{ custom: CustomNode }}
        >
          <Background />
          <Controls />
          <Panel position="top-right">
            <ResourceSheet prompt={savedPrompt} />
          </Panel>
        </ReactFlow>
      </motion.div>
    );
  }, [roadmapData]);

  return roadmapData ? renderFlowchart() : null;
};

export default RoadmapFlow;
