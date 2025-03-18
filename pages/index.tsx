import React from "react";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Destaques from "../components/destaques/index.tsx";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>CarShop - Sua loja de carros</title>
          <meta
            name="description"
            content="A melhor loja de carros da região"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <section className={styles.hero}>
            <h1 className={styles.title}>
              Bem-vindo à <span>CarShop!</span>
            </h1>

            <p className={styles.description}>
              Encontre o carro dos seus sonhos aqui
            </p>

            <div className={styles.buttonGroup}>
              <Link href="/carros" className={styles.primaryButton}>
                Ver todos os carros
              </Link>
              <Link href="/contato" className={styles.secondaryButton}>
                Fale conosco
              </Link>
            </div>
          </section>

          <Destaques />

          <section className={styles.categorias}>
            <h2 className={styles.subtitulo}>O que você procura?</h2>
            <div className={styles.grid}>
              <Link href="/carros?categoria=sedan" className={styles.card}>
                <h2>Sedans &rarr;</h2>
                <p>Conforto e elegância para sua família.</p>
              </Link>

              <Link href="/carros?categoria=suv" className={styles.card}>
                <h2>SUVs &rarr;</h2>
                <p>Robustez e versatilidade para qualquer terreno.</p>
              </Link>

              <Link href="/carros?categoria=hatch" className={styles.card}>
                <h2>Hatches &rarr;</h2>
                <p>Compactos e econômicos para a cidade.</p>
              </Link>

              <Link href="/carros?categoria=luxo" className={styles.card}>
                <h2>Carros de Luxo &rarr;</h2>
                <p>Exclusividade e alto desempenho.</p>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
