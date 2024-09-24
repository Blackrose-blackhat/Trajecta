import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(_request: Request) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "You are not logged in" }),
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: !!session,
    session,
  });
}
