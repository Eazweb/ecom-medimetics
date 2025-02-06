import { Metadata } from 'next';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Shopping Cart',
};

const CartDetails = dynamic(() => import('./CartDetails'), {
  loading: () => <div>Loading your orders...</div>,
  ssr: false,
});

const CartPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading your orders...</div>}>
        <CartDetails />
      </Suspense>
    </div>
  );
};

export default CartPage;