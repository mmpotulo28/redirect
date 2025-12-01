"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { useRef, useState } from "react";
import { mutate } from "swr";
import { PlusIcon } from "./icons";

import { createRedirect } from "@/hooks/use-redirects";

export function CreateRedirectModal() {
 const { isOpen, onOpen, onOpenChange } = useDisclosure();
 const ref = useRef<HTMLFormElement>(null);
 const [isLoading, setIsLoading] = useState(false);

 const handleSubmit = async (onClose: () => void) => {
  if (!ref.current) return;
  setIsLoading(true);
  const formData = new FormData(ref.current);

  try {
   const targetUrl = formData.get("targetUrl") as string;

   await createRedirect({
    targetUrl: targetUrl || undefined,
    shortCode: formData.get("shortCode") as string,
    description: formData.get("description") as string,
   });
   mutate("/api/redirects");
   ref.current.reset();
   onClose();
  } catch (error) {
   console.error(error);
  } finally {
   setIsLoading(false);
  }
 };

 return (
  <>
   <Button onPress={onOpen} color="primary" startContent={<PlusIcon />}>
    Create Redirect
   </Button>
   <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
    <ModalContent>
     {(onClose) => (
      <>
       <ModalHeader className="flex flex-col gap-1">Create New Redirect</ModalHeader>
       <ModalBody>
        <form ref={ref} className="flex flex-col gap-4">
         <Input
          autoFocus
          label="Target URL"
          name="targetUrl"
          placeholder="https://example.com"
          type="url"
          variant="bordered"
         />
         <Input
          label="Short Code"
          name="shortCode"
          placeholder="custom-code"
          variant="bordered"
          description="Leave empty for auto-generated code"
         />
         <Input
          label="Description"
          name="description"
          placeholder="Marketing Campaign 2025"
          variant="bordered"
         />
        </form>
       </ModalBody>
       <ModalFooter>
        <Button color="danger" variant="flat" onPress={onClose}>
         Cancel
        </Button>
        <Button color="primary" onPress={() => handleSubmit(onClose)} isLoading={isLoading}>
         Create
        </Button>
       </ModalFooter>
      </>
     )}
    </ModalContent>
   </Modal>
  </>
 );
}
