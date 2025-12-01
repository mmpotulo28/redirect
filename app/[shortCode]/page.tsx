import { notFound } from "next/navigation";
import { headers, cookies } from "next/headers";
import { UAParser } from "ua-parser-js";
import { isbot } from "isbot";
import { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { RedirectInterstitial } from "@/components/redirect-interstitial";
import { RedirectPending } from "@/components/redirect-pending";
import { PasswordEntry } from "@/components/password-entry";

type Props = {
 params: Promise<{ shortCode: string }>;
};

async function getGeoData(ip: string) {
 try {
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  if (!response.ok) return null;
  const data = await response.json();
  return {
   country: data.countryCode,
   city: data.city,
  };
 } catch (error) {
  return null;
 }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { shortCode } = await params;
 const redirect = await prisma.redirect.findUnique({
  where: { shortCode },
 });

 if (!redirect) {
  return {
   title: "Not Found",
  };
 }

 return {
  title: redirect.ogTitle || redirect.shortCode,
  description: redirect.ogDescription || redirect.description,
  openGraph: {
   title: redirect.ogTitle || redirect.shortCode,
   description: redirect.ogDescription || redirect.description || undefined,
   images: redirect.ogImage ? [{ url: redirect.ogImage }] : undefined,
  },
 };
}

export default async function RedirectPage({ params }: Props) {
 const { shortCode } = await params;

 const redirectEntry = await prisma.redirect.findUnique({
  where: { shortCode },
 });

 if (!redirectEntry || !redirectEntry.active) {
  notFound();
 }

 // Check scheduling
 const now = new Date();
 if (redirectEntry.startsAt && now < redirectEntry.startsAt) {
  notFound();
 }
 if (redirectEntry.expiresAt && now > redirectEntry.expiresAt) {
  notFound();
 }

 // Check password
 if (redirectEntry.password) {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get(`pwd_${shortCode}`);

  if (!hasAccess) {
   return <PasswordEntry shortCode={shortCode} />;
  }
 }

 // Log click
 const headersList = await headers();
 const userAgent = headersList.get("user-agent") || "";
 const ipHeader = headersList.get("x-forwarded-for") || "unknown";
 const ip = Array.isArray(ipHeader) ? ipHeader[0] : ipHeader.split(",")[0];
 const referrer = headersList.get("referer");

 // Only log if not a bot
 if (!isbot(userAgent)) {
  // Parse User Agent
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser().name;
  const os = parser.getOS().name;
  const device = parser.getDevice().type || "desktop";

  // Parse Geo Location
  const geo = await getGeoData(ip);
  const country = geo?.country || "Unknown";
  const city = geo?.city || "Unknown";

  await prisma.click.create({
   data: {
    redirectId: redirectEntry.id,
    userAgent,
    browser,
    os,
    device,
    ip,
    referrer,
    country,
    city,
   },
  });
 }

 if (!redirectEntry.targetUrl) {
  return <RedirectPending />;
 }

 return <RedirectInterstitial targetUrl={redirectEntry.targetUrl} />;
}
