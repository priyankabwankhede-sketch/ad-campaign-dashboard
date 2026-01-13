
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Building2, Tag, CreditCard, ChevronRight, Sparkles, PlusCircle, DollarSign, Loader2, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { Campaign, CampaignStatus, MediaChannel } from './types';
import { getCampaignAdvice } from './geminiService';

interface CampaignBookingProps {
  onAdd: (campaign: Campaign) => void;
}

const CampaignBooking: React.FC<CampaignBookingProps> = ({ onAdd }) => {
  const navigate = useNavigate();
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const [showAnalysisSuccess, setShowAnalysisSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    advertiser: '',
    budget: '',
    startDate: '',
    endDate: '',
    channels: [] as MediaChannel[]
  });

  const toggleChannel = (channel: MediaChannel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel) 
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleGetAIAssistance = async () => {
    if (!formData.name || !formData.budget || formData.channels.length === 0) {
      alert("Please fill in campaign name, budget, and select at least one channel for analysis.");
      return;
    }
    
    setLoadingAdvice(true);
    setAdvice(null);
    setShowAnalysisSuccess(false);

    try {
      const res = await getCampaignAdvice(formData);
      setAdvice(res);
      setShowAnalysisSuccess(true);
      setTimeout(() => setShowAnalysisSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: Campaign = {
      id: `CAM-${Math.floor(Math.random() * 1000)}`,
      name: formData.name,
      advertiser: formData.advertiser,
      budget: parseFloat(formData.budget),
      spent: 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: CampaignStatus.DRAFT,
      channels: formData.channels,
      metrics: { impressions: 0, clicks: 0, reach: 0 }
    };
    onAdd(newCampaign);
    navigate('/campaigns');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shadow-sm">
          <PlusCircle size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Sales Booking</h1>
          <p className="text-slate-500">Create a new insertion order across TV, Digital and Print</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 mb-1.5 block">Campaign Name</span>
              <div className="relative group">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Summer Refresh 2024"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700 mb-1.5 block">Advertiser</span>
              <div className="relative group">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  required
                  type="text" 
                  value={formData.advertiser}
                  onChange={e => setFormData({...formData, advertiser: e.target.value})}
                  placeholder="Brand or Agency name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">Total Budget (Gross)</span>
                <div className="relative group">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    required
                    type="number" 
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: e.target.value})}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-bold"
                  />
                </div>
              </label>
              <div className="block md:pt-8">
                <div className="flex items-center gap-2 h-12 px-4 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-700 text-sm italic font-semibold">
                  <Sparkles size={14} className="text-blue-400" />
                  Suggested CPM: $12.40
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">Start Date</span>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    required
                    type="date" 
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">End Date</span>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    required
                    type="date" 
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
                  />
                </div>
              </label>
            </div>

            <div>
              <span className="text-sm font-semibold text-slate-700 mb-3 block">Media Channels</span>
              <div className="flex flex-wrap gap-2">
                {Object.values(MediaChannel).map(channel => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => toggleChannel(channel)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      formData.channels.includes(channel)
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex gap-4">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95"
            >
              Confirm Booking <ChevronRight size={18} />
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-800 p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                  <BrainCircuit size={24} className="text-blue-200" />
                </div>
                <h3 className="font-bold text-xl tracking-tight">AI Consultant</h3>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed mb-8">
                Let Gemini 3 Pro analyze your parameters to suggest the optimal media mix and reach potential.
              </p>
              <button 
                onClick={handleGetAIAssistance}
                disabled={loadingAdvice}
                className="w-full bg-white text-blue-800 font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg active:scale-[0.98]"
              >
                {loadingAdvice ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Analyzing Parameters...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analyze Media Mix
                  </>
                )}
              </button>
            </div>
          </div>

          {showAnalysisSuccess && (
             <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={18} />
                <span className="text-sm font-bold">Analysis Complete!</span>
             </div>
          )}

          {advice && (
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-500 ring-2 ring-blue-500/20">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-lg">Optimization Tips</h4>
                  <p className="text-xs text-slate-500 font-medium">Strategic Recommendations</p>
                </div>
                <div className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter">
                  Boost: {advice.estimatedReachBoost}
                </div>
              </div>
              <ul className="space-y-4">
                {advice.advice.map((item: string, i: number) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-700 leading-relaxed group">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0 group-hover:scale-125 transition-transform shadow-sm" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-slate-100 italic text-[11px] text-slate-400">
                Analysis based on current regional inventory levels and historical ROI data.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignBooking;
