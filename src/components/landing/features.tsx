import { Trophy, CalendarCheck, BellRing } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <CalendarCheck className="w-8 h-8 text-emerald-400" />,
      title: 'Rodadas Automáticas',
      description:
        'Nosso algoritmo gera todas as duplas e confrontos rotativos da temporada sem dor de cabeça.',
    },
    {
      icon: <Trophy className="w-8 h-8 text-cyan-400" />,
      title: 'Ranking em Tempo Real',
      description:
        'Acompanhe a tabela com cálculo automático de saldo de games e critérios de desempate justos.',
    },
    {
      icon: <BellRing className="w-8 h-8 text-indigo-400" />,
      title: 'Notificações Integradas',
      description:
        'Jogadores são avisados sobre novos jogos, prazos curtos e placares a confirmar por e-mail e app.',
    },
  ];

  return (
    <section className="py-24 bg-black/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-outfit text-3xl md:text-5xl font-bold text-white mb-4">
            Tudo que sua liga precisa
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Foque apenas na diversão em quadra e deixe a organização maçante com o Matchpoint.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-colors"
            >
              <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
