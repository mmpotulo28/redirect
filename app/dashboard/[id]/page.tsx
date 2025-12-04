"use client";

import { Link } from "@heroui/link";
import { useParams } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { useState } from "react";

import { title } from "@/components/primitives";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { useRedirect, useRedirectAnalytics } from "@/hooks/use-redirects";
import { EditIcon } from "@/components/icons";
import { EditRedirectModal } from "@/components/edit-redirect-modal";

export default function RedirectDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { redirect, isLoading: isLoadingRedirect } = useRedirect(id);
  const { clicks, isLoading: isLoadingAnalytics } = useRedirectAnalytics(id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoadingRedirect || isLoadingAnalytics) {
    return (
      <div className="flex justify-center mt-8">
        <Spinner />
      </div>
    );
  }

  if (!redirect || !clicks) {
    return <div>Not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col gap-2 mb-8">
        <Link className="text-sm text-default-500 mb-2" href="/dashboard">
          ← Back to Dashboard
        </Link>
        <h1 className={title()}>{redirect.shortCode}</h1>
        <div className="flex flex-col sm:flex-row gap-4 text-default-500">
          <Link isExternal className="text-primary" href={redirect.targetUrl}>
            {redirect.targetUrl}
          </Link>
          <span>•</span>
          <span>{redirect._count.clicks} total clicks</span>
          <span>•</span>
          <span>
            Created {new Date(redirect.createdAt).toLocaleDateString()}
          </span>
        </div>
        {redirect.description && (
          <p className="text-default-600 mt-2">{redirect.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardBody className="text-center py-8">
                <div className="text-4xl font-bold text-primary">
                  {redirect._count.clicks}
                </div>
                <div className="text-default-500">Total Clicks</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center py-8">
                <div className="text-4xl font-bold text-success">
                  {clicks.filter((c: any) => c.device === "mobile").length}
                </div>
                <div className="text-default-500">Mobile Clicks</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center py-8">
                <div className="text-4xl font-bold text-warning">
                  {clicks.filter((c: any) => c.device === "desktop").length}
                </div>
                <div className="text-default-500">Desktop Clicks</div>
              </CardBody>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <AnalyticsCharts clicks={clicks} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardBody className="flex flex-col gap-4 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Link Details</h3>
                <Button isIconOnly variant="light" onPress={() => setIsEditModalOpen(true)}>
                  <EditIcon />
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
      </div>

      <EditRedirectModal
        isOpen={isEditModalOpen}
        redirect={redirect}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
