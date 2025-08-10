import ResidentsTable from '@/components/dashboard/admin-dashboard/residents/ResidentsTable';
import AdminLayout from '@/components/layouts/admin-layout';

export function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="grid grid-cols-2 items-center justify-between gap-4">
          <div className="w-full">
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="w-full">
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
        </div>
        {/* 🧭 Simple placeholder content for navigation testing */}
        <ResidentsTable />
      </div>
    </AdminLayout>
  );
}
