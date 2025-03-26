import React, { useState } from "react";
import Head from "next/head";
import styles from "./clientes.module.css";
import Layout from "../../components/layout";

export default function Clientes() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Aqui entraria a lógica de autenticação/cadastro
    alert(isLogin ? "Tentativa de login" : "Tentativa de cadastro");
  };

  return (
    <Layout>
      <Head>
        <title>Clientes | CarShop</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Área do Cliente</h1>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`${styles.tab} ${!isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Cadastro
          </button>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="nome">Nome completo</label>
                  <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              {isLogin ? "Entrar" : "Cadastrar"}
            </button>
          </form>

          {isLogin && (
            <p className={styles.forgotPassword}>
              <a href="#">Esqueci minha senha</a>
            </p>
          )}
        </div>

        <div className={styles.beneficios}>
          <h2>Benefícios para clientes cadastrados</h2>
          <ul>
            <li>Acesso a ofertas exclusivas</li>
            <li>Agendamento de test drive</li>
            <li>Histórico de visualizações</li>
            <li>Atendimento personalizado</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
