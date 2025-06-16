'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bannerSlides = [
  {
    id: 1,
    title: 'Mercedes-Benz S-Class 2024',
    subtitle: 'Luxo e Performance Incomparáveis',
    price: 'R$ 850.000',
    image: '/mercedes-benz-s-class-2024.png',
    cta: 'Ver Detalhes',
  },
  {
    id: 2,
    title: 'BMW X7 2024',
    subtitle: 'SUV de Luxo Redefinido',
    price: 'R$ 720.000',
    image: '/bmw-x7-2024.png',
    cta: 'Agendar Test Drive',
  },
  {
    id: 3,
    title: 'Audi A8 2024',
    subtitle: 'Tecnologia e Elegância',
    price: 'R$ 680.000',
    image: '/audi-a8-2024.png ',
    cta: 'Conhecer Mais',
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      prev => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );
  };

  return (
    <section className="relative h-[70vh] overflow-hidden bg-black">
      {bannerSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image || '/placeholder.svg'}
            alt={slide.title}
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white">
                <h1 className="mb-4 text-5xl font-bold leading-tight md:text-6xl">
                  {slide.title}
                </h1>
                <p className="mb-6 text-xl text-gray-200 md:text-2xl">
                  {slide.subtitle}
                </p>
                <div className="mb-8 flex items-center gap-6">
                  <span className="text-3xl font-bold text-yellow-400">
                    {slide.price}
                  </span>
                </div>
                <Button
                  size="lg"
                  className="bg-white px-8 py-3 text-lg text-black hover:bg-gray-100"
                >
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 space-x-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
}
