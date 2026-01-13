
export enum CampaignStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending Approval',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  INVOICED = 'Invoiced'
}

export enum MediaChannel {
  TV = 'TV',
  DIGITAL = 'Digital',
  PRINT = 'Print',
  RADIO = 'Radio',
  SOCIAL = 'Social'
}

export interface Campaign {
  id: string;
  name: string;
  advertiser: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  channels: MediaChannel[];
  metrics: {
    impressions: number;
    clicks: number;
    reach: number;
  };
}

export interface Invoice {
  id: string;
  campaignId: string;
  campaignName: string;
  advertiser: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface StatItem {
  label: string;
  value: string | number;
  trend: number;
  icon: string;
}
