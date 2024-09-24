"use server"
import axios from "axios";
import prisma from '@/prisma/prisma';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchYouTubeVideos(
  topic: string,
  prompt: string
): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const videoIds = data.map((item: any) => item.id.videoId);

    console.log('Fetched video IDs:', videoIds);

    return videoIds;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    throw error;
  }
}


export async function fetchResources(prompt: string): Promise<string[]> {
  console.log("prompt is ",prompt);
  try {
    const res = await fetch(`${API_BASE_URL}/api/resource`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const videoId = data.videoIds.map((item: any) => item);

    return videoId;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
}

export async function fetchRoadmapById(id: string): Promise<string[]> {
  try {
    const roadmapData = await prisma.generatedRoadmap.findUnique({
      where: { id },
    });

    if (!roadmapData) {
      throw new Error(`Roadmap with id ${id} not found`);
    }
    console.log(roadmapData);
    
    return roadmapData;

  } catch (error) {
    console.error('Error fetching roadmap:', error);
    throw error;
  }
}
