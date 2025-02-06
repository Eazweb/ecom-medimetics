import AdminLayout from '@/components/admin/AdminLayout';
import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Admin Orders',
};
const Orders = dynamic(() => import('./Orders'), {
  loading: () => <div>Loading your orders...</div>,
  ssr: false, // Ensures this component is only rendered on the client side
});
const AdminOrdersPage = () => {
  return (
    <AdminLayout activeItem='orders'>
      <Orders />
    </AdminLayout>
  );
};

export default AdminOrdersPage;
