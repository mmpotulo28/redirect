import { CreateRedirectModal } from "@/components/create-redirect-modal";
import { RedirectList } from "@/components/redirect-list";
import { DashboardStats } from "@/components/dashboard-stats";

export default function DashboardPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-default-900">Dashboard</h1>
          <p className="text-default-500">
            Manage your redirects and view performance.
          </p>
        </div>
        <CreateRedirectModal />
      </div>

      <DashboardStats />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-default-900">
          Your Redirects
        </h2>
        <RedirectList />
      </div>
    </div>
  );
}
