import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const taskQueue = new Map();
    const taskId = req.nextUrl.searchParams.get('taskId');
  
    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }
  
    const task = taskQueue.get(taskId);
  
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
  
    // If task is completed, return the data and remove it from the queue
    if (task.status === 'completed') {
      taskQueue.delete(taskId);
      return NextResponse.json({ status: 'completed', data: task.data });
    }
  
    // For other statuses, just return the status
    return NextResponse.json({ status: task.status });
  }
  