import create from 'zustand';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../lib/api';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  contact: string;
  location: string;
  description?: string;
}

interface EventStore {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, data: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true });
    try {
      const response = await getEvents();
      set({ events: response.data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch events' });
      toast.error('Erro ao carregar eventos');
    } finally {
      set({ loading: false });
    }
  },

  addEvent: async (event) => {
    try {
      const response = await createEvent(event);
      set((state) => ({ events: [...state.events, response.data] }));
      toast.success('Evento criado com sucesso');
    } catch (error) {
      toast.error('Erro ao criar evento');
      throw error;
    }
  },

  updateEvent: async (id, data) => {
    try {
      const response = await updateEvent(id, data);
      set((state) => ({
        events: state.events.map((event) =>
          event.id === id ? { ...event, ...response.data } : event
        ),
      }));
      toast.success('Evento atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar evento');
      throw error;
    }
  },

  deleteEvent: async (id) => {
    try {
      await deleteEvent(id);
      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
      }));
      toast.success('Evento deletado com sucesso');
    } catch (error) {
      toast.error('Erro ao deletar evento');
      throw error;
    }
  },
}));