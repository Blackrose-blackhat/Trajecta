"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowDownIcon } from "@radix-ui/react-icons";

interface CustomNodeProps {
  data: {
    label: string;
    description?: string;
    timeTaken?: string;
  };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  const router = useRouter();
  const handleNodeClick = () => {
    router.push(`/resources/${data.label}`);
  };

  const description = data.description || "No description available";
  const timeTaken = data.timeTaken || "No time specified";

  return (
    <div
      className="p-10 border border-neutral-300 bg-neutral-700 space-y-5 rounded-md shadow-md shadow-neutral-600 flex flex-col justify-center items-center"
      onClick={handleNodeClick} // Add click handler to navigate
    >
      <h1 className="text-lg font-bold">{data.label}</h1>
      <div>{description}</div>
      <div>
        <strong>Time Taken:</strong> {timeTaken}
      </div>
      <ArrowDownIcon />
    </div>
  );
};

export default CustomNode;
