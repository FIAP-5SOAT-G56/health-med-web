'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Cookie from 'js-cookie'


export default function Page() {
  const [consultas, setConsultas] = useState([]);
  const [filtroData, setFiltroData] = useState('');

  const find =async () => {
    const tt =  await api.get(
      '/v1/agenda/1',
      {
        headers: {
          Authorization: `Bearer ${Cookie.get('token')}`,
        },
      },
    )
  const horarios = tt.data.data.agenda.map(agenda => {

    return {
      id: 1,
      paciente: undefined,
      inicio: agenda.startAt,
      fim: agenda.endAt,
      liberada: agenda.liberada

    }
  })
  setConsultas(horarios)
  }

  useEffect(() => {
    find()

  },[
  ])
  // Função para formatar a data e hora
  const formatarDataHora = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const consultasFiltradas = filtroData
    ? consultas.filter(consulta => consulta.inicio.startsWith(filtroData))
    : consultas;

  return (
   
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="py-4 px-6 bg-blue-600 text-white">
            <h2 className="text-2xl font-bold">Consultas Agendadas</h2>
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

                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consultasFiltradas.map((consulta) => (
                    <tr key={consulta.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{consulta.paciente}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarDataHora(consulta.inicio)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarDataHora(consulta.fim)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consulta.liberada ? 'Sim': 'Não'}</td>
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