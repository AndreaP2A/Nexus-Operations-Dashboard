import type { ServiceData } from '../types/index';

export const MOCK_DATA: ServiceData[] = [
  { id: '1', name: 'Auth Service', type: 'Authentication', status: 'active', uptime: 99.99, lastUpdated: '2026-01-06T10:00:00Z', region: 'US-East' },
  { id: '2', name: 'Payment Gateway', type: 'Transactions', status: 'active', uptime: 99.95, lastUpdated: '2026-01-06T09:45:00Z', region: 'US-West' },
  { id: '3', name: 'Analytics Engine', type: 'Data Processing', status: 'degraded', uptime: 98.50, lastUpdated: '2026-01-06T11:20:00Z', region: 'EU-Central' },
  { id: '4', name: 'File Storage', type: 'Storage', status: 'maintenance', uptime: 100.00, lastUpdated: '2026-01-06T12:00:00Z', region: 'US-East' },
  { id: '5', name: 'Notification Service', type: 'Messaging', status: 'active', uptime: 99.90, lastUpdated: '2026-01-06T10:15:00Z', region: 'Asia-Pacific' },
  { id: '6', name: 'User Profile DB', type: 'Database', status: 'active', uptime: 99.99, lastUpdated: '2026-01-06T09:30:00Z', region: 'US-East' },
  { id: '7', name: 'Search Index', type: 'Search', status: 'offline', uptime: 95.00, lastUpdated: '2026-01-06T08:00:00Z', region: 'EU-West' },
  { id: '8', name: 'CDN Facade', type: 'Content Delivery', status: 'active', uptime: 99.99, lastUpdated: '2026-01-06T10:05:00Z', region: 'Global' },
  { id: '9', name: 'Invoice Generator', type: 'Billing', status: 'active', uptime: 99.98, lastUpdated: '2026-01-06T11:00:00Z', region: 'US-West' },
  { id: '10', name: 'Email Dispatcher', type: 'Messaging', status: 'degraded', uptime: 97.20, lastUpdated: '2026-01-06T10:45:00Z', region: 'Asia-South' },
  { id: '11', name: 'Log Aggregator', type: 'Logging', status: 'active', uptime: 99.95, lastUpdated: '2026-01-06T09:00:00Z', region: 'US-East' },
  { id: '12', name: 'Recommendation AI', type: 'ML', status: 'maintenance', uptime: 98.00, lastUpdated: '2026-01-06T12:30:00Z', region: 'EU-Central' },
  { id: '13', name: 'Order Processing', type: 'Transactions', status: 'active', uptime: 99.99, lastUpdated: '2026-01-06T10:10:00Z', region: 'US-East' },
  { id: '14', name: 'Inventory Sync', type: 'Inventory', status: 'active', uptime: 99.92, lastUpdated: '2026-01-06T11:15:00Z', region: 'US-West' },
  { id: '15', name: 'Chat Service', type: 'Realtime', status: 'offline', uptime: 89.50, lastUpdated: '2026-01-06T07:45:00Z', region: 'SA-East' },
];

export const fetchServices = async (shouldFail = false): Promise<ServiceData[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Failed to fetch service status. Please try again later.'));
      } else {
        resolve(MOCK_DATA);
      }
    }, 1000); // Simulate network delay
  });
};
