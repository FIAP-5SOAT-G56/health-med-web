'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Cookie from 'js-cookie'


export default function Page() {
  const [filtros, setFiltros] = useState({
    crm: '',
    nome: '',
    dataInicio: null,
    dataFim: null
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [medicos, setMedicos] = useState([]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDataChange = (data, tipo) => {
    setFiltros(prevState => ({
      ...prevState,
      [tipo]: data
    }));
  };

  const aplicarFiltros = async (e) => {
    e.preventDefault();
    console.log('Filtros aplicados:', filtros);
    // Aqui você faria a chamada para a API com os filtros
    let query = `?page=${page}&pageSize=${pageSize}`
    if (filtros.crm.length > 3) {
      query = query.concat('&crm=' + filtros.crm)
    }

    if (filtros.nome.length > 3) {
      query = query.concat('&name=' + filtros.nome)
    }

    if (filtros.dataFim) {
      query = query.concat('&startAt=' + filtros.dataFim)
    }

   const result =  await api.get(
      '/v1/doctors' + query,
      {
        headers: {
          Authorization: `Bearer ${Cookie.get('token')}`,
        },
      },
    )

    console.log(result.data.data)

    const doctors = result.data?.data[0].map(doctor => {
      return {
        id: doctor.id, nome: doctor.user.name, crm:doctor.crm
      }
    })
    setMedicos(doctors)
    setPage(1)
  };

  useEffect(() => {
    (async () =>{
      const query = `?page=${page}&pageSize=${pageSize}`

      const result =  await api.get(
        '/v1/doctors' + query,
        {
          headers: {
            Authorization: `Bearer ${Cookie.get('token')}`,
          },
        },
      )
  
      console.log(result.data.data)
  
      const doctors = result.data?.data[0].map(doctor => {
        console.log(doctor)
  
        return {
          id: doctor.id, nome: doctor.user.name, crm:doctor.crm
        }
      })
      setMedicos(doctors)

    })()

  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="py-4 px-6 bg-blue-600 text-white text-center">
            <h2 className="text-2xl font-bold">Lista de Médicos</h2>
          </div>
          
          <form onSubmit={aplicarFiltros} className="py-4 px-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="crm" className="block text-sm font-medium text-gray-700">CRM</label>
                <input
                  type="text"
                  id="crm"
                  name="crm"
                  value={filtros.crm}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={filtros.nome}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Data Início</label>

                <input
                type="date"
                id="date"
                value={filtros.dataInicio ?? ''}
                onChange={(e) => handleDataChange(e.target.value, 'dataInicio')}
                className="mt-1 block w-full px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Aplicar Filtros
              </button>
            </div>
          </form>

          <div className="py-4 px-6">
            <h3 className="text-lg font-semibold mb-4">Resultados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicos.map((medico) => (
                <Link href={'/doctor/' + medico.id} key={medico.id} className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow">
                  <h4 className="font-bold">{medico.nome}</h4>
                  <p className="text-gray-600">CRM: {medico.crm}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="py-4 px-6 flex justify-between items-center bg-gray-50">
            <button
              onClick={() => setPage(page > 1 ? page - 1 : 1)}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">Página {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Próxima
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}