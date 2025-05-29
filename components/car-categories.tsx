import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Sparkles, Tag } from "lucide-react"

const categories = [
  {
    title: "Carros Novos",
    description: "Últimos lançamentos das melhores marcas",
    icon: Car,
    href: "/carros/novos",
    count: "120+ veículos",
  },
  {
    title: "Carros Usados",
    description: "Seminovos selecionados com qualidade garantida",
    icon: Sparkles,
    href: "/carros/usados",
    count: "85+ veículos",
  },
  {
    title: "Promoções",
    description: "Ofertas especiais e condições exclusivas",
    icon: Tag,
    href: "/promocoes",
    count: "15+ ofertas",
  },
]

export function CarCategories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Nossa Coleção</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra carros de luxo cuidadosamente selecionados para oferecer a melhor experiência
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.title} href={category.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <Icon className="h-12 w-12 mx-auto text-gray-700 group-hover:text-black transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <span className="text-sm font-medium text-gray-500">{category.count}</span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
