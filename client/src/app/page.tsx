import MovieDisplay from "@/components/MovieDisplay/MovieDisplay";
import styles from "./page.module.css";
import Carousel from "@/components/Carousel/Carousel";

export default function Home() {
  return (
    <main className={styles.main}>
      <Carousel />
      <MovieDisplay />
    </main>
  );
}
