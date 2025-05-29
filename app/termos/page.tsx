export default function TermsPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-black mb-8">Termos e Condições</h1>
        
        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold mb-4">1. Aceitação dos Termos</h2>
          <p className="mb-6">
            Ao acessar e usar a plataforma LuxuryCars, você concorda em cumprir e estar vinculado 
            aos seguintes termos e condições de uso.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. Uso da Plataforma</h2>
          <p className="mb-6">
            A LuxuryCars é uma plataforma de marketplace de carros de luxo. Você pode usar nossos 
            serviços para navegar, comprar e vender veículos de acordo com os termos estabelecidos.
          </p>

          <h2 className="text-xl font-semibold mb-4">3. Responsabilidades do Usuário</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Fornecer informações precisas e atualizadas</li>
            <li>Manter a confidencialidade de suas credenciais de acesso</li>
            <li>Usar a plataforma de forma legal e respeitosa</li>
            <li>Não publicar conteúdo falso ou enganoso</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">4. Transações</h2>
          <p className="mb-6">
            Todas as transações entre compradores e vendedores são de responsabilidade das partes 
            envolvidas. A LuxuryCars atua apenas como facilitador.
          </p>

          <h2 className="text-xl font-semibold mb-4">5. Limitação de Responsabilidade</h2>
          <p className="mb-6">
            A LuxuryCars não se responsabiliza por danos diretos ou indiretos resultantes do uso 
            da plataforma ou de transações realizadas através dela.
          </p>

          <h2 className="text-xl font-semibold mb-4">6. Modificações dos Termos</h2>
          <p className="mb-6">
            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações 
            entrarão em vigor imediatamente após a publicação.
          </p>

          <h2 className="text-xl font-semibold mb-4">7. Contato</h2>
          <p className="mb-6">
            Para dúvidas sobre estes termos, entre em contato conosco através do email: 
            contato@luxurycars.com
          </p>
        </div>
      </div>
    </main>
  )
}
