import React, { useState } from "react";

import Image from "next/image";
import { Input } from "../input";
import { Label } from "../label";
import { Button } from "../button";
import { deleteUserHistory } from "@/actions/user.action";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "../Spinner";
const UserProfleDialog = ({ user }) => {
  const [loading, setLoading] = useState(false);
  let { toast } = useToast();
  const handleDeleteHistory = async () => {
    try {
      setLoading(true);
      const res = await deleteUserHistory(user?.id);

      toast({
        title: "Success",
        description: "History deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error deleting history",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-4 w-full ">
      {/* //image field */}
      <div className="flex flex-row w-full items-center justify-center">
        <div className="relative h-20 w-20 rounded-full flex flex-row ">
          <Image src={user?.image} alt="image" fill className="rounded-full" />
        </div>
        <div className="flex flex-row items-center justify-center"></div>
      </div>

      {/* //name field */}

      <Input type="text" value={user?.name} disabled />
      <Input type="email" value={user?.email} disabled />

      <div>
        <Button onClick={handleDeleteHistory} variant="destructive">
          {loading ? <Spinner size="small" /> : "Delete History"}
        </Button>
      </div>
    </section>
  );
};

export default UserProfleDialog;
