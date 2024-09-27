'use client'
import { api } from '@/lib/api';
import React, { useState } from 'react';
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'

enum Etapas {
  RANGES,
  SAMPLES
}

type Agenda = {
  startAt: Date,
  endAt: Date,
}
export default function Page() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [consultationDuration, setConsultationDuration] = useState('60');
  const [etapas, setEtapas] = useState(Etapas.RANGES);
  const [horarios, setHorarios] = useState<Agenda[]>([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Agendamento:', { selectedDate, startTime, endTime, consultationDuration });
    // Aqui você enviaria os dados para o backend
    let more = true;

    let date = new Date(selectedDate);
    const [houraStart, minuteStart] = startTime.split(':')

    date.setHours(parseInt(houraStart));
    date.setMinutes(parseInt(minuteStart));

    const endDate = new Date(selectedDate);
    const [houra, minute] = endTime.split(':')

    endDate.setHours(parseInt(houra));
    endDate.setMinutes(parseInt(minute));

    const dates: Agenda[] = [];
    let n =1
    while (more && n < 16) {
      const startAt = new Date(date);

      date.setMinutes( date.getMinutes() + parseInt(consultationDuration));

      const endAt = new Date(date);
      date = new Date(endAt);
      dates.push({
        startAt: startAt,
        endAt: endAt,
      })
      console.log({
        startAt: startAt,
        endAt: endAt,
      });

      if (date >= endDate) {
        more = false;
      }
      n++;
    }
    console.log(dates);
    setHorarios(dates);

    setEtapas(Etapas.SAMPLES)

  };

  const onRanges = () => {
    setEtapas(Etapas.RANGES)
  };

  const onSave = async () => {

    await api.post(
      '/v1/agenda/list',
      {
       dates: horarios,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookie.get('token')}`,
        },
      },
    )
    
    router.push('/my-schelder')
  }

  const removeHorario = (index: number) => {
    const newHorarios = [...horarios]; 
    newHorarios.splice(index, 1);
    setHorarios(newHorarios);
  }

  const onSamples = () => {
    if (selectedDate && startTime && endTime) {
      setEtapas(Etapas.SAMPLES)
    }
  };
  // Gerar opções de tempo (de 30 em 30 minutos)
  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i.toString().padStart(2, '0');
        const minute = j.toString().padStart(2, '0');
        options.push(`${hour}:${minute}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="py-4 px-6 bg-blue-600 text-white text-center">
            <h2 className="text-2xl font-bold">Criação  de Agenda</h2>
          </div>
          <div className="flex flex-row justify-center">
            <button onClick={onRanges} className={`my-4 mx-4 w-7 h-7 ${ etapas == Etapas.RANGES ? 'bg-blue-600' : 'bg-slate-600'} rounded-full text-center`}>
              1
            </button>
            <button onClick={onSamples}  className={`my-4 mx-4 w-7 h-7 ${ etapas == Etapas.SAMPLES ? 'bg-blue-600' : 'bg-slate-600'} rounded-full text-center`}>
              2
            </button>
          </div>

        

          { etapas == Etapas.RANGES && (

          <form onSubmit={handleSubmit} className="py-4 px-6 space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Horário de Início</label>
                <select
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border text-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Horário de Término</label>
                <select
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border text-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duração da Consulta</label>
              <select
                id="duration"
                value={consultationDuration}
                onChange={(e) => setConsultationDuration(e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="90">1 hora e 30 minutos</option>
                <option value="120">2 horas</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Agendar Horários
              </button>
            </div>
          </form>)
          }

          { etapas == Etapas.SAMPLES && (
            <>
           {
            horarios.map((horario, index) => {
              const year = horario.startAt.getFullYear();
              const month = String(horario.startAt.getMonth() + 1).padStart(2, '0');
              const day = String(horario.startAt.getDate()).padStart(2, '0');
              
              let hours = String(horario.startAt.getHours()).padStart(2, '0');
              let minutes = String(horario.startAt.getMinutes()).padStart(2, '0');
              const horaStart = `${hours}:${minutes}`;

              hours = String(horario.endAt.getHours()).padStart(2, '0');
              minutes = String(horario.endAt.getMinutes()).padStart(2, '0');
              const horaEnd = `${hours}:${minutes}`;

              const date = `${day}-${month}-${year}`;
          
              return (
                  <div className="m-2 flex flex-row" key={index}>
                    <button
                      className="m-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-500 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Horario de inicio {date +' ' + horaStart} até {date +' ' + horaEnd}
                    </button>

                    <button
                      onClick={ () => removeHorario(index)}
                      className=" justify-center border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Apagar
                    </button>
                  </div>
              )})
           }
            <div className="my-2">
              <button
                 onClick={onSave}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Salvar Horários
              </button>
            </div>
           </>
          )}
        </div>
      </main>
    </div>
  );
}