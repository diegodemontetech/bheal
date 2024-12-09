import React from 'react';
import { X, Download, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

interface Props {
  quote: {
    id: string;
    number: string;
    clientName: string;
    date: string;
    total: number;
    status: 'draft' | 'sent' | 'approved' | 'rejected';
  };
  onClose: () => void;
}

export default function QuoteViewModal({ quote, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900 font-poppins">
            Orçamento {quote.number}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Cliente
              </label>
              <p className="mt-1 text-sm text-gray-900 font-poppins">
                {quote.clientName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Data
              </label>
              <p className="mt-1 text-sm text-gray-900 font-poppins">
                {formatDate(quote.date)}
              </p>
            </div>
          </div>

          {/* Mock Items */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 font-poppins mb-4">
              Itens
            </h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                    Valor Unitário
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-poppins">
                    Barreira Óssea 15x20mm
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-poppins">
                    2
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-poppins">
                    {formatCurrency(450)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-poppins">
                    {formatCurrency(900)}
                  </td>
                </tr>
                {/* Add more items as needed */}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 font-poppins">Subtotal:</span>
                  <span className="text-sm text-gray-900 font-poppins">{formatCurrency(quote.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 font-poppins">Frete:</span>
                  <span className="text-sm text-gray-900 font-poppins">{formatCurrency(50)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-sm text-gray-900 font-poppins">Total:</span>
                  <span className="text-sm text-gray-900 font-poppins">{formatCurrency(quote.total + 50)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-poppins"
            >
              Fechar
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 font-poppins flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}