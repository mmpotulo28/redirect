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
import { Tabs, Tab } from "@heroui/tabs";
import { useState } from "react";
import { mutate } from "swr";

import { updateRedirect } from "@/hooks/use-redirects";

type Redirect = {
 id: string;
 shortCode: string;
 targetUrl: string | null;
 description: string | null;
 active: boolean;
 startsAt: string | null;
 expiresAt: string | null;
 ogTitle: string | null;
 ogDescription: string | null;
 ogImage: string | null;
 password?: string | null;
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
   const startsAt = formData.get("startsAt") as string;
   const expiresAt = formData.get("expiresAt") as string;

   await updateRedirect(redirect.id, {
    targetUrl: targetUrl || null,
    shortCode: formData.get("shortCode") as string,
    description: formData.get("description") as string,
    active: active,
    startsAt: startsAt || null,
    expiresAt: expiresAt || null,
    ogTitle: formData.get("ogTitle") as string,
    ogDescription: formData.get("ogDescription") as string,
    ogImage: formData.get("ogImage") as string,
    password: formData.get("password") as string,
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
       <Tabs aria-label="Options">
        <Tab key="general" title="General">
         <div className="flex flex-col gap-4">
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
         </div>
        </Tab>
        <Tab key="scheduling" title="Scheduling">
         <div className="flex flex-col gap-4">
          <Input
           defaultValue={
            redirect.startsAt
             ? new Date(redirect.startsAt).toISOString().slice(0, 16)
             : ""
           }
           label="Starts At"
           name="startsAt"
           type="datetime-local"
          />
          <Input
           defaultValue={
            redirect.expiresAt
             ? new Date(redirect.expiresAt).toISOString().slice(0, 16)
             : ""
           }
           label="Expires At"
           name="expiresAt"
           type="datetime-local"
          />
         </div>
        </Tab>
        <Tab key="social" title="Social Cards">
         <div className="flex flex-col gap-4">
          <Input
           defaultValue={redirect.ogTitle || ""}
           label="Social Title"
           name="ogTitle"
           placeholder="Custom title for social media"
          />
          <Input
           defaultValue={redirect.ogDescription || ""}
           label="Social Description"
           name="ogDescription"
           placeholder="Custom description for social media"
          />
          <Input
           defaultValue={redirect.ogImage || ""}
           label="Social Image URL"
           name="ogImage"
           placeholder="https://example.com/image.png"
           type="url"
          />
         </div>
        </Tab>
        <Tab key="security" title="Security">
         <div className="flex flex-col gap-4">
          <Input
           defaultValue={redirect.password || ""}
           label="Password Protection"
           name="password"
           placeholder="Leave empty to disable"
           type="text"
          />
         </div>
        </Tab>
       </Tabs>
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
