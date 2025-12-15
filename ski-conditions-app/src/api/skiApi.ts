/**
 * Ski API integration (skiapi.com via RapidAPI)
 * 
 * IMPORTANT: Add your RapidAPI key to .env file as VITE_RAPIDAPI_KEY
 * (Can use the same key as Ski Resort Forecast API if both are on RapidAPI)
 * 
 * Note: The actual endpoint structure may vary. Adjust the base URL and endpoints
 * based on the actual Ski API documentation from RapidAPI.
 */

// Base URL for Ski API - adjust based on actual API documentation
const BASE_URL = 'https://ski-api.p.rapidapi.com'; // Update this with actual base URL

export interface ResortMetadata {
  name: string;
  country: string;
  latitude?: number;
  longitude?: number;
  elevation?: number;
}

export interface LiftStatus {
  open: number;
  total: number;
}

export interface SkiApiResponse {
  name?: string;
  country?: string;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  lifts?: {
    open?: number;
    total?: number;
  };
  condition?: string;
  [key: string]: any; // Allow for additional fields
}

export interface ResortStatus {
  metadata: ResortMetadata;
  liftStatus: LiftStatus;
  condition?: string;
}

/**
 * Fetches resort status and metadata from Ski API
 * @param resortIdOrName - Resort ID or name identifier
 * @returns Promise with resort status data
 */
export async function getResortStatus(
  resortIdOrName: string
): Promise<ResortStatus> {
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  
  if (!apiKey) {
    throw new Error(
      'VITE_RAPIDAPI_KEY is not set. Please add it to your .env file.'
    );
  }

  try {
    // NOTE: Adjust the endpoint path based on actual Ski API documentation
    // This is a placeholder structure - you'll need to verify the actual endpoint
    const response = await fetch(
      `${BASE_URL}/resorts/${encodeURIComponent(resortIdOrName)}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'ski-api.p.rapidapi.com', // Update with actual host
        },
      }
    );

    if (!response.ok) {
      // If the API endpoint doesn't exist, return mock data for development
      console.warn(
        `Ski API endpoint not available (${response.status}). Using fallback data.`
      );
      return getFallbackResortStatus(resortIdOrName);
    }

    const data: SkiApiResponse = await response.json();

    return {
      metadata: {
        name: data.name ?? resortIdOrName,
        country: data.country ?? 'Unknown',
        latitude: data.latitude ?? data.lat,
        longitude: data.longitude ?? data.lng,
        elevation: data.elevation,
      },
      liftStatus: {
        open: data.lifts?.open ?? 0,
        total: data.lifts?.total ?? 0,
      },
      condition: data.condition,
    };
  } catch (error) {
    console.error(`Error fetching resort status for ${resortIdOrName}:`, error);
    // Return fallback data instead of throwing
    return getFallbackResortStatus(resortIdOrName);
  }
}

/**
 * Fallback function that returns mock data when API is unavailable
 * This allows the app to work even if one API is down
 */
function getFallbackResortStatus(resortIdOrName: string): ResortStatus {
  // Map common resort names to countries
  const resortCountryMap: Record<string, string> = {
    vail: 'USA',
    breckenridge: 'USA',
    'whistler blackcomb': 'Canada',
    'whistler-blackcomb': 'Canada',
    'jackson hole': 'USA',
  };

  const normalizedName = resortIdOrName.toLowerCase();
  const country =
    resortCountryMap[normalizedName] ??
    resortCountryMap[normalizedName.replace(/\s+/g, '-')] ??
    'Unknown';

  return {
    metadata: {
      name: resortIdOrName,
      country,
    },
    liftStatus: {
      open: 0,
      total: 0,
    },
    condition: 'Unknown',
  };
}



