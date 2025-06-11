import { HeroBanner } from '@/components/hero-banner';
import { FeaturedCars } from '@/components/featured-cars';
import { CarCategories } from '@/components/car-categories';
import { CarFilters } from '@/components/car-filters';
import { AdminRedirect } from '@/components/admin-redirect';

export default function HomePage() {
  return (
    <>
      <AdminRedirect />
      <main className="min-h-screen">
        <HeroBanner />
        <CarCategories />
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="lg:w-1/4">
              <CarFilters />
            </aside>
            <div className="lg:w-3/4">
              <FeaturedCars />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
