import React from 'react';
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

const Header = async () => {
  const session = await auth();
  const user = session?.user;

  const tokens = await getTokens();
  console.log("tokens are" , tokens)

  return (
    <header className="border-b bg-black border-neutral-500 p-5 w-full">
      <nav className="h-full flex flex-row justify-between items-center">
        <div>
          <Link href="/" className="text-2xl font-semibold">
            Roadmap Generator
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
                  <p>This  is currently in beta testing</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;