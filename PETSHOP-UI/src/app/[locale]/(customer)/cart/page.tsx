import CartMain from '@/containers/Cart/cartDetail';
import CartSummary from '@/containers/Cart/cartSummary';

export default function CartPage() {
  return (
    <main className='py-10 space-y-4'>
      <h2 className='font-bold text-4xl mb-6'>Cart</h2>
      <div className='grid grid-cols-[3fr_1fr] gap-4'>
        <CartMain />
        <CartSummary />
      </div>
    </main>
  );
}
