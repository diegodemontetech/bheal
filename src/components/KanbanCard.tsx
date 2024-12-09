import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../types';
import { Phone, Mail, Building2, Tag, Eye } from 'lucide-react';

interface Props {
  card: Card;
  onCardClick: (card: Card) => void;
}

export default function KanbanCard({ card, onCardClick }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: card.id,
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    touchAction: 'none',
  };

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    'backlog': { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
    'interagindo': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    'avancado': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    'cadastro': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    'venda-realizada': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }
  };

  const statusStyle = statusColors[card.status] || statusColors.backlog;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white border ${statusStyle.border} rounded-lg p-4 shadow-sm hover:shadow-md transition-all font-poppins relative touch-none select-none`}
      {...attributes}
      {...listeners}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onCardClick(card);
        }}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 cursor-pointer"
        title="Ver detalhes"
      >
        <Eye className="w-4 h-4 text-gray-600 hover:text-indigo-600" />
      </button>

      <div className="space-y-3">
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
          <Tag className="w-3 h-3 mr-1" />
          {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {card.dentistName}
          </h3>
          {card.clinicName && (
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <Building2 className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">{card.clinicName}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">{card.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">{card.email}</span>
          </div>
        </div>

        <div className="pt-2 mt-2 border-t border-gray-100">
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xs font-medium text-indigo-600">
                {card.responsible.charAt(0)}
              </span>
            </div>
            <span className="ml-2 text-xs text-gray-500 truncate">
              {card.responsible}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}