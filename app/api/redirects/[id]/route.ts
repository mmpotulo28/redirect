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
			include: {
				clicks: {
					orderBy: { timestamp: "desc" },
					take: 100,
				},
				_count: {
					select: { clicks: true },
				},
			},
		});

		if (!redirect) {
			return new NextResponse("Not Found", { status: 404 });
		}

		return NextResponse.json(redirect);
	} catch (error) {
		console.error("[REDIRECT_GET]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { id } = await params;
		const body = await req.json();
		const { targetUrl, shortCode, description, active } = body;

		const redirect = await prisma.redirect.update({
			where: { id, userId },
			data: {
				targetUrl,
				shortCode,
				description,
				active,
			},
		});

		return NextResponse.json(redirect);
	} catch (error) {
		console.error("[REDIRECT_PATCH]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { id } = await params;

		await prisma.redirect.delete({
			where: { id, userId },
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error("[REDIRECT_DELETE]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
