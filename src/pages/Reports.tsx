import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Filter, 
  Download, 
  Save,
  Calendar,
  Search,
  X,
  GripVertical,
  Eye
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDate, formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

interface Pipeline {
  id: string;
  name: string;
  fields: Field[];
  isExpanded?: boolean;
}

interface Field {
  id: string;
  name: string;
  key: string;
  isSelected?: boolean;
}

interface SavedReport {
  id: string;
  name: string;
  pipeline: string;
  fields: string[];
  filters: any[];
  dateRange?: { start: string; end: string };
}

const pipelines: Pipeline[] = [
  {
    id: 'hunting',
    name: 'Hunting',
    fields: [
      { id: 'dentistName', name: 'Nome do Dentista', key: 'dentistName' },
      { id: 'clinicName', name: 'Clínica', key: 'clinicName' },
      { id: 'phone', name: 'Telefone', key: 'phone' },
      { id: 'email', name: 'Email', key: 'email' },
      { id: 'status', name: 'Status', key: 'status' },
      { id: 'potentialValue', name: 'Valor Potencial', key: 'potentialValue' },
      { id: 'lastContact', name: 'Último Contato', key: 'lastContact' },
      { id: 'responsible', name: 'Responsável', key: 'responsible' }
    ]
  },
  // Add other pipelines...
];

export default function Reports() {
  const [expandedPipeline, setExpandedPipeline] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [columns, setColumns] = useState<Field[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filters, setFilters] = useState<any[]>([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [reportName, setReportName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handlePipelineClick = (pipelineId: string) => {
    setExpandedPipeline(expandedPipeline === pipelineId ? null : pipelineId);
  };

  const handleFieldSelect = (field: Field) => {
    if (selectedFields.includes(field.id)) {
      setSelectedFields(prev => prev.filter(id => id !== field.id));
      setColumns(prev => prev.filter(col => col.id !== field.id));
    } else {
      setSelectedFields(prev => [...prev, field.id]);
      setColumns(prev => [...prev, field]);
    }
  };

  const handleColumnReorder = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setColumns(prev => {
        const oldIndex = prev.findIndex(col => col.id === active.id);
        const newIndex = prev.findIndex(col => col.id === over.id);
        const newColumns = [...prev];
        const [removed] = newColumns.splice(oldIndex, 1);
        newColumns.splice(newIndex, 0, removed);
        return newColumns;
      });
    }
  };

  const handleSaveReport = () => {
    if (!reportName) {
      toast.error('Digite um nome para o relatório');
      return;
    }

    const newReport: SavedReport = {
      id: crypto.randomUUID(),
      name: reportName,
      pipeline: expandedPipeline!,
      fields: selectedFields,
      filters,
      dateRange
    };

    setSavedReports(prev => [...prev, newReport]);
    setShowSaveModal(false);
    setReportName('');
    toast.success('Relatório salvo com sucesso');
  };

  const handleExportExcel = () => {
    // Excel export logic here
    toast.success('Relatório exportado com sucesso');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900 font-poppins">Relatórios</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSaveModal(true)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center font-poppins"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Relatório
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center font-poppins"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3 bg-white rounded-lg shadow p-4">
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-gray-900 font-poppins">Pipelines</h2>
            {pipelines.map(pipeline => (
              <div key={pipeline.id}>
                <button
                  onClick={() => handlePipelineClick(pipeline.id)}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                >
                  <span className="text-sm font-poppins">{pipeline.name}</span>
                  {expandedPipeline === pipeline.id ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedPipeline === pipeline.id && (
                  <div className="ml-4 mt-2 space-y-2">
                    {pipeline.fields.map(field => (
                      <label key={field.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(field.id)}
                          onChange={() => handleFieldSelect(field)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-poppins">{field.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-medium text-gray-900 mb-4 font-poppins">Meus Relatórios</h2>
            <div className="space-y-2">
              {savedReports.map(report => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                >
                  <span className="text-sm font-poppins">{report.name}</span>
                  <button
                    onClick={() => {
                      setExpandedPipeline(report.pipeline);
                      setSelectedFields(report.fields);
                      setFilters(report.filters);
                      if (report.dateRange) setDateRange(report.dateRange);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 font-poppins mb-1">
                  Período
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                  />
                  <span className="text-gray-500">até</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                  />
                </div>
              </div>
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center font-poppins">
                <Filter className="w-4 h-4 mr-2" />
                Mais Filtros
              </button>
            </div>
          </div>

          {/* Table */}
          {columns.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleColumnReorder}
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <SortableContext
                    items={columns.map(col => col.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <thead className="bg-gray-50">
                      <tr>
                        {columns.map(column => (
                          <SortableHeader key={column.id} column={column} />
                        ))}
                      </tr>
                    </thead>
                  </SortableContext>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Add your table rows here */}
                  </tbody>
                </table>
              </DndContext>
            </div>
          )}
        </div>
      </div>

      {/* Save Report Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4 font-poppins">
              Salvar Relatório
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-poppins mb-1">
                  Nome do Relatório
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={e => setReportName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                  placeholder="Ex: Leads por Status"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-poppins"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveReport}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 font-poppins"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SortableHeaderProps {
  column: Field;
}

function SortableHeader({ column }: SortableHeaderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins cursor-move"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center space-x-2">
        <GripVertical className="w-4 h-4" />
        <span>{column.name}</span>
      </div>
    </th>
  );
}