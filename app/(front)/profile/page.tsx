import { Metadata } from 'next';
import React from 'react';


import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Profile',
};
const Form = dynamic(() => import('./Form'), {
  loading: () => <div>Loading your orders...</div>,
  ssr: false, // Ensures this component is only rendered on the client side
});
const ProfilePage = async () => {
  return (
    <div>
      <Form />
    </div>
  );
};

export default ProfilePage;
