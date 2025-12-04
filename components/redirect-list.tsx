"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { Tooltip } from "@heroui/tooltip";
import {
 QrCode,
 Pencil,
 Trash2,
 ExternalLink,
 BarChart2,
 Calendar,
 Globe,
 Search,
 Filter
} from "lucide-react";

import { EditRedirectModal } from "./edit-redirect-modal";
import { QRCodeModal } from "./qr-code-modal";

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
 tags?: string[];
 qrCodeUrl?: string | null;
 _count: { clicks: number };
};

export function RedirectList() {
 const { redirects, isLoading, mutate } = useRedirects();
 const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null);
 const [viewingQRCode, setViewingQRCode] = useState<Redirect | null>(null);
 const [searchQuery, setSearchQuery] = useState("");
 const [statusFilter, setStatusFilter] = useState("all");
 const router = useRouter();

 const filteredRedirects = useMemo(() => {
  if (!redirects) return [];

  return redirects.filter((redirect: Redirect) => {
   const matchesSearch =
    redirect.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    redirect.targetUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    redirect.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    redirect.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

   const matchesStatus =
    statusFilter === "all" ? true :
     statusFilter === "active" ? redirect.active :
      !redirect.active;

   return matchesSearch && matchesStatus;
  });
 }, [redirects, searchQuery, statusFilter]);

 const handleDelete = async (id: string) => {
  if (confirm("Are you sure you want to delete this redirect?")) {
   try {
    await deleteRedirect(id);
    mutate("/api/redirects");
   } catch {
    // Ignore error
   }
  }
 };

 if (isLoading) {
  return (
   <div className="flex justify-center mt-12">
    <Spinner size="lg" />
   </div>
  );
 }

 if (!redirects?.length) {
  return (
   <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-default-200 rounded-3xl">
    <div className="p-4 bg-default-100 rounded-full mb-4">
     <Globe className="text-default-500" size={32} />
    </div>
    <h3 className="text-xl font-semibold text-default-900">No redirects yet</h3>
    <p className="text-default-500 mt-2 max-w-xs">
     Create your first redirect to start tracking clicks and managing your links.
    </p>
   </div>
  );
 }

 return (
  <>
   <div className="flex flex-col sm:flex-row gap-4 mb-6">
    <Input
     className="w-full sm:max-w-md"
     placeholder="Search redirects..."
     startContent={<Search className="text-default-400" size={18} />}
     value={searchQuery}
     onValueChange={setSearchQuery}
    />
    <Select
     className="w-full sm:max-w-[200px]"
     defaultSelectedKeys={["all"]}
     startContent={<Filter className="text-default-400" size={18} />}
     onChange={(e) => setStatusFilter(e.target.value)}
    >
     <SelectItem key="all">All Status</SelectItem>
     <SelectItem key="active">Active</SelectItem>
     <SelectItem key="inactive">Inactive</SelectItem>
    </Select>
   </div>

   {!filteredRedirects.length ? (
    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-default-200 rounded-2xl bg-content1/50">
     <div className="p-3 bg-default-100 rounded-full mb-3">
      <Search className="text-default-500" size={24} />
     </div>
     <h3 className="text-lg font-semibold text-default-900">No results found</h3>
     <p className="text-default-500 mt-1 text-sm">
      Try adjusting your search or filter to find what you&apos;re looking for.
     </p>
     <Button
      className="mt-4"
      color="primary"
      size="sm"
      variant="flat"
      onPress={() => {
       setSearchQuery("");
       setStatusFilter("all");
      }}
     >
      Clear Filters
     </Button>
    </div>
   ) : (
    <div className="grid gap-4">
     {filteredRedirects.map((redirect: Redirect) => (
      <Card
       key={redirect.id}
       isPressable
       className="border-none shadow-sm hover:shadow-md transition-all duration-200 bg-content1"
       onPress={() => router.push(`/dashboard/${redirect.id}`)}
      >
       <CardBody className="p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div className="flex flex-col gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-lg">
            <span className="text-lg font-bold text-primary">
             /{redirect.shortCode}
            </span>
           </div>
           {!redirect.active && (
            <span className="text-xs bg-danger/10 text-danger px-2 py-1 rounded-md font-medium">
             Inactive
            </span>
           )}
           {redirect.password && (
            <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-md font-medium">
             Password
            </span>
           )}
          </div>

          <div className="flex items-center gap-2 text-small text-default-500">
           <ExternalLink size={14} />
           <span className="truncate max-w-[200px] sm:max-w-md font-medium">
            {redirect.targetUrl || (
             <span className="text-warning italic">Pending Target</span>
            )}
           </span>
          </div>

          {redirect.description && (
           <p className="text-tiny text-default-400 line-clamp-1">
            {redirect.description}
           </p>
          )}

          {redirect.tags && redirect.tags.length > 0 && (
           <div className="flex flex-wrap gap-1 mt-1">
            {redirect.tags.map((tag, index) => (
             <Chip key={index} className="h-5 text-[10px]" size="sm" variant="flat">
              {tag}
             </Chip>
            ))}
           </div>
          )}
         </div>

         <div className="flex items-center justify-between w-full sm:w-auto gap-8">
          <div className="flex flex-col items-end gap-1 min-w-[80px]">
           <div className="flex items-center gap-2 text-default-900">
            <BarChart2 className="text-default-400" size={18} />
            <span className="text-xl font-bold">
             {redirect._count.clicks}
            </span>
           </div>
           <div className="flex items-center gap-1 text-tiny text-default-400">
            <Calendar size={12} />
            <span>{new Date(redirect.createdAt).toLocaleDateString()}</span>
           </div>
          </div>

          <div className="flex items-center gap-1">
           <Tooltip content="View QR Code">
            <Button
             isIconOnly
             size="sm"
             variant="light"
             onClick={(e) => e.stopPropagation()}
             onKeyDown={(e) => e.stopPropagation()}
             onPress={() => setViewingQRCode(redirect)}
            >
             <QrCode className="text-default-500" size={18} />
            </Button>
           </Tooltip>
           <Tooltip content="Edit Redirect">
            <Button
             isIconOnly
             size="sm"
             variant="light"
             onClick={(e) => e.stopPropagation()}
             onKeyDown={(e) => e.stopPropagation()}
             onPress={() => setEditingRedirect(redirect)}
            >
             <Pencil className="text-default-500" size={18} />
            </Button>
           </Tooltip>
           <Tooltip color="danger" content="Delete Redirect">
            <Button
             isIconOnly
             color="danger"
             size="sm"
             variant="light"
             onClick={(e) => e.stopPropagation()}
             onKeyDown={(e) => e.stopPropagation()}
             onPress={() => handleDelete(redirect.id)}
            >
             <Trash2 size={18} />
            </Button>
           </Tooltip>
          </div>
         </div>
        </div>
       </CardBody>
      </Card>
     ))}
    </div>
   )}
   {editingRedirect && (
    <EditRedirectModal
     isOpen={!!editingRedirect}
     redirect={editingRedirect}
     onClose={() => setEditingRedirect(null)}
    />
   )}
   {viewingQRCode && (
    <QRCodeModal
     initialQrCodeUrl={viewingQRCode.qrCodeUrl}
     isOpen={!!viewingQRCode}
     redirectId={viewingQRCode.id}
     shortCode={viewingQRCode.shortCode}
     onClose={() => setViewingQRCode(null)}
     onSaved={() => mutate()}
    />
   )}
  </>
 );
}
