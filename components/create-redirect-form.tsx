'use client'

import { createRedirect } from '@/app/actions'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { useRef } from 'react'

export function CreateRedirectForm() {
 const ref = useRef<HTMLFormElement>(null)

 return (
  <form
   ref={ref}
   action={async (formData) => {
    await createRedirect(formData)
    ref.current?.reset()
   }}
   className="flex gap-4 items-end"
  >
   <Input
    name="targetUrl"
    label="Target URL"
    placeholder="https://example.com"
    required
    type="url"
    className="flex-1"
   />
   <Input
    name="shortCode"
    label="Short Code (Optional)"
    placeholder="custom-code"
    className="w-48"
   />
   <Button type="submit" color="primary">
    Create
   </Button>
  </form>
 )
}
