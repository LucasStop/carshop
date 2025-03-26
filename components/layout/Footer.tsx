import styles from './layout.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.contentWrapper}>
        <div className={styles.footerContent}>
          <div className={styles.info}>
            <h3>Web Frame</h3>
            <p>Uma aplicação moderna construída com Next.js</p>
          </div>
          <div className={styles.links}>
            <div className={styles.linkColumn}>
              <h4>Links</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">Sobre</a></li>
                <li><a href="/contact">Contato</a></li>
              </ul>
            </div>
            <div className={styles.linkColumn}>
              <h4>Social</h4>
              <ul>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>© {new Date().getFullYear()} Web Frame. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
