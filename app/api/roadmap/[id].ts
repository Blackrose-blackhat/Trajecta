// pages/api/roadmap/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchRoadmapById } from '@/actions/Generate.action';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const roadmap = await fetchRoadmapById(id as string);
    res.status(200).json(roadmap);
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
