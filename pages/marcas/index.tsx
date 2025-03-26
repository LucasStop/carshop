import React from "react";
import Head from "next/head";
import styles from "./marcas.module.css";
import Layout from "../../components/layout";

// Dados de exemplo
const marcas = [
  {
    id: 1,
    nome: "Toyota",
    pais: "Japão",
    logo: "/images/toyota.png",
    modelos: ["Corolla", "Yaris", "Hilux"],
  },
  {
    id: 2,
    nome: "Honda",
    pais: "Japão",
    logo: "/images/honda.png",
    modelos: ["Civic", "Fit", "HR-V"],
  },
  {
    id: 3,
    nome: "Volkswagen",
    pais: "Alemanha",
    logo: "/images/volkswagen.png",
    modelos: ["Golf", "Polo", "T-Cross"],
  },
  {
    id: 4,
    nome: "Fiat",
    pais: "Itália",
    logo: "/images/fiat.png",
    modelos: ["Pulse", "Argo", "Mobi"],
  },
  {
    id: 5,
    nome: "Chevrolet",
    pais: "Estados Unidos",
    logo: "/images/chevrolet.png",
    modelos: ["Onix", "Tracker", "Cruze"],
  },
  {
    id: 6,
    nome: "Hyundai",
    pais: "Coreia do Sul",
    logo: "/images/hyundai.png",
    modelos: ["HB20", "Creta", "Tucson"],
  },
];

export default function Marcas() {
  return (
    <Layout>
      <Head>
        <title>Marcas | CarShop</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Marcas Disponíveis</h1>

        <div className={styles.marcasGrid}>
          {marcas.map((marca) => (
            <div key={marca.id} className={styles.marcaCard}>
              <div className={styles.marcaLogo}>
                <img src={marca.logo} alt={`Logo da ${marca.nome}`} />
              </div>
              <h2>{marca.nome}</h2>
              <p>País de origem: {marca.pais}</p>
              <div className={styles.modelosContainer}>
                <h3>Principais modelos:</h3>
                <ul>
                  {marca.modelos.map((modelo, index) => (
                    <li key={index}>{modelo}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
