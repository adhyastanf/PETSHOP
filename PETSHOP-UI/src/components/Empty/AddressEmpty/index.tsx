import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function EmptyAddress() {
  return (
    <Card>
      <CardContent className='flex flex-col items-center justify-center py-12 px-4 text-center'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4'>
          <MapPin className='h-8 w-8 text-muted-foreground' />
        </div>

        <h3 className='text-lg font-semibold tracking-tight mb-1'>Belum Ada Alamat Tersimpan</h3>
        <p className='text-sm text-muted-foreground max-w-sm mb-6'>Tambahkan alamat pengiriman Anda untuk memudahkan proses checkout dan transaksi berikutnya.</p>
      </CardContent>
    </Card>
  );
}
