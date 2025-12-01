'use client'

import { createRedirect } from '@/hooks/use-redirects'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { useRef, useState } from 'react'
import { mutate } from 'swr'

export function CreateRedirectForm() {
 const ref = useRef<HTMLFormElement>(null)
 const [isLoading, setIsLoading] = useState(false)

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsLoading(true)
  const formData = new FormData(e.currentTarget)

  try {
   await createRedirect({
    targetUrl: formData.get('targetUrl') as string,
    shortCode: formData.get('shortCode') as string,
    description: formData.get('description') as string,
   })
   mutate('/api/redirects')
   ref.current?.reset()
  } catch (error) {
   console.error(error)
  } finally {
   setIsLoading(false)
  }
 }

 return (
  <form
   ref={ref}
   onSubmit={handleSubmit}
   className="flex flex-col md:flex-row gap-4 items-stretch md:items-end"
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
    className="w-full md:w-48"
   />
   <Input
    name="description"
    label="Description (Optional)"
    placeholder="Marketing campaign"
    className="w-full md:w-64"
   />
   <Button type="submit" color="primary" className="w-full md:w-auto" isLoading={isLoading}>
    Create
   </Button>
  </form>
 )
}
