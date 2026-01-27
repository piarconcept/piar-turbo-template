import { useHealth } from '../hooks/use-health';

export interface HealthBadgeProps {
  serviceUrl: string;
  serviceName?: string;
}

/**
 * Health Badge Component
 * Displays health status as a badge
 */
export function HealthBadge({ serviceUrl, serviceName }: HealthBadgeProps) {
  const { status, loading } = useHealth(serviceUrl);

  if (loading) {
    return <span className="text-gray-500">⏳ Checking...</span>;
  }

  if (!status) {
    return <span className="text-gray-500">❓ Unknown</span>;
  }

  const statusStyles = {
    ok: 'text-green-500',
    degraded: 'text-amber-500',
    error: 'text-red-500',
  };

  const statusIcons = {
    ok: '✓',
    degraded: '⚠',
    error: '✗',
  };

  return (
    <span className={statusStyles[status.status]}>
      {statusIcons[status.status]} {serviceName || status.service}
    </span>
  );
}

export interface HealthCardProps {
  serviceUrl: string;
  serviceName?: string;
}

/**
 * Health Card Component
 * Displays detailed health information
 */
export function HealthCard({ serviceUrl, serviceName }: HealthCardProps) {
  const { status, loading, refetch } = useHealth(serviceUrl);

  if (loading) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg">
        <p>Loading...</p>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const statusBorderColors = {
    ok: 'border-green-500',
    degraded: 'border-amber-500',
    error: 'border-red-500',
  };

  const statusTextColors = {
    ok: 'text-green-500',
    degraded: 'text-amber-500',
    error: 'text-red-500',
  };

  // Check if there's an error in checks
  const errorCheck = status.checks?.find((c) => c.status === 'error' && c.name === 'connection');

  if (status.status === 'error' && errorCheck) {
    return (
      <div className="p-4 border border-red-500 rounded-lg">
        <p className="text-red-500">Error: {errorCheck.message}</p>
        <button
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 border ${statusBorderColors[status.status]} rounded-lg`}>
      <h3 className="text-lg font-semibold mb-2">{serviceName || status.service}</h3>
      <p className="mb-1">
        Status:{' '}
        <strong className={statusTextColors[status.status]}>{status.status.toUpperCase()}</strong>
      </p>
      <p className="text-sm text-gray-600 mb-2">
        Last checked: {new Date(status.timestamp).toLocaleString()}
      </p>

      {status.version && <p className="mb-2">Version: {status.version}</p>}

      {status.checks && status.checks.length > 0 && (
        <div className="mt-2">
          <strong>Checks:</strong>
          <ul className="my-2 pl-6 list-disc">
            {status.checks.map((check, idx) => (
              <li key={idx}>
                {check.name}:{' '}
                <span className={check.status === 'ok' ? 'text-green-500' : 'text-red-500'}>
                  {check.status}
                </span>
                {check.message && ` - ${check.message}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={refetch}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Refresh
      </button>
    </div>
  );
}
