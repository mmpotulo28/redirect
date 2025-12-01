import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { headers } from 'next/headers'

export default async function RedirectPage({ params }: { params: Promise<{ shortCode: string }> }) {
 const { shortCode } = await params

 const redirectEntry = await prisma.redirect.findUnique({
  where: { shortCode },
 })

 if (!redirectEntry) {
  notFound()
 }

 // Log click
 const headersList = await headers()
 const userAgent = headersList.get('user-agent')
 const ip = headersList.get('x-forwarded-for') || 'unknown'
 const referrer = headersList.get('referer')

 await prisma.click.create({
  data: {
   redirectId: redirectEntry.id,
   userAgent,
   ip: Array.isArray(ip) ? ip[0] : ip,
   referrer,
  },
 })

 redirect(redirectEntry.targetUrl)
}
