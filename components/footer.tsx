import Link from "next/link"
import { Car, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8" />
              <span className="text-2xl font-bold">LuxuryCars</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Especialistas em carros de luxo novos e usados. Oferecemos a melhor experiência em vendas de veículos
              premium.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/carros/novos" className="text-gray-400 hover:text-white">
                  Carros Novos
                </Link>
              </li>
              <li>
                <Link href="/carros/usados" className="text-gray-400 hover:text-white">
                  Carros Usados
                </Link>
              </li>
              <li>
                <Link href="/promocoes" className="text-gray-400 hover:text-white">
                  Promoções
                </Link>
              </li>
              <li>
                <Link href="/financiamento" className="text-gray-400 hover:text-white">
                  Financiamento
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-white">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Marcas */}
          <div>
            <h3 className="font-bold text-lg mb-4">Marcas</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marcas/mercedes-benz" className="text-gray-400 hover:text-white">
                  Mercedes-Benz
                </Link>
              </li>
              <li>
                <Link href="/marcas/bmw" className="text-gray-400 hover:text-white">
                  BMW
                </Link>
              </li>
              <li>
                <Link href="/marcas/audi" className="text-gray-400 hover:text-white">
                  Audi
                </Link>
              </li>
              <li>
                <Link href="/marcas/porsche" className="text-gray-400 hover:text-white">
                  Porsche
                </Link>
              </li>
              <li>
                <Link href="/marcas/jaguar" className="text-gray-400 hover:text-white">
                  Jaguar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">(11) 3456-7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">contato@luxurycars.com.br</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-400">
                  Av. Paulista, 1000
                  <br />
                  São Paulo - SP, 01310-100
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 LuxuryCars. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
