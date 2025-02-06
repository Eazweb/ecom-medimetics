import { Metadata } from 'next';
import { Suspense } from 'react';
import CartDetails from './CartDetails';
export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Shopping Cart',
};


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