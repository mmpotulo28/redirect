'use client'

import { deleteRedirect } from '@/app/actions'
import { Button } from '@heroui/button'
import { Card, CardHeader } from '@heroui/card'
import { Link } from '@heroui/link'

type Redirect = {
 id: string
 shortCode: string
 targetUrl: string
 createdAt: Date
 _count: { clicks: number }
}

export function RedirectList({ redirects }: { redirects: Redirect[] }) {
 return (
  <div className="grid gap-4 mt-8">
   {redirects.map((redirect) => (
    <Card key={redirect.id}>
     <CardHeader className="flex justify-between items-center">
      <div className="flex flex-col">
       <Link
        href={`/${redirect.shortCode}`}
        isExternal
        className="text-lg font-bold"
       >
        /{redirect.shortCode}
       </Link>
       <span className="text-small text-default-500">
        {redirect.targetUrl}
       </span>
      </div>
      <div className="flex items-center gap-4">
       <div className="text-small">
        {redirect._count.clicks} clicks
       </div>
       <Button
        color="danger"
        variant="light"
        onPress={() => deleteRedirect(redirect.id)}
       >
        Delete
       </Button>
      </div>
     </CardHeader>
    </Card>
   ))}
  </div>
 )
}
