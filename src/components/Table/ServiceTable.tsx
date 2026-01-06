import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, AlertCircle, RefreshCw, Server, Activity, ArrowUpDown, ArrowUp, ArrowDown, CheckCircle, AlertTriangle } from 'lucide-react';
import type { ServiceData } from '../../types/index';
import './Table.css';

interface ServiceTableProps {
  data?: ServiceData[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  filterStatus?: string | null;
  onFilterChange?: (filter: string | null) => void;
}

// extracted logic for clarity
const RegionTable = ({ data, onNavigateToIssues }: { data: ServiceData[], onNavigateToIssues: () => void }) => {
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'count' | 'active' | 'issues'; direction: 'asc' | 'desc' } | null>(null);

  const regions = useMemo(() => {
    const regionMap = new Map<string, { count: number; active: number; issues: number; maintenance: number }>();
    data.forEach(item => {
      const current = regionMap.get(item.region) || { count: 0, active: 0, issues: 0, maintenance: 0 };
      current.count++;
      if (item.status === 'active') current.active++;
      if (['offline', 'degraded'].includes(item.status)) current.issues++;
      if (item.status === 'maintenance') current.maintenance++;
      regionMap.set(item.region, current);
    });
    let result = Array.from(regionMap.entries()).map(([name, stats]) => ({ name, ...stats }));

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        // Calculate health percentage for sorting 'active' (health)
        const valA = sortConfig.key === 'active' ? (a.active / a.count) : a[sortConfig.key];
        const valB = sortConfig.key === 'active' ? (b.active / b.count) : b[sortConfig.key];
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, sortConfig]);

  const handleSort = (key: 'name' | 'count' | 'active') => {
    setSortConfig((current) => {
      if (!current || current.key !== key) return { key, direction: 'asc' };
      if (current.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });
  };

  const SortIcon = ({ columnKey }: { columnKey: 'name' | 'count' | 'active' }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  return (
    <div className="table-wrapper">
      <div className="table-header">
         <div className="table-title">
          <h2>Global Coverage</h2>
          <p>Data Center Regional Performance</p>
        </div>
      </div>
      <div className="table-container">
        <table className="service-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  Region Name <SortIcon columnKey="name" />
                </div>
              </th>
              <th onClick={() => handleSort('count')} className="sortable-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  Total Services <SortIcon columnKey="count" />
                </div>
              </th>
              <th>Status Breakdown</th>
              <th onClick={() => handleSort('active')} className="sortable-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  Health <SortIcon columnKey="active" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {regions.map(r => (
              <tr key={r.name}>
                <td style={{ fontWeight: 500 }}>{r.name}</td>
                <td>{r.count} Service{r.count !== 1 ? 's' : ''}</td>
                <td>
                   <div className="region-status-cell">
                     <span className="region-active-tag">
                       {r.issues === 0 && r.maintenance === 0 && <CheckCircle size={14} />}
                       {r.active} Active
                     </span>
                     {r.maintenance > 0 && (
                       <span className="region-maintenance-tag">
                         <AlertCircle size={14} />
                         {r.maintenance} Maint.
                       </span>
                     )}
                     {r.issues > 0 && (
                       <button className="region-issue-btn" onClick={onNavigateToIssues}>
                         <AlertTriangle size={14} />
                         {r.issues} Issue{r.issues !== 1 ? 's' : ''}
                       </button>
                     )}
                   </div>
                </td>
                <td>
                  <div className="health-bar-container">
                    <div className="health-track">
                      <div 
                        className="health-fill"
                        style={{ 
                          width: `${(r.active / r.count) * 100}%`, 
                          background: r.issues > 0 ? 'var(--warning)' : (r.maintenance > 0 ? 'var(--warning)' : 'var(--success)') 
                        }} 
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{Math.round((r.active / r.count) * 100)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ServiceTable = ({ data = [], isLoading, isError, onRetry, filterStatus, onFilterChange }: ServiceTableProps) => {
  // If global coverage is selected, show RegionTable
  if (filterStatus === 'region' && !isLoading && !isError) {
    return <RegionTable data={data} onNavigateToIssues={() => onFilterChange && onFilterChange('issue')} />;
  }

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ServiceData; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: keyof ServiceData) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const filteredData = useMemo(() => {
    if (!data) return [];
    let result = data;

    // Filter by card selection
    if (filterStatus) {
      if (filterStatus === 'issue') {
        result = result.filter(item => ['offline', 'degraded'].includes(item.status));
      } else if (filterStatus === 'active') {
        result = result.filter(item => item.status === 'active');
      }
      // 'total' (null) shows all
    }

    // Filter by search
    result = result.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase()) ||
      item.region.toLowerCase().includes(search.toLowerCase())
    );

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, search, sortConfig, filterStatus]); // Added filterStatus to dependencies

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  // Reset page logic
  useMemo(() => {
    setPage(1);
  }, [search, pageSize, filterStatus]);

  const SortIcon = ({ columnKey }: { columnKey: keyof ServiceData }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  if (isError) {
    return (
      <div className="error-state">
        <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <h3>Failed to load services</h3>
        <p style={{ marginBottom: '1.5rem', opacity: 0.7 }}>We couldn't fetch the latest operational data.</p>
        <button className="btn-page" onClick={onRetry}>
          <RefreshCw size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <div className="table-header">
        <div className="table-title">
          <h2>System Status</h2>
          <p>Real-time operational metrics across regions</p>
        </div>
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search services..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="service-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th onClick={() => handleSort('status')} className="sortable-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  Status <SortIcon columnKey="status" />
                </div>
              </th>
              <th onClick={() => handleSort('type')} className="sortable-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                   Type <SortIcon columnKey="type" />
                </div>
              </th>
              <th onClick={() => handleSort('region')} className="sortable-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                   Region <SortIcon columnKey="region" />
                </div>
              </th>
              <th>Uptime</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6}>
                    <div style={{ height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '100%' }} />
                  </td>
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((service) => (
                <tr key={service.id}>
                  <td style={{ fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Server size={16} style={{ opacity: 0.5 }} />
                      {service.name}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${service.status}`}>
                      <span className="status-dot" />
                      {service.status}
                    </span>
                  </td>
                  <td>{service.type}</td>
                  <td>{service.region}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={14} style={{ color: service.uptime > 99 ? 'var(--success)' : 'var(--warning)' }} />
                      {service.uptime.toFixed(2)}%
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {new Date(service.lastUpdated).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <p>No services found matching "{search}"</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && paginatedData.length > 0 && (
        <div className="pagination">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>
              Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredData.length)} of {filteredData.length}
            </span>
            <select 
              className="page-size-select"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={5}>Show 5</option>
              <option value={10}>Show 10</option>
              <option value={20}>Show 20</option>
              <option value={50}>Show 50</option>
            </select>
          </div>
          
          <div className="pagination-controls">
            <button
              className="btn-page"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ margin: '0 0.5rem' }}>Page {page} of {totalPages}</span>
            <button
              className="btn-page"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
