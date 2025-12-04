"use server";

import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export async function createRedirect(formData: FormData) {
	const { userId } = await auth();

	if (!userId) throw new Error("Unauthorized");

	const targetUrl = formData.get("targetUrl") as string;
	let shortCode = formData.get("shortCode") as string;
	const description = formData.get("description") as string;

	if (!targetUrl) throw new Error("Target URL is required");

	if (!shortCode) {
		shortCode = nanoid(6);
	}

	await prisma.redirect.create({
		data: {
			targetUrl,
			shortCode,
			description,
			userId,
		},
	});

	revalidatePath("/dashboard");
}

export async function updateRedirect(id: string, formData: FormData) {
	const { userId } = await auth();

	if (!userId) throw new Error("Unauthorized");

	const targetUrl = formData.get("targetUrl") as string;
	const shortCode = formData.get("shortCode") as string;
	const description = formData.get("description") as string;
	const active = formData.get("active") === "true";

	await prisma.redirect.update({
		where: { id, userId },
		data: {
			targetUrl,
			shortCode,
			description,
			active,
		},
	});

	revalidatePath("/dashboard");
	revalidatePath(`/dashboard/${id}`);
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

export async function getRedirect(id: string) {
	const { userId } = await auth();

	if (!userId) return null;

	return await prisma.redirect.findUnique({
		where: { id, userId },
		include: {
			clicks: {
				orderBy: { timestamp: "desc" },
				take: 100, // Limit recent clicks
			},
			_count: {
				select: { clicks: true },
			},
		},
	});
}

export async function getRedirectAnalytics(id: string) {
	const { userId } = await auth();

	if (!userId) return null;

	const redirect = await prisma.redirect.findUnique({
		where: { id, userId },
	});

	if (!redirect) return null;

	const clicks = await prisma.click.findMany({
		where: { redirectId: id },
		orderBy: { timestamp: "asc" },
	});

	return clicks;
}

export async function deleteRedirect(id: string) {
	const { userId } = await auth();

	if (!userId) throw new Error("Unauthorized");

	await prisma.redirect.delete({
		where: { id, userId },
	});
	revalidatePath("/dashboard");
}

export async function verifyPassword(shortCode: string, password: string) {
	const redirect = await prisma.redirect.findUnique({
		where: { shortCode },
	});

	if (!redirect || !redirect.password) return false;

	if (redirect.password === password) {
		const cookieStore = await cookies();

		cookieStore.set(`pwd_${shortCode}`, "true", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60 * 24, // 24 hours
		});

		return true;
	}

	return false;
}

export async function updateRedirectQRCode(id: string, qrCodeUrl: string) {
	const { userId } = await auth();

	if (!userId) throw new Error("Unauthorized");

	await prisma.redirect.update({
		where: { id, userId },
		data: {
			qrCodeUrl,
		},
	});

	revalidatePath("/dashboard");
}
