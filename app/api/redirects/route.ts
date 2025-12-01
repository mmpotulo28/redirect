import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const redirects = await prisma.redirect.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
    });

    return NextResponse.json(redirects);
  } catch (error) {
    console.error("[REDIRECTS_GET]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { targetUrl, shortCode, description } = body;

    if (!targetUrl) {
      return new NextResponse("Target URL is required", { status: 400 });
    }

    const code = shortCode || nanoid(6);

    const redirect = await prisma.redirect.create({
      data: {
        targetUrl,
        shortCode: code,
        description,
        userId,
      },
    });

    return NextResponse.json(redirect);
  } catch (error) {
    console.error("[REDIRECTS_POST]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
