import React from 'react';
import Link from 'next/link';
import styles from './cardCarro.module.css';

interface Carro {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
  imagem: string;
}

interface CardCarroProps {
  carro: Carro;
  destaque?: boolean;
}

const CardCarro: React.FC<CardCarroProps> = ({ carro, destaque = false }) => {
  return (
    <div className={`${styles.carroCard} ${destaque ? styles.destaque : ''}`}>
      <div className={styles.carroImagem}>
        <img src={carro.imagem} alt={`${carro.marca} ${carro.modelo}`} />
        {destaque && <span className={styles.destaqueTag}>Destaque</span>}
      </div>
      <div className={styles.carroInfo}>
        <h2>{carro.marca} {carro.modelo}</h2>
        <p className={styles.carroAno}>Ano: {carro.ano}</p>
        <p className={styles.carroPreco}>
          R$ {carro.preco.toLocaleString('pt-BR')}
        </p>
        <div className={styles.botoesContainer}>
          <Link href={`/carros/${carro.id}`} className={styles.botaoDetalhe}>
            Ver detalhes
          </Link>
          <button className={styles.botaoInteresse}>
            Tenho interesse
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardCarro;
