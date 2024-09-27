'use client'
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Cookie from 'js-cookie'

interface IParams {
  doctorId?: string;
}

export default function Page({ params }: { params: IParams }) {
  const [consultas, setConsultas] = useState([]);
  const [filtroData, setFiltroData] = useState('');

  const find = async () => {
    const tt =  await api.get(
      '/v1/agenda/' + params.doctorId,
      {
        headers: {
          Authorization: `Bearer ${Cookie.get('token')}`,
        },
      },
    )
    console.log(tt.data.data.agenda);
  const horarios = tt.data.data.agenda.map(agenda => {
    return {
      id: agenda.id,
      paciente: undefined,
      inicio: agenda.startAt,
      fim: agenda.endAt,
      liberada: agenda.liberada
    }
  })
  console.log(horarios)

  setConsultas(horarios)
  }

  useEffect(() => {
    find()

  },[
  ])
  const formatarDataHora = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const marcarHorario = async (id: number) => {

    await api.patch(
      '/v1/agenda/consulta',
      {
        agendaId: id,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookie.get('token')}`,
        },
      },
    )

    find()
  }


  const consultasFiltradas = filtroData
    ? consultas.filter(consulta => consulta.inicio.startsWith(filtroData))
    : consultas;

  return (
   
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="py-4 px-6 bg-blue-600 text-white">
            <h2 className="text-2xl font-bold">Marcar Consultas</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <label htmlFor="filtroData" className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Data</label>
              <input
                type="date"
                id="filtroData"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fim</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponivel</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>

                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consultasFiltradas.map((consulta) => (
                    <tr key={consulta.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{consulta.paciente}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarDataHora(consulta.inicio)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarDataHora(consulta.fim)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consulta.liberada ? 'Sim': 'Não'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consulta.liberada ? 
                          <button
                          onClick={ () => marcarHorario(consulta.id)}
                          className=" p-1 justify-center border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lime-600 hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
                        >
                          Marcar
                        </button>
                      
                      : undefined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {consultasFiltradas.length === 0 && (
              <p className="text-center text-gray-500 my-4">Nenhuma consulta encontrada para esta data.</p>
            )}
          </div>
        </div>
      </main>
  );
}