'use client'
import { api } from '@/lib/api';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'


export default function Page() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: ''
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    let newErrors: any = {};
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório';
    if (!formData.email) newErrors.email = 'E-mail é obrigatório';
    if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await api.post(
        '/v1/patients/user',
        {
          name: formData.nome,
          cpf: formData.cpf,
          email: formData.email,
          password: formData.senha
        },
      )
      
      router.push('/login')
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="py-4 px-6 bg-blue-600 text-white text-center">
            <h2 className="text-2xl font-bold">Cadastro de Paciente</h2>
          </div>
          <form onSubmit={handleSubmit} className="py-4 px-6 space-y-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 text-gray-400 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
            </div>

            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 text-gray-400 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.cpf && <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 text-gray-400 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 text-gray-400 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.senha && <p className="mt-1 text-sm text-red-600">{errors.senha}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 text-gray-400 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}