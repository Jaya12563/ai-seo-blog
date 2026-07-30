import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (
    blog.authorId !== session.user.id &&
    (session.user as any).role !== "ADMIN"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(blog);
}