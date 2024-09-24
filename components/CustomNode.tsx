import { fetchYouTubeVideos } from "@/actions/Generate.action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/Spinner";
interface CustomNodeData {
  label: string;
  description?: string;
}


const CustomNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  let { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<string[] | null>(
    null
  );
  const [videos, setVideos] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { label, description = "No description available" } = data;

  const handleDialogOpen = useCallback(async () => {
    const prompt = localStorage.getItem("prompt");
    setIsDialogOpen(true);
    setIsLoading(true);

    try {
      const videoIds = await fetchYouTubeVideos(label, prompt || "");
      console.log(videoIds)
      setVideos(videoIds);

      const videoUrls = videoIds.map(
        (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`
      );
      setSelectedResource(videoUrls);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "An error occurred",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching the resources",
        variant: "destructive",
      });
      setIsDialogOpen(false);
    } finally {
      setIsLoading(false);
    
    }
  }, [label]);

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white shadow-md">
      <h3 className="font-bold mb-2 text-lg text-gray-800">{label}</h3>
      <p className="mb-3 text-sm text-gray-600">{description}</p>
      <div>
        <Button variant="outline" onClick={handleDialogOpen}>
          Resource
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex flex-col items-center p-4">
          <DialogHeader>
            <DialogTitle>{label} - Resource Details</DialogTitle>
            <DialogDescription className="flex flex-col items-center w-full space-y-4 py-5">
              {isLoading ? (
                <Spinner size="large" />
              ) : (
                selectedResource?.map((url, index) => {
                  const isYouTubeUrl =
                    url.includes("youtube.com") || url.includes("youtu.be");
                  const embedUrl = isYouTubeUrl
                    ? url
                        .replace("watch?v=", "embed/")
                        .replace("youtu.be/", "youtube.com/embed/")
                    : url;

                  return (
                    <div key={index} className="w-full aspect-w-16 aspect-h-9">
                      <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
                  );
                })
              )}

              {/* TODO:add resources like ebooks or wiki links */}
             
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomNode