import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

const featuredCars = [
  {
    id: 1,
    brand: "Mercedes-Benz",
    model: "S-Class 500",
    year: 2024,
    price: 850000,
    image: "/placeholder.svg?height=300&width=400",
    isNew: true,
    mileage: "0 km",
    fuel: "Gasolina",
    transmission: "Automático",
  },
  {
    id: 2,
    brand: "BMW",
    model: "X7 xDrive40i",
    year: 2023,
    price: 720000,
    image: "/placeholder.svg?height=300&width=400",
    isNew: false,
    mileage: "15.000 km",
    fuel: "Gasolina",
    transmission: "Automático",
  },
  {
    id: 3,
    brand: "Audi",
    model: "A8 L 60 TFSI",
    year: 2024,
    price: 680000,
    image: "/placeholder.svg?height=300&width=400",
    isNew: true,
    mileage: "0 km",
    fuel: "Gasolina",
    transmission: "Automático",
  },
  {
    id: 4,
    brand: "Porsche",
    model: "Cayenne Turbo",
    year: 2023,
    price: 920000,
    image: "/placeholder.svg?height=300&width=400",
    isNew: false,
    mileage: "8.500 km",
    fuel: "Gasolina",
    transmission: "Automático",
  },
  {
    id: 5,
    brand: "Jaguar",
    model: "F-PACE SVR",
    year: 2024,
    price: 580000,
    image: "/placeholder.svg?height=300&width=400",
    isNew: true,
    mileage: "0 km",
    fuel: "Gasolina",
    transmission: "Automático",
  },
  {
    id: 6,
    brand: "Land Rover",
    model: "Range Rover Vogue",
    year: 2023,
    price: 750000,
    image: "/placeholder.svg?height=300&width=400",
    isNew: false,
    mileage: "12.000 km",
    fuel: "Diesel",
    transmission: "Automático",
  },
]

export function FeaturedCars() {
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Carros em Destaque</h2>
        <Link href="/carros" className="text-sm font-medium text-gray-600 hover:text-black">
          Ver todos →
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCars.map((car) => (
          <Card key={car.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={car.image || "/placeholder.svg"}
                alt={`${car.brand} ${car.model}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                {car.isNew && <Badge className="bg-green-600 text-white">Novo</Badge>}
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="mb-3">
                <h3 className="font-bold text-lg text-gray-900">
                  {car.brand} {car.model}
                </h3>
                <p className="text-sm text-gray-600">{car.year}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-4">
                <span>{car.mileage}</span>
                <span>{car.fuel}</span>
                <span>{car.transmission}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">R$ {car.price.toLocaleString()}</span>
                <Link href={`/carros/${car.id}`}>
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                    Ver Detalhes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
