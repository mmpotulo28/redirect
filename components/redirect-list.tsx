"use client";

import { Button } from "@heroui/button";
import { Card, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { mutate } from "swr";

import { EditRedirectModal } from "./edit-redirect-modal";

import { useRedirects, deleteRedirect } from "@/hooks/use-redirects";

type Redirect = {
 id: string;
 shortCode: string;
 targetUrl: string | null;
 description: string | null;
 active: boolean;
 createdAt: Date;
 _count: { clicks: number };
};

export function RedirectList() {
 const { redirects, isLoading } = useRedirects();
 const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null);
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
   <div className="grid gap-4 mt-8">
    {redirects.map((redirect: Redirect) => (
     <Card
      key={redirect.id}
      className="cursor-pointer hover:bg-content2 transition-colors"
      onClick={() => router.push(`/dashboard/${redirect.id}`)}
     >
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
       <div className="flex flex-col w-full sm:w-auto overflow-hidden text-left">
        <div className="flex items-center gap-2">
         <Link
          isExternal
          className="text-lg font-bold break-all"
          href={`/${redirect.shortCode}`}
          onClick={(e) => e.stopPropagation()}
         >
          /{redirect.shortCode}
         </Link>
         {!redirect.active && (
          <span className="text-tiny bg-danger/10 text-danger px-2 py-0.5 rounded-full">
           Inactive
          </span>
         )}
        </div>
        <span className="text-small text-default-500 truncate max-w-full sm:max-w-md">
         {redirect.targetUrl || (
          <span className="text-warning italic">Pending Target</span>
         )}
        </span>
        {redirect.description && (
         <span className="text-tiny text-default-400 mt-1">
          {redirect.description}
         </span>
        )}
       </div>
       <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        <div className="text-small whitespace-nowrap">
         {redirect._count.clicks} clicks
        </div>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
         <Button
          size="sm"
          variant="flat"
          onPress={() => router.push(`/dashboard/${redirect.id}`)}
         >
          View
         </Button>
         <Button
          size="sm"
          variant="flat"
          onPress={() => {
           setEditingRedirect(redirect);
          }}
         >
          Edit
         </Button>
         <Button
          color="danger"
          size="sm"
          variant="light"
          onPress={() => {
           handleDelete(redirect.id);
          }}
         >
          Delete
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
  </>
 );
}
