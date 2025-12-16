import { SnowConditions } from '../api/skiResortForecast';
import { ResortStatus } from '../api/skiApi';

export interface ResortData {
  name: string;
  snowConditions: SnowConditions | null;
  resortStatus: ResortStatus | null;
  isLoading: boolean;
  error: string | null;
}

interface ResortCardProps {
  resort: ResortData;
}

/**
 * Determines condition label based on snow data
 */
function getConditionLabel(
  snowConditions: SnowConditions | null,
  resortStatus: ResortStatus | null
): string {
  if (resortStatus?.condition) {
    return resortStatus.condition;
  }

  if (!snowConditions) {
    return 'Unknown';
  }

  const freshSnow = snowConditions.freshSnowfall;
  const topDepth = snowConditions.topSnowDepth;

  if (freshSnow >= 6) {
    return 'Powder';
  } else if (freshSnow >= 2) {
    return 'Fresh Snow';
  } else if (topDepth >= 60) {
    return 'Packed Powder';
  } else if (topDepth >= 30) {
    return 'Variable';
  } else {
    return 'Thin Cover';
  }
}

export default function ResortCard({ resort }: ResortCardProps) {
  const { name, snowConditions, resortStatus, isLoading, error } = resort;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-red-200">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  const condition = getConditionLabel(snowConditions, resortStatus);
  const metadata = resortStatus?.metadata;
  const liftStatus = resortStatus?.liftStatus;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-1">{name}</h3>
        {metadata && (
          <p className="text-gray-600 text-sm">
            {metadata.country}
            {metadata.elevation && ` • ${metadata.elevation.toLocaleString()} ft`}
          </p>
        )}
      </div>

      {/* Condition Badge */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
            condition === 'Powder'
              ? 'bg-blue-100 text-blue-800'
              : condition === 'Fresh Snow'
              ? 'bg-green-100 text-green-800'
              : condition === 'Packed Powder'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {condition}
        </span>
      </div>

      {/* Snow Conditions */}
      {snowConditions && (
        <div className="mb-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Fresh Snow (24h)</span>
            <span className="font-semibold text-gray-800">
              {snowConditions.freshSnowfall.toFixed(1)}"
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Top Base Depth</span>
            <span className="font-semibold text-gray-800">
              {snowConditions.topSnowDepth.toFixed(0)}"
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Bottom Base Depth</span>
            <span className="font-semibold text-gray-800">
              {snowConditions.botSnowDepth.toFixed(0)}"
            </span>
          </div>
          {snowConditions.lastSnowfallDate && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Last Snowfall</span>
              <span className="text-sm text-gray-700">
                {new Date(snowConditions.lastSnowfallDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Lift Status */}
      {liftStatus && liftStatus.total > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Lifts Open</span>
            <span className="font-semibold text-gray-800">
              {liftStatus.open} / {liftStatus.total}
            </span>
          </div>
        </div>
      )}

      {/* No data message */}
      {!snowConditions && !resortStatus && (
        <p className="text-gray-500 text-sm italic">
          No data available for this resort
        </p>
      )}
    </div>
  );
}






