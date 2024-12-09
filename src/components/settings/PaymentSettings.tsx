import React, { useState } from 'react';
import { Plus, Pencil, Trash2, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  maxDiscountPercent: number;
  minOrderValue: number;
  maxOrderValue: number;
  active: boolean;
}

export default function PaymentSettings() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      name: 'Boleto à Vista',
      description: 'Pagamento via boleto bancário com vencimento em 3 dias',
      maxDiscountPercent: 5,
      minOrderValue: 0,
      maxOrderValue: 999999,
      active: true
    },
    {
      id: '2',
      name: 'Boleto 30 dias',
      description: 'Pagamento via boleto bancário com vencimento em 30 dias',
      maxDiscountPercent: 0,
      minOrderValue: 1000,
      maxOrderValue: 999999,
      active: true
    },
    {
      id: '3',
      name: 'Cartão de Crédito',
      description: 'Pagamento via cartão de crédito em até 6x',
      maxDiscountPercent: 0,
      minOrderValue: 0,
      maxOrderValue: 999999,
      active: true
    }
  ]);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [isAddingMethod, setIsAddingMethod] = useState(false);

  const handleAddMethod = () => {
    setIsAddingMethod(true);
    setEditingMethod({
      id: crypto.randomUUID(),
      name: '',
      description: '',
      maxDiscountPercent: 0,
      minOrderValue: 0,
      maxOrderValue: 999999,
      active: true
    });
  };

  const handleEditMethod = (method: PaymentMethod) => {
    setEditingMethod(method);
  };

  const handleDeleteMethod = (methodId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta forma de pagamento?')) {
      setPaymentMethods(prev => prev.filter(m => m.id !== methodId));
      toast.success('Forma de pagamento excluída com sucesso');
    }
  };

  const handleSaveMethod = (method: PaymentMethod) => {
    if (isAddingMethod) {
      setPaymentMethods(prev => [...prev, method]);
      toast.success('Forma de pagamento criada com sucesso');
    } else {
      setPaymentMethods(prev => prev.map(m => m.id === method.id ? method : m));
      toast.success('Forma de pagamento atualizada com sucesso');
    }
    setEditingMethod(null);
    setIsAddingMethod(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 font-poppins">
          Formas de Pagamento
        </h2>
        <button
          onClick={handleAddMethod}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center font-poppins"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Forma de Pagamento
        </button>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 font-poppins">
                    {method.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-poppins mt-1">
                    {method.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditMethod(method)}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMethod(method.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-poppins">
                  Desconto Máximo
                </label>
                <p className="text-sm font-medium text-gray-900 font-poppins">
                  {method.maxDiscountPercent}%
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-poppins">
                  Valor Mínimo
                </label>
                <p className="text-sm font-medium text-gray-900 font-poppins">
                  R$ {method.minOrderValue.toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-poppins">
                  Valor Máximo
                </label>
                <p className="text-sm font-medium text-gray-900 font-poppins">
                  R$ {method.maxOrderValue.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingMethod && (
        <PaymentMethodModal
          method={editingMethod}
          onSave={handleSaveMethod}
          onClose={() => {
            setEditingMethod(null);
            setIsAddingMethod(false);
          }}
        />
      )}
    </div>
  );
}

interface PaymentMethodModalProps {
  method: PaymentMethod;
  onSave: (method: PaymentMethod) => void;
  onClose: () => void;
}

function PaymentMethodModal({ method, onSave, onClose }: PaymentMethodModalProps) {
  const [formData, setFormData] = useState<PaymentMethod>(method);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4 font-poppins">
          {method.id ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Desconto Máximo (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.maxDiscountPercent}
                onChange={e => setFormData(prev => ({ ...prev, maxDiscountPercent: parseFloat(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Valor Mínimo
              </label>
              <input
                type="number"
                min="0"
                value={formData.minOrderValue}
                onChange={e => setFormData(prev => ({ ...prev, minOrderValue: parseFloat(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Valor Máximo
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxOrderValue}
                onChange={e => setFormData(prev => ({ ...prev, maxOrderValue: parseFloat(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                required
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={e => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900 font-poppins">
              Ativo
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-poppins"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 font-poppins"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}