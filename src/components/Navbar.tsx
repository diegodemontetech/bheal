import React from 'react';
import { Bell, Settings, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  return (
    <nav className="h-16 bg-white border-b border-gray-200 fixed w-full top-0 z-40">
      <div className="h-full px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
          >
            <Menu className="h-6 w-6 text-gray-500" />
          </button>
          <img
            className="h-8 w-auto ml-2 md:ml-0"
            src="https://boneheal.com.br/wp-content/uploads/2023/12/logo-horizontal.png"
            alt="Boneheal"
          />
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 rounded-full hover:bg-gray-100 hidden md:block"
          >
            <Settings className="h-5 w-5 text-gray-500" />
          </button>
          <button 
            onClick={signOut}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2 hidden md:block">{user?.name}</span>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-600">
                {user?.name?.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}