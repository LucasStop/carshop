import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Carousel.module.css';

interface Slide {
  id: number;
  imagem: string;
  titulo: string;
  subtitulo: string;
  link: string;
}

const slides: Slide[] = [
  {
    id: 1,
    imagem: '/images/banner1.jpg',
    titulo: 'Ofertas especiais',
    subtitulo: 'Até 20% de desconto em veículos selecionados',
    link: '/ofertas'
  },
  {
    id: 2,
    imagem: '/images/banner2.jpg',
    titulo: 'Novos modelos 2023',
    subtitulo: 'Conheça as novidades que acabaram de chegar',
    link: '/novidades'
  },
  {
    id: 3,
    imagem: '/images/banner3.jpg',
    titulo: 'Financiamento facilitado',
    subtitulo: 'Entrada a partir de 20% e até 60 meses para pagar',
    link: '/financiamento'
  }
];

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotação do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(current => (current + 1) % slides.length);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(current => (current + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(current => (current - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselInner} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide) => (
          <div className={styles.slide} key={slide.id}>
            <div className={styles.slideContent}>
              <h2>{slide.titulo}</h2>
              <p>{slide.subtitulo}</p>
              <Link href={slide.link} className={styles.slideButton}>
                Ver mais
              </Link>
            </div>
            <div className={styles.slideBackground} style={{ backgroundImage: `url(${slide.imagem})` }} />
          </div>
        ))}
      </div>
      
      <button className={`${styles.carouselControl} ${styles.prev}`} onClick={prevSlide}>
        &lt;
      </button>
      <button className={`${styles.carouselControl} ${styles.next}`} onClick={nextSlide}>
        &gt;
      </button>
      
      <div className={styles.carouselIndicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
