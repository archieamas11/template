import AdminLayout from '@/components/layouts/admin-layout';

export default function AdminIntermentDeceasedPage() {
  return (
    <AdminLayout>
      {/* 🧭 Simple placeholder content for navigation testing */}
      <div className="space-y-4">
        <h1 className="font-semibold text-2xl tracking-tight">Deceased Record</h1>
        <p className="text-muted-foreground">Manage deceased records.</p>
      </div>
    </AdminLayout>
  );
}
