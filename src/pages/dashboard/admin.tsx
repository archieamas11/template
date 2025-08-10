import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout';
import { ContentLayout } from '@/components/admin-panel/content-layout';

export function AdminDashboardPage() {
  return (
    <AdminPanelLayout>
      <ContentLayout title="Admin Dashboard">
        <div className="rounded-lg border p-6">Welcome, Admin.</div>
      </ContentLayout>
    </AdminPanelLayout>
  );
}
