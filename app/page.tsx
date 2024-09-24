import Header from "@/components/Navbar/header";
import TestimonialSlider from "@/components/Testimonials";
import { BackgroundLines } from "@/components/ui/background-lines";
import ContactUs from "@/components/ui/ContactUs";
import { FeaturesSectionDemo } from "@/components/ui/FeatureSection";
import Model from "@/components/ui/Model";
import RoadmapGeneratedNumber from "@/components/ui/RoadmapGeneratedNumber";
import { Separator } from "@/components/ui/separator";
import { Spotlight } from "@/components/ui/spotlight";
import TextEffect from "@/components/ui/TextEffect";
import Users from "@/components/ui/Users";
import React from "react";

const Page = () => {
  return (
    <div className="w-full flex flex-col items-center ">
      <Spotlight />
      <Header />
      <div className="flex flex-row max-h-screen w-full md:justify-between justify-center items-center p-5 ">
        <TextEffect />
        <Model />
      </div>
      <div className="flex flex-col space-y-5 items-center justify-center">
        <RoadmapGeneratedNumber />
        <Users />
      </div>
      <div className="flex flex-col space-y-10 ">
        <FeaturesSectionDemo />
        <TestimonialSlider />
        <Separator />
        <ContactUs />
      </div>
    </div>
  );
};

export default Page;
