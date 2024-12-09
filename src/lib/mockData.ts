// Mock data service
export const mockEvents = [
  {
    id: '1',
    title: 'Reunião com Dr. João',
    date: '2024-03-15',
    time: '14:00',
    type: 'visita',
    contact: 'Dr. João Silva',
    location: 'Clínica Silva',
    description: 'Apresentação inicial dos produtos'
  },
  {
    id: '2',
    title: 'Follow-up Dra. Maria',
    date: '2024-03-16',
    time: '10:00',
    type: 'call',
    contact: 'Dra. Maria Santos',
    location: 'Telefone',
    description: 'Acompanhamento da proposta'
  },
  {
    id: '3',
    title: 'Demonstração Produto',
    date: '2024-03-17',
    time: '15:30',
    type: 'demo',
    contact: 'Dr. Pedro Costa',
    location: 'Clínica Costa',
    description: 'Demonstração das barreiras ósseas'
  }
];

export const mockLeads = [
  {
    id: '1',
    dentistName: 'Dr. João Silva',
    clinicName: 'Clínica Silva',
    phone: '(11) 99999-9999',
    email: 'joao.silva@email.com',
    responsible: 'Diego Demonte',
    status: 'backlog',
    pipeline: 'hunting'
  },
  {
    id: '2',
    dentistName: 'Dra. Maria Santos',
    clinicName: 'Centro Odontológico Santos',
    phone: '(11) 98888-8888',
    email: 'maria.santos@email.com',
    responsible: 'Diego Demonte',
    status: 'interagindo',
    pipeline: 'hunting'
  }
];

export const mockUsers = [
  {
    id: '1',
    name: 'Diego Demonte',
    email: 'diego.demonte@vpjalimentos.com.br',
    role: 'admin'
  }
];

// Mock API functions
export const getEvents = async () => {
  return Promise.resolve({ data: mockEvents });
};

export const createEvent = async (event: any) => {
  const newEvent = { id: crypto.randomUUID(), ...event };
  mockEvents.push(newEvent);
  return Promise.resolve({ data: newEvent });
};

export const updateEvent = async (id: string, data: any) => {
  const index = mockEvents.findIndex(e => e.id === id);
  if (index >= 0) {
    mockEvents[index] = { ...mockEvents[index], ...data };
    return Promise.resolve({ data: mockEvents[index] });
  }
  throw new Error('Event not found');
};

export const deleteEvent = async (id: string) => {
  const index = mockEvents.findIndex(e => e.id === id);
  if (index >= 0) {
    mockEvents.splice(index, 1);
    return Promise.resolve({ success: true });
  }
  throw new Error('Event not found');
};