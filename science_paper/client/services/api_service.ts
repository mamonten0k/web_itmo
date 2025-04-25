import type {ThrottleType, Modifiers} from '../../common/types';
import {REJECT_TIMESTAMP_MS} from '../common/constants';

// Define types for API requests and responses
interface WebVitalsRequest {
    url: string;
    modifiers: Modifiers[];
    throttleType: ThrottleType;
    options?: Record<string, any>;
}

interface WebVitalsResponse {
    data: {
        lhr?: {
            audits?: Record<string, {
                displayValue?: string;
                score?: number;
                numericValue?: number;
            }>;
        };
    };
}

/**
 * Fetches web vitals data for a given URL with specified modifiers and throttling
 * @param params Request parameters including URL, modifiers, and throttling settings
 * @returns Promise with web vitals data
 */
export async function getWebVitals(params: WebVitalsRequest): Promise<WebVitalsResponse> {
  return await request<WebVitalsResponse>('/api/web-vitals', params);
}

/**
 * Generic request function for API calls
 * @param url API endpoint URL
 * @param body Request body
 * @returns Promise with response data
 * @throws Error if the request fails or times out
 */
async function request<T>(url: string, body: object): Promise<T> {
  const controller = new AbortController();
  const signal = controller.signal;

  const timeout = window.setTimeout(() => controller.abort(), REJECT_TIMESTAMP_MS);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal,
    });
        
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
        
    return await res.json() as T;
  } catch (e: unknown) {
    controller.abort();
    console.error('API request failed:', e);
    throw e; // Re-throw to allow handling in the component
  } finally {
    clearTimeout(timeout);
  }
}
