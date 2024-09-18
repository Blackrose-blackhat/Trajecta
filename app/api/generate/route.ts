import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";
import prisma from "@/prisma/prisma";

export const maxDuration = 60;
const maxRetries = 3; // Maximum number of retries
const retryDelay = 2000; // Delay between retries in milliseconds

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
      if (userInfo.requestCount >= parseInt(process.env.LIMIT)) {
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
3. For each concept, provide a high-quality learning resource (article, video, or documentation).
4. Present the output in the following JSON format:
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
    { "project1": "Description", "githubLink": "" }
  ],
  "connections": [
    { "from": "Concept A", "to": "Concept B" }
  ]
}
Ensure the response is usable by ReactFlow and includes all necessary details.
`;

    // Retry logic
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Generate content using the GoogleGenerativeAI
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(modifiedPrompt);

        // Assuming the result has content directly
        console.log("res text", result);
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

        // Return the parsed flowchart data
        return NextResponse.json({ flowchartData });
      } catch (error) {
        if (attempt === maxRetries) {
          console.error("Final attempt failed:", error);
          return NextResponse.json(
            { error: "Failed to process your request after multiple attempts. Please try again later." },
            { status: 500 }
          );
        }

        console.warn(`Attempt ${attempt} failed. Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
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
