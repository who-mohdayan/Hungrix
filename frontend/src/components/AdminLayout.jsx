import AdminTopbar from './AdminTopbar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f3f6fb] flex flex-col">
      <AdminTopbar />
      <main className="flex-1 overflow-auto p-5 lg:p-8">{children}</main>
    </div>
  );
}
