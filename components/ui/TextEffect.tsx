"use client";
import React, { Suspense } from "react";
import { Button } from "./button";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Spinner } from "./Spinner";

const TextEffectContent = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  return (
    <div className="z-10 md:text-left text-center flex flex-col lg:w-1/2 w-full lg:h-[90vh] space-y-5 justify-center items-center p-responsive">
      <h1 className="lg:text-6xl text-4xl font-bold  w-full tracking-wider md:text-center text-left">
        Get your Own Personalized <br /> Roadmap
      </h1>
      <h3 className="text-semibold  md:text-center text-left   text-neutral-500">
        Be a step ahead from everyone Else
      </h3>

      <div className="flex flex-row w-full md:justify-center justify-start  ">
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

const TextEffect = () => {
  return(
    <Suspense fallback={<Spinner />}>
    <TextEffectContent />
  </Suspense>
  )
}

export default TextEffect;
