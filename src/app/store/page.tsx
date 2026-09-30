import type { Metadata } from "next";
import Link from "next/link";
import StoreCatalog from "./StoreCatalog";
import styles from "./store.module.css";

export const metadata: Metadata = {
  title: "Store | Tired Dad Tech",
  description: "Tech-inspired shirts, hoodies, mugs, and small gear from Tired Dad Tech. Build It. Break It. Figure It Out.",
};

export default function StorePage() {
  return (
    <main className={styles.store} id="store">
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.heroTop}>
            <Link href="/" className={styles.brand}>TIRED DAD TECH <span>/ STORE</span></Link>
            <span className={styles.status}>The first collection · Coming soon</span>
          </div>
          <h1>Build It. Break It.<br /><span>Figure It Out.</span></h1>
          <div className={styles.heroBottom}>
            <p>Tech-inspired apparel and gear for late-night builds, coffee refills, and figuring it out as you go.</p>
            <span>Same ideas. Less sleep.</span>
          </div>
        </header>
        <StoreCatalog />
        <aside className={styles.fulfillment} aria-labelledby="made-to-order">
          <h2 id="made-to-order">Made to order.</h2>
          <p>When the store opens, our production partner will make and fulfill your gear when you order it. Keeps things simple. Fewer boxes in the garage.</p>
        </aside>
        <footer className={styles.footer}>
          <Link href="/">Tired Dad Tech</Link>
          <span>Build It. Break It. Figure It Out.</span>
          <Link href="/war-room">Meet the dad behind the tech ↗</Link>
        </footer>
      </div>
    </main>
  );
}
