import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { id } = await params;

		const redirect = await prisma.redirect.findUnique({
			where: { id, userId },
		});

		if (!redirect) {
			return new NextResponse("Not Found", { status: 404 });
		}

		const clicks = await prisma.click.findMany({
			where: { redirectId: id },
			orderBy: { timestamp: "asc" },
		});

		return NextResponse.json(clicks);
	} catch (error) {
		console.error("[REDIRECT_ANALYTICS_GET]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
