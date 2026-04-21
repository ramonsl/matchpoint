import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h4 className="font-outfit text-2xl font-bold text-white mb-4">Matchpoint</h4>
            <p className="text-slate-400 max-w-sm">
              Competições organizadas, justas e tecnológicas.
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4">Plataforma</h5>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/login"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Entrar
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Cadastre-se
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4">Legal</h5>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Matchpoint. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
