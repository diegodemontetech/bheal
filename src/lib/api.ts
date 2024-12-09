import { mockEvents, mockLeads, mockUsers } from './mockData';

// Auth
export const login = async (email: string, password: string) => {
  if (email === 'diego.demonte@vpjalimentos.com.br' && password === 'Kabul@21') {
    return Promise.resolve({
      data: {
        user: mockUsers[0],
        token: 'mock-token'
      }
    });
  }
  throw new Error('Invalid credentials');
};

// Events
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

// Leads
export const getLeads = async () => {
  return Promise.resolve({ data: mockLeads });
};

export const createLead = async (lead: any) => {
  const newLead = { id: crypto.randomUUID(), ...lead };
  mockLeads.push(newLead);
  return Promise.resolve({ data: newLead });
};

export const updateLead = async (id: string, data: any) => {
  const index = mockLeads.findIndex(l => l.id === id);
  if (index >= 0) {
    mockLeads[index] = { ...mockLeads[index], ...data };
    return Promise.resolve({ data: mockLeads[index] });
  }
  throw new Error('Lead not found');
};

export const deleteLead = async (id: string) => {
  const index = mockLeads.findIndex(l => l.id === id);
  if (index >= 0) {
    mockLeads.splice(index, 1);
    return Promise.resolve({ success: true });
  }
  throw new Error('Lead not found');
};