import { Image, Title } from "@mantine/core";
import Header from "@/app/components/Header";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Header />
      </header>
      <main className={styles.main}></main>
    </div>
  );
}
