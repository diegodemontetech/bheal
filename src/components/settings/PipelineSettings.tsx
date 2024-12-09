import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

interface Pipeline {
  id: string;
  name: string;
  icon: string;
  fieldGroupId: string;
  stages: Stage[];
}

interface Stage {
  id: string;
  name: string;
  color: string;
}

interface FieldGroup {
  id: string;
  name: string;
  fields: Field[];
}

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  showInCard: boolean;
  showInDrawer: boolean;
}

const availableIcons = [
  { id: 'mdi:target', name: 'Target' },
  { id: 'mdi:briefcase', name: 'Briefcase' },
  { id: 'mdi:account-check', name: 'User Check' },
  { id: 'mdi:account-convert', name: 'User Convert' },
  { id: 'mdi:delete', name: 'Trash' },
  { id: 'mdi:star', name: 'Star' },
  { id: 'mdi:flag', name: 'Flag' },
  { id: 'mdi:chart-line', name: 'Chart' },
  { id: 'mdi:cash', name: 'Cash' },
  { id: 'mdi:account-group', name: 'Users' }
];

// Mock field groups
const mockFieldGroups: FieldGroup[] = [
  {
    id: '1',
    name: 'Dados Básicos',
    fields: [
      { id: '1', name: 'Nome', type: 'text', required: true, showInCard: true, showInDrawer: true },
      { id: '2', name: 'Email', type: 'email', required: true, showInCard: true, showInDrawer: true },
      { id: '3', name: 'Telefone', type: 'phone', required: true, showInCard: true, showInDrawer: true }
    ]
  },
  {
    id: '2',
    name: 'Dados Comerciais',
    fields: [
      { id: '4', name: 'Valor Potencial', type: 'number', required: true, showInCard: true, showInDrawer: true },
      { id: '5', name: 'Próximos Passos', type: 'text', required: false, showInCard: false, showInDrawer: true },
      { id: '6', name: 'Data Prevista', type: 'date', required: false, showInCard: true, showInDrawer: true }
    ]
  },
  {
    id: '3',
    name: 'Dados Financeiros',
    fields: [
      { id: '7', name: 'Limite de Crédito', type: 'number', required: true, showInCard: false, showInDrawer: true },
      { id: '8', name: 'Condição de Pagamento', type: 'select', required: true, showInCard: false, showInDrawer: true },
      { id: '9', name: 'Histórico de Compras', type: 'text', required: false, showInCard: false, showInDrawer: true }
    ]
  }
];

export default function PipelineSettings() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [isAddingPipeline, setIsAddingPipeline] = useState(false);

  const handleAddPipeline = () => {
    setIsAddingPipeline(true);
    setEditingPipeline({
      id: crypto.randomUUID(),
      name: '',
      icon: 'mdi:target',
      fieldGroupId: '',
      stages: []
    });
  };

  const handleEditPipeline = (pipeline: Pipeline) => {
    setEditingPipeline(pipeline);
  };

  const handleDeletePipeline = (pipelineId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pipeline?')) {
      setPipelines(prev => prev.filter(p => p.id !== pipelineId));
      toast.success('Pipeline excluído com sucesso');
    }
  };

  const handleSavePipeline = (pipeline: Pipeline) => {
    if (!pipeline.fieldGroupId) {
      toast.error('Selecione um grupo de campos');
      return;
    }

    if (isAddingPipeline) {
      setPipelines(prev => [...prev, pipeline]);
      toast.success('Pipeline criado com sucesso');
    } else {
      setPipelines(prev => prev.map(p => p.id === pipeline.id ? pipeline : p));
      toast.success('Pipeline atualizado com sucesso');
    }
    setEditingPipeline(null);
    setIsAddingPipeline(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 font-poppins">
          Pipelines
        </h2>
        <button
          onClick={handleAddPipeline}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center font-poppins"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Pipeline
        </button>
      </div>

      <div className="grid gap-4">
        {pipelines.map((pipeline) => (
          <div
            key={pipeline.id}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Icon icon={pipeline.icon} className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900 font-poppins">
                  {pipeline.name}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditPipeline(pipeline)}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePipeline(pipeline.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-500 font-poppins">
                Grupo de Campos: {mockFieldGroups.find(g => g.id === pipeline.fieldGroupId)?.name}
              </div>
            </div>

            <div className="mt-4 flex space-x-4">
              {pipeline.stages.map((stage) => (
                <div
                  key={stage.id}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium bg-${stage.color}-100 text-${stage.color}-800`}
                >
                  {stage.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {editingPipeline && (
        <EditPipelineModal
          pipeline={editingPipeline}
          fieldGroups={mockFieldGroups}
          onSave={handleSavePipeline}
          onClose={() => {
            setEditingPipeline(null);
            setIsAddingPipeline(false);
          }}
          availableIcons={availableIcons}
        />
      )}
    </div>
  );
}

interface EditPipelineModalProps {
  pipeline: Pipeline;
  fieldGroups: FieldGroup[];
  onSave: (pipeline: Pipeline) => void;
  onClose: () => void;
  availableIcons: { id: string; name: string; }[];
}

function EditPipelineModal({ pipeline, fieldGroups, onSave, onClose, availableIcons }: EditPipelineModalProps) {
  const [formData, setFormData] = useState<Pipeline>(pipeline);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddStage = () => {
    setFormData(prev => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          id: crypto.randomUUID(),
          name: '',
          color: 'gray'
        }
      ]
    }));
  };

  const handleRemoveStage = (stageId: string) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.filter(stage => stage.id !== stageId)
    }));
  };

  const handleStageChange = (stageId: string, field: keyof Stage, value: string) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.map(stage =>
        stage.id === stageId ? { ...stage, [field]: value } : stage
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4 font-poppins">
          {pipeline.id ? 'Editar Pipeline' : 'Novo Pipeline'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Ícone
            </label>
            <div className="mt-1 grid grid-cols-5 gap-2">
              {availableIcons.map(icon => (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon: icon.id }))}
                  className={`p-2 rounded-lg border ${
                    formData.icon === icon.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon icon={icon.id} className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Grupo de Campos
            </label>
            <select
              value={formData.fieldGroupId}
              onChange={e => setFormData(prev => ({ ...prev, fieldGroupId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
              required
            >
              <option value="">Selecione um grupo de campos...</option>
              {fieldGroups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>

            {formData.fieldGroupId && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700 font-poppins mb-2">
                  Campos incluídos:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                  {fieldGroups
                    .find(g => g.id === formData.fieldGroupId)
                    ?.fields.map(field => (
                      <li key={field.id} className="font-poppins">
                        {field.name}
                        {field.required && <span className="text-red-500">*</span>}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Fases
              </label>
              <button
                type="button"
                onClick={handleAddStage}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-poppins"
              >
                Adicionar Fase
              </button>
            </div>
            <div className="space-y-2">
              {formData.stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={stage.name}
                    onChange={e => handleStageChange(stage.id, 'name', e.target.value)}
                    placeholder={`Fase ${index + 1}`}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                  />
                  <select
                    value={stage.color}
                    onChange={e => handleStageChange(stage.id, 'color', e.target.value)}
                    className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                  >
                    <option value="gray">Cinza</option>
                    <option value="blue">Azul</option>
                    <option value="green">Verde</option>
                    <option value="yellow">Amarelo</option>
                    <option value="red">Vermelho</option>
                    <option value="purple">Roxo</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveStage(stage.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-poppins"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 font-poppins"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}