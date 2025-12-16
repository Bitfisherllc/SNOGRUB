/**
 * Ski Resort Forecast API integration
 * Base URL: https://ski-resort-forecast.p.rapidapi.com/
 * 
 * IMPORTANT: Add your RapidAPI key to .env file as VITE_RAPIDAPI_KEY
 */

const BASE_URL = 'https://ski-resort-forecast.p.rapidapi.com';

export interface SnowConditions {
  topSnowDepth: number;
  botSnowDepth: number;
  freshSnowfall: number;
  lastSnowfallDate: string;
}

export interface SkiResortForecastResponse {
  topSnowDepth?: number;
  botSnowDepth?: number;
  freshSnowfall?: number;
  lastSnowfallDate?: string;
  [key: string]: any; // Allow for additional fields from API
}

/**
 * Fetches snow conditions for a given resort
 * @param resortSlug - Resort name/slug (e.g., "Vail", "Whistler-Blackcomb")
 * @returns Promise with snow conditions data
 */
export async function getSnowConditions(
  resortSlug: string
): Promise<SnowConditions> {
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  
  if (!apiKey) {
    throw new Error(
      'VITE_RAPIDAPI_KEY is not set. Please add it to your .env file.'
    );
  }

  try {
    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(resortSlug)}/snowConditions`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'ski-resort-forecast.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch snow conditions: ${response.status} ${response.statusText}`
      );
    }

    const data: SkiResortForecastResponse = await response.json();

    // Map API response to our interface
    return {
      topSnowDepth: data.topSnowDepth ?? 0,
      botSnowDepth: data.botSnowDepth ?? 0,
      freshSnowfall: data.freshSnowfall ?? 0,
      lastSnowfallDate: data.lastSnowfallDate ?? 'N/A',
    };
  } catch (error) {
    console.error(`Error fetching snow conditions for ${resortSlug}:`, error);
    throw error;
  }
}






