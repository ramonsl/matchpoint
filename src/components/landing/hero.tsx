'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-outfit text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            A gestão da sua liga
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              nunca foi tão fácil.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-10">
            Matchpoint é a plataforma definitiva para criar, gerenciar e elevar o nível de
            competições amadoras de esportes de raquete.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-1"
            >
              Criar liga grátis
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-full glass hover:bg-white/10 text-white font-semibold transition-all"
            >
              Entrar
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
