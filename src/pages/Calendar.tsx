import React, { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, User, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import EventModal from '../components/EventModal';
import toast from 'react-hot-toast';

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
    setIsEventModalOpen(true);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('pt-BR', { month: 'long' });
  const year = currentMonth.getFullYear();

  return (
    <div className="h-full">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900 font-poppins">Calendário</h1>
        <button 
          onClick={() => setIsEventModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center font-poppins"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold capitalize font-poppins">
                  {monthName} {year}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 font-poppins">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 mt-2">
                {days.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => day && handleDateClick(day)}
                    className={`
                      aspect-square border rounded p-1 
                      ${day ? 'hover:bg-gray-50 cursor-pointer' : ''}
                      ${day?.toDateString() === new Date().toDateString() ? 'bg-indigo-50 border-indigo-200' : 'border-gray-200'}
                    `}
                  >
                    {day && (
                      <>
                        <span className="text-sm text-gray-700 font-poppins">{day.getDate()}</span>
                        {events
                          .filter(event => new Date(event.date).toDateString() === day.toDateString())
                          .slice(0, 2)
                          .map((event, i) => (
                            <div
                              key={event.id}
                              className="text-xs p-1 mt-1 rounded bg-indigo-100 text-indigo-700 truncate font-poppins"
                            >
                              {event.title}
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4 font-poppins">Próximos Eventos</h2>
          <div className="space-y-4">
            {events
              .filter(event => new Date(event.date) >= new Date())
              .slice(0, 5)
              .map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-900 font-poppins">{event.title}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      {event.contact}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedDate(undefined);
        }}
        onEventAdded={fetchEvents}
        selectedDate={selectedDate}
      />
    </div>
  );
}