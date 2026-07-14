import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

export default function CarouselComponent() {
  const styleAnimationArrow = {
    left: 'left-20 scale-200 opacity-0 group-hover:-left-3 group-hover:opacity-100',
    right: 'right-20 scale-200 opacity-0 group-hover:-right-3 group-hover:opacity-100',
  };

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className='w-full group'
    >
      <div className='rounded-2xl overflow-hidden'>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className='pl-0'>
              <Card className='rounded-none bg-amber-600'>
                <CardContent className='flex h-80 items-center justify-center p-6'>
                  <span className='text-4xl font-semibold'>{index + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
      <CarouselPrevious className={cn('transition-all duration-300', styleAnimationArrow['left'])} />
      <CarouselNext className={cn('transition-all duration-300', styleAnimationArrow['right'])} />
    </Carousel>
  );
}
