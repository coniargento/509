import Image from "next/image";
import styles from "./page.module.css";
import MapComp from "./components/Map";

export default function Home() {
  return (
    <main className={styles.main}>
      <MapComp/>
    </main>
  );
}
