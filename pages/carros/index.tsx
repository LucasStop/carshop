import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "./carros.module.css";
import Layout from "../../components/Layout";
import CardCarro from "../../components/cardCarro";

// Dados de exemplo (em um projeto real, viriam de uma API)
const carrosIniciais = [
  {
    id: 1,
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2022,
    preco: 120000,
    imagem: "/images/corolla.jpg",
  },
  {
    id: 2,
    marca: "Honda",
    modelo: "Civic",
    ano: 2021,
    preco: 115000,
    imagem: "/images/civic.jpg",
  },
  {
    id: 3,
    marca: "Volkswagen",
    modelo: "Golf",
    ano: 2022,
    preco: 110000,
    imagem: "/images/golf.jpg",
  },
  {
    id: 4,
    marca: "Fiat",
    modelo: "Pulse",
    ano: 2023,
    preco: 98000,
    imagem: "/images/pulse.jpg",
  },
  {
    id: 5,
    marca: "Hyundai",
    modelo: "HB20",
    ano: 2022,
    preco: 85000,
    imagem: "/images/hb20.jpg",
  },
  {
    id: 6,
    marca: "Chevrolet",
    modelo: "Onix",
    ano: 2023,
    preco: 82000,
    imagem: "/images/onix.jpg",
  },
];

export default function Carros() {
  const router = useRouter();
  const { categoria } = router.query;

  const [carros, setCarros] = useState(carrosIniciais);
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroAnoMin, setFiltroAnoMin] = useState("");

  // Filtrar carros com base nos parâmetros de URL e filtros do usuário
  useEffect(() => {
    let carrosFiltrados = [...carrosIniciais];

    // Filtrar por categoria da URL
    if (categoria) {
      // Lógica de filtro por categoria (exemplo simplificado)
      // Em um caso real, os carros teriam um campo 'categoria'
      const categoriaStr = String(categoria).toLowerCase();
      if (categoriaStr === "sedan") {
        carrosFiltrados = carrosFiltrados.filter(
          (c) =>
            c.modelo.toLowerCase().includes("corolla") ||
            c.modelo.toLowerCase().includes("civic")
        );
      } else if (categoriaStr === "suv") {
        carrosFiltrados = carrosFiltrados.filter((c) =>
          c.modelo.toLowerCase().includes("pulse")
        );
      }
    }

    // Filtros adicionais
    if (filtroMarca) {
      carrosFiltrados = carrosFiltrados.filter((c) =>
        c.marca.toLowerCase().includes(filtroMarca.toLowerCase())
      );
    }

    if (filtroAnoMin) {
      const anoMin = parseInt(filtroAnoMin);
      if (!isNaN(anoMin)) {
        carrosFiltrados = carrosFiltrados.filter((c) => c.ano >= anoMin);
      }
    }

    setCarros(carrosFiltrados);
  }, [categoria, filtroMarca, filtroAnoMin]);

  return (
    <Layout>
      <Head>
        <title>Carros | CarShop</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>
          {categoria ? `Carros ${categoria}` : "Carros Disponíveis"}
        </h1>

        <div className={styles.filtros}>
          <div className={styles.filtroContainer}>
            <input
              type="text"
              placeholder="Filtrar por marca"
              value={filtroMarca}
              onChange={(e) => setFiltroMarca(e.target.value)}
              className={styles.filtroInput}
            />
          </div>

          <div className={styles.filtroContainer}>
            <select
              value={filtroAnoMin}
              onChange={(e) => setFiltroAnoMin(e.target.value)}
              className={styles.filtroSelect}
            >
              <option value="">Selecione o ano mínimo</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>

        <div className={styles.carrosGrid}>
          {carros.length > 0 ? (
            carros.map((carro) => <CardCarro key={carro.id} carro={carro} />)
          ) : (
            <p className={styles.semResultados}>
              Nenhum carro encontrado com os filtros atuais.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
