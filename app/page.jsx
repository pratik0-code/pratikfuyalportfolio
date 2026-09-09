import Preloader from '@/components/Preloader';
import ScrollProgress from '@/components/ScrollProgress';
import Cursor from '@/components/Cursor';
import Scene from '@/components/Scene';
import SmoothScroll from '@/components/SmoothScroll';
import RevealObserver from '@/components/RevealObserver';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <Cursor />
      <Scene />
      <SmoothScroll />
      <RevealObserver />

      <a className="skip-link" href="#main">Skip to content</a>

      <Header />

      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
