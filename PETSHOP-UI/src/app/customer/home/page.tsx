'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { Category, PageResponse, Product } from '@/types';

export default function CustomerHomePage() {
  const { data: categories, isLoading: loadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchApi<Category[]>('/categories'),
  });

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchApi<PageResponse<Product>>('/products'),
  });

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold">Pet Marketplace</h1>
        <p className="mt-2 text-zinc-600">Temukan produk dan layanan untuk hewan peliharaan kamu.</p>

        {/* Categories */}
        <section className="mt-8">
          <h2 className="text-xl font-medium">Kategori</h2>
          {loadingCats ? (
            <p className="mt-3 text-zinc-500">Memuat kategori...</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {categories?.map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Products */}
        <section className="mt-10">
          <h2 className="text-xl font-medium">Produk</h2>
          {loadingProducts ? (
            <p className="mt-3 text-zinc-500">Memuat produk...</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products?.content.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg border border-zinc-200 bg-white p-5"
                >
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{product.petshopName}</p>
                  <p className="mt-1 text-sm text-zinc-500">{product.categoryName}</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    {product.discountPrice ? (
                      <>
                        <span className="text-lg font-semibold text-emerald-700">
                          Rp {product.discountPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="text-sm text-zinc-400 line-through">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex gap-3 text-xs text-zinc-400">
                    <span>⭐ {product.ratingAvg}</span>
                    <span>Terjual {product.soldCount}</span>
                    <span>Stok {product.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
