export function Sports() {
  const sports = ['Padel', 'Tênis', 'Beach Tennis', 'Pickleball', 'Outros'];

  return (
    <section className="py-16 border-y border-white/5">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-semibold tracking-wider text-slate-500 uppercase mb-8">
          Suporte completo aos esportes de raquete
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-12 opacity-70">
          {sports.map((sport, index) => (
            <div
              key={index}
              className="text-xl md:text-3xl font-outfit font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400"
            >
              {sport}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
