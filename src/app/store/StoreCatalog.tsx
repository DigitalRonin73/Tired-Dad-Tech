"use client";

import Image from "next/image";
import { useState } from "react";
import { storeCategories, storeProducts, type StoreCategory, type StoreProduct } from "@/content/store";
import styles from "./store.module.css";

function ProductCard({ product, index }: { product: StoreProduct; index: number }) {
  return (
    <article className={styles.card} aria-labelledby={`product-${product.id}`}>
      <div className={styles.visual}>
        {product.image ? (
          <Image src={product.image.src} alt={product.image.alt} width={339} height={508}
            sizes="(max-width: 599px) 100vw, (max-width: 899px) 50vw, 33vw"
            loading={index < 2 ? "eager" : "lazy"} className={styles.productImage} />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderLabel}>TIRED DAD TECH / {product.category.toUpperCase()}</span>
            <span className={styles.placeholderDesign}>{product.placeholder}</span>
            <span className={styles.placeholderNote}>Product image coming soon</span>
          </div>
        )}
        <span className={styles.imageBadge}>{product.image ? "Design preview" : "In the works"}</span>
      </div>
      <div className={styles.details}>
        <p className={styles.type}>{product.productType}</p>
        <h3 id={`product-${product.id}`}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.colors}>
          {product.colors.length ? <>
            <span className={styles.swatches} aria-hidden="true">{product.colors.map(color => <span key={color.name} style={{ backgroundColor: color.hex }} />)}</span>
            <span>Planned: {product.colors.map(color => color.name).join(" / ")}</span>
          </> : <span>Details coming soon</span>}
        </div>
        <div className={styles.purchase}>
          <span>{product.price ? `From ${product.price}` : "Price coming soon"}</span>
          {product.printifyUrl ? (
            <a className={styles.buy} href={product.printifyUrl} aria-label={`View ${product.name} ${product.productType}`}>View Product ↗</a>
          ) : (
            <button className={styles.buy} disabled aria-label={`${product.name} ${product.productType} — coming soon`}>Coming soon</button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function StoreCatalog() {
  const [category, setCategory] = useState<StoreCategory>("All");
  const products = storeProducts.filter(product => category === "All" || product.category === category);
  return (
    <section aria-labelledby="catalog-heading" className={styles.catalog}>
      <div className={styles.catalogHeading}>
        <h2 id="catalog-heading">The gear</h2>
        <p>Preview the lineup. Orders aren’t open just yet.</p>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter products by category">
          {storeCategories.map(item => (
            <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <p className={styles.count} role="status">{products.length} {products.length === 1 ? "product" : "products"}</p>
      </div>
      <div className={styles.grid}>{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
    </section>
  );
}
