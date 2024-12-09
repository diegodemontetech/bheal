import { create } from 'zustand';
import { Card } from '../types';

interface KanbanState {
  cards: Card[];
  loading: boolean;
  error: string | null;
  moveCard: (cardId: string, fromColumn: string, toColumn: string) => void;
  updateCard: (card: Card) => Promise<void>;
}

// Mock data
const mockCards: Card[] = [
  {
    id: '1',
    title: 'Dr. João Silva',
    dentistName: 'Dr. João Silva',
    clinicName: 'Clínica Odontológica Silva',
    phone: '(11) 99999-9999',
    email: 'joao.silva@email.com',
    responsible: 'Diego Demonte',
    status: 'backlog',
    pipeline: 'hunting',
    specialty: 'implantodontista',
    potential_value: 50000,
    lead_source: 'prospect',
    cnpj: '12.345.678/0001-90',
    address: 'Av. Paulista, 1000 - São Paulo, SP'
  },
  {
    id: '2',
    title: 'Dra. Maria Santos',
    dentistName: 'Dra. Maria Santos',
    clinicName: 'Centro Odontológico Santos',
    phone: '(11) 98888-8888',
    email: 'maria.santos@email.com',
    responsible: 'Diego Demonte',
    status: 'interagindo',
    pipeline: 'hunting',
    specialty: 'periodontista',
    potential_value: 75000,
    lead_source: 'congresso',
    cnpj: '98.765.432/0001-21',
    address: 'Rua Augusta, 500 - São Paulo, SP'
  },
  {
    id: '3',
    title: 'Dr. Pedro Costa',
    dentistName: 'Dr. Pedro Costa',
    clinicName: 'Clínica Costa',
    phone: '(11) 97777-7777',
    email: 'pedro.costa@email.com',
    responsible: 'Diego Demonte',
    status: 'avancado',
    pipeline: 'hunting',
    specialty: 'cirurgiao-geral',
    potential_value: 100000,
    lead_source: 'site',
    cnpj: '45.678.901/0001-34',
    address: 'Rua Oscar Freire, 200 - São Paulo, SP'
  }
];

export const useKanbanStore = create<KanbanState>((set) => ({
  cards: mockCards,
  loading: false,
  error: null,

  moveCard: (cardId, fromColumn, toColumn) => {
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId ? { ...card, status: toColumn } : card
      ),
    }));
  },

  updateCard: async (updatedCard) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      ),
    }));
  }
}));