"use client";

import { Button } from "@heroui/button";
import { Card, CardHeader } from "@heroui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { mutate } from "swr";

import { EditRedirectModal } from "./edit-redirect-modal";
import { QRCodeModal } from "./qr-code-modal";
import { EditIcon, DeleteIcon, QrCodeIcon } from "./icons";

import { useRedirects, deleteRedirect } from "@/hooks/use-redirects";

type Redirect = {
 id: string;
 shortCode: string;
 targetUrl: string | null;
 description: string | null;
 active: boolean;
 createdAt: Date;
 startsAt: string | null;
 expiresAt: string | null;
 ogTitle: string | null;
 ogDescription: string | null;
 ogImage: string | null;
 password: string | null;
 targetingRules?: {
  id: string;
  type: "device" | "geo";
  key: string;
  targetUrl: string;
 }[];
 _count: { clicks: number };
};

export function RedirectList() {
 const { redirects, isLoading } = useRedirects();
 const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null);
 const [viewingQRCode, setViewingQRCode] = useState<Redirect | null>(null);
 const router = useRouter();
 const handleDelete = async (id: string) => {
  if (confirm("Are you sure you want to delete this redirect?")) {
   try {
    await deleteRedirect(id);
    mutate("/api/redirects");
   } catch (error) {
    console.error(error);
   }
  }
 };

 if (isLoading) {
  return (
   <div className="flex justify-center mt-8">
    <Spinner />
   </div>
  );
 }

 if (!redirects?.length) {
  return (
   <div className="text-center mt-8 text-default-500">
    No redirects found. Create one above!
   </div>
  );
 }

 return (
  <>
   <div className="grid gap-4">
    {redirects.map((redirect: Redirect) => (
     <Card
      key={redirect.id}
      className="border-none shadow-sm hover:shadow-md transition-shadow"
     >
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
       <div
        className="flex flex-col w-full sm:w-auto overflow-hidden text-left gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1 -m-1"
        role="button"
        tabIndex={0}
        onClick={() => router.push(`/dashboard/${redirect.id}`)}
        onKeyDown={(e) => {
         if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/dashboard/${redirect.id}`);
         }
        }}
       >
        <div className="flex items-center gap-2">
         <span className="text-lg font-bold text-primary">
          /{redirect.shortCode}
         </span>
         {!redirect.active && (
          <span className="text-tiny bg-danger/10 text-danger px-2 py-0.5 rounded-full font-medium">
           Inactive
          </span>
         )}
        </div>
        <div className="flex items-center gap-2 text-small text-default-500">
         <span className="truncate max-w-[200px] sm:max-w-md">
          {redirect.targetUrl || (
           <span className="text-warning italic">
            Pending Target
           </span>
          )}
         </span>
        </div>
        {redirect.description && (
         <span className="text-tiny text-default-400">
          {redirect.description}
         </span>
        )}
       </div>
       <div className="flex items-center justify-between w-full sm:w-auto gap-6">
        <div className="flex flex-col items-end">
         <span className="text-2xl font-bold text-default-900">
          {redirect._count.clicks}
         </span>
         <span className="text-tiny text-default-400 uppercase font-bold tracking-wider">
          Clicks
         </span>
        </div>
        <div className="flex items-center gap-1">
         <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => setViewingQRCode(redirect)}
         >
          <QrCodeIcon size={20} />
         </Button>
         <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => setEditingRedirect(redirect)}
         >
          <EditIcon size={20} />
         </Button>
         <Button
          isIconOnly
          color="danger"
          size="sm"
          variant="light"
          onPress={() => handleDelete(redirect.id)}
         >
          <DeleteIcon size={20} />
         </Button>
        </div>
       </div>
      </CardHeader>
     </Card>
    ))}
   </div>
   {editingRedirect && (
    <EditRedirectModal
     isOpen={!!editingRedirect}
     redirect={editingRedirect}
     onClose={() => setEditingRedirect(null)}
    />
   )}
   {viewingQRCode && (
    <QRCodeModal
     isOpen={!!viewingQRCode}
     shortCode={viewingQRCode.shortCode}
     onClose={() => setViewingQRCode(null)}
    />
   )}
  </>
 );
}
