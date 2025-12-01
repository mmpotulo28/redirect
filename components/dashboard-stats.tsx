"use client";

import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { ChartIcon } from "./icons";
import { useRedirects } from "@/hooks/use-redirects";

type Redirect = {
 _count: { clicks: number };
};

export function DashboardStats() {
 const { redirects, isLoading } = useRedirects();

 if (isLoading) {
  return (
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
    <Card>
     <CardBody className="flex flex-row items-center gap-4 p-6">
      <Spinner size="sm" />
     </CardBody>
    </Card>
    <Card>
     <CardBody className="flex flex-row items-center gap-4 p-6">
      <Spinner size="sm" />
     </CardBody>
    </Card>
   </div>
  );
 }

 const totalRedirects = redirects?.length || 0;
 const totalClicks = redirects?.reduce((acc: number, r: Redirect) => acc + (r._count?.clicks || 0), 0) || 0;

 return (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
   <Card className="border-none bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10">
    <CardBody className="flex flex-row items-center gap-4 p-6">
     <div className="p-3 bg-primary/10 rounded-full text-primary">
      <ChartIcon size={24} />
     </div>
     <div>
      <p className="text-sm text-default-500 font-medium">Total Redirects</p>
      <h3 className="text-2xl font-bold text-default-900">{totalRedirects}</h3>
     </div>
    </CardBody>
   </Card>
   <Card className="border-none bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-900/10">
    <CardBody className="flex flex-row items-center gap-4 p-6">
     <div className="p-3 bg-secondary/10 rounded-full text-secondary">
      <ChartIcon size={24} />
     </div>
     <div>
      <p className="text-sm text-default-500 font-medium">Total Clicks</p>
      <h3 className="text-2xl font-bold text-default-900">{totalClicks}</h3>
     </div>
    </CardBody>
   </Card>
  </div>
 );
}
