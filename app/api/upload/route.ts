import { auth } from "@clerk/nextjs/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
	const body = (await request.json()) as HandleUploadBody;

	try {
		const jsonResponse = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async (pathname, clientPayload) => {
				const { isAuthenticated } = await auth();

				if (!isAuthenticated) {
					throw new Error("Unauthorized");
				}

				return {
					allowedContentTypes: ["image/jpeg", "image/png", "image/gif"],
					tokenPayload: JSON.stringify({
						clientPayload,
					}),
				};
			},
			onUploadCompleted: async ({ blob, tokenPayload }) => {
				// Get notified of client upload completion
				console.log("blob uploaded", blob.url);
			},
		});

		return NextResponse.json(jsonResponse);
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, { status: 400 });
	}
}
