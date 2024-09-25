"use client";

import React, { useCallback, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../button";
import { fetchResources } from "@/actions/Generate.action";
import { Spinner } from "../Spinner";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../separator";



const ResourceSheet = (  ) => {

  let { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resource, setResource] = useState(null);
  const projects = localStorage.getItem("projects");
  const prompt = localStorage.getItem("prompt");
  const getResources = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchResources(prompt);
      console.log(res);
      const videoUrls = res.map(
        (videoIds: string) => `https://www.youtube.com/watch?v=${videoIds}`
      );
      console.log("videoUrls", videoUrls);
      setResource(videoUrls);
      console.log("Resources fetched: ", res);
    } catch (error) {
      toast({
        title: "An Error Occurred",
        description: `Error ${error}`,
        variant: "destructive",
      });
      console.error("Error fetching resources: ", error);
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  // const getResources = ()=>{
  //   console.log("Working")
  // }

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline">Additional Resources</Button>
      </SheetTrigger>
      <SheetContent className="max-h-[100vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-center">Additional Resources</SheetTitle>
          <SheetDescription className="flex flex-col justify-center items-center gap-5">
            <div className="flex flex-col space-y-5 w-full">
              {loading ? (
                <Spinner />
              ) : (
                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg">Youtube Videos</h1>
                    <Button variant="destructive" onClick={getResources}>
                      Fetch Videos
                    </Button>
                    <Separator />
                    {resource?.map((url, idx) => {
                      const isYouTubeUrl =
                        url.includes("youtube.com") || url.includes("youtu.be");
                      const embedUrl = isYouTubeUrl
                        ? url
                            .replace("watch?v=", "embed/")
                            .replace("youtu.be/", "youtube.com/embed/")
                        : url;

                      return (
                        <div
                          key={idx}
                          className="w-full aspect-w-16 aspect-h-9"
                        >
                          <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg">Projetcs</h1>
                    <Separator />
                    {projects && (
                      <div className="flex flex-col gap-4 p-4 border rounded-lg">
                        {JSON.parse(projects).map((project, idx) => (
                          <div key={idx} className="p-4 rounded-md shadow-md">
                            <h2 className="text-neutral-100  font-semibold">{`${
                              project.name
                            } ${idx + 1}`}</h2>
                            <p className="text-neutral-300 mt-2">
                              {project.description}
                            </p>
                            <p className="text-neutral-500 mt-1">
                              {project.level}
                            </p>
                            <p className="text-neutral-500 mt-1">
                              Average time : {project.time_taken}
                            </p>

                            <Separator />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ResourceSheet;
