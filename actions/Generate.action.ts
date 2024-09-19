import axios from 'axios';

export async function fetchYouTubeVideos(topic: string ,prompt:string): Promise<string[]> {
  try {
    const response = await axios.post('/api/search', { topic,prompt });
    const videoIds = response.data.map((item: any) => item.id.videoId); // Extract video IDs
    return videoIds;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    throw error;
  }
}