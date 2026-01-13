
import { Campaign, CampaignStatus, MediaChannel, Invoice } from './types';

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'CAM-001',
    name: 'Summer Refresh 2024',
    advertiser: 'AquaPure Beverages',
    budget: 50000,
    spent: 42500,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: CampaignStatus.ACTIVE,
    channels: [MediaChannel.TV, MediaChannel.DIGITAL],
    metrics: { impressions: 1200000, clicks: 45000, reach: 850000 }
  },
  {
    id: 'CAM-002',
    name: 'TechLaunch Q3',
    advertiser: 'CyberCore Systems',
    budget: 120000,
    spent: 120000,
    startDate: '2024-07-15',
    endDate: '2024-09-15',
    status: CampaignStatus.COMPLETED,
    channels: [MediaChannel.SOCIAL, MediaChannel.DIGITAL, MediaChannel.RADIO],
    metrics: { impressions: 3500000, clicks: 120000, reach: 2100000 }
  },
  {
    id: 'CAM-003',
    name: 'AutoDrive Luxury',
    advertiser: 'Prestige Motors',
    budget: 250000,
    spent: 10000,
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    status: CampaignStatus.DRAFT,
    channels: [MediaChannel.TV, MediaChannel.PRINT],
    metrics: { impressions: 0, clicks: 0, reach: 0 }
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-1029',
    campaignId: 'CAM-002',
    campaignName: 'TechLaunch Q3',
    advertiser: 'CyberCore Systems',
    amount: 120000,
    date: '2024-09-20',
    status: 'Paid'
  },
  {
    id: 'INV-1030',
    campaignId: 'CAM-001',
    campaignName: 'Summer Refresh 2024',
    advertiser: 'AquaPure Beverages',
    amount: 15000,
    date: '2024-08-01',
    status: 'Unpaid'
  }
];
