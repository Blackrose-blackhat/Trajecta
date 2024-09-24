// serverActions.ts
'use server';

import { auth, signOut } from '@/auth';
import prisma from '@/prisma/prisma';
export const logoutAction = async () => {
  await signOut();
};

export const getTokens = async()=> {
  const session = await auth();
  const user = session?.user;

  let requestCount = 0;
  if(user){
    const dbUser = await prisma.user.findUnique({
      where:{id:user?.id},
      select:{requestCount : true},

    });
    requestCount = dbUser?.requestCount || 0;
  }
  return requestCount;
  
}

export const getTotalRoadmaps = async () => {

  const totalRoadmaps = await prisma.generatedRoadmap.count();
  return totalRoadmaps;
};

export const getStatisticsTotalRoadmaps = async () => {
  const statistics = await prisma.statistics.findUnique({
    where: { id: 1 },
  });
  return statistics?.totalRoadmaps || 0;
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export const getUserRoadmaps = async(userId:string) => {
 
  const res = await prisma.generatedRoadmap.findMany({
    where:{userId:userId}

  })
  
  return res;
}