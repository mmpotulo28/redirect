"use client";

import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { Plus } from "lucide-react";

import { RedirectModal } from "./redirect-modal";

export function CreateRedirectModal() {
 const { isOpen, onOpen, onClose } = useDisclosure();

 return (
  <>
   <Button
    className="font-medium shadow-md"
    color="primary"
    startContent={<Plus size={18} />}
    onPress={onOpen}
   >
    Create Redirect
   </Button>
   <RedirectModal isOpen={isOpen} onClose={onClose} />
  </>
 );
}

