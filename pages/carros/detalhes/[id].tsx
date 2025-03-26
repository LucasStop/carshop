import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../../components/layout";
import styles from "./carroDetalhe.module.css";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaGasPump, FaCar, FaCalendarAlt } from "react-icons/fa";

// Interface para o carro
interface Carro {
  id: number;
  marca: string;
  modelo: string;
  versao: string;
  ano: number;
  km: number;
  cor: string;
  cambio: string;
  combustivel: string;
  preco: number;
  descricao: string;
  caracteristicas: string[];
  imagens: string[];
  avaliacoes: Array<{
    id: number;
    usuario: string;
    nota: number;
    comentario: string;
  }>;
}

// Dados de exemplo (em um projeto real, viriam de uma API)
const carrosDetalhes: { [key: string]: Carro } = {
  1: {
    id: 1,
    marca: "Toyota",
    modelo: "Corolla",
    versao: "XEI 2.0 Flex",
    ano: 2022,
    km: 15000,
    cor: "Prata",
    cambio: "Automático",
    combustivel: "Flex",
    preco: 120000,
    descricao:
      "Veículo em excelente estado, único dono, revisões feitas na concessionária. Possui ar-condicionado digital, direção elétrica, freios ABS, airbags, controle de estabilidade, câmera de ré e sensores de estacionamento.",
    caracteristicas: [
      "Ar-condicionado digital",
      "Direção elétrica",
      "Vidros e travas elétricas",
      "Piloto automático",
      "Central multimídia",
      "Câmera de ré",
      "Bancos de couro",
      "Sensor de estacionamento",
      "Controle de tração",
    ],
    imagens: [
      "/images/corolla.jpg",
      "/images/corolla-interior.jpg",
      "/images/corolla-traseira.jpg",
      "/images/corolla-motor.jpg",
    ],
    avaliacoes: [
      {
        id: 1,
        usuario: "Carlos Silva",
        nota: 5,
        comentario: "Excelente carro! Confortável e econômico.",
      },
      {
        id: 2,
        usuario: "Ana Rodrigues",
        nota: 4,
        comentario: "Muito bom, mas poderia ter mais recursos de conforto.",
      },
    ],
  },
  2: {
    id: 2,
    marca: "Honda",
    modelo: "Civic",
    versao: "EXL 2.0 Flex",
    ano: 2021,
    km: 25000,
    cor: "Preto",
    cambio: "Automático",
    combustivel: "Flex",
    preco: 115000,
    descricao:
      "Veículo em excelente estado, segundo dono, todas as revisões em dia. Possui ar-condicionado digital, direção elétrica, kit multimídia com GPS, controle de cruzeiro adaptativo e sistema de frenagem autônoma.",
    caracteristicas: [
      "Ar-condicionado digital",
      "Direção elétrica",
      "Vidros e travas elétricas",
      "Controle de cruzeiro adaptativo",
      "Central multimídia",
      "Câmera de ré",
      "Bancos de couro",
      "Frenagem autônoma",
      "Faróis em LED",
    ],
    imagens: [
      "/images/civic.jpg",
      "/images/civic-interior.jpg",
      "/images/civic-traseira.jpg",
      "/images/civic-motor.jpg",
    ],
    avaliacoes: [
      {
        id: 1,
        usuario: "Pedro Almeida",
        nota: 5,
        comentario: "Carro incrível, performático e confortável!",
      },
      {
        id: 2,
        usuario: "Mariana Costa",
        nota: 5,
        comentario: "Design moderno e ótimo acabamento interno.",
      },
    ],
  },
};

export default function CarroDetalhe() {
  const router = useRouter();
  const { id } = router.query;
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Validar ID e buscar carro
  if (!id || !(Number(id) in carrosDetalhes)) {
    return (
      <Layout>
        <div className={styles.container}>
          <p className={styles.notFound}>Carro não encontrado!</p>
          <Link href="/carros" className={styles.backButton}>
            Voltar para lista de carros
          </Link>
        </div>
      </Layout>
    );
  }

  const carro = carrosDetalhes[Number(id)];

  const renderStars = (nota: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= nota ? (
          <AiFillStar key={i} className={styles.starFilled} />
        ) : (
          <AiOutlineStar key={i} className={styles.starEmpty} />
        )
      );
    }
    return stars;
  };

  return (
    <Layout>
      <Head>
        <title>
          {carro.marca} {carro.modelo} | CarShop
        </title>
      </Head>

      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> &gt;
          <Link href="/carros">Carros</Link> &gt;
          <span>
            {carro.marca} {carro.modelo}
          </span>
        </div>

        <div className={styles.carroGrid}>
          <div className={styles.galeriaContainer}>
            <div className={styles.imagemPrincipal}>
              <img
                src={carro.imagens[imagemAtiva]}
                alt={`${carro.marca} ${carro.modelo}`}
              />
            </div>
            <div className={styles.miniaturas}>
              {carro.imagens.map((imagem, index) => (
                <div
                  key={index}
                  className={`${styles.miniatura} ${
                    index === imagemAtiva ? styles.ativa : ""
                  }`}
                  onClick={() => setImagemAtiva(index)}
                >
                  <img
                    src={imagem}
                    alt={`${carro.marca} ${carro.modelo} - Imagem ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.infoContainer}>
            <h1 className={styles.titulo}>
              {carro.marca} {carro.modelo}
            </h1>
            <p className={styles.versao}>{carro.versao}</p>

            <div className={styles.especificacoes}>
              <div className={styles.especificacao}>
                <FaCalendarAlt />
                <span>Ano: {carro.ano}</span>
              </div>
              <div className={styles.especificacao}>
                <FaCar />
                <span>Km: {carro.km.toLocaleString("pt-BR")}</span>
              </div>
              <div className={styles.especificacao}>
                <FaGasPump />
                <span>Combustível: {carro.combustivel}</span>
              </div>
            </div>

            <p className={styles.preco}>
              R$ {carro.preco.toLocaleString("pt-BR")}
            </p>

            <div className={styles.acoes}>
              <button
                className={styles.botaoInteresse}
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
              >
                Tenho interesse
              </button>
              <a
                href={`https://wa.me/5511999998888?text=Olá! Tenho interesse no ${carro.marca} ${carro.modelo} ano ${carro.ano}`}
                className={styles.botaoWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                Contato via WhatsApp
              </a>
            </div>

            {mostrarFormulario && (
              <div className={styles.formularioInteresse}>
                <h3>Preencha seus dados</h3>
                <form>
                  <div className={styles.formGroup}>
                    <label htmlFor="nome">Nome completo</label>
                    <input type="text" id="nome" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="telefone">Telefone</label>
                    <input type="tel" id="telefone" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="mensagem">Mensagem</label>
                    <textarea
                      id="mensagem"
                      rows={3}
                      defaultValue={`Olá, tenho interesse no ${carro.marca} ${carro.modelo}.`}
                    />
                  </div>
                  <button type="submit" className={styles.botaoEnviar}>
                    Enviar mensagem
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className={styles.descricaoContainer}>
          <h2>Descrição do veículo</h2>
          <p>{carro.descricao}</p>

          <h2>Características</h2>
          <ul className={styles.caracteristicasList}>
            {carro.caracteristicas.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.avaliacoesContainer}>
          <h2>Avaliações dos clientes</h2>

          <div className={styles.avaliacoes}>
            {carro.avaliacoes.map((avaliacao) => (
              <div key={avaliacao.id} className={styles.avaliacao}>
                <div className={styles.avaliacaoHeader}>
                  <h3>{avaliacao.usuario}</h3>
                  <div className={styles.estrelas}>
                    {renderStars(avaliacao.nota)}
                  </div>
                </div>
                <p>{avaliacao.comentario}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
