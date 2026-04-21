export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Crie sua liga',
      desc: 'Defina as regras, min/max de participantes e gere um código exclusivo.',
    },
    {
      num: '02',
      title: 'Convide atletas',
      desc: 'Use o código para os jogadores solicitarem a inscrição em 1 clique.',
    },
    {
      num: '03',
      title: 'Bora pro play',
      desc: 'Inicie a liga. Os jogos são liberados e vocês só precisam informar o placar.',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-outfit text-3xl md:text-5xl font-bold text-white mb-6">
              Organizar não precisa ser chato.
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Substitua as inúmeras planilhas e brigas no grupo do WhatsApp por um fluxo
              automatizado, justo e extremamente simples de utilizar.
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="glass p-6 rounded-2xl flex gap-6 items-start">
                <div className="text-4xl font-black font-outfit text-transparent bg-clip-text bg-gradient-to-b from-slate-600 to-slate-800">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
