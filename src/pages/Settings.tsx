import React, { useState } from 'react';
import { Settings as SettingsIcon, Users, Database, LayoutGrid, Package, Truck, CreditCard, Newspaper } from 'lucide-react';
import PipelineSettings from '../components/settings/PipelineSettings';
import UserSettings from '../components/settings/UserSettings';
import FieldGroupSettings from '../components/settings/FieldGroupSettings';
import ProductSettings from '../components/settings/ProductSettings';
import ShippingSettings from '../components/settings/ShippingSettings';
import PaymentSettings from '../components/settings/PaymentSettings';
import NewsSettings from '../components/settings/NewsSettings';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('pipelines');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900 font-poppins">Configurações</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('pipelines')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'pipelines' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Pipelines</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'users' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Usuários</span>
            </button>
            <button
              onClick={() => setActiveTab('fields')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'fields' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Campos</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'products' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Produtos</span>
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'shipping' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Frete</span>
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'payment' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Pagamento</span>
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'news' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Notícias</span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'pipelines' && <PipelineSettings />}
          {activeTab === 'users' && <UserSettings />}
          {activeTab === 'fields' && <FieldGroupSettings />}
          {activeTab === 'products' && <ProductSettings />}
          {activeTab === 'shipping' && <ShippingSettings />}
          {activeTab === 'payment' && <PaymentSettings />}
          {activeTab === 'news' && <NewsSettings />}
        </div>
      </div>
    </div>
  );
}