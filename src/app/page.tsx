import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Bem-vindo ao Health Med</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            O Health Med é uma plataforma inovadora projetada para revolucionar a gestão de saúde. 
            Nossa solução integrada oferece uma experiência única tanto para pacientes quanto para profissionais de saúde, 
            simplificando processos e melhorando a qualidade do atendimento médico.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Para Pacientes</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Agendamento de consultas online</li>
              <li>Acesso fácil ao histórico médico</li>
              <li>Comunicação direta com profissionais de saúde</li>
              <li>Lembretes de medicação e consultas</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Para Médicos</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Gerenciamento eficiente de pacientes</li>
              <li>Prontuários eletrônicos seguros</li>
              <li>Agendamento inteligente</li>
              <li>Ferramentas de análise e relatórios</li>
            </ul>
          </div>
        </section>

        <section className="mt-12 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Comece Agora</h3>
          <div className="space-x-4">
            <Link href="/create-patient" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Cadastrar como Paciente
            </Link>
            <Link href="/create-doctor" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Cadastrar como Médico
            </Link>
          </div>
        </section>
      </main>
      </>
  )
}