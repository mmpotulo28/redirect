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
				targetingRules: true,
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
		const {
			targetUrl,
			shortCode,
			description,
			active,
			startsAt,
			expiresAt,
			ogTitle,
			ogDescription,
			ogImage,
			password,
			targetingRules,
		} = body;

		// targetUrl is now optional

		const code = shortCode || nanoid(6);

		const redirect = await prisma.redirect.create({
			data: {
				targetUrl,
				shortCode: code,
				description,
				active: active ?? true,
				userId,
				startsAt: startsAt ? new Date(startsAt) : null,
				expiresAt: expiresAt ? new Date(expiresAt) : null,
				ogTitle,
				ogDescription,
				ogImage,
				password,
				targetingRules: targetingRules
					? {
							create: targetingRules.map(
								(rule: { type: string; key: string; targetUrl: string }) => ({
									type: rule.type,
									key: rule.key,
									targetUrl: rule.targetUrl,
								}),
							),
						}
					: undefined,
			},
		});

		return NextResponse.json(redirect);
	} catch (error) {
		console.error("[REDIRECTS_POST]", error);

		return new NextResponse("Internal Error", { status: 500 });
	}
}
