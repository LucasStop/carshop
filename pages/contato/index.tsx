import React, { useState } from "react";
import Head from "next/head";
import styles from "./contato.module.css";
import Layout from "../../components/layout";

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Aqui entraria a lógica para enviar o formulário
    console.log("Formulário enviado:", formData);
    alert("Mensagem enviada com sucesso!");
    // Limpar formulário
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      assunto: "",
      mensagem: "",
    });
  };

  return (
    <Layout>
      <Head>
        <title>Contato | CarShop</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Entre em Contato</h1>

        <div className={styles.contatoGrid}>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="nome">Nome completo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="assunto">Assunto</label>
                <select
                  id="assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um assunto</option>
                  <option value="Dúvidas sobre veículos">
                    Dúvidas sobre veículos
                  </option>
                  <option value="Agendamento de test drive">
                    Agendamento de test drive
                  </option>
                  <option value="Financiamento">Financiamento</option>
                  <option value="Reclamação">Reclamação</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mensagem">Mensagem</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  rows={5}
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Enviar mensagem
              </button>
            </form>
          </div>

          <div className={styles.infoContainer}>
            <div className={styles.infoBox}>
              <h2>Informações de contato</h2>
              <p>
                <strong>Telefone:</strong> (11) 3333-4444
              </p>
              <p>
                <strong>WhatsApp:</strong> (11) 99999-8888
              </p>
              <p>
                <strong>E-mail:</strong> contato@carshop.com.br
              </p>
              <p>
                <strong>Horário:</strong> Segunda a Sábado, das 8h às 18h
              </p>
            </div>

            <div className={styles.infoBox}>
              <h2>Nossa localização</h2>
              <p>
                Av. dos Automóveis, 1234
                <br />
                Bairro Centro
                <br />
                São Paulo - SP
              </p>
              <div className={styles.mapa}>
                {/* Aqui entraria um iframe de mapa ou uma imagem */}
                <div className={styles.mapPlaceholder}>Mapa da loja</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
