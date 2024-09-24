"use client"
import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { getStatisticsTotalRoadmaps } from '@/actions/user.action';

const RoadmapGeneratedNumber = () => {
  const [totalRoadmaps, setTotalRoadmaps] = useState<number>(0);

  const fetchTotalRoadmaps = async () => {
    try {
      const total = await getStatisticsTotalRoadmaps();
      setTotalRoadmaps(total);
    } catch (error) {
      console.error('Error fetching total roadmaps:', error);
    }
  };

  useEffect(() => {
    fetchTotalRoadmaps();
  }, []);

  return (
    <div>
      <h1 className='text-2xl '>
       
        <CountUp end={totalRoadmaps} duration={1} />
        {" "}
        Roadmap Generated!
      </h1>
    </div>
  );
};

export default RoadmapGeneratedNumber;