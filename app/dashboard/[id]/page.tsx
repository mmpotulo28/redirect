"use client";

import { Link } from "@heroui/link";
import { useParams } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";

import { title } from "@/components/primitives";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { useRedirect, useRedirectAnalytics } from "@/hooks/use-redirects";

export default function RedirectDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { redirect, isLoading: isLoadingRedirect } = useRedirect(id);
  const { clicks, isLoading: isLoadingAnalytics } = useRedirectAnalytics(id);

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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

      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <AnalyticsCharts clicks={clicks} />
    </div>
  );
}
