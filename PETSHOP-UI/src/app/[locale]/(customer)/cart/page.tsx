import CartMain from '@/containers/Cart/CartDetail';
import CartSummary from '@/containers/Cart/CartSummary';
// import CartSummary from '@/containers/Cart/CartSummary';
import { getTranslations } from 'next-intl/server';

export default async function CartPage() {
  const t = await getTranslations('customer');

  return (
    <main className='flex flex-col gap-6 py-8 sm:py-10'>
      <h1 className='text-h1'>{t('cart.title')}</h1>
      <div className='grid min-w-0 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(18rem,1fr)]'>
        <CartMain />
        <CartSummary />
      </div>
    </main>
  );
}
