import React from 'react';
import { DndContext, DragEndEvent, closestCorners, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { useKanbanStore } from '../store/kanbanStore';
import KanbanColumn from './KanbanColumn';
import { useParams } from 'react-router-dom';
import { Card } from '../types';
import KanbanCard from './KanbanCard';

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'interagindo', title: 'Interagindo' },
  { id: 'avancado', title: 'Avançado' },
  { id: 'cadastro', title: 'Cadastro' },
  { id: 'venda-realizada', title: 'Venda Realizada' }
];

interface Props {
  searchResults: Card[];
  onCardClick: (card: Card) => void;
}

export default function KanbanBoard({ searchResults, onCardClick }: Props) {
  const { pipelineId } = useParams();
  const cards = useKanbanStore((state) => state.cards);
  const moveCard = useKanbanStore((state) => state.moveCard);
  const [activeCard, setActiveCard] = React.useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const displayCards = searchResults.length > 0 ? searchResults : cards;

  const handleDragStart = (event: DragStartEvent) => {
    const card = displayCards.find((c) => c.id === event.active.id);
    if (card) setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      moveCard(active.id as string, active.data.current?.sortable.containerId, over.id as string);
    }
    setActiveCard(null);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 min-w-max p-4">
        {columns.map((column) => (
          <div key={column.id} className="w-80">
            <KanbanColumn
              id={column.id}
              title={column.title}
              cards={displayCards.filter(
                (card) => card.status === column.id && card.pipeline === pipelineId
              )}
              onCardClick={onCardClick}
            />
          </div>
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeCard ? <KanbanCard card={activeCard} onCardClick={onCardClick} /> : null}
      </DragOverlay>
    </DndContext>
  );
}