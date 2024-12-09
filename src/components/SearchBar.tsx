import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useKanbanStore } from '../store/kanbanStore';
import { Card } from '../types';

interface SearchBarProps {
  onSearch: (results: Card[]) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const cards = useKanbanStore((state) => state.cards);

  const performSearch = useCallback(() => {
    if (searchTerm.trim()) {
      const results = cards.filter((card) => 
        Object.values(card).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      onSearch(results);
    } else {
      onSearch([]);
    }
  }, [searchTerm, cards, onSearch]);

  useEffect(() => {
    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [performSearch]);

  return (
    <div className="max-w-2xl mx-auto px-4 mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar leads por nome, clínica, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-inter"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}