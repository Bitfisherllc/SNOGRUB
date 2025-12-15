import { useState, useEffect } from 'react';
import ResortCard, { ResortData } from './components/ResortCard';
import { getSnowConditions } from './api/skiResortForecast';
import { getResortStatus } from './api/skiApi';

// Hard-coded list of resorts
const RESORTS = [
  'Vail',
  'Breckenridge',
  'Whistler Blackcomb',
  'Jackson Hole',
];

function App() {
  const [resorts, setResorts] = useState<ResortData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize resorts with loading state
  useEffect(() => {
    const initialResorts: ResortData[] = RESORTS.map((name) => ({
      name,
      snowConditions: null,
      resortStatus: null,
      isLoading: true,
      error: null,
    }));
    setResorts(initialResorts);
    fetchAllResorts(initialResorts);
  }, []);

  const fetchAllResorts = async (currentResorts: ResortData[]) => {
    const updatedResorts = await Promise.all(
      currentResorts.map(async (resort) => {
        try {
          // Fetch both APIs in parallel
          const [snowConditions, resortStatus] = await Promise.all([
            getSnowConditions(resort.name).catch((error) => {
              console.error(`Error fetching snow for ${resort.name}:`, error);
              return null;
            }),
            getResortStatus(resort.name).catch((error) => {
              console.error(`Error fetching status for ${resort.name}:`, error);
              return null;
            }),
          ]);

          return {
            ...resort,
            snowConditions,
            resortStatus,
            isLoading: false,
            error: null,
          };
        } catch (error) {
          return {
            ...resort,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Failed to fetch resort data',
          };
        }
      })
    );

    setResorts(updatedResorts);
    setIsRefreshing(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    const loadingResorts: ResortData[] = resorts.map((resort) => ({
      ...resort,
      isLoading: true,
      error: null,
    }));
    setResorts(loadingResorts);
    fetchAllResorts(loadingResorts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎿 Ski Conditions
          </h1>
          <p className="text-gray-600 mb-6">
            Real-time snow conditions and lift status
          </p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors disabled:cursor-not-allowed"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh All Resorts'}
          </button>
        </div>

        {/* Resorts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {resorts.map((resort) => (
            <ResortCard key={resort.name} resort={resort} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Data provided by Ski Resort Forecast API and Ski API via RapidAPI
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
