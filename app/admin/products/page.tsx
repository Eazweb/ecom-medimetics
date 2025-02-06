import AdminLayout from '@/components/admin/AdminLayout';

import dynamic from 'next/dynamic';
const ItemList = dynamic(() => import('./Products'), {
  loading: () => <div>Loading your orders...</div>,
  ssr: false, // Ensures this component is only rendered on the client side
});
const AdminProductsPge = () => {
  return (
    <AdminLayout activeItem='products'>
      <ItemList itemType="products" />
    </AdminLayout>
  );
};

export default AdminProductsPge;
