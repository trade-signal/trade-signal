import styles from "./page.module.css";

import { Image, Title } from "@mantine/core";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          w={160}
          className={styles.logo}
          src="/icon.svg"
          alt="Chives Box logo"
        />
        <Title>Chives Box</Title>
      </main>
    </div>
  );
}
