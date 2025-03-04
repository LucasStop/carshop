import Link from 'next/link'
import styles from './Layout.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`${styles.contentWrapper} ${styles.headerContent}`}>
        <div className={styles.logo}>
          <Link href="/">Web Frame</Link>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">Sobre</Link>
            </li>
            <li>
              <Link href="/contact">Contato</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
