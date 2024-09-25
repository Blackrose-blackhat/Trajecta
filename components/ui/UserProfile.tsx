import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import UserProfleDialog from "./Dialogs/UserProfleDialog";
import { Separator } from "./separator";

const UserProfile: React.FC = ({ user }) => {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const handleProfileClick = () => {
    setIsProfileDialogOpen(true);
  };

  const handleCloseProfileDialog = () => {
    setIsProfileDialogOpen(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
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
        <DropdownMenuItem onClick={handleProfileClick}>
          Profile
        </DropdownMenuItem>
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
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogTrigger asChild>
          <button style={{ display: "none" }}>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Profile</DialogTitle>
          <Separator />
          <DialogDescription>
           
           <UserProfleDialog user={user} />
          </DialogDescription>
         
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
};

export default UserProfile;
