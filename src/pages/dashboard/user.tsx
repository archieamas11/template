import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout';
import { ContentLayout } from '@/components/admin-panel/content-layout';

export function UserDashboardPage() {
  return (
    <AdminPanelLayout>
      <ContentLayout title="User Dashboard">
        <div className="rounded-lg border p-6">Welcome, User.</div>
      </ContentLayout>
    </AdminPanelLayout>
  );
}
