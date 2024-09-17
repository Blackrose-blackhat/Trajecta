import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const gen = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    const model = gen.getGenerativeModel({
      model: "gemini-pro",
    });
    const data = await req.json();
    const { prompt } = data;

    const modifiedPrompt = `Get all the detailed Resources in a structured format of ${prompt}
        also include about all the topics from the official websites , add youtube and coursera links, 
        also include all the books and articles related to the topic
        also include all the courses and tutorials related to the topic
        also include all the communities and forums related to the topic
        also include all the tools and software related to the topic
        also include all the Projects related to the topic in a format like 
        Beginner , advaned and Intermediate
        provide in a json format like :
        {
        "resources":[
            {
                "name" : "",
                "description" : "",
                resources : "url"

            }
        ]
    },
    "projects" : [
        {"project1" : "Description" , "githubLink":}
    ]
        },

        `;
    const res = await model.generateContent(modifiedPrompt);
    const response = await res.response.text();

    console.log("response is" , response);

    return NextResponse.json({response});

  } catch (error) {
    console.error(error);
    return NextResponse.json({error:"An error occurred"});
  }

}
