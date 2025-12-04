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
import { Select, SelectItem } from "@heroui/select";
import { useState, useEffect } from "react";
import { mutate } from "swr";

import { PlusIcon, DeleteIcon } from "./icons";

import { createRedirect, updateRedirect } from "@/hooks/use-redirects";

type TargetingRule = {
 type: "device" | "geo";
 key: string;
 targetUrl: string;
};

export type Redirect = {
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
 targetingRules?: TargetingRule[];
};

interface RedirectModalProps {
 isOpen: boolean;
 onClose: () => void;
 initialData?: Redirect;
}

export function RedirectModal({ isOpen, onClose, initialData }: RedirectModalProps) {
 const isEditing = !!initialData;
 const [isLoading, setIsLoading] = useState(false);

 // Form State
 const [active, setActive] = useState(true);
 const [rules, setRules] = useState<TargetingRule[]>([]);
 const [formData, setFormData] = useState({
  targetUrl: "",
  shortCode: "",
  description: "",
  startsAt: "",
  expiresAt: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  password: "",
 });

 // Initialize state when initialData changes
 useEffect(() => {
  if (initialData) {
   setActive(initialData.active);
   setRules(initialData.targetingRules || []);
   setFormData({
    targetUrl: initialData.targetUrl || "",
    shortCode: initialData.shortCode || "",
    description: initialData.description || "",
    startsAt: initialData.startsAt ? new Date(initialData.startsAt).toISOString().slice(0, 16) : "",
    expiresAt: initialData.expiresAt ? new Date(initialData.expiresAt).toISOString().slice(0, 16) : "",
    ogTitle: initialData.ogTitle || "",
    ogDescription: initialData.ogDescription || "",
    ogImage: initialData.ogImage || "",
    password: initialData.password || "",
   });
  } else {
   setActive(true);
   setRules([]);
   setFormData({
    targetUrl: "",
    shortCode: "",
    description: "",
    startsAt: "",
    expiresAt: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    password: "",
   });
  }
 }, [initialData, isOpen]);

 const handleInputChange = (field: string, value: string) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
 };
 const addRule = () => {
  setRules([...rules, { type: "device", key: "", targetUrl: "" }]);
 };

 const removeRule = (index: number) => {
  setRules(rules.filter((_, i) => i !== index));
 };

 const updateRule = (
  index: number,
  field: keyof TargetingRule,
  value: string
 ) => {
  const newRules = [...rules];

  // @ts-ignore
  newRules[index][field] = value;
  setRules(newRules);
 }; const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
   if (isEditing && initialData) {
    await updateRedirect(initialData.id, {
     targetUrl: formData.targetUrl || null,
     shortCode: formData.shortCode,
     description: formData.description,
     active,
     startsAt: formData.startsAt || null,
     expiresAt: formData.expiresAt || null,
     ogTitle: formData.ogTitle,
     ogDescription: formData.ogDescription,
     ogImage: formData.ogImage,
     password: formData.password,
     targetingRules: rules,
    });
    mutate(`/api/redirects/${initialData.id}`);
   } else {
    await createRedirect({
     targetUrl: formData.targetUrl || undefined,
     shortCode: formData.shortCode,
     description: formData.description,
     active,
     startsAt: formData.startsAt || null,
     expiresAt: formData.expiresAt || null,
     ogTitle: formData.ogTitle,
     ogDescription: formData.ogDescription,
     ogImage: formData.ogImage,
     password: formData.password,
     targetingRules: rules.length > 0 ? rules : undefined,
    });
   }

   mutate("/api/redirects");
   onClose();
  } catch (error) {
   console.error(error);
  } finally {
   setIsLoading(false);
  }
 };

 return (
  <Modal
   backdrop="blur"
   classNames={{
    body: "py-6",
    backdrop: "bg-overlay/50 backdrop-opacity-40",
    base: "border-default-100 bg-content1 text-foreground",
    header: "border-b-[1px] border-default-100",
    footer: "border-t-[1px] border-default-100",
    closeButton: "hover:bg-default-100 active:bg-default-200",
   }}
   isOpen={isOpen}
   size="2xl"
   onClose={onClose}
  >
   <ModalContent>
    {(onClose) => (
     <form onSubmit={handleSubmit}>
      <ModalHeader className="flex flex-col gap-1">
       {isEditing ? "Edit Redirect" : "Create New Redirect"}
       <span className="text-sm font-normal text-default-400">
        {isEditing ? "Manage your redirect settings" : "Configure your new redirect link settings"}
       </span>
      </ModalHeader>
      <ModalBody>
       <Tabs
        aria-label="Options"
        classNames={{
         tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
         cursor: "w-full bg-primary",
         tab: "max-w-fit px-0 h-12",
         tabContent: "group-data-[selected=true]:text-primary"
        }}
        color="primary"
        variant="underlined"
       >
        <Tab key="general" title="General">
         <div className="flex flex-col gap-6 pt-4">
          <Input
           description="The destination URL where users will be redirected."
           label="Target URL"
           labelPlacement="outside"
           name="targetUrl"
           placeholder="https://example.com"
           type="url"
           value={formData.targetUrl}
           variant="bordered"
           onValueChange={(value) => handleInputChange("targetUrl", value)}
          />
          <div className="grid grid-cols-2 gap-4">
           <Input
            required
            description={isEditing ? "Custom alias for this link." : "Leave empty for auto-generated code"}
            label="Short Code"
            labelPlacement="outside"
            name="shortCode"
            placeholder="custom-code"
            value={formData.shortCode}
            variant="bordered"
            onValueChange={(value) => handleInputChange("shortCode", value)}
           />
           <Input
            description="Internal note for this link."
            label="Description"
            labelPlacement="outside"
            name="description"
            placeholder="Marketing Campaign 2025"
            value={formData.description}
            variant="bordered"
            onValueChange={(value) => handleInputChange("description", value)}
           />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-default-200 bg-content2/20">
           <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Active Status</p>
            <p className="text-xs text-default-500">Enable or disable this redirect link.</p>
           </div>
           <Switch isSelected={active} onValueChange={setActive}>
            {active ? "Active" : "Inactive"}
           </Switch>
          </div>
         </div>
        </Tab>
        <Tab key="scheduling" title="Scheduling">
         <div className="grid grid-cols-2 gap-6 pt-4">
          <Input
           description="Link becomes active on this date."
           label="Starts At"
           labelPlacement="outside"
           name="startsAt"
           type="datetime-local"
           value={formData.startsAt}
           variant="bordered"
           onValueChange={(value) => handleInputChange("startsAt", value)}
          />
          <Input
           description="Link expires on this date."
           label="Expires At"
           labelPlacement="outside"
           name="expiresAt"
           type="datetime-local"
           value={formData.expiresAt}
           variant="bordered"
           onValueChange={(value) => handleInputChange("expiresAt", value)}
          />
         </div>
        </Tab>
        <Tab key="social" title="Social Cards">
         <div className="flex flex-col gap-6 pt-4">
          <Input
           label="Social Title"
           labelPlacement="outside"
           name="ogTitle"
           placeholder="Custom title for social media"
           value={formData.ogTitle}
           variant="bordered"
           onValueChange={(value) => handleInputChange("ogTitle", value)}
          />
          <Input
           label="Social Description"
           labelPlacement="outside"
           name="ogDescription"
           placeholder="Custom description for social media"
           value={formData.ogDescription}
           variant="bordered"
           onValueChange={(value) => handleInputChange("ogDescription", value)}
          />
          <Input
           label="Social Image URL"
           labelPlacement="outside"
           name="ogImage"
           placeholder="https://example.com/image.png"
           type="url"
           value={formData.ogImage}
           variant="bordered"
           onValueChange={(value) => handleInputChange("ogImage", value)}
          />
         </div>
        </Tab>
        <Tab key="security" title="Security">
         <div className="flex flex-col gap-6 pt-4">
          <Input
           description="Leave empty to disable password protection."
           label="Password Protection"
           labelPlacement="outside"
           name="password"
           placeholder="Enter a password"
           type="password"
           value={formData.password}
           variant="bordered"
           onValueChange={(value) => handleInputChange("password", value)}
          />
         </div>
        </Tab>
        <Tab key="targeting" title="Targeting">
         <div className="flex flex-col gap-6 pt-4">
          <div className="flex justify-between items-center p-4 bg-default-50 rounded-lg border border-default-100">
           <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Smart Targeting</p>
            <p className="text-xs text-default-500">
             Redirect users based on their device or location.
            </p>
           </div>
           <Button
            color="primary"
            size="sm"
            startContent={<PlusIcon />}
            variant="flat"
            onPress={addRule}
           >
            Add Rule
           </Button>
          </div>

          <div className="flex flex-col gap-4">
           {rules.map((rule, index) => (
            <div
             key={index}
             className="flex flex-col gap-4 p-4 border border-default-200 rounded-xl bg-content2/20 hover:bg-content2/40 transition-colors"
            >
             <div className="flex gap-4">
              <Select
               className="w-1/3"
               label="Type"
               labelPlacement="outside"
               selectedKeys={[rule.type]}
               variant="bordered"
               onChange={(e) =>
                updateRule(index, "type", e.target.value as any)
               }
              >
               <SelectItem key="device">Device</SelectItem>
               <SelectItem key="geo">Location</SelectItem>
              </Select>
              <Input
               className="w-2/3"
               label={
                rule.type === "device"
                 ? "Device (ios, android)"
                 : "Country Code (US, GB)"
               }
               labelPlacement="outside"
               value={rule.key}
               variant="bordered"
               onValueChange={(v) => updateRule(index, "key", v)}
              />
             </div>
             <div className="flex gap-4 items-end">
              <Input
               className="flex-1"
               label="Target URL"
               labelPlacement="outside"
               placeholder="https://..."
               size="sm"
               type="url"
               value={rule.targetUrl}
               variant="bordered"
               onValueChange={(v) =>
                updateRule(index, "targetUrl", v)
               }
              />
              <Button
               isIconOnly
               className="mb-0.5"
               color="danger"
               variant="light"
               onPress={() => removeRule(index)}
              >
               <DeleteIcon size={20} />
              </Button>
             </div>
            </div>
           ))}
           {rules.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-default-200 rounded-xl text-default-400">
             <p>No targeting rules configured.</p>
             <p className="text-xs mt-1">Click &quot;Add Rule&quot; to get started.</p>
            </div>
           )}
          </div>
         </div>
        </Tab>
       </Tabs>
      </ModalBody>
      <ModalFooter>
       <Button color="danger" variant="light" onPress={onClose}>
        Cancel
       </Button>
       <Button className="shadow-lg shadow-primary/40" color="primary" isLoading={isLoading} type="submit">
        {isEditing ? "Save Changes" : "Create Redirect"}
       </Button>
      </ModalFooter>
     </form>
    )}
   </ModalContent>
  </Modal>
 );
}
