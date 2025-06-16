'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Car, User, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { UserMenu } from '@/components/user-menu';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const navigation = [
    { name: 'Início', href: '/' },
    // { name: 'Carros Novos', href: '/carros/novos' },
    // { name: 'Carros Usados', href: '/carros/usados' },
    // { name: 'Promoções', href: '/promocoes' },
    { name: 'Contato', href: '/contato' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-black" />
            <span className="text-2xl font-bold text-black">LuxuryCars</span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-black"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center space-x-4 md:flex">
            {isLoading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
            ) : isAuthenticated && user ? (
              <>
                <span className="mr-2 text-sm text-gray-600">
                  Olá, {user.name.split(' ')[0]}
                </span>
                <UserMenu />
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
              Vender Carro
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="mt-8 flex flex-col space-y-4">
                {navigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-gray-700 transition-colors hover:text-black"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}{' '}
                <div className="space-y-2 border-t pt-4">
                  {isLoading ? (
                    <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                  ) : isAuthenticated && user ? (
                    <>
                      <div className="rounded-md bg-gray-50 p-3">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                        {user.role && (
                          <p className="text-xs text-gray-500">
                            {user.role.name}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/perfil" onClick={() => setIsOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Perfil
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-600"
                        onClick={async () => {
                          await logout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Login
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full justify-start">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Carrinho
                  </Button>
                  <Button className="w-full bg-black text-white hover:bg-gray-800">
                    Vender Carro
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
