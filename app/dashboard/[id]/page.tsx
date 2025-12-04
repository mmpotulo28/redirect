"use client";

import { Link } from "@heroui/link";
import { useParams } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  BarChart2,
  Smartphone,
  Monitor,
  Pencil
} from "lucide-react";

import { title } from "@/components/primitives";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { useRedirect, useRedirectAnalytics } from "@/hooks/use-redirects";
import { EditRedirectModal } from "@/components/edit-redirect-modal";

export default function RedirectDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { redirect, isLoading: isLoadingRedirect } = useRedirect(id);
  const { clicks, isLoading: isLoadingAnalytics } = useRedirectAnalytics(id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoadingRedirect || isLoadingAnalytics) {
    return (
      <div className="flex justify-center mt-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!redirect || !clicks) {
    return <div>Not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-8">
      <div className="flex flex-col gap-4">
        <Link
          className="text-sm text-default-500 hover:text-default-900 transition-colors flex items-center gap-1 w-fit"
          href="/dashboard"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className={title({ size: "sm" })}>/{redirect.shortCode}</h1>
            {!redirect.active && (
              <span className="text-sm bg-danger/10 text-danger px-2 py-1 rounded-md font-medium">
                Inactive
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-default-500">
            <div className="flex items-center gap-2">
              <ExternalLink size={16} />
              <Link isExternal className="text-primary font-medium" href={redirect.targetUrl}>
                {redirect.targetUrl}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <BarChart2 size={16} />
              <span>{redirect._count.clicks} total clicks</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                Created {new Date(redirect.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {redirect.description && (
            <p className="text-default-600 max-w-2xl">{redirect.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm bg-content1">
              <CardBody className="flex flex-row items-center justify-between p-6">
                <div className="flex flex-col gap-1">
                  <span className="text-default-500 font-medium">Total Clicks</span>
                  <span className="text-2xl font-bold text-primary">
                    {redirect._count.clicks}
                  </span>
                </div>
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <BarChart2 size={24} />
                </div>
              </CardBody>
            </Card>
            <Card className="border-none shadow-sm bg-content1">
              <CardBody className="flex flex-row items-center justify-between p-6">
                <div className="flex flex-col gap-1">
                  <span className="text-default-500 font-medium">Mobile</span>
                  <span className="text-2xl font-bold text-success">
                    {clicks.filter((c: any) => c.device === "mobile").length}
                  </span>
                </div>
                <div className="p-3 rounded-full bg-success/10 text-success">
                  <Smartphone size={24} />
                </div>
              </CardBody>
            </Card>
            <Card className="border-none shadow-sm bg-content1">
              <CardBody className="flex flex-row items-center justify-between p-6">
                <div className="flex flex-col gap-1">
                  <span className="text-default-500 font-medium">Desktop</span>
                  <span className="text-2xl font-bold text-warning">
                    {clicks.filter((c: any) => c.device === "desktop").length}
                  </span>
                </div>
                <div className="p-3 rounded-full bg-warning/10 text-warning">
                  <Monitor size={24} />
                </div>
              </CardBody>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 text-default-900">Analytics Overview</h2>
            <AnalyticsCharts clicks={clicks} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-none shadow-sm bg-content1 h-fit sticky top-24">
            <CardBody className="flex flex-col gap-6 p-6">
              <div className="flex justify-between items-center border-b border-default-100 pb-4">
                <h3 className="text-lg font-bold">Link Details</h3>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => setIsEditModalOpen(true)}
                >
                  <Pencil className="text-default-500" size={18} />
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-default-500">Target URL</p>
                  <p className="break-all text-sm">{redirect.targetUrl}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Short Code</p>
                  <p className="text-sm">{redirect.shortCode}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Description</p>
                  <p className="text-sm">{redirect.description || "No description"}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Status</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-1 ${redirect.active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                    {redirect.active ? "Active" : "Inactive"}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-default-500">Created At</p>
                  <p className="text-sm">{new Date(redirect.createdAt).toLocaleDateString()}</p>
                </div>
                {redirect.startsAt && (
                  <div>
                    <p className="text-sm text-default-500">Starts At</p>
                    <p className="text-sm">{new Date(redirect.startsAt).toLocaleString()}</p>
                  </div>
                )}
                {redirect.expiresAt && (
                  <div>
                    <p className="text-sm text-default-500">Expires At</p>
                    <p className="text-sm">{new Date(redirect.expiresAt).toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-default-500">Password Protection</p>
                  <p className="text-sm">{redirect.password ? "Enabled" : "Disabled"}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Targeting Rules</p>
                  <p className="text-sm">{redirect.targetingRules?.length || 0} rules configured</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>


        <EditRedirectModal
          isOpen={isEditModalOpen}
          redirect={redirect}
          onClose={() => setIsEditModalOpen(false)}
        />
      </div>
    </div>
  );
}
