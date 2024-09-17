"use client";
import React from "react";
import UserProfile from "../ui/UserProfile";
import { useSession } from "next-auth/react";
import { FaHistory } from "react-icons/fa";

const SideNavbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <nav className="border-r md:w-1/12 w-full p-5 rounded-md justify-end  items-center bg-black flex flex-col">
      
      <div className="flex flex-row w-full justify-center items-center  capitalize">
        <UserProfile user={user} />
      </div>
    </nav>
  );
};

export default SideNavbar;
