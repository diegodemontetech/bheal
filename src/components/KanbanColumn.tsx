import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import { Card } from '../types';

interface Props {
  id: string;
  title: string;
  cards: Card[];
  onCardClick: (card: Card) => void;
}

export default function KanbanColumn({ id, title, cards, onCardClick }: Props) {
  const { setNodeRef } = useDroppable({ id });

  const columnColors: Record<string, { bg: string; border: string; text: string }> = {
    'backlog': { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
    'interagindo': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    'avancado': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    'cadastro': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    'venda-realizada': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }
  };

  const columnStyle = columnColors[id] || columnColors.backlog;

  return (
    <div className={`${columnStyle.bg} rounded-lg p-4 border ${columnStyle.border} min-h-[calc(100vh-13rem)]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className={`font-medium ${columnStyle.text}`}>{title}</h3>
          <span className="ml-2 flex items-center justify-center w-5 h-5 rounded-full bg-white text-xs font-medium text-gray-600">
            {cards.length}
          </span>
        </div>
      </div>
      
      <SortableContext
        items={cards.map(card => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="space-y-3">
          {cards.map((card) => (
            <KanbanCard 
              key={card.id} 
              card={card}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}