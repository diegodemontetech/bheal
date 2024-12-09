import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import QuoteViewModal from '../components/QuoteViewModal';

interface Quote {
  id: string;
  number: string;
  clientName: string;
  date: string;
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
}

const mockQuotes: Quote[] = [
  {
    id: '1',
    number: 'ORC2024001',
    clientName: 'Dr. João Silva',
    date: '2024-03-15',
    total: 12500.00,
    status: 'sent'
  },
  {
    id: '2',
    number: 'ORC2024002',
    clientName: 'Dra. Maria Santos',
    date: '2024-03-14',
    total: 8750.00,
    status: 'approved'
  },
  {
    id: '3',
    number: 'ORC2024003',
    clientName: 'Dr. Pedro Costa',
    date: '2024-03-13',
    total: 15000.00,
    status: 'draft'
  }
];

export default function Quotes() {
  const [selectedQuote, setSelectedQuote] = React.useState<Quote | null>(null);

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    draft: 'Rascunho',
    sent: 'Enviado',
    approved: 'Aprovado',
    rejected: 'Rejeitado'
  };

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-900 font-poppins">Meus Orçamentos</h1>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-poppins">
                    {quote.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-poppins">
                    {quote.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-poppins">
                    {formatDate(quote.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-poppins">
                    {formatCurrency(quote.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[quote.status]} font-poppins`}>
                      {statusLabels[quote.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewQuote(quote)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Visualizar"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="text-gray-400 hover:text-gray-500"
                        title="Download PDF"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedQuote && (
        <QuoteViewModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
        />
      )}
    </div>
  );
}