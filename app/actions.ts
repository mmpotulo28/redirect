"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function createRedirect(formData: FormData) {
	const { userId } = await auth();
	if (!userId) throw new Error("Unauthorized");

	const targetUrl = formData.get("targetUrl") as string;
	let shortCode = formData.get("shortCode") as string;

	if (!targetUrl) throw new Error("Target URL is required");

	if (!shortCode) {
		shortCode = nanoid(6);
	}

	await prisma.redirect.create({
		data: {
			targetUrl,
			shortCode,
			userId,
		},
	});

	revalidatePath("/dashboard");
}

export async function getRedirects() {
	const { userId } = await auth();
	if (!userId) return [];

	return await prisma.redirect.findMany({
		where: { userId },
		orderBy: { createdAt: "desc" },
		include: {
			_count: {
				select: { clicks: true },
			},
		},
	});
}

export async function deleteRedirect(id: string) {
	const { userId } = await auth();
	if (!userId) throw new Error("Unauthorized");

	await prisma.redirect.delete({
		where: { id, userId },
	});
	revalidatePath("/dashboard");
}
