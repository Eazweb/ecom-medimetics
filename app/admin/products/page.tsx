import AdminLayout from '@/components/admin/AdminLayout';

import Products from './Products';
import ItemList from './Products';

const AdminProductsPge = () => {
  return (
    <AdminLayout activeItem='products'>
      <ItemList itemType="products" />
    </AdminLayout>
  );
};

export default AdminProductsPge;
