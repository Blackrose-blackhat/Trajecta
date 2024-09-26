"use client"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUserRoadmaps } from "@/actions/user.action";
import { useToast } from "@/hooks/use-toast";
import UserProfile from "../ui/UserProfile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SquarePen, Menu } from "lucide-react";
import { Spinner } from "../ui/Spinner";
import { truncatePrompt } from "@/lib/utils";

interface Roadmap {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  prompt: string;
}

const SheetStyleSidebar = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const user = session?.user;

  const getRoadmaps = async () => {
    try {
      const res = await getUserRoadmaps(user?.id);
      setRoadmaps(res);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch roadmaps",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getRoadmaps();
      const intervalId = setInterval(getRoadmaps, 30000);
      return () => clearInterval(intervalId);
    }
  }, [user?.id]);

  const handleNewRoadmap = () => {
    localStorage.removeItem("prompt");
    localStorage.removeItem("roadmapData");
    router.push("/dashboard");
    router.refresh();
  };

  const handleRoadmapClick = (roadmap: Roadmap) => {
    router.push(`/dashboard/${roadmap.id}`);
  };

  const organizeRoadmapsByDate = (roadmaps: Roadmap[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return roadmaps.reduce((acc, roadmap) => {
      const createdAt = new Date(roadmap.createdAt);
      if (createdAt >= today) {
        acc.today.push(roadmap);
      } else if (createdAt >= yesterday) {
        acc.yesterday.push(roadmap);
      } else if (createdAt >= sevenDaysAgo) {
        acc.pastWeek.push(roadmap);
      } else {
        acc.older.push(roadmap);
      }
      return acc;
    }, { today: [], yesterday: [], pastWeek: [], older: [] } as Record<string, Roadmap[]>);
  };

  const RoadmapList = ({ roadmaps, title }: { roadmaps: Roadmap[], title: string }) => {
    if (roadmaps.length === 0) return null;

    return (
      <>
        <h3 className="text-md font-semibold mt-4 mb-2">{title}</h3>
        <Separator />
        {roadmaps.map((roadmap) => (
          <Button
            key={roadmap.id}
            variant="ghost"
            className="w-full justify-start my-1 text-neutral-400"
            onClick={() => handleRoadmapClick(roadmap)}
          >
            {truncatePrompt(roadmap.prompt)}
          </Button>
        ))}
      </>
    );
  };

  const SidebarContent = () => {
    const organizedRoadmaps = organizeRoadmapsByDate(roadmaps);

    return (
      <div className="flex flex-col h-full bg-black">
        <div className="flex items-center justify-end p-4">
          <Button variant="ghost" size="icon" onClick={handleNewRoadmap}>
            <SquarePen className="h-5 w-5" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-3">
          {loading ? (
            <div className="flex justify-center flex-col items-center h-[70vh]">
              <Spinner />
            </div>
          ) : (
            <>
              <RoadmapList roadmaps={organizedRoadmaps.today} title="Today" />
              <RoadmapList roadmaps={organizedRoadmaps.yesterday} title="Yesterday" />
              <RoadmapList roadmaps={organizedRoadmaps.pastWeek} title="Past 7 Days" />
              <RoadmapList roadmaps={organizedRoadmaps.older} title="Older" />
            </>
          )}
        </ScrollArea>
        <Separator />
        <div className="p-4">
          <UserProfile user={user} />
        </div>
      </div>
    );
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <div className="hidden md:block w-[300px] border-r bg-background">
        <SidebarContent />
      </div>
    </>
  );
};

export default SheetStyleSidebar;