'use client'

import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUtensils, FaMoneyBillWave, FaFileInvoice, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, text, href, isActive }) => (
  <li>
    <Link 
      href={href}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
        ${isActive 
          ? 'bg-gray-100 text-black' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-black'
        }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{text}</span>
    </Link>
  </li>
);

const Sidebar: FC = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { 
      icon: <FaChartLine size={20} className="text-blue-600" />, 
      text: 'Dashboard', 
      href: '/' 
    },
    { 
      icon: <FaMoneyBillWave size={20} className="text-red-600" />, 
      text: 'Gastos', 
      href: '/gastos' 
    },
    {
      icon: <FaUtensils size={20} className="text-purple-600" />,
      text: 'Estoque',
      href: '/estoque'
    },
    { 
      icon: <FaFileInvoice size={20} className="text-yellow-600" />, 
      text: 'Notas Fiscais', 
      href: '/notas' 
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-black">Kiosque</h1>
          <p className="text-sm text-gray-600 mt-1">Sistema de Gestão</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                text={item.text}
                href={item.href}
                isActive={pathname === item.href}
              />
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
