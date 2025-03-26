import React from 'react';
import styles from './destaques.module.css';
import CardCarro from '../cardCarro';

const carrosDestaque = [
  { 
    id: 1, 
    marca: 'Toyota', 
    modelo: 'Corolla', 
    ano: 2023, 
    preco: 135000, 
    imagem: '/images/corolla.jpg' 
  },
  { 
    id: 2, 
    marca: 'Honda', 
    modelo: 'Civic', 
    ano: 2022, 
    preco: 125000, 
    imagem: '/images/civic.jpg' 
  },
  { 
    id: 3, 
    marca: 'Volkswagen', 
    modelo: 'T-Cross', 
    ano: 2023, 
    preco: 138000, 
    imagem: '/images/tcross.jpg' 
  }
];

const Destaques: React.FC = () => {
  return (
    <section className={styles.destaquesContainer}>
      <h2 className={styles.titulo}>Destaques da semana</h2>
      
      <div className={styles.destaquesGrid}>
        {carrosDestaque.map(carro => (
          <CardCarro key={carro.id} carro={carro} destaque={true} />
        ))}
      </div>
    </section>
  );
};

export default Destaques;
