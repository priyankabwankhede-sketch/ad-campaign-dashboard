
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  FileText, 
  Settings, 
  Bell, 
  User, 
  Search,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Info,
  LogOut,
  UserCircle,
  ShieldCheck,
  ChevronRight,
  Menu
} from 'lucide-react';
import DashboardView from './DashboardView';
import CampaignBooking from './CampaignBooking';
import CampaignList from './CampaignList';
import InvoiceList from './InvoiceList';
import AIConsultant from './AIConsultant';
import { INITIAL_CAMPAIGNS, INITIAL_INVOICES } from './constants';
import { Campaign, Invoice, CampaignStatus } from './types';

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: PlusCircle, label: 'Sales Booking', path: '/booking' },
    { icon: BarChart3, label: 'Active Campaigns', path: '/campaigns' },
    { icon: FileText, label: 'Billing & Invoices', path: '/invoices' },
    { icon: Zap, label: 'AI Planner', path: '/ai' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      window.location.reload();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 lg:sticky lg:translate-x-0 transition-transform duration-300 ease-in-out transform flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">A</div>
            <span>AdFlow</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100 relative" ref={settingsRef}>
          {showSettings && (
            <div className="absolute bottom-full left-4 mb-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 animate-in slide-in-from-bottom-2 duration-200 z-50">
              <div className="px-4 py-2 border-b border-slate-50 mb-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configuration</p>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
                <UserCircle size={18} className="text-slate-400" /> My Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
                <ShieldCheck size={18} className="text-slate-400" /> Security Settings
              </button>
              <div className="h-px bg-slate-100 my-1 mx-2"></div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors text-sm font-bold"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl w-full transition-all ${showSettings ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <div className="flex items-center gap-3">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </div>
            <ChevronRight size={16} className={`transition-transform duration-200 ${showSettings ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </aside>
    </>
  );
};

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: 'Campaign Alert', message: 'Summer Refresh 2024 has reached 85% of budget.', time: '10m ago', type: 'warning' },
    { id: 2, title: 'Payment Received', message: 'Invoice #INV-1029 for CyberCore Systems was paid.', time: '1h ago', type: 'success' },
    { id: 3, title: 'New Booking', message: 'Draft campaign "AutoDrive Luxury" is awaiting approval.', time: '3h ago', type: 'info' },
    { id: 4, title: 'Inventory Update', message: 'Q4 TV inventory for Broadline segments is now 90% booked.', time: '5h ago', type: 'warning' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    if (window.confirm("Sign out of AdFlow Alliance?")) {
      window.location.reload();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="lg:hidden flex items-center gap-2 text-blue-600 font-bold text-lg">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white">A</div>
          <span>AdFlow</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-full relative transition-all ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-sm">Campaign Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 h-fit ${
                        n.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                        n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {n.type === 'warning' ? <AlertCircle size={14} /> : 
                         n.type === 'success' ? <CheckCircle2 size={14} /> : 
                         <Info size={14} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-xs font-bold text-slate-900 truncate pr-2">{n.title}</span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{n.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest">
                  View All Activity
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-6 w-px bg-slate-200 mx-1 lg:mx-2"></div>
        
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfile(!showProfile)}
            className={`flex items-center gap-2 lg:gap-3 cursor-pointer group p-1 rounded-xl transition-all ${showProfile ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-tight">Priyanka Wankhede</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sales Executive</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 overflow-hidden ring-2 ring-white shadow-sm transition-all group-hover:scale-105">
              <img src="https://picsum.photos/seed/sarah/100/100" alt="Avatar" />
            </div>
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-4 py-3 border-b border-slate-50 mb-1 flex items-center gap-3">
                 <img src="https://picsum.photos/seed/sarah/100/100" className="w-10 h-10 rounded-full border border-slate-100" />
                 <div>
                    <p className="text-xs font-bold text-slate-900">Priyanka Wankhede</p>
                    <p className="text-[10px] text-slate-400 font-medium">Active Now</p>
                 </div>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
                <User size={18} className="text-slate-400" /> Profile Overview
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
                <Settings size={18} className="text-slate-400" /> Preferences
              </button>
              <div className="h-px bg-slate-100 my-1 mx-2"></div>
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-900 hover:bg-slate-50 transition-colors text-sm font-bold"
              >
                <LogOut size={18} className="text-rose-500" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const addCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
  };

  const deleteCampaign = (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  const updateCampaignStatus = (id: string, status: CampaignStatus) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    
    if (status === CampaignStatus.COMPLETED) {
      const campaign = campaigns.find(c => c.id === id);
      if (campaign) {
        const newInvoice: Invoice = {
          id: `INV-${Math.floor(Math.random() * 10000)}`,
          campaignId: campaign.id,
          campaignName: campaign.name,
          advertiser: campaign.advertiser,
          amount: campaign.spent,
          date: new Date().toISOString().split('T')[0],
          status: 'Unpaid'
        };
        setInvoices(prev => [newInvoice, ...prev]);
      }
    }
  };

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="p-4 lg:p-8 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<DashboardView campaigns={campaigns} invoices={invoices} />} />
              <Route path="/booking" element={<CampaignBooking onAdd={addCampaign} />} />
              <Route path="/campaigns" element={<CampaignList campaigns={campaigns} onStatusChange={updateCampaignStatus} onDelete={deleteCampaign} />} />
              <Route path="/invoices" element={<InvoiceList invoices={invoices} />} />
              <Route path="/ai" element={<AIConsultant campaigns={campaigns} />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
