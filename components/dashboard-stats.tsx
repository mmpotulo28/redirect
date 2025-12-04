"use client";

import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Link2, MousePointerClick } from "lucide-react";

import { useRedirects } from "@/hooks/use-redirects";

type Redirect = {
  _count: { clicks: number };
};

export function DashboardStats() {
  const { redirects, isLoading } = useRedirects();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="border-none shadow-sm">
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <Spinner size="sm" />
          </CardBody>
        </Card>
        <Card className="border-none shadow-sm">
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <Spinner size="sm" />
          </CardBody>
        </Card>
      </div>
    );
  }

  const totalRedirects = redirects?.length || 0;
  const totalClicks =
    redirects?.reduce(
      (acc: number, r: Redirect) => acc + (r._count?.clicks || 0),
      0,
    ) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      <Card className="border-none shadow-sm bg-content1">
        <CardBody className="flex flex-row items-center gap-6 p-6">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary">
            <Link2 size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-default-500 font-medium uppercase tracking-wider">
              Total Redirects
            </p>
            <h3 className="text-3xl font-bold text-default-900">
              {totalRedirects}
            </h3>
          </div>
        </CardBody>
      </Card>
      <Card className="border-none shadow-sm bg-content1">
        <CardBody className="flex flex-row items-center gap-6 p-6">
          <div className="p-4 bg-secondary/10 rounded-2xl text-secondary">
            <MousePointerClick size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-default-500 font-medium uppercase tracking-wider">Total Clicks</p>
            <h3 className="text-3xl font-bold text-default-900">
              {totalClicks}
            </h3>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
