import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../components/KanbanBoard';
import TableView from '../components/TableView';
import { Layout, LayoutList, Plus } from 'lucide-react';
import LeadModal from '../components/LeadModal';
import SearchBar from '../components/SearchBar';
import { Card } from '../types';
import CardDrawer from '../components/CardDrawer';

const pipelineNames: Record<string, string> = {
  'hunting': 'Hunting',
  'carteira': 'Carteira',
  'positivacao': 'Positivação',
  'resgate': 'Resgate de Lead',
  'lixeira': 'Lixeira Cliente'
};

export default function Pipeline() {
  const { pipelineId } = useParams();
  const [viewType, setViewType] = useState<'kanban' | 'table'>('kanban');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const pipelineName = pipelineNames[pipelineId || ''] || 'Pipeline';

  const handleSearch = (results: Card[]) => {
    setSearchResults(results);
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900 font-poppins">{pipelineName}</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsLeadModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center font-poppins"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </button>
          <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button
              onClick={() => setViewType('kanban')}
              className={`p-2 rounded ${
                viewType === 'kanban' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-600'
              }`}
              title="Visualização Kanban"
            >
              <Layout className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewType('table')}
              className={`p-2 rounded ${
                viewType === 'table' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-600'
              }`}
              title="Visualização em Tabela"
            >
              <LayoutList className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} />

      {viewType === 'kanban' ? (
        <KanbanBoard searchResults={searchResults} onCardClick={handleCardClick} />
      ) : (
        <TableView searchResults={searchResults} onCardClick={handleCardClick} />
      )}

      <LeadModal 
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />

      <CardDrawer
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
}