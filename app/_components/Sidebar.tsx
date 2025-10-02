'use client'

import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUtensils, FaMoneyBillWave, FaFileInvoice, FaChartLine, FaSignOutAlt, FaProductHunt, FaBook, FaTruck, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  href: string;
  isActive?: boolean;
  isExpanded: boolean;
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, text, href, isActive, isExpanded }) => (
  <li>
    <Link
      href={href}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out group
        ${isActive
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
          : 'text-gray-600 hover:bg-gradient-to-r from-gray-100 to-gray-200 hover:text-blue-600'
        } ${!isExpanded ? 'justify-center space-x-0' : ''}`}
    >
      <span className="text-xl">{icon}</span>
      {isExpanded && <span className="font-medium">{text}</span>}
    </Link>
  </li>
);

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isExpanded, onToggle }) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    {
      icon: <FaChartLine size={20} className="text-blue-500" />,
      text: 'Dashboard',
      href: '/'
    },
    {
      icon: <FaProductHunt size={20} className="text-green-500" />,
      text: 'Produtos',
      href: '/produto'
    },
    {
      icon: <FaBook size={20} className="text-purple-500" />,
      text: 'Categorias',
      href: '/categoria'
    },
    {
      icon: <FaTruck size={20} className="text-orange-500" />,
      text: 'Fornecedores',
      href: '/fornecedores'
    },
    {
      icon: <FaUtensils size={20} className="text-indigo-500" />,
      text: 'Estoque',
      href: '/estoque'
    },
    {
      icon: <FaFileInvoice size={20} className="text-yellow-500" />,
      text: 'Notas de Compra',
      href: '/notas-compra'
    },
    {
      icon: <FaMoneyBillWave size={20} className="text-emerald-500" />,
      text: 'Notas de Venda',
      href: '/notas-vendas'
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside className={`h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out z-40 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-xl ${
        isExpanded ? 'w-64' : 'w-16'
      }`}>
        <div className={`flex flex-col h-full transition-all duration-300 ${
          isExpanded ? 'p-6' : 'p-2'
        }`}>
          {/* Header with Toggle Button on Right */}
          <div className={`flex items-center justify-between border-b border-gray-200 pb-4 mb-4 ${isExpanded ? 'p-2' : 'p-1'}`}>
            {isExpanded && (
              <>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 mb-1">Kiosque</h1>
                  <p className="text-sm text-gray-500">Sistema de Gestão</p>
                </div>
              </>
            )}
            <button
              onClick={onToggle}
              className="p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50"
              aria-label={isExpanded ? 'Minimizar sidebar' : 'Expandir sidebar'}
            >
              {isExpanded ? <FaTimes size={16} className="text-gray-600" /> : <FaBars size={16} className="text-gray-600" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 ${isExpanded ? 'p-4' : 'p-2'}`}>
            <ul className={`space-y-${isExpanded ? '2' : '1'}`}>
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  icon={item.icon}
                  text={item.text}
                  href={item.href}
                  isActive={pathname === item.href}
                  isExpanded={isExpanded}
                />
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className={`${isExpanded ? 'p-4' : 'p-2'} border-t border-gray-200`}>
            <button
              onClick={logout}
              className={`flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 ${
                !isExpanded ? 'justify-center space-x-0' : ''
              }`}
            >
              <FaSignOutAlt size={20} />
              {isExpanded && <span className="font-medium">Sair</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
