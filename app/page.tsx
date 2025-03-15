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
    <div className="w-full flex flex-col items-center   ">
      <Spotlight />
      <Header />
     <div className="flex flex-col h-[90vh] w-full justify-between ">
     <div className="flex flex-row lg:max-h-screen h-full w-full lg:justify-between justify-center items-center p-5 ">
        <TextEffect />
        <Model />
      </div>
      <div className="flex flex-col space-y-5 items-center justify-center p-2">
        <RoadmapGeneratedNumber />
        <Users />
      </div>
     </div>
      <div className="flex flex-col space-y-10 ">
        {/* <FeaturesSectionDemo /> */}
        {/* <TestimonialSlider /> */}
        {/* <Separator />
        <ContactUs /> */}
      </div>
    </div>
  );
};

export default Page;
