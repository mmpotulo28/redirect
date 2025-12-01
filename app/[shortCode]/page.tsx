import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

import { prisma } from "@/lib/prisma";
import { RedirectInterstitial } from "@/components/redirect-interstitial";
import { RedirectPending } from "@/components/redirect-pending";

export default async function RedirectPage({
 params,
}: {
 params: Promise<{ shortCode: string }>;
}) {
 const { shortCode } = await params;

 const redirectEntry = await prisma.redirect.findUnique({
  where: { shortCode },
 });

 if (!redirectEntry || !redirectEntry.active) {
  notFound();
 }

 // Log click
 const headersList = await headers();
 const userAgent = headersList.get("user-agent") || "";
 const ip = headersList.get("x-forwarded-for") || "unknown";
 const referrer = headersList.get("referer");

 // Parse User Agent
 const parser = new UAParser(userAgent);
 const browser = parser.getBrowser().name;
 const os = parser.getOS().name;
 const device = parser.getDevice().type || "desktop";

 await prisma.click.create({
  data: {
   redirectId: redirectEntry.id,
   userAgent,
   browser,
   os,
   device,
   ip: Array.isArray(ip) ? ip[0] : ip,
   referrer,
  },
 });

 if (!redirectEntry.targetUrl) {
  return <RedirectPending />;
 }

 return <RedirectInterstitial targetUrl={redirectEntry.targetUrl} />;
}
