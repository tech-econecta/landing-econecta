import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import Planes from "./components/landing/Planes";
import Clientes from "./components/landing/Clientes";
import Caracteristicas from "./components/landing/Caracteristicas";
import Footer from "./components/landing/Footer";
import Newsletter from "./components/landing/Newsletter";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  return (
    <section className={urbanist.className}>
      <main className="min-h-screen">
        <article>
          <Hero />

          <section aria-label="Clientes">
            <Clientes />
          </section>
          <section aria-label="Planes">
            <Planes />
          </section>
        </article>
      </main>
      <Footer />
    </section>
  );
}
