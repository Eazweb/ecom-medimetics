import { Metadata } from 'next';

import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Shopping Cart',
};
const CartDetails = dynamic(() => import('./CartDetails'), {
  loading: () => <div>Loading your orders...</div>,
  ssr: false, // Ensures this component is only rendered on the client side
});
const CartPage = () => {
  return (
    <div>
      <CartDetails />
    </div>
  );
};

export default CartPage;
