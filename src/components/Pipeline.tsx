import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from './KanbanBoard';
import TableView from './TableView';
import { Layout, LayoutList, Plus } from 'lucide-react';
import LeadModal from './LeadModal';
import SearchBar from './SearchBar';
import { Card } from '../types';
import CardDrawer from './CardDrawer';

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
        <h1 className="text-2xl font-semibold text-gray-900 font-inter">{pipelineName}</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsLeadModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center font-inter"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewType('kanban')}
              className={`p-2 rounded ${
                viewType === 'kanban' ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
              title="Visualização Kanban"
            >
              <Layout className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => setViewType('table')}
              className={`p-2 rounded ${
                viewType === 'table' ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
              title="Visualização em Tabela"
            >
              <LayoutList className="h-5 w-5 text-gray-600" />
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