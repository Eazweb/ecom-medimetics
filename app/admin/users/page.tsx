import AdminLayout from '@/components/admin/AdminLayout';

import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Admin Users',
};
const Users = dynamic(() => import('./Users'), {
  loading: () => <div>Loading your orders...</div>,
  ssr: false, // Ensures this component is only rendered on the client side
});
const AdminUsersPage = () => {
  return (
    <AdminLayout activeItem='users'>
      <Users />
    </AdminLayout>
  );
};

export default AdminUsersPage;
