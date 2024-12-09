import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Card } from '../types';
import { useKanbanStore } from '../store/kanbanStore';
import toast from 'react-hot-toast';

interface Props {
  lead: Card;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadDetailsModal({ lead, isOpen, onClose }: Props) {
  const [formData, setFormData] = useState(lead);
  const updateCard = useKanbanStore((state) => state.updateCard);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateCard(formData);
      toast.success('Lead atualizado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar lead');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detalhes do Lead</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Dentista
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.dentistName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dentistName: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome da Clínica
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.clinicName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, clinicName: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="tel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="backlog">Backlog</option>
                <option value="interagindo">Interagindo</option>
                <option value="avancado">Avançado</option>
                <option value="cadastro">Cadastro</option>
                <option value="venda-realizada">Venda Realizada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Responsável
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.responsible}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, responsible: e.target.value }))
                }
              />
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
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}