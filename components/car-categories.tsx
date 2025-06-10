import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Sparkles, Tag } from 'lucide-react';

const categories = [
  {
    title: 'Carros Novos',
    description: 'Últimos lançamentos das melhores marcas',
    icon: Car,
    href: '/carros/novos',
    count: '120+ veículos',
  },
  {
    title: 'Carros Usados',
    description: 'Seminovos selecionados com qualidade garantida',
    icon: Sparkles,
    href: '/carros/usados',
    count: '85+ veículos',
  },
  {
    title: 'Promoções',
    description: 'Ofertas especiais e condições exclusivas',
    icon: Tag,
    href: '/promocoes',
    count: '15+ ofertas',
  },
];

export function CarCategories() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Explore Nossa Coleção
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Descubra carros de luxo cuidadosamente selecionados para oferecer a
            melhor experiência
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <Link key={category.title} href={category.href}>
                <Card className="group h-full cursor-pointer transition-shadow hover:shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <Icon className="mx-auto h-12 w-12 text-gray-700 transition-colors group-hover:text-black" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900">
                      {category.title}
                    </h3>
                    <p className="mb-4 text-gray-600">{category.description}</p>
                    <span className="text-sm font-medium text-gray-500">
                      {category.count}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
