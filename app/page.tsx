import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import Planes from './components/landing/Planes';
import Clientes from './components/landing/Clientes';
import Caracteristicas from './components/landing/Caracteristicas';
import Footer from './components/landing/Footer';
import Newsletter from './components/landing/Newsletter';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <article>
          <Hero />
          <section aria-label="Características">
            <Caracteristicas />
          </section>
          <section aria-label="Planes">
            <Planes />
          </section>
          <section aria-label="Newsletter">
            <Newsletter />
          </section>
          <section aria-label="Clientes">
            <Clientes />
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
