"use client";
import React, { useEffect, useState } from 'react';
import { getTokens, logoutAction } from "@/actions/user.action";
import { auth, signOut } from "@/auth";
import Link from "next/link";
import { Spotlight } from "../ui/spotlight";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '../ui/button';
import { IconCoins } from '@tabler/icons-react';

const Header = () => {
  const [token, setToken] = useState(null);

  // Function to fetch and update the tokens
  const generateToken = async () => {
    const tokens = await getTokens();
    setToken(tokens);  // Set the token in the state
    return tokens;
  };

  // Effect to fetch tokens on component mount and refresh them periodically
  useEffect(() => {
    // Fetch tokens when the component is mounted
    generateToken();

    // Set interval to refresh tokens every 5 minutes (300000 ms)
      // Adjust time based on your requirement

  
  }, []);

  return (
    <header className="border-b bg-black border-neutral-500 p-5 w-full">
      <nav className="h-full flex flex-row justify-between items-center">
        <div>
          <Link href="/" className="text-2xl font-semibold">
            TRAJECTA
          </Link>
        </div>
        <ul className="flex items-center space-x-4">
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="lg" className="px-7 py-1 ">
                    Beta
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is currently in beta testing</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className='border p-2 flex flex-row space-x-5 items-center justify-center gap-5'>
             <IconCoins /> {10-token }  {/* Display token */}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
