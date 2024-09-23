"use client";
import React, { useEffect, useState } from "react";
import UserProfile from "../ui/UserProfile";
import { useSession } from "next-auth/react";
import { getUserRoadmaps } from "@/actions/user.action";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Roadmap {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  prompt: string;
}

const SideNavbar = () => {
  let {toast} = useToast();
  let router = useRouter();
  const [roadmap, setRoadmap] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap[]>([]);
  const { data: session } = useSession();
  const user = session?.user;

  const getRoadmap = async () => {
    try {
      const res = await getUserRoadmaps(user?.id);
      console.log(res);
      setRoadmap(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleClick = (roadmap: Roadmap) => {
    setSelectedRoadmap(roadmap);
    try {
      router.push(`/dashboard/${roadmap.id}`);
    } catch (error) {
      toast({
        title:"An Error occured",
        description:"Error Occurred"
      })
    }
  };

  useEffect(() => {
    if (user?.id) {
      getRoadmap();
      const intervalId = setInterval(getRoadmap, 60000); // Fetch new data every minute
      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [user?.id]);

  const truncatePrompt = (prompt: string) => {
    return prompt.length > 10 ? `${prompt.substring(0, 10)}...` : prompt;
  };

  return (
    <nav className="border-r md:w-1/12 w-full p-5 rounded-md justify-end items-center bg-black flex flex-col">
      <div className="flex-1 overflow-y-auto hide-scrollbar w-full">
        {loading ? (
          <div className="text-white">Loading roadmaps...</div>
        ) : (
          roadmap?.map((content, idx) => (
            <div key={idx} className="mb-3 text-sm text-neutral-300">
              {" "}
              {/* Add margin-bottom to create space between buttons */}
              <Button
                variant="outline"
                className="gap-3"
                onClick={() => handleClick(content)}
              >
                {truncatePrompt(content.prompt)}
              </Button>
            </div>
          ))
        )}
      </div>
      <div className="flex flex-row w-full justify-center items-center capitalize mt-4">
        <UserProfile user={user} />
      </div>
    </nav>
  );
};

export default SideNavbar;
