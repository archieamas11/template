import ResidentsTable from '@/components/dashboard/residents/ResidentsTable';
import AdminLayout from '@/components/layouts/admin-layout';

export function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="font-semibold text-2xl tracking-tight">Residents</h1>
        <ResidentsTable />
      </div>
    </AdminLayout>
  );
}
