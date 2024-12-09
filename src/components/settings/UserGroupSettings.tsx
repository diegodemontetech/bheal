import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Permission {
  pipelineId: string;
  viewOwn: boolean;
  editOwn: boolean;
  viewAll: boolean;
  editAll: boolean;
}

interface UserGroup {
  id: string;
  name: string;
  permissions: Permission[];
  features: string[];
}

const pipelines = [
  { id: 'hunting', name: 'Hunting' },
  { id: 'carteira', name: 'Carteira' },
  { id: 'positivacao', name: 'Positivação' },
  { id: 'resgate', name: 'Resgate de Lead' },
  { id: 'lixeira', name: 'Lixeira Cliente' }
];

const features = [
  { id: 'client_registration_approval', name: 'Aprovação de Cadastro de Cliente' },
  { id: 'quote_approval', name: 'Aprovação de Orçamentos' },
  { id: 'reports_access', name: 'Acesso a Relatórios' },
  { id: 'settings_access', name: 'Acesso a Configurações' }
];

export default function UserGroupSettings() {
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);

  const handleAddGroup = () => {
    setIsAddingGroup(true);
    setEditingGroup({
      id: crypto.randomUUID(),
      name: '',
      permissions: pipelines.map(pipeline => ({
        pipelineId: pipeline.id,
        viewOwn: false,
        editOwn: false,
        viewAll: false,
        editAll: false
      })),
      features: []
    });
  };

  const handleEditGroup = (group: UserGroup) => {
    setEditingGroup(group);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo?')) {
      setGroups(prev => prev.filter(g => g.id !== groupId));
      toast.success('Grupo excluído com sucesso');
    }
  };

  const handleSaveGroup = (group: UserGroup) => {
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
        <h2 className="text-lg font-semibold text-gray-900 font-poppins">
          Grupos de Usuários
        </h2>
        <button
          onClick={handleAddGroup}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center font-poppins"
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
              <h3 className="text-lg font-medium text-gray-900 font-poppins">
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

            <div className="space-y-6">
              {/* Pipeline Permissions */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4 font-poppins">Permissões por Pipeline</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                          Pipeline
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                          Ver Próprios
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                          Editar Próprios
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                          Ver Todos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                          Editar Todos
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {group.permissions.map((permission) => {
                        const pipeline = pipelines.find(p => p.id === permission.pipelineId);
                        return (
                          <tr key={permission.pipelineId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-poppins">
                              {pipeline?.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                <div className={`h-3 w-3 rounded-full ${permission.viewOwn ? 'bg-green-500' : 'bg-gray-300'}`} />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                <div className={`h-3 w-3 rounded-full ${permission.editOwn ? 'bg-green-500' : 'bg-gray-300'}`} />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                <div className={`h-3 w-3 rounded-full ${permission.viewAll ? 'bg-green-500' : 'bg-gray-300'}`} />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                <div className={`h-3 w-3 rounded-full ${permission.editAll ? 'bg-green-500' : 'bg-gray-300'}`} />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Feature Permissions */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4 font-poppins">Funcionalidades</h4>
                <div className="grid grid-cols-2 gap-4">
                  {features.map(feature => (
                    <div key={feature.id} className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${
                        group.features.includes(feature.id) ? 'bg-green-500' : 'bg-gray-300'
                      } mr-3`} />
                      <span className="text-sm text-gray-700 font-poppins">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingGroup && (
        <EditGroupModal
          group={editingGroup}
          pipelines={pipelines}
          features={features}
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

interface EditGroupModalProps {
  group: UserGroup;
  pipelines: { id: string; name: string; }[];
  features: { id: string; name: string; }[];
  onSave: (group: UserGroup) => void;
  onClose: () => void;
}

function EditGroupModal({ group, pipelines, features, onSave, onClose }: EditGroupModalProps) {
  const [formData, setFormData] = useState<UserGroup>(group);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePermissionChange = (pipelineId: string, field: keyof Permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.map(permission =>
        permission.pipelineId === pipelineId
          ? { ...permission, [field]: !permission[field] }
          : permission
      )
    }));
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4 font-poppins">
          {group.id ? 'Editar Grupo' : 'Novo Grupo'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Nome do Grupo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
              required
            />
          </div>

          {/* Pipeline Permissions */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4 font-poppins">Permissões por Pipeline</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                    Pipeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                    Ver Próprios
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                    Editar Próprios
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                    Ver Todos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">
                    Editar Todos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.permissions.map((permission) => {
                  const pipeline = pipelines.find(p => p.id === permission.pipelineId);
                  return (
                    <tr key={permission.pipelineId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-poppins">
                        {pipeline?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={permission.viewOwn}
                          onChange={() => handlePermissionChange(permission.pipelineId, 'viewOwn')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={permission.editOwn}
                          onChange={() => handlePermissionChange(permission.pipelineId, 'editOwn')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={permission.viewAll}
                          onChange={() => handlePermissionChange(permission.pipelineId, 'viewAll')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={permission.editAll}
                          onChange={() => handlePermissionChange(permission.pipelineId, 'editAll')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Feature Permissions */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4 font-poppins">Funcionalidades</h4>
            <div className="grid grid-cols-2 gap-4">
              {features.map(feature => (
                <label key={feature.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 font-poppins">{feature.name}</span>
                </label>
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