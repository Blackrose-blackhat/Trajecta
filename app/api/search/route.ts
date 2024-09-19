import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Load environment variables
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  throw new Error("Missing YouTube API key. Please set YOUTUBE_API_KEY in your environment variables.");
}

async function searchYouTube(topic: string , prompt:string): Promise<any> {
 
  const query = topic + " " + prompt;
  console.log("query is " , query);
  const url = 'https://www.googleapis.com/youtube/v3/search';
  const params = {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: 3,
    key: YOUTUBE_API_KEY,
  };

  try {
    const response = await axios.get(url, { params });
    return response.data.items; // Return the items array directly
  } catch (error) {
    console.error('Error searching YouTube:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { topic,prompt } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const results = await searchYouTube(topic,prompt);
    console.log(results);
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}