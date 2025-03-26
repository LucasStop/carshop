import React from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "./layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/">
            <span>CarShop</span>
          </Link>
        </div>

        <nav className={styles.navigation}>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/carros">Carros</Link>
            </li>
            <li>
              <Link href="/marcas">Marcas</Link>
            </li>
            <li>
              <Link href="/clientes">Clientes</Link>
            </li>
            <li>
              <Link href="/contato">Contato</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>CarShop</h3>
            <p>Sua loja de carros de confiança desde 2005.</p>
          </div>

          <div className={styles.footerSection}>
            <h3>Links Rápidos</h3>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/carros">Carros</Link>
              </li>
              <li>
                <Link href="/marcas">Marcas</Link>
              </li>
              <li>
                <Link href="/clientes">Clientes</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3>Contato</h3>
            <p>contato@carshop.com.br</p>
            <p>(11) 3333-4444</p>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>
            © {new Date().getFullYear()} CarShop - Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
