import { Hero } from '@/components/landing/hero';
import { Sports } from '@/components/landing/sports';
import { Features } from '@/components/landing/features';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#020817] relative">
      <Hero />
      <Sports />
      <HowItWorks />
      <Features />

      {/* Secondary CTA */}
      <section className="py-32 relative overflow-hidden text-center border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="font-outfit text-4xl md:text-6xl font-bold text-white mb-8">
            Pronto para subir de nível?
          </h2>
          <a
            href="/register"
            className="inline-block px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Criar liga grátis agora
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
