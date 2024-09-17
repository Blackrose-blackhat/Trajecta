import React, { useCallback } from "react";
import ReactFlow from "react-flow-renderer";
import CustomNode from "./CustomNode";

const Flowchart = (roadmapData) => {
  console.log(roadmapData.roadmapData);
  const nodeTypes = {
    custom: CustomNode,
  };

  // Filter and validate nodes and edges
  const cleanedNodes = roadmapData?.nodes?.filter(
    (node: any) => node.id && node.position,
  );
  const cleanedEdges = roadmapData?.edges?.filter(
    (edge: any) => edge.source && edge.target,
  );

  const renderFlowchart = useCallback(() => {
    if (!cleanedNodes.length) return null;

    return (
      <div className="relative w-full h-screen overflow-auto">
        <ReactFlow
          nodes={cleanedNodes}
          edges={cleanedEdges}
          nodeTypes={nodeTypes}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            padding: "20px",
          }}
          fitView
        />
      </div>
    );
  }, [cleanedNodes, cleanedEdges]);

  return renderFlowchart();
};

export default Flowchart;
