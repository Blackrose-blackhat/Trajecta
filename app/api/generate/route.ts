import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";
import prisma from "@/prisma/prisma";

export const maxDuration = 60;
const maxRetries = 3; // Maximum number of retries
const retryDelay = 1000; // Delay between retries in milliseconds

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = session?.user;
  const userId = user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: "User not found! Please login first." },
      { status: 401 }
    );
  }

  // Initialize Google Generative AI
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

  try {
    const data = await req.json();
    const { prompt } = data;

    const userInfo = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const existingRoadmaps = await prisma.generatedRoadmap.findFirst({
      where:{
        prompt:prompt.toLowerCase(),
      },
    })

    if (existingRoadmaps) {
      const flowchartData = {
        flowchartData: existingRoadmaps.content,
      };
    
      return NextResponse.json(flowchartData, {
        status: 200,
        statusText: "Found roadmap from DB, no need to generate.",
      });
    }

    // if(existingRoadmaps){
    //    // Clean up unnecessary characters from the response
    //    const cleanedResponseText = existingRoadmaps
    //    .replace(/```json/g, "")
    //    .replace(/```/g, "")
    //    .trim();

    //  // Validate and parse the JSON response
    //  if (!isValidJSON(cleanedResponseText)) {
    //    throw new Error("Invalid JSON format");
    //  }

    //  let flowchartData = JSON.parse(cleanedResponseText);
    //   return NextResponse.json(existingRoadmaps,{status:200})
    // }

    if (!userInfo) {
      return NextResponse.json(
        { error: "User info not found." },
        { status: 404 }
      );
    }

    const currTimestamp = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Check if the user has exceeded the request limit
    if (
      currTimestamp - new Date(userInfo.lastRequestTimestamp).getTime() <
      oneDay
    ) {
      if (userInfo.requestCount >= parseInt(process.env.LIMIT || "0")) {
        return NextResponse.json(
          { error: "Request limit exceeded. Try again tomorrow." },
          { status: 429 }
        );
      }
    } else {
      // Reset the request count for the new day
      await prisma.user.update({
        where: { id: userId },
        data: {
          requestCount: 1,
          lastRequestTimestamp: new Date(currTimestamp),
        },
      });
    }

    // Prepare the modified prompt
    const modifiedPrompt = `
Create a flowchart for learning ${prompt} with the following requirements:
1. Include key concepts and skills needed to master ${prompt}.
2. Arrange the concepts in a logical learning order.
4. It should be strictly in the below given format.
5. Give proper data that covers all the topics of the ${prompt} in depth.
6, Provide Additional Next steps also after that
3. Present the output in the following JSON format:
{
  "topics": [
    {
      "name": "Concept Name",
      "description": "Short description about the concept",
      "resources": ["URL to resource 1", "URL to resource 2"],
      "position": { "x": 0, "y": 0 },
      "time_taken": "Estimated time to learn this concept"
    }
  ],
  "projects": [
    { "name": "" , "description":"" ,   , "level" : "Beginner" , "time taken" : "Average time to complete" }
  ],
  "connections": [
    { "from": "Concept A", "to": "Concept B" }
  ]
}
  It is okay if any of the field is missing but at least topics and connections should be present.
  Be dynamic give response for any prompt
Ensure the response is usable by ReactFlow and includes all necessary details.
`;

    // Retry logic
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Generate content using the GoogleGenerativeAI
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(modifiedPrompt);

        // Assuming the result has content directly

        const responseText = result.response.text();

        // Clean up unnecessary characters from the response
        const cleanedResponseText = responseText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        // Validate and parse the JSON response
        if (!isValidJSON(cleanedResponseText)) {
          throw new Error("Invalid JSON format");
        }

        let flowchartData = JSON.parse(cleanedResponseText);

        // Increment the request count after a successful response
        await prisma.user.update({
          where: { id: userId },
          data: {
            requestCount: { increment: 1 },
          },
        });

        await prisma.statistics.upsert({
          where: { id: 1 }, // Assuming there's only one row in the Statistics table
          update: {
            totalRoadmaps: {
              increment: 1,
            },
            // Example field to update
          },
          create: {
            id: 1, // Ensure this matches the unique identifier
            totalRoadmaps: 1,
            // Example field to create
          },
        });
        const SavedPrompt = prompt.toLowerCase();

        await prisma.generatedRoadmap.create({
          data: {
            userId: userId,
            content: flowchartData,
            prompt: SavedPrompt,
          },
        });

        // Return the parsed flowchart data
        return NextResponse.json({ flowchartData });
      } catch (error) {
        if (attempt === maxRetries) {
          console.error("Final attempt failed:", error);
          return NextResponse.json(
            {
              error:
                "Failed to process your request after multiple attempts. Please try again later.",
            },
            { status: 500 }
          );
        }

        console.warn(
          `Attempt ${attempt} failed. Retrying in ${retryDelay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "An internal error occurred." },
      { status: 500 }
    );
  }
}

// Helper function to validate JSON format
function isValidJSON(responseText: string): boolean {
  try {
    JSON.parse(responseText);
    return true;
  } catch {
    return false;
  }
}
