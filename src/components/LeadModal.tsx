import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useKanbanStore } from '../store/kanbanStore';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadModal({ isOpen, onClose }: Props) {
  const { user } = useAuth();
  const { pipelineId } = useParams();
  const addCard = useKanbanStore((state) => state.addCard);

  const [formData, setFormData] = useState({
    dentist_name: '',
    clinic_name: '',
    cnpj: '',
    cpf: '',
    phone: '',
    email: '',
    address: '',
    socioeconomic_class: '',
    demographic_density: '',
    consumption_potential: '',
    website: '',
    specialty: '',
    purchase_history: '',
    purchase_frequency: '',
    purchase_volume: '',
    last_purchase_date: '',
    average_order_value: '',
    bone_barriers_type: '',
    preferred_brands: '',
    needs_samples: false,
    other_interests: '',
    preferred_communication: '',
    opportunity_status: '',
    expected_close_date: '',
    potential_value: '',
    competitors: '',
    payment_terms: '',
    credit_limit: '',
    delivery_preferences: '',
    special_instructions: '',
    pipeline: pipelineId || 'hunting',
    status: 'backlog',
    responsible_id: user?.id || '',
    lead_source: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addCard(formData);
      toast.success('Lead criado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Erro ao criar lead');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Novo Lead</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome do Dentista</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.dentist_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, dentist_name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nome da Clínica</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.clinic_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, clinic_name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.cnpj}
                  onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">CPF</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.cpf}
                  onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                />
              </div>
            </div>

            {/* Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contato</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="tel"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>

            {/* Informações Profissionais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Informações Profissionais</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Especialidade</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.specialty}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                >
                  <option value="">Selecione...</option>
                  <option value="cirurgiao-geral">Cirurgião-Dentista Geral</option>
                  <option value="periodontista">Periodontista</option>
                  <option value="implantodontista">Implantodontista</option>
                  <option value="endodontista">Endodontista</option>
                  <option value="ortodontista">Ortodontista</option>
                  <option value="bucomaxilo">Cirurgião Bucomaxilofacial</option>
                  <option value="protesista">Prostodontista</option>
                  <option value="odontopediatra">Odontopediatra</option>
                  <option value="radiologista">Radiologista</option>
                  <option value="patologista">Patologista Oral</option>
                  <option value="estomatologista">Estomatologista</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Barreiras Ósseas</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.bone_barriers_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, bone_barriers_type: e.target.value }))}
                >
                  <option value="">Selecione...</option>
                  <option value="reabsorviveis">Reabsorvíveis</option>
                  <option value="nao-reabsorviveis">Não Reabsorvíveis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Marcas Preferidas</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.preferred_brands}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferred_brands: e.target.value }))}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={formData.needs_samples}
                  onChange={(e) => setFormData(prev => ({ ...prev, needs_samples: e.target.checked }))}
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Necessita de Amostras
                </label>
              </div>
            </div>

            {/* Informações Comerciais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Informações Comerciais</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor Potencial</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.potential_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, potential_value: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Data Prevista de Fechamento</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.expected_close_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, expected_close_date: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Origem do Lead</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.lead_source}
                  onChange={(e) => setFormData(prev => ({ ...prev, lead_source: e.target.value }))}
                >
                  <option value="">Selecione...</option>
                  <option value="prospect">Prospect</option>
                  <option value="facebook">Lead Ads Facebook</option>
                  <option value="site">Lead Site</option>
                  <option value="base">Cliente Base Boneheal</option>
                  <option value="congresso">Congresso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Concorrentes</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.competitors}
                  onChange={(e) => setFormData(prev => ({ ...prev, competitors: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              Criar Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}