import { Metadata } from 'next';
import dynamic from 'next/dynamic';

import Categories from '@/components/categories/Categories';
import Icons from '@/components/icons/Icons';
import ReadMore from '@/components/readMore/ReadMore';
import Text from '@/components/readMore/Text';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Fullstack Next.js Store',
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    'Fullstack Next.js Store - Server Components, MongoDB, Next Auth, Tailwind, Zustand',
};

// Dynamically import components with loading fallbacks
const Carousel = dynamic(() => import('@/components/carousel/carousel'), {
  loading: () => <div>Loading Carousel...</div>,
  ssr: false,
});

const ProductItems = dynamic(
  () => import('@/components/products/ProductItems'),
  {
    loading: () => <div>Loading Latest Products...</div>,
    ssr: false,
  },
);

const Slider = dynamic(() => import('@/components/slider/Slider'), {
  loading: () => <div>Loading Slider...</div>,
  ssr: false,
});

const HomePage = () => {
  return (
    <div className='my-8 flex flex-col gap-4 md:gap-16'>
      <div>
        <Carousel />
      </div>
      <div className='flex flex-col gap-8 md:flex-row'>
        <div className='flex-1'>
          <p className='text-nowrap text-4xl font-semibold md:text-6xl'>
            Simply Unique/ <br /> Simply Better.
          </p>
        </div>
        <div className='flex flex-1 items-center'>
          <div>
            <span className='font-bold'>Fashion Corner</span> is a gift &
            clothes store based in HCMC, <br className='hidden sm:inline' />
            Vietnam. Est since 2019.
          </div>
        </div>
      </div>
      <Categories />
      <Icons />
      <ProductItems />
      <Slider />
      <ReadMore>
        <Text />
      </ReadMore>
    </div>
  );
};

export default HomePage;
