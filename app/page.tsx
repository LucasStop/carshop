import { HeroBanner } from "@/components/hero-banner"
import { FeaturedCars } from "@/components/featured-cars"
import { CarCategories } from "@/components/car-categories"
import { CarFilters } from "@/components/car-filters"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroBanner />
      <CarCategories />
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <CarFilters />
          </aside>
          <div className="lg:w-3/4">
            <FeaturedCars />
          </div>
        </div>
      </section>
    </main>
  )
}
