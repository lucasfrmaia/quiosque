'use client'

import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUtensils, FaMoneyBillWave, FaFileInvoice } from 'react-icons/fa';

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, text, href, isActive }) => (
  <li className="w-full">
    <Link 
      href={href}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
        ${isActive 
          ? 'bg-gray-100 text-black' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-black'
        }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{text}</span>
    </Link>
  </li>
);

const Sidebar: FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: <FaHome />, text: 'Home', href: '/' },
    { icon: <FaUtensils />, text: 'Cardápio', href: '/cardapio' },
    { icon: <FaMoneyBillWave />, text: 'Gastos Diários', href: '/gastos' },
    { icon: <FaFileInvoice />, text: 'Notas Fiscais', href: '/notas' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h1 className="text-xl font-bold text-black">Kiosque</h1>
        </div>
        <nav className="flex-1 px-2">
          <ul className="space-y-1">
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
      </div>
    </aside>
  );
};

export default Sidebar;
