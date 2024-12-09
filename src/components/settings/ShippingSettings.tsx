import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShippingZone {
  id: string;
  name: string;
  cepStart: string;
  cepEnd: string;
  rates: ShippingRate[];
  active: boolean;
}

interface ShippingRate {
  id: string;
  weightStart: number;
  weightEnd: number;
  price: number;
  deliveryDays: number;
}

export default function ShippingSettings() {
  const [zones, setZones] = useState<ShippingZone[]>([
    {
      id: '1',
      name: 'São Paulo Capital',
      cepStart: '01000000',
      cepEnd: '05999999',
      active: true,
      rates: [
        {
          id: '1',
          weightStart: 0,
          weightEnd: 1,
          price: 25,
          deliveryDays: 2
        },
        {
          id: '2',
          weightStart: 1.001,
          weightEnd: 3,
          price: 35,
          deliveryDays: 2
        }
      ]
    },
    {
      id: '2',
      name: 'São Paulo Interior',
      cepStart: '06000000',
      cepEnd: '19999999',
      active: true,
      rates: [
        {
          id: '1',
          weightStart: 0,
          weightEnd: 1,
          price: 35,
          deliveryDays: 3
        },
        {
          id: '2',
          weightStart: 1.001,
          weightEnd: 3,
          price: 45,
          deliveryDays: 3
        }
      ]
    }
  ]);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [isAddingZone, setIsAddingZone] = useState(false);

  const handleAddZone = () => {
    setIsAddingZone(true);
    setEditingZone({
      id: crypto.randomUUID(),
      name: '',
      cepStart: '',
      cepEnd: '',
      rates: [],
      active: true
    });
  };

  const handleEditZone = (zone: ShippingZone) => {
    setEditingZone(zone);
  };

  const handleDeleteZone = (zoneId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta zona de frete?')) {
      setZones(prev => prev.filter(z => z.id !== zoneId));
      toast.success('Zona de frete excluída com sucesso');
    }
  };

  const handleSaveZone = (zone: ShippingZone) => {
    if (isAddingZone) {
      setZones(prev => [...prev, zone]);
      toast.success('Zona de frete criada com sucesso');
    } else {
      setZones(prev => prev.map(z => z.id === zone.id ? zone : z));
      toast.success('Zona de frete atualizada com sucesso');
    }
    setEditingZone(null);
    setIsAddingZone(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 font-poppins">
          Zonas de Frete
        </h2>
        <button
          onClick={handleAddZone}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center font-poppins"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Zona
        </button>
      </div>

      <div className="grid gap-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 font-poppins">
                    {zone.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-poppins mt-1">
                    CEP: {zone.cepStart} até {zone.cepEnd}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditZone(zone)}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteZone(zone.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                      Peso (kg)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                      Prazo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {zone.rates.map((rate) => (
                    <tr key={rate.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-poppins">
                        {rate.weightStart} - {rate.weightEnd}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-poppins">
                        R$ {rate.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-poppins">
                        {rate.deliveryDays} {rate.deliveryDays === 1 ? 'dia útil' : 'dias úteis'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {editingZone && (
        <ShippingZoneModal
          zone={editingZone}
          onSave={handleSaveZone}
          onClose={() => {
            setEditingZone(null);
            setIsAddingZone(false);
          }}
        />
      )}
    </div>
  );
}

interface ShippingZoneModalProps {
  zone: ShippingZone;
  onSave: (zone: ShippingZone) => void;
  onClose: () => void;
}

function ShippingZoneModal({ zone, onSave, onClose }: ShippingZoneModalProps) {
  const [formData, setFormData] = useState<ShippingZone>(zone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddRate = () => {
    setFormData(prev => ({
      ...prev,
      rates: [
        ...prev.rates,
        {
          id: crypto.randomUUID(),
          weightStart: 0,
          weightEnd: 0,
          price: 0,
          deliveryDays: 1
        }
      ]
    }));
  };

  const handleRemoveRate = (rateId: string) => {
    setFormData(prev => ({
      ...prev,
      rates: prev.rates.filter(r => r.id !== rateId)
    }));
  };

  const handleRateChange = (rateId: string, field: keyof ShippingRate, value: number) => {
    setFormData(prev => ({
      ...prev,
      rates: prev.rates.map(rate =>
        rate.id === rateId ? { ...rate, [field]: value } : rate
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4 font-poppins">
          {zone.id ? 'Editar Zona de Frete' : 'Nova Zona de Frete'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 font-poppins">
                  CEP Inicial
                </label>
                <input
                  type="text"
                  value={formData.cepStart}
                  onChange={e => setFormData(prev => ({ ...prev, cepStart: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 font-poppins">
                  CEP Final
                </label>
                <input
                  type="text"
                  value={formData.cepEnd}
                  onChange={e => setFormData(prev => ({ ...prev, cepEnd: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-gray-900 font-poppins">
                Faixas de Peso
              </h4>
              <button
                type="button"
                onClick={handleAddRate}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-poppins"
              >
                Adicionar Faixa
              </button>
            </div>

            <div className="space-y-4">
              {formData.rates.map((rate, index) => (
                <div key={rate.id} className="flex items-center space-x-4">
                  <div>
                    <label className="block text-xs text-gray-500 font-poppins">
                      Peso Inicial (kg)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={rate.weightStart}
                      onChange={e => handleRateChange(rate.id, 'weightStart', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 font-poppins">
                      Peso Final (kg)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={rate.weightEnd}
                      onChange={e => handleRateChange(rate.id, 'weightEnd', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 font-poppins">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={rate.price}
                      onChange={e => handleRateChange(rate.id, 'price', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 font-poppins">
                      Prazo (dias úteis)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={rate.deliveryDays}
                      onChange={e => handleRateChange(rate.id, 'deliveryDays', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveRate(rate.id)}
                    className="mt-6 p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
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