import React, { useState, useEffect } from 'react';
import { X, Save, Check, Upload, Building2, Phone, Mail, Globe, MapPin, DollarSign, Calendar, FileText, MessageSquare, Target, Tag, Search } from 'lucide-react';
import { Card } from '../types';
import { useKanbanStore } from '../store/kanbanStore';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

interface Props {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock WhatsApp history
const whatsappHistory = [
  {
    id: '1',
    date: '2024-03-15T14:30:00Z',
    message: 'Bom dia! Gostaria de saber mais sobre as barreiras ósseas.',
    from: 'client'
  },
  {
    id: '2',
    date: '2024-03-15T14:35:00Z',
    message: 'Olá! Claro, temos várias opções disponíveis. Qual tamanho você precisa?',
    from: 'user'
  },
  {
    id: '3',
    date: '2024-03-15T14:40:00Z',
    message: 'Preciso da 15x20mm. Vocês têm em estoque?',
    from: 'client'
  }
];

export default function CardDrawer({ card, isOpen, onClose }: Props) {
  const [formData, setFormData] = useState<Card | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const updateCard = useKanbanStore((state) => state.updateCard);

  useEffect(() => {
    if (card) {
      setFormData(card);
    }
  }, [card]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleFieldChange = async (field: keyof Card, value: any) => {
    if (!formData) return;

    const updatedCard = { ...formData, [field]: value };
    setFormData(updatedCard);
    setSaveStatus('saving');

    try {
      await updateCard(updatedCard);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      setSaveStatus(null);
      toast.error('Erro ao atualizar campo');
    }
  };

  if (!isOpen || !formData) return null;

  const filteredHistory = whatsappHistory
    .filter(msg => 
      (!dateFilter || msg.date.includes(dateFilter)) &&
      (!searchTerm || msg.message.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div 
      className={`fixed inset-0 z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/20" />
      
      <div 
        className={`absolute right-0 top-0 h-full w-[600px] transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isClosing ? 'translate-x-full' : 'translate-x-0'
        } overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold font-poppins">
                {formData.dentistName}
              </h2>
              {saveStatus && (
                <div className="flex items-center text-sm bg-white/10 px-2 py-1 rounded-full">
                  {saveStatus === 'saving' ? (
                    <Save className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-1" />
                  )}
                  {saveStatus === 'saving' ? 'Salvando...' : 'Salvo'}
                </div>
              )}
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-1 hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 font-poppins flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Informações Básicas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-poppins">
                  Nome do Dentista
                </label>
                <input
                  type="text"
                  value={formData.dentistName}
                  onChange={(e) => handleFieldChange('dentistName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 font-poppins">
                  Nome da Clínica
                </label>
                <input
                  type="text"
                  value={formData.clinicName}
                  onChange={(e) => handleFieldChange('clinicName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 font-poppins">
                  CNPJ
                </label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => handleFieldChange('cnpj', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 font-poppins">
                  CPF
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => handleFieldChange('cpf', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                />
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 font-poppins flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Contato
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-poppins">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 font-poppins">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 font-poppins">
                  Endereço
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                />
              </div>
            </div>
          </section>

          {/* Commercial Info */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 font-poppins flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Informações Comerciais
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-poppins">
                  Valor Potencial
                </label>
                <input
                  type="number"
                  value={formData.potential_value}
                  onChange={(e) => handleFieldChange('potential_value', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 font-poppins">
                  Origem do Lead
                </label>
                <select
                  value={formData.lead_source}
                  onChange={(e) => handleFieldChange('lead_source', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                >
                  <option value="">Selecione...</option>
                  <option value="prospect">Prospect</option>
                  <option value="facebook">Lead Ads Facebook</option>
                  <option value="site">Lead Site</option>
                  <option value="base">Cliente Base Boneheal</option>
                  <option value="congresso">Congresso</option>
                </select>
              </div>
            </div>
          </section>

          {/* WhatsApp History */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 font-poppins flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Histórico WhatsApp
            </h3>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                />
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Buscar mensagens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto">
              {filteredHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'client' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.from === 'client'
                        ? 'bg-gray-100'
                        : 'bg-indigo-50'
                    }`}
                  >
                    <p className="text-sm font-poppins">{msg.message}</p>
                    <span className="text-xs text-gray-500 font-poppins mt-1 block">
                      {formatDate(msg.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-between border-t pt-6">
            <button
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 font-poppins"
              onClick={() => {
                handleFieldChange('registrationStatus', 'pending');
                toast.success('Solicitação de cadastro enviada');
              }}
            >
              Solicitar Cadastro
            </button>
            <button
              className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 font-poppins"
              onClick={() => {
                toast.success('Redirecionando para criação de orçamento...');
              }}
            >
              Criar Orçamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}