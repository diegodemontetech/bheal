import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, X, Check, Edit2, Eye } from 'lucide-react';
import { Card } from '../types';
import useDebounce from '../hooks/useDebounce';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useKanbanStore } from '../store/kanbanStore';

interface Props {
  searchResults: Card[];
  onCardClick: (card: Card) => void;
}

type SortField = keyof Card;
type SortDirection = 'asc' | 'desc';
type FilterValue = string | number | boolean;

interface Filter {
  field: keyof Card;
  value: FilterValue;
}

interface EditingCell {
  id: string;
  field: keyof Card;
  value: string;
}

export default function TableView({ searchResults, onCardClick }: Props) {
  const cards = useKanbanStore((state) => state.cards);
  const [sortField, setSortField] = useState<SortField>('dentistName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState<Filter[]>([]);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const columns = [
    { field: 'dentistName', label: 'Nome do Dentista', editable: true },
    { field: 'clinicName', label: 'Clínica', editable: true },
    { field: 'phone', label: 'Telefone', editable: true },
    { field: 'email', label: 'Email', editable: true },
    { field: 'specialty', label: 'Especialidade', editable: true },
    { field: 'potential_value', label: 'Valor Potencial', editable: true },
    { field: 'status', label: 'Status', editable: true },
    { field: 'responsible', label: 'Responsável', editable: false }
  ];

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilter = (field: keyof Card, value: FilterValue) => {
    setFilters(prev => {
      const existing = prev.findIndex(f => f.field === field);
      if (existing >= 0) {
        if (!value) {
          return prev.filter(f => f.field !== field);
        }
        const newFilters = [...prev];
        newFilters[existing] = { field, value };
        return newFilters;
      }
      if (!value) return prev;
      return [...prev, { field, value }];
    });
  };

  const handleClearFilters = () => {
    setFilters([]);
    setSearchTerm('');
  };

  const handleEdit = (id: string, field: keyof Card, value: string) => {
    setEditingCell({ id, field, value });
  };

  const handleSaveEdit = (card: Card) => {
    if (!editingCell) return;
    
    const updatedCard = {
      ...card,
      [editingCell.field]: editingCell.value
    };
    
    onCardClick(updatedCard);
    setEditingCell(null);
  };

  const displayCards = searchResults.length > 0 ? searchResults : cards;

  const filteredAndSortedCards = useMemo(() => {
    let result = [...displayCards];

    // Apply filters
    if (filters.length > 0) {
      result = result.filter(card =>
        filters.every(filter => {
          const value = card[filter.field];
          return value?.toString().toLowerCase().includes(filter.value.toString().toLowerCase());
        })
      );
    }

    // Apply search
    if (debouncedSearch) {
      result = result.filter(card =>
        Object.values(card).some(value =>
          value?.toString().toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      );
    }

    // Apply sort
    return result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [displayCards, filters, debouncedSearch, sortField, sortDirection]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-64 font-poppins"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 font-poppins">Filtros ativos:</span>
              {filters.map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 font-poppins"
                >
                  {columns.find(col => col.field === filter.field)?.label}: {filter.value.toString()}
                  <button
                    onClick={() => handleFilter(filter.field, '')}
                    className="ml-1 hover:text-indigo-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {filters.length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 font-poppins"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500 font-poppins">
            {filteredAndSortedCards.length} resultados
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.field}
                  onClick={() => handleSort(column.field)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 font-poppins"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    <div className="flex flex-col">
                      <ChevronUp 
                        className={`h-3 w-3 ${
                          sortField === column.field && sortDirection === 'asc'
                            ? 'text-indigo-600'
                            : 'text-gray-400'
                        }`}
                      />
                      <ChevronDown 
                        className={`h-3 w-3 ${
                          sortField === column.field && sortDirection === 'desc'
                            ? 'text-indigo-600'
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedCards.map((card) => (
              <tr key={card.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={`${card.id}-${column.field}`} className="px-6 py-4 whitespace-nowrap">
                    {editingCell?.id === card.id && editingCell?.field === column.field ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-poppins"
                          value={editingCell.value}
                          onChange={(e) => setEditingCell({
                            ...editingCell,
                            value: e.target.value
                          })}
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(card)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingCell(null)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between group">
                        <span className="text-sm text-gray-900 font-poppins">
                          {column.field === 'potential_value'
                            ? formatCurrency(card[column.field] as number)
                            : card[column.field]?.toString()}
                        </span>
                        {column.editable && (
                          <button
                            onClick={() => handleEdit(
                              card.id,
                              column.field,
                              card[column.field]?.toString() || ''
                            )}
                            className="hidden group-hover:block text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onCardClick(card)}
                    className="text-indigo-600 hover:text-indigo-900 font-poppins"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}