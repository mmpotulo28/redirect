"use client";

import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";

import { PlusIcon } from "./icons";
import { RedirectModal } from "./redirect-modal";

export function CreateRedirectModal() {
 const { isOpen, onOpen, onClose } = useDisclosure();

 return (
  <>
   <Button color="primary" startContent={<PlusIcon />} onPress={onOpen}>
    Create Redirect
   </Button>
   <RedirectModal isOpen={isOpen} onClose={onClose} />
  </>
 );
}

