import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { CustomOrders } from "@/components/CustomOrders";
import { Footer } from "@/components/Footer";
import { WavyDivider } from "@/components/WavyDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <About />
        <WavyDivider />
        <Gallery />
        <WavyDivider />
        <CustomOrders />
      </main>
      <Footer />
    </>
  );
}
