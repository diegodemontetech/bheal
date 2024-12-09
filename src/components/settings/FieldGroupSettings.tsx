import React, { useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  showInCard: boolean;
  showInDrawer: boolean;
}

interface FieldGroup {
  id: string;
  name: string;
  fields: Field[];
}

const fieldTypes = [
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Telefone' },
  { value: 'date', label: 'Data' },
  { value: 'select', label: 'Seleção' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'textarea', label: 'Área de Texto' }
];

export default function FieldGroupSettings() {
  const [groups, setGroups] = useState<FieldGroup[]>([]);
  const [editingGroup, setEditingGroup] = useState<FieldGroup | null>(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);

  const handleAddGroup = () => {
    setIsAddingGroup(true);
    setEditingGroup({
      id: crypto.randomUUID(),
      name: '',
      fields: []
    });
  };

  const handleEditGroup = (group: FieldGroup) => {
    setEditingGroup(group);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo?')) {
      setGroups(prev => prev.filter(g => g.id !== groupId));
      toast.success('Grupo excluído com sucesso');
    }
  };

  const handleSaveGroup = (group: FieldGroup) => {
    if (isAddingGroup) {
      setGroups(prev => [...prev, group]);
      toast.success('Grupo criado com sucesso');
    } else {
      setGroups(prev => prev.map(g => g.id === group.id ? group : g));
      toast.success('Grupo atualizado com sucesso');
    }
    setEditingGroup(null);
    setIsAddingGroup(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 font-inter">
          Grupos de Campos
        </h2>
        <button
          onClick={handleAddGroup}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center font-inter"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Grupo
        </button>
      </div>

      <div className="grid gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 font-inter">
                {group.name}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditGroup(group)}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                      Campo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                      Obrigatório
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                      Mostrar no Card
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                      Mostrar no Drawer
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {group.fields.map((field) => (
                    <tr key={field.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-inter">
                        {field.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-inter">
                        {fieldTypes.find(t => t.value === field.type)?.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.required ? 'Sim' : 'Não'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.showInCard ? 'Sim' : 'Não'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.showInDrawer ? 'Sim' : 'Não'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {editingGroup && (
        <EditFieldGroupModal
          group={editingGroup}
          onSave={handleSaveGroup}
          onClose={() => {
            setEditingGroup(null);
            setIsAddingGroup(false);
          }}
        />
      )}
    </div>
  );
}

interface EditFieldGroupModalProps {
  group: FieldGroup;
  onSave: (group: FieldGroup) => void;
  onClose: () => void;
}

function EditFieldGroupModal({ group, onSave, onClose }: EditFieldGroupModalProps) {
  const [formData, setFormData] = useState<FieldGroup>(group);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          id: crypto.randomUUID(),
          name: '',
          type: 'text',
          required: false,
          showInCard: false,
          showInDrawer: true
        }
      ]
    }));
  };

  const handleRemoveField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId)
    }));
  };

  const handleFieldChange = (fieldId: string, key: keyof Field, value: any) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, [key]: value } : field
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
          {group.id ? 'Editar Grupo de Campos' : 'Novo Grupo de Campos'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-inter">
              Nome do Grupo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-inter"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-gray-900 font-inter">Campos</h4>
              <button
                type="button"
                onClick={handleAddField}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-inter"
              >
                Adicionar Campo
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (over && active.id !== over.id) {
                  const oldIndex = formData.fields.findIndex(f => f.id === active.id);
                  const newIndex = formData.fields.findIndex(f => f.id === over.id);
                  const newFields = [...formData.fields];
                  const [removed] = newFields.splice(oldIndex, 1);
                  newFields.splice(newIndex, 0, removed);
                  setFormData(prev => ({ ...prev, fields: newFields }));
                }
              }}
            >
              <SortableContext
                items={formData.fields.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {formData.fields.map((field) => (
                    <SortableField
                      key={field.id}
                      field={field}
                      onRemove={() => handleRemoveField(field.id)}
                      onChange={(key, value) => handleFieldChange(field.id, key, value)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-inter"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 font-inter"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface SortableFieldProps {
  field: Field;
  onRemove: () => void;
  onChange: (key: keyof Field, value: any) => void;
}

function SortableField({ field, onRemove, onChange }: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200"
    >
      <button
        type="button"
        className="cursor-move text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 grid grid-cols-5 gap-4">
        <input
          type="text"
          value={field.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="Nome do campo"
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-inter"
        />

        <select
          value={field.type}
          onChange={e => onChange('type', e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-inter"
        >
          {fieldTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={field.required}
            onChange={e => onChange('required', e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700 font-inter">
            Obrigatório
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={field.showInCard}
            onChange={e => onChange('showInCard', e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700 font-inter">
            Mostrar no Card
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={field.showInDrawer}
            onChange={e => onChange('showInDrawer', e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700 font-inter">
            Mostrar no Drawer
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="text-gray-400 hover:text-red-600"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}