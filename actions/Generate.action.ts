"use server";

import prisma from '@/prisma/prisma';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (i === retries - 1) {
        console.error('Error fetching data after multiple attempts:', error);
        throw error;
      }
      console.warn(`Retrying fetch... (${i + 1}/${retries})`);
    }
  }
  throw new Error('Failed to fetch data after multiple attempts');
}

export async function fetchYouTubeVideos(
  topic: string,
  prompt: string
): Promise<string[]> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, prompt }),
    });

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
  console.log("prompt is ", prompt);
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/resource`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    const videoId = data.videoIds.map((item: any) => item);

    return videoId;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
}

export async function fetchRoadmapById(id: string): Promise<any> {
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
