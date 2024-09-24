import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  throw new Error("Missing YouTube API key. Please set YOUTUBE_API_KEY in your environment variables.");
}

async function searchYouTubeVideos(prompt: string): Promise<string[]> {
  const url = 'https://www.googleapis.com/youtube/v3/search';
  const params = {
    part: 'snippet',
    q: prompt,
    type: 'video',
    maxResults: 5,
    key: YOUTUBE_API_KEY,
  };

  try {
    const response = await axios.get(url, { params });
    const videoIds = response.data.items.map((item: any) => item.id.videoId);
    return videoIds;
  } catch (error) {
    console.error('Error searching YouTube:', error);
    throw error;
  }
}


export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const videoIds = await searchYouTubeVideos(prompt);
    

    return NextResponse.json({ videoIds }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}