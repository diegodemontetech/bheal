import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { 
  LayoutGrid, 
  Users, 
  Calendar, 
  BarChart2,
  Settings,
  Package,
  FileText,
  UserPlus,
  ChevronLeft,
  ShoppingCart
} from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { canApproveClientRegistration } = usePermissions();

  const pipelines = [
    { id: 'hunting', name: 'Hunting', icon: 'mdi:target' },
    { id: 'carteira', name: 'Carteira', icon: 'mdi:briefcase' },
    { id: 'positivacao', name: 'Positivação', icon: 'mdi:account-check' },
    { id: 'resgate', name: 'Resgate de Lead', icon: 'mdi:account-convert' },
    { id: 'lixeira', name: 'Lixeira Cliente', icon: 'mdi:delete' }
  ];

  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#1a1f36] text-white transition-all duration-300 ease-in-out z-30
        ${isOpen ? 'w-64' : 'w-16'}`}
    >
      <div className="relative h-full">
        <div className="flex justify-end px-2 py-3 border-b border-white/10">
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title={isOpen ? "Recolher menu" : "Expandir menu"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <div className="h-[calc(100%-3.5rem)] overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 p-2">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`
                }
              >
                <LayoutGrid className="w-4 h-4" />
                {isOpen && <span className="ml-3 text-xs font-bold font-poppins">Dashboard</span>}
              </NavLink>
            </li>
            
            <li className="pt-4">
              {isOpen && (
                <div className="px-3 py-2 text-xs font-semibold text-white/60 font-poppins">
                  PIPELINES
                </div>
              )}
              {pipelines.map((pipeline) => (
                <NavLink
                  key={pipeline.id}
                  to={`/pipeline/${pipeline.id}`}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-white/10' : 'hover:bg-white/5'
                    }`
                  }
                >
                  <Icon icon={pipeline.icon} className="w-4 h-4" />
                  {isOpen && <span className="ml-3 text-xs font-bold font-poppins">{pipeline.name}</span>}
                </NavLink>
              ))}
            </li>

            <li className="pt-4">
              {isOpen && (
                <div className="px-3 py-2 text-xs font-semibold text-white/60 font-poppins">
                  VENDAS
                </div>
              )}
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`
                }
              >
                <Package className="w-4 h-4" />
                {isOpen && <span className="ml-3 text-xs font-bold font-poppins">Produtos</span>}
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`
                }
              >
                <ShoppingCart className="w-4 h-4" />
                {isOpen && <span className="ml-3 text-xs font-bold font-poppins">Carrinho</span>}
              </NavLink>
              <NavLink
                to="/quotes"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`
                }
              >
                <FileText className="w-4 h-4" />
                {isOpen && <span className="ml-3 text-xs font-bold font-poppins">Orçamentos</span>}
              </NavLink>
            </li>

            <li className="pt-4">
              {isOpen && (
                <div className="px-3 py-2 text-xs font-semibold text-white/60 font-poppins">
                  GERAL
                </div>
              )}
              <NavLink
                to="/contacts"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`
                }
              >
                <Users className="w-4 h-4" />
                {isOpen && <span className="ml-3 text-xs font-bold font-poppins">Contatos</span>}
              </NavLink>
              <NavLink
                to="/calendar"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`
                }
              >
                <Calendar className="w-4 h-4" />
                {isOpen && <span className="ml-3 text-xs font-bold font-poppins">Calendário</span>}
              </NavLink>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`
                }
              >
                <BarChart2 className="w-4 h-4" />
                {isOpen && <span className="ml-3 text-xs font-bold font-poppins">Relatórios</span>}
              </NavLink>
              {canApproveClientRegistration && (
                <NavLink
                  to="/client-registration"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-white/10' : 'hover:bg-white/5'
                    }`
                  }
                >
                  <UserPlus className="w-4 h-4" />
                  {isOpen && <span className="ml-3 text-xs font-bold font-poppins">Aprovar Cadastros</span>}
                </NavLink>
              )}
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`
                }
              >
                <Settings className="w-4 h-4" />
                {isOpen && <span className="ml-3 text-xs font-bold font-poppins">Configurações</span>}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}