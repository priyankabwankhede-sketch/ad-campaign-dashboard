
import React, { useState } from 'react';
import { Download, ExternalLink, Filter, Mail, X, FileText, CheckCircle2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Invoice } from './types';

interface InvoiceListProps {
  invoices: Invoice[];
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  const exportAllInvoices = () => {
    const headers = ['Invoice ID', 'Campaign', 'Advertiser', 'Amount', 'Due Date', 'Status'];
    const rows = invoices.map(inv => [
      inv.id,
      inv.campaignName,
      inv.advertiser,
      inv.amount,
      inv.date,
      inv.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "all_invoices_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSingleInvoice = (invoice: Invoice) => {
    const doc = new jsPDF();
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("AdFlow Alliance", 20, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Global Advertising Sales & Clearing House", 20, 32);
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 140, 65);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice Number: #${invoice.id}`, 140, 75);
    doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 140, 80);
    doc.text(`Due Date: ${invoice.date}`, 140, 85);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 20, 65);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(invoice.advertiser, 20, 73);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Premium Media Partner", 20, 78);
    doc.text("Advertiser Account #88219", 20, 83);
    doc.setFillColor(241, 245, 249);
    doc.rect(20, 100, 170, 10, 'F');
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "bold");
    doc.text("Description", 25, 106.5);
    doc.text("Amount (USD)", 150, 106.5);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "normal");
    doc.text(`Campaign: ${invoice.campaignName}`, 25, 120);
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Full delivery of media units across authorized channels.`, 25, 126);
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(`$${invoice.amount.toLocaleString()}.00`, 150, 120);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, 140, 190, 140);
    doc.setFont("helvetica", "bold");
    doc.text("SUBTOTAL:", 110, 150);
    doc.text(`$${invoice.amount.toLocaleString()}.00`, 150, 150);
    doc.text("TAX (0.00%):", 110, 157);
    doc.text("$0.00", 150, 157);
    doc.setFillColor(239, 246, 255);
    doc.rect(105, 165, 85, 15, 'F');
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text("TOTAL DUE:", 110, 174);
    doc.text(`$${invoice.amount.toLocaleString()}.00`, 150, 174);
    if (invoice.status === 'Paid') {
      doc.setDrawColor(16, 185, 129);
      doc.setTextColor(16, 185, 129);
      doc.setLineWidth(1.5);
      doc.rect(25, 160, 45, 18);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("PAID", 37, 172);
      doc.setFontSize(8);
      doc.text("TXN #822190-ADF", 31, 183);
    }
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Terms & Conditions", 20, 240);
    doc.setFont("helvetica", "normal");
    doc.text("Please remit payment within 30 days of invoice date.", 20, 246);
    doc.text("Late payments are subject to a 1.5% monthly finance charge.", 20, 251);
    doc.line(20, 265, 190, 265);
    doc.text("AdFlow Alliance | 100 Media Plaza, Tech City | www.adflow.io", 105, 275, { align: 'center' });
    doc.save(`Invoice_${invoice.id}.pdf`);
  };

  const mailInvoice = (invoice: Invoice) => {
    const subject = encodeURIComponent(`Invoice #${invoice.id} - ${invoice.campaignName}`);
    const body = encodeURIComponent(`Hello,\n\nPlease find the details for invoice #${invoice.id} for the campaign "${invoice.campaignName}".\n\nAmount: $${invoice.amount}\nStatus: ${invoice.status}\n\nBest regards,\nAdFlow Team`);
    window.location.href = `mailto:abc@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Billing & Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Manage client payments and automated clearing</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button 
            onClick={exportAllInvoices}
            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            Export Invoices
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Outstanding', value: '$45,200.00', color: 'text-slate-900' },
          { label: 'Paid this month', value: '$120,000.00', color: 'text-slate-900' },
          { label: 'Overdue', value: '$4,500.00', color: 'text-red-600' },
          { label: 'Clearing Time', value: '1.2 Days', color: 'text-slate-900' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 lg:p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-xl lg:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Advertiser</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm text-blue-600">#{invoice.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{invoice.campaignName}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{invoice.advertiser}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">${invoice.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{invoice.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 sm:gap-2 lg:opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => downloadSingleInvoice(invoice)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Download Invoice PDF"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={() => mailInvoice(invoice)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Mail to abc@gmail.com"
                      >
                        <Mail size={18} />
                      </button>
                      <button 
                        onClick={() => setPreviewInvoice(invoice)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Preview Invoice"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {previewInvoice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <FileText size={20} />
                </div>
                <h2 className="font-bold text-slate-900 text-lg">Invoice Preview</h2>
              </div>
              <button 
                onClick={() => setPreviewInvoice(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice ID</p>
                  <p className="font-mono text-xl text-blue-600 font-bold">#{previewInvoice.id}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter ${
                  previewInvoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {previewInvoice.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:gap-8 py-6 border-y border-slate-50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Campaign</p>
                  <p className="font-bold text-slate-800 text-sm">{previewInvoice.campaignName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Advertiser</p>
                  <p className="font-medium text-slate-600 text-sm">{previewInvoice.advertiser}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                  <p className="font-medium text-slate-600 text-sm">{previewInvoice.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Currency</p>
                  <p className="font-medium text-slate-600 text-sm">USD ($)</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 sm:p-6 rounded-xl flex justify-between items-center">
                <p className="text-slate-500 font-semibold text-sm">Total Amount Due</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">${previewInvoice.amount.toLocaleString()}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => { downloadSingleInvoice(previewInvoice); setPreviewInvoice(null); }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download size={18} /> Download PDF
                </button>
                <button 
                  onClick={() => setPreviewInvoice(null)}
                  className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50/50 p-4 text-center border-t border-slate-100">
               <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                 <CheckCircle2 size={12} className="text-blue-500" />
                 Verified by AdFlow Automated Clearing
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
