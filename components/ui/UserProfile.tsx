"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarImage } from "./avatar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
const UserProfile = ({ user }) => {
  let router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
       
          <div className="relative w-10 h-10">
            <Image
              className="rounded-full cursor-pointer "
              src={user?.image}
              alt="hello"
              fill
            />
          </div>
          
      
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            localStorage.removeItem("prompt");
            localStorage.removeItem("roadmapData");
            signOut();

          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
