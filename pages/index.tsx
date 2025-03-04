import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { Button } from "@mui/material";
import styles from "@/styles/Home.module.css";
import layoutStyles from "@/components/layout/Layout.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Web Frame</title>
        <meta
          name="description"
          content="Projeto criado com Next.js, React, TypeScript e CSS Modules"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className={layoutStyles.main}>
          <div className={layoutStyles.contentWrapper}>
            <div className={styles.main}>
              <h1 className={styles.title}>
                Bem-vindo ao <span>Web Frame!</span>
              </h1>
              <p className={styles.description}>
                Um projeto inicial utilizando Next.js, React, TypeScript e CSS
                Modules
              </p>
              <div className={styles.buttonGroup}>
                <Button>Começar</Button>
                <Button variant="outlined">Sobre</Button>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
