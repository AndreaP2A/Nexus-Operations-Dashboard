import { useState } from 'react';
import { useServiceData } from './hooks/useServiceData';
import { ServiceTable } from './components/Table/ServiceTable';
import { RefreshCw, Zap, Server, Activity, Globe } from 'lucide-react';

function App() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [simulateError, setSimulateError] = useState(false);
  const { data, isLoading, isError, refetch, isFetching } = useServiceData(simulateError);

  const handleCardClick = (filter: string | null) => {
    setActiveFilter(filter === activeFilter ? null : filter);
  };

  const handleRetry = () => {
    setSimulateError(false);
    setTimeout(() => refetch(), 50);
  };

  return (
    <div className="app-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src="favicon.png" alt="Nexus Logo" style={{ width: '42px', height: '42px', filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }} />
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, letterSpacing: '-0.025em' }}>Nexus Operations</h1>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Live Service Monitoring Portal</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <input 
                type="checkbox" 
                id="error-toggle"
                checked={simulateError} 
                onChange={e => {
                  setSimulateError(e.target.checked);
                  if (!e.target.checked) setTimeout(refetch, 50);
                }} 
                style={{ cursor: 'pointer', accentColor: 'var(--danger)' }}
              />
              <label htmlFor="error-toggle" style={{ cursor: 'pointer', userSelect: 'none' }}>Simulate Error Mode</label>
            </div>

            <button 
              onClick={() => refetch()} 
              className="btn-icon-control"
              style={{ opacity: isFetching ? 0.7 : 1 }}
            >
              <RefreshCw size={16} className={isFetching ? 'spin' : ''} />
              <span>{isFetching ? 'Updating...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Derived Metrics Calculation */}
        {(() => {
          const metrics = data ? {
            total: data.length,
            active: data.filter(s => s.status === 'active').length,
            offline: data.filter(s => ['offline', 'degraded'].includes(s.status)).length,
            avgUptime: (data.reduce((acc, s) => acc + s.uptime, 0) / data.length).toFixed(1),
            regions: new Set(data.map(s => s.region)).size
          } : null;

          return (
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <MetricCard 
                label="Total Systems" 
                value={metrics ? metrics.total.toString() : '-'} 
                sub="Monitored Endpoints"
                Icon={Server}
                iconColor="var(--accent)"
                isActive={activeFilter === null}
                onClick={() => handleCardClick(null)}
              />
              <MetricCard 
                label="Active Systems" 
                value={metrics ? metrics.active.toString() : '-'} 
                sub="Fully Operational"
                Icon={Zap}
                iconColor="var(--success)"
                isActive={activeFilter === 'active'}
                onClick={() => handleCardClick('active')}
              />
              <MetricCard 
                label="System Issues" 
                value={metrics ? (metrics.offline === 0 ? 'None' : `${metrics.offline} Issue${metrics.offline !== 1 ? 's' : ''}`) : '-'} 
                sub={metrics?.offline === 0 ? 'All systems operational' : 'Requires attention'}
                Icon={Activity}
                iconColor={metrics?.offline === 0 ? 'var(--success)' : 'var(--danger)'}
                highlight={metrics && metrics.offline > 0}
                isActive={activeFilter === 'issue'}
                onClick={() => handleCardClick('issue')}
              />
               <MetricCard 
                label="Global Coverage" 
                value={metrics ? `${metrics.regions} Regions` : '-'} 
                sub="Active Data Centers"
                Icon={Globe}
                iconColor="#8b5cf6"
                isActive={activeFilter === 'region'}
                onClick={() => handleCardClick('region')}
              />
            </section>
          );
        })()}

        <ServiceTable 
          data={data} 
          isLoading={isLoading} 
          isError={isError} 
          onRetry={handleRetry} 
          filterStatus={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </main>
      

    </div>
  )
}

const MetricCard = ({ label, value, sub, Icon, iconColor, highlight, isActive, onClick, style }: any) => (
  <div 
    onClick={onClick}
    style={{ 
      background: isActive ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-secondary)', 
      padding: '1.25rem', 
      borderRadius: '12px', 
      border: isActive 
        ? (highlight ? '1px solid var(--danger)' : '1px solid var(--accent)') 
        : '1px solid var(--border)',
      boxShadow: isActive 
        ? (highlight ? '0 0 0 1px var(--danger)' : '0 0 0 1px var(--accent)') 
        : 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      transition: 'all 0.3s',
      position: 'relative',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      ...style
  }}>
    <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.1, pointerEvents: 'none' }}>
      <Icon size={120} color={iconColor} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', position: 'relative', zIndex: 1 }}>
      <span style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
      <div style={{ animation: highlight ? 'pulse-scale 2s infinite' : 'none' }}>
        <Icon size={20} color={iconColor} />
      </div>
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: '700', position: 'relative', zIndex: 1 }}>{value}</div>
    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', position: 'relative', zIndex: 1 }}>{sub}</div>
  </div>
);

export default App
