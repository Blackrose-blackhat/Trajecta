"use client";
import React from "react";
import { Button } from "./button";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const TextEffect = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  return (
    <div className="z-10 md:text-left text-center flex flex-col w-1/2 h-[90vh] space-y-5 justify-center items-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Get your Own Personalized Roadmap
      </h1>
      <h3 className="text-semibold text-neutral-500">
        Be a step ahead from everyone Else
      </h3>

      <div className="flex flex-row space-x-10 items-center">
        <Button
          onClick={() => {
            signIn("google", { callbackUrl });
          }}
          variant="outline"
          className="space-x-5 flex flex-row p-5 hover:border-violet-400 duration-500 hover:bg-black "
        >
          <FaGoogle /> <p>Sign in with Google</p>
        </Button>
      </div>
    </div>
  );
};

export default TextEffect;
