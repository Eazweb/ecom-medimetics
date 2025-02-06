import { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Register',
};
const Form = dynamic(() => import('./Form'), {
  loading: () => <div>Loading your orders...</div>,
  ssr: false, // Ensures this component is only rendered on the client side
});
const RegisterPage = async () => {
  return (
    <div>
      <Form />
    </div>
  );
};

export default RegisterPage;
