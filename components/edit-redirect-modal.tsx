'use client'

import { updateRedirect } from '@/hooks/use-redirects'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Switch } from '@heroui/switch'
import { useState } from 'react'
import { mutate } from 'swr'

type Redirect = {
 id: string
 shortCode: string
 targetUrl: string
 description: string | null
 active: boolean
}

export function EditRedirectModal({ redirect, isOpen, onClose }: { redirect: Redirect, isOpen: boolean, onClose: () => void }) {
 const [active, setActive] = useState(redirect.active)
 const [isLoading, setIsLoading] = useState(false)

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsLoading(true)
  const formData = new FormData(e.currentTarget)

  try {
   await updateRedirect(redirect.id, {
    targetUrl: formData.get('targetUrl') as string,
    shortCode: formData.get('shortCode') as string,
    description: formData.get('description') as string,
    active: active
   })
   mutate('/api/redirects')
   mutate(`/api/redirects/${redirect.id}`)
   onClose()
  } catch (error) {
   console.error(error)
  } finally {
   setIsLoading(false)
  }
 }

 return (
  <Modal isOpen={isOpen} onClose={onClose}>
   <ModalContent>
    {(onClose) => (
     <form onSubmit={handleSubmit}>
      <ModalHeader className="flex flex-col gap-1">Edit Redirect</ModalHeader>
      <ModalBody>
       <Input
        name="targetUrl"
        label="Target URL"
        defaultValue={redirect.targetUrl}
        required
        type="url"
       />
       <Input
        name="shortCode"
        label="Short Code"
        defaultValue={redirect.shortCode}
        required
       />
       <Input
        name="description"
        label="Description"
        defaultValue={redirect.description || ''}
        placeholder="Marketing campaign, etc."
       />
       <Switch
        isSelected={active}
        onValueChange={setActive}
       >
        Active
       </Switch>
      </ModalBody>
      <ModalFooter>
       <Button color="danger" variant="light" onPress={onClose}>
        Cancel
       </Button>
       <Button color="primary" type="submit" isLoading={isLoading}>
        Save
       </Button>
      </ModalFooter>
     </form>
    )}
   </ModalContent>
  </Modal>
 )
}
