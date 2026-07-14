import CardProduct from '@/components/Layout/item-card';
import CarouselComponent from '@/components/Layout/menu-carousel';

export default function HomeCustomer() {
  return (
    <main className='py-10 space-y-10'>
      <CarouselComponent />
      <div className='grid grid-cols-4 gap-4'>
        {Array.from({ length: 10 }).map((item, idx) => {
          return <CardProduct key={idx} title={`MITRA `.concat('1')} description='2' />;
        })}
      </div>
    </main>
  );
}
