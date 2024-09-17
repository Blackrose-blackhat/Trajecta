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