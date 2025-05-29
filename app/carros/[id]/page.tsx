import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Share2, Phone, MessageCircle, Gauge, Settings, Shield, Award } from "lucide-react"

// Mock data - em produção viria do banco de dados
const carData = {
  id: 1,
  brand: "Mercedes-Benz",
  model: "S-Class 500",
  year: 2024,
  price: 850000,
  images: [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ],
  isNew: true,
  mileage: "0 km",
  fuel: "Gasolina",
  transmission: "Automático",
  engine: "3.0 V6 Turbo",
  power: "435 cv",
  acceleration: "4.9s (0-100 km/h)",
  topSpeed: "250 km/h",
  consumption: "9.8 km/l",
  description:
    "O Mercedes-Benz S-Class 500 2024 representa o ápice do luxo e tecnologia automotiva. Com design elegante e sofisticado, este sedan oferece uma experiência de condução incomparável, combinando performance excepcional com o máximo conforto.",
  features: [
    "Sistema de som Burmester",
    "Teto solar panorâmico",
    "Bancos com massagem",
    "Ar condicionado automático 4 zonas",
    "Sistema de navegação MBUX",
    "Câmera 360°",
    "Piloto automático adaptativo",
    "Faróis LED adaptativos",
  ],
  safety: [
    "9 airbags",
    "ABS com EBD",
    "Controle de estabilidade",
    "Assistente de frenagem",
    "Alerta de ponto cego",
    "Detector de fadiga",
  ],
}

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Galeria de Imagens */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={carData.images[0] || "/placeholder.svg"}
                alt={`${carData.brand} ${carData.model}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                {carData.isNew && <Badge className="bg-green-600 text-white">Novo</Badge>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {carData.images.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${carData.brand} ${carData.model} - ${index + 2}`}
                    fill
                    className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informações do Carro */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {carData.brand} {carData.model}
            </h1>
            <p className="text-lg text-gray-600">{carData.year}</p>
          </div>

          <div className="text-4xl font-bold text-gray-900">R$ {carData.price.toLocaleString()}</div>

          {/* Especificações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Especificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Quilometragem</span>
                <span className="font-medium">{carData.mileage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Combustível</span>
                <span className="font-medium">{carData.fuel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transmissão</span>
                <span className="font-medium">{carData.transmission}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Motor</span>
                <span className="font-medium">{carData.engine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Potência</span>
                <span className="font-medium">{carData.power}</span>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="space-y-3">
            <Button className="w-full bg-black text-white hover:bg-gray-800 text-lg py-3">
              <Phone className="h-5 w-5 mr-2" />
              Entrar em Contato
            </Button>
            <Button variant="outline" className="w-full text-lg py-3">
              <MessageCircle className="h-5 w-5 mr-2" />
              Agendar Test Drive
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Favoritar
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Descrição e Detalhes */}
      <div className="mt-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Descrição */}
          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{carData.description}</p>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gauge className="h-5 w-5 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Aceleração (0-100 km/h)</span>
                <span className="font-medium">{carData.acceleration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Velocidade máxima</span>
                <span className="font-medium">{carData.topSpeed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Consumo médio</span>
                <span className="font-medium">{carData.consumption}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Potência</span>
                <span className="font-medium">{carData.power}</span>
              </div>
            </CardContent>
          </Card>

          {/* Equipamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Equipamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-2">
                {carData.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Award className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {carData.safety.map((item, index) => (
                <div key={index} className="flex items-center">
                  <Shield className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Financiamento */}
          <Card>
            <CardHeader>
              <CardTitle>Financiamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Parcelas a partir de</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {Math.round(carData.price / 60).toLocaleString()}/mês
                </p>
                <p className="text-xs text-gray-500">em 60x</p>
              </div>
              <Button variant="outline" className="w-full">
                Simular Financiamento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
