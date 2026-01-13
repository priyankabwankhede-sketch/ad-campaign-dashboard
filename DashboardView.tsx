
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Target, Activity } from 'lucide-react';
import { Campaign, Invoice, CampaignStatus } from '../types';

interface DashboardViewProps {
  campaigns: Campaign[];
  invoices: Invoice[];
}

const StatCard = ({ title, value, trend, icon: Icon, color, path }: any) => {
  // Extracting the color name (e.g., 'blue' from 'bg-blue-500') for text styling
  const colorName = color.split('-')[1];
  
  return (
    <Link 
      to={path} 
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-${colorName}-600 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      </div>
      <h3 className="text-slate-500 text-sm font-medium group-hover:text-slate-700 transition-colors">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </Link>
  );
};

const DashboardView: React.FC<DashboardViewProps> = ({ campaigns, invoices }) => {
  const stats = useMemo(() => {
    const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0);
    const activeCampaigns = campaigns.filter(c => c.status === CampaignStatus.ACTIVE).length;
    const totalImpressions = campaigns.reduce((acc, c) => acc + c.metrics.impressions, 0);
    const pendingRevenue = invoices.filter(i => i.status !== 'Paid').reduce((acc, i) => acc + i.amount, 0);

    return [
      { 
        title: 'Total Booked Budget', 
        value: `$${(totalBudget / 1000).toFixed(1)}k`, 
        trend: 12.5, 
        icon: DollarSign, 
        color: 'bg-blue-500',
        path: '/campaigns'
      },
      { 
        title: 'Active Campaigns', 
        value: activeCampaigns, 
        trend: 8.2, 
        icon: Activity, 
        color: 'bg-indigo-500',
        path: '/campaigns'
      },
      { 
        title: 'Gross Reach', 
        value: `${(totalImpressions / 1000000).toFixed(1)}M`, 
        trend: 15.1, 
        icon: Target, 
        color: 'bg-purple-500',
        path: '/campaigns'
      },
      { 
        title: 'Pending Revenue', 
        value: `$${(pendingRevenue / 1000).toFixed(1)}k`, 
        trend: -2.4, 
        icon: TrendingUp, 
        color: 'bg-emerald-500',
        path: '/invoices'
      },
    ];
  }, [campaigns, invoices]);

  const chartData = useMemo(() => {
    return campaigns.map(c => ({
      name: c.name.split(' ')[0],
      budget: c.budget,
      spent: c.spent
    }));
  }, [campaigns]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolio Overview</h1>
          <p className="text-slate-500 mt-1">Real-time performance of all advertising segments</p>
        </div>
        <div className="flex gap-2">
          {/* Share View button removed as requested */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Budget Allocation vs. Actual Delivery</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                  tickFormatter={(val) => `$${val/1000}k`} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="budget" name="Budgeted" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
                <Bar dataKey="spent" name="Spent" fill="#94a3b8" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Channel Distribution</h3>
          <div className="space-y-7 mt-6">
            {[
              { label: 'TV Broadline', percentage: 45, color: 'bg-blue-500' },
              { label: 'Digital Display', percentage: 30, color: 'bg-emerald-500' },
              { label: 'Social Video', percentage: 15, color: 'bg-purple-500' },
              { label: 'Print/Outdoor', percentage: 10, color: 'bg-amber-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-700">{item.label}</span>
                  <span className="text-slate-500 font-medium">{item.percentage}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-5 bg-blue-50 rounded-xl border border-blue-100 shadow-inner">
            <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              AI Recommendation
            </p>
            <p className="text-sm text-blue-900 leading-relaxed italic">
              "Inventory for Digital Video is tight for Q4. Shift $12k budget to Connected TV for better ROI."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
