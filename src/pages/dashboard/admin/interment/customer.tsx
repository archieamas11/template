import AdminLayout from '@/components/layouts/admin-layout';

export default function AdminIntermentCustomerPage() {
  return (
    <AdminLayout>
      {/* 🧭 Simple placeholder content for navigation testing */}
      <div className="space-y-4">
        <h1 className="font-semibold text-2xl tracking-tight">Customer</h1>
        <p className="text-muted-foreground">Manage interment customers.</p>
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
    </AdminLayout>
  );
}
