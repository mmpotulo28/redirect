"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
 Modal,
 ModalContent,
 ModalHeader,
 ModalBody,
 ModalFooter,
} from "@heroui/modal";
import { Switch } from "@heroui/switch";
import { useState } from "react";
import { mutate } from "swr";

import { updateRedirect } from "@/hooks/use-redirects";

type Redirect = {
 id: string;
 shortCode: string;
 targetUrl: string | null;
 description: string | null;
 active: boolean;
};

export function EditRedirectModal({
 redirect,
 isOpen,
 onClose,
}: {
 redirect: Redirect;
 isOpen: boolean;
 onClose: () => void;
}) {
 const [active, setActive] = useState(redirect.active);
 const [isLoading, setIsLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);
  const formData = new FormData(e.currentTarget);

  try {
   const targetUrl = formData.get("targetUrl") as string;

   await updateRedirect(redirect.id, {
    targetUrl: targetUrl || null,
    shortCode: formData.get("shortCode") as string,
    description: formData.get("description") as string,
    active: active,
   });
   mutate("/api/redirects");
   mutate(`/api/redirects/${redirect.id}`);
   onClose();
  } catch (error) {
   console.error(error);
  } finally {
   setIsLoading(false);
  }
 };

 return (
  <Modal isOpen={isOpen} onClose={onClose}>
   <ModalContent>
    {(onClose) => (
     <form onSubmit={handleSubmit}>
      <ModalHeader className="flex flex-col gap-1">
       Edit Redirect
      </ModalHeader>
      <ModalBody>
       <Input
        defaultValue={redirect.targetUrl || ""}
        label="Target URL (Optional)"
        name="targetUrl"
        type="url"
       />
       <Input
        required
        defaultValue={redirect.shortCode}
        label="Short Code"
        name="shortCode"
       />
       <Input
        defaultValue={redirect.description || ""}
        label="Description"
        name="description"
        placeholder="Marketing campaign, etc."
       />
       <Switch isSelected={active} onValueChange={setActive}>
        Active
       </Switch>
      </ModalBody>
      <ModalFooter>
       <Button color="danger" variant="light" onPress={onClose}>
        Cancel
       </Button>
       <Button color="primary" isLoading={isLoading} type="submit">
        Save
       </Button>
      </ModalFooter>
     </form>
    )}
   </ModalContent>
  </Modal>
 );
}
