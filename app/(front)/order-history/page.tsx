import { Metadata } from 'next';
import React from 'react';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Order History',
};
// Dynamically import MyOrders component with a fallback
const MyOrders = dynamic(() => import('./MyOrders'), {
  loading: () => <div>Loading your orders...</div>,
  ssr: false, // Ensures this component is only rendered on the client side
});

const MyOrderPage = () => {
  return (
    <div>
      <h1 className='py-2 text-2xl'>Order History</h1>
      <MyOrders /> {/* Use the Suspense-wrapped component */}
    </div>
  );
};

export default MyOrderPage;
