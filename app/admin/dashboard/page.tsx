import AdminLayout from '@/components/admin/AdminLayout';
import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Admin Dashboard',
};
const Dashboard = dynamic(() => import('./Dashboard'), {
  loading: () => <div>Loading your orders...</div>,
  ssr: false, // Ensures this component is only rendered on the client side
});
const DashbaordPage = () => {
  return (
    <AdminLayout activeItem='dashboard'>
      <Dashboard />
    </AdminLayout>
  );
};

export default DashbaordPage;
