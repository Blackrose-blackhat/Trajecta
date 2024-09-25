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

  

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Roadmaps</h2>
        <Button variant="ghost" size="icon" onClick={handleNewRoadmap}>
          <SquarePen className="h-5 w-5" />
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          roadmaps.map((roadmap) => (
            <Button
              key={roadmap.id}
              variant="ghost"
              className="w-full justify-start my-1"
              onClick={() => handleRoadmapClick(roadmap)}
            >
              {truncatePrompt(roadmap.prompt)}
            </Button>
          ))
        )}
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <UserProfile user={user} />
      </div>
    </div>
  );

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