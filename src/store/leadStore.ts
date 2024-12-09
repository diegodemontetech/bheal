import create from 'zustand';
import { getLeads, createLead, updateLead, deleteLead } from '../lib/api';
import toast from 'react-hot-toast';

interface Lead {
  id: string;
  dentist_name: string;
  clinic_name?: string;
  phone: string;
  email: string;
  responsible_id: string;
  pipeline: string;
  status: string;
}

interface LeadStore {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  addLead: (lead: Omit<Lead, 'id'>) => Promise<void>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

export const useLeadStore = create<LeadStore>((set) => ({
  leads: [],
  loading: false,
  error: null,

  fetchLeads: async () => {
    set({ loading: true });
    try {
      const response = await getLeads();
      set({ leads: response.data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch leads' });
      toast.error('Erro ao carregar leads');
    } finally {
      set({ loading: false });
    }
  },

  addLead: async (lead) => {
    try {
      const response = await createLead(lead);
      set((state) => ({ leads: [...state.leads, response.data] }));
      toast.success('Lead criado com sucesso');
    } catch (error) {
      toast.error('Erro ao criar lead');
      throw error;
    }
  },

  updateLead: async (id, data) => {
    try {
      const response = await updateLead(id, data);
      set((state) => ({
        leads: state.leads.map((lead) =>
          lead.id === id ? { ...lead, ...response.data } : lead
        ),
      }));
      toast.success('Lead atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar lead');
      throw error;
    }
  },

  deleteLead: async (id) => {
    try {
      await deleteLead(id);
      set((state) => ({
        leads: state.leads.filter((lead) => lead.id !== id),
      }));
      toast.success('Lead deletado com sucesso');
    } catch (error) {
      toast.error('Erro ao deletar lead');
      throw error;
    }
  },
}));