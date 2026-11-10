import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AlertContext } from '../layouts/PharmacistLayout';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Pill, 
  Users, 
  Archive, 
  Search, 
  Bell, 
  BarChart2, 
  Settings, 
  LogOut, 
  Package, 
  PlusCircle, 
  Layers, 
  MessageSquare, 
  Zap 
} from 'lucide-react';

const PharmacistSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate();
  const { unreadAlerts, unreadMessages, pendingRxCount } = useContext(AlertContext);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/pharmacist/dashboard',        name: 'Dashboard',         icon: LayoutDashboard },
    { path: '/pharmacist/prescriptions',    name: 'Prescriptions',     icon: FileText, badge: pendingRxCount > 0 ? pendingRxCount.toString() : null },
    { path: '/pharmacist/orders',           name: 'Orders',            icon: Package },
    { path: '/pharmacist/dispensing',       name: 'Dispensing',        icon: Pill },
    { path: '/pharmacist/drug-interaction', name: 'Drug Interaction',  icon: Zap },
    { path: '/pharmacist/patients',         name: 'Patients',          icon: Users },
    { path: '/pharmacist/inventory',        name: 'Inventory',         icon: Archive },
    { path: '/pharmacist/lookup',           name: 'Drug Lookup',       icon: Search },
    { path: '/pharmacist/notifications',    name: 'Notifications',     icon: Bell, dot: unreadAlerts > 0 },
    { path: '/pharmacist/reports',          name: 'Reports',           icon: BarChart2 },
  ];

  const managementItems = [
    { path: '/pharmacist/add-product',   name: 'Add Product',    icon: PlusCircle },
    { path: '/pharmacist/my-products',   name: 'My Products',    icon: Layers },
    { path: '/pharmacist/messages',      name: 'Messages',       icon: MessageSquare, dot: unreadMessages > 0 },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      key={item.name}
      to={item.path}
      className={({ isActive }) =>
        `group flex items-center justify-between px-3 py-2.5 mx-2 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-[#0d4530] text-white font-medium shadow-sm'
            : 'text-[#EBF5EE] hover:bg-[#10573A] hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-md transition-colors duration-200 ${
              isActive ? 'bg-white/15' : 'bg-transparent group-hover:bg-white/10'
            }`}>
              <item.icon className="w-4 h-4" />
            </div>
            <span className="text-sm tracking-wide">{item.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {item.badge && (
              <span className="bg-white text-[#16734B] text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center leading-4">
                {item.badge}
              </span>
            )}
            {item.dot && (
              <span className="w-2 h-2 rounded-full bg-red-400 ring-2 ring-red-400/30" />
            )}
          </div>
        </>
      )}
    </NavLink>
  );

  return (
    <div className={`w-64 bg-[#16734B] text-white flex flex-col h-screen fixed left-0 top-0 z-[200] transition-transform duration-300
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

      {/* Logo top */}
      <div className="h-[70px] flex items-center justify-between px-5 bg-[#10573A] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white shadow-sm flex items-center justify-center border-2 border-white/20">
            <img src="/logo.png" alt="Happy Health" className="w-full h-full object-cover scale-110" />
          </div>
          <span className="text-xl font-black tracking-wide text-white">
            Happy Health
          </span>
        </div>
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">

        {/* Main section */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#EBF5EE]/70 px-5 mb-1.5">
            Main
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-white/10 my-3" />

        {/* Management section */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#EBF5EE]/70 px-5 mb-1.5">
            Management
          </p>
          <nav className="space-y-0.5">
            {managementItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>

      {/* Footer Settings & Logout */}
      <div className="px-5 py-4 border-t border-white/10 shrink-0 mt-auto flex items-center justify-between">
        <NavLink
          to="/pharmacist/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 py-2 px-3 -ml-3 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-[#0d4530] text-white shadow-sm'
                : 'text-[#EBF5EE] hover:bg-[#10573A] hover:text-white'
            }`
          }
          title="Settings"
        >
          <div className="p-1.5 rounded-md bg-white/5">
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-sm tracking-wide">Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-[#EBF5EE] bg-white/5 hover:bg-red-500 hover:text-white transition-all duration-200"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PharmacistSidebar;