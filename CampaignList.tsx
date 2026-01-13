
import React from 'react';
import { MoreVertical, CheckCircle, Clock, Pause, FileSpreadsheet, Eye, Trash2 } from 'lucide-react';
import { Campaign, CampaignStatus } from './types';

interface CampaignListProps {
  campaigns: Campaign[];
  onStatusChange: (id: string, status: CampaignStatus) => void;
  onDelete: (id: string) => void;
}

const CampaignList: React.FC<CampaignListProps> = ({ campaigns, onStatusChange, onDelete }) => {
  const getStatusStyle = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE: return 'bg-blue-100 text-blue-700';
      case CampaignStatus.COMPLETED: return 'bg-emerald-100 text-emerald-700';
      case CampaignStatus.DRAFT: return 'bg-slate-100 text-slate-700';
      case CampaignStatus.PENDING: return 'bg-amber-100 text-amber-700';
      case CampaignStatus.INVOICED: return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Campaign Management</h1>
          <p className="text-sm text-slate-500 mt-1">Track delivery and manage inventory lifecycle</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Campaign & Advertiser</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Budget / Spent</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{campaign.name}</div>
                    <div className="text-sm text-slate-500">{campaign.advertiser}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">${campaign.budget.toLocaleString()}</div>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-600">{campaign.startDate}</div>
                    <div className="text-xs text-slate-400">to {campaign.endDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-xs font-bold text-slate-900">{(campaign.metrics.impressions / 1000).toFixed(0)}k</div>
                        <div className="text-[10px] text-slate-400 uppercase">Impr.</div>
                      </div>
                      <div className="text-center border-l border-slate-100 pl-4">
                        <div className="text-xs font-bold text-slate-900">{(campaign.metrics.reach / 1000).toFixed(0)}k</div>
                        <div className="text-[10px] text-slate-400 uppercase">Reach</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onStatusChange(campaign.id, CampaignStatus.ACTIVE)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Activate"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        onClick={() => onStatusChange(campaign.id, CampaignStatus.COMPLETED)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        title="Mark Complete"
                      >
                        <Clock size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(campaign.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Delete Campaign"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {campaigns.length === 0 && (
          <div className="p-12 text-center text-slate-500 italic">
            No campaigns found. Start by booking a new campaign.
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignList;
