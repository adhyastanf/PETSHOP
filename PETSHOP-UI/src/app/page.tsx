export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center gap-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Pet Marketplace
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
            Marketplace produk dan layanan hewan peliharaan.
          </h1>
          <p className="mt-5 text-lg leading-8 text-zinc-600">
            Starter UI untuk customer, mitra petshop, dan admin sesuai Product Vision Document.
          </p>
        </div>
        <nav className="grid gap-3 sm:grid-cols-3">
          <a className="rounded-lg border border-zinc-200 bg-white p-5 font-medium" href="/customer/home">
            Customer
          </a>
          <a className="rounded-lg border border-zinc-200 bg-white p-5 font-medium" href="/mitra/home">
            Mitra
          </a>
          <a className="rounded-lg border border-zinc-200 bg-white p-5 font-medium" href="/admin/home">
            Admin
          </a>
        </nav>
      </section>
    </main>
  );
}
