import Header from "@/components/Navbar/header";
import { BackgroundLines } from "@/components/ui/background-lines";
import Model from "@/components/ui/Model";
import { Spotlight } from "@/components/ui/spotlight";
import TextEffect from "@/components/ui/TextEffect";
import React from "react";

const Page = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center">
      <Spotlight />
      <Header />
      <div className="flex flex-row w-full md:justify-between justify-center items-center ">
        <TextEffect />
        <Model />
      </div>
    </div>
  );
};

export default Page;
