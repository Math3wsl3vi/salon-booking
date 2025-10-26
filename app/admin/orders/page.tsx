// import AdminOrders from "@/components/admin/AdminOrders";

import AdminOrders from "@/components/admin/AdminOrders";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminPanel() {
  return (
    <ProtectedRoute>
    <div className="mt-20">
      <AdminOrders />
    </div>
  </ProtectedRoute>
  );
}
