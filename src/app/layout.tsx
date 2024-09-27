import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { getUser } from "@/lib/auth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Health&Med",
  description: "This project is part of a medical appointment scheduling system, proposed in a Hackathon for the Software Architecture Postgraduate Course at FIAP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = cookies().has('token')
  const user = isAuthenticated ? getUser() : undefined;
  const perfis = Object.keys(user?.profiles ?? [])

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white shadow-lg">
              <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                <Link href="/" className="text-3xl font-bold">Health Med</Link>
                <nav>
                  <ul className="flex space-x-4">
                  { perfis.includes('MEDICO') && <li>
                      <Link href="/create-schelder" className="hover:text-blue-200 transition-colors">
                        Cadastro de Horarios
                      </Link>
                    </li>}

                    { perfis.includes('MEDICO') && <li>
                      <Link href="/my-schelder" className="hover:text-blue-200 transition-colors">
                        Meus Horarios
                      </Link>
                    </li>}

                    { perfis.includes('PACIENTE') && <li>
                      <Link href="/doctors" className="hover:text-blue-200 transition-colors">
                        Buscar Médicos
                      </Link>
                    </li>}
                    { perfis.includes('PACIENTE') || !isAuthenticated &&   <li>
                      <Link href="/create-patient" className="hover:text-blue-200 transition-colors">
                        Cadastro de Paciente
                      </Link>
                    </li>}
                  { perfis.includes('MEDICO') || !isAuthenticated &&  <li>
                      <Link href="/create-doctor" className="hover:text-blue-200 transition-colors">
                        Cadastro de Médico
                      </Link>
                    </li>
                    }

                  { isAuthenticated && user && <li>
                      <Link href="/create-doctor" className="hover:text-blue-200 transition-colors">
                        Olá, {user.name.split(' ').shift()}
                      </Link>
                    </li>
                    }
                    
                    {!isAuthenticated ? 
                     <li>
                     <Link href="/login" className="hover:text-blue-200 transition-colors">
                       Logar
                     </Link>
                   </li>
                    
                    : 
                    <li>
                    <a href="/api/auth/logout" className="hover:text-blue-200 transition-colors">
                      Sair
                    </a>
                  </li>
                    }
                  </ul>
                </nav>
              </div>
            </header>
        {children}
        <footer className="bg-gray-800 text-white mt-auto">
          <div className="container mx-auto px-4 py-6 text-center">
            <p>&copy; 2024 Health Med. Todos os direitos reservados.</p>
          </div>
        </footer>
        </div>
      </body>
    </html>
  );
}
