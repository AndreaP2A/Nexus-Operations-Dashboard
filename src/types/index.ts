export type ServiceStatus = 'active' | 'maintenance' | 'offline' | 'degraded';

export interface ServiceData {
  id: string;
  name: string;
  type: string;
  status: ServiceStatus;
  uptime: number; // percentage
  lastUpdated: string; // ISO date
  region: string;
}
