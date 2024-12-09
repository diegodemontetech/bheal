import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, MapPin, Building2, Globe, Tag } from 'lucide-react';

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const mockContacts: Contact[] = [
    {
      id: '1',
      name: 'Dr. João Silva',
      clinic: 'Clínica Odontológica Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-9999',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      specialty: 'Implantodontista',
      website: 'www.clinicasilva.com.br'
    },
    {
      id: '2',
      name: 'Dra. Maria Santos',
      clinic: 'Centro Odontológico Santos',
      email: 'maria.santos@email.com',
      phone: '(11) 98888-8888',
      address: 'Rua Augusta, 500 - São Paulo, SP',
      specialty: 'Periodontista',
      website: 'www.dramariasantos.com.br'
    }
  ];

  const filteredContacts = mockContacts.filter(contact =>
    Object.values(contact).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="h-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900 font-poppins">Contatos</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center font-poppins">
          <Plus className="w-4 h-4 mr-2" />
          Novo Contato
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar contatos..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-poppins"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-lg border transition-all cursor-pointer ${
                selectedContact?.id === contact.id
                  ? 'border-indigo-500 shadow-md'
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
              }`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 font-poppins">{contact.name}</h3>
                    <p className="text-sm text-gray-500 font-poppins">{contact.specialty}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    <Tag className="w-3 h-3 mr-1" />
                    {contact.specialty}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                    {contact.clinic}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {contact.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {contact.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {contact.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="w-4 h-4 mr-2 text-gray-400" />
                    {contact.website}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {selectedContact ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 font-poppins">
                    {selectedContact.name}
                  </h2>
                  <p className="text-sm text-gray-500 font-poppins mt-1">
                    {selectedContact.specialty}
                  </p>
                </div>
                <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 font-poppins">
                  Editar
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-poppins">
                      Clínica
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.clinic}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-poppins">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-poppins">
                      Telefone
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-poppins">
                      Endereço
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-poppins">
                      Website
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.website}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MapPin className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium font-poppins">
                Selecione um contato para ver os detalhes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface Contact {
  id: string;
  name: string;
  clinic: string;
  email: string;
  phone: string;
  address: string;
  specialty: string;
  website: string;
}