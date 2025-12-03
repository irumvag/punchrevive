/**
 * Result Storage Service
 * 
 * Handles storage and retrieval of resurrection results using Vercel KV.
 * Generates unique shareable URLs and manages result expiration.
 */

import { kv } from '@vercel/kv';
import { randomUUID } from 'crypto';
import type { ResurrectionResult } from '../types';

/**
 * Time-to-live for stored results (30 days in seconds)
 */
const RESULT_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

/**
 * Key prefix for resurrection results in KV store
 */
const RESULT_KEY_PREFIX = 'resurrection:';

/**
 * Key prefix for view counts in KV store
 */
const VIEWS_KEY_PREFIX = 'views:';

/**
 * Storage service interface for managing resurrection results
 */
export interface StorageService {
  saveResult(result: Omit<ResurrectionResult, 'id'>): Promise<string>;
  getResult(id: string): Promise<ResurrectionResult | null>;
  generateShareableLink(id: string): string;
  incrementViews(id: string): Promise<void>;
  getViews(id: string): Promise<number>;
}

/**
 * Generate a unique key for storing a result in KV
 */
function generateResultKey(id: string): string {
  return `${RESULT_KEY_PREFIX}${id}`;
}

/**
 * Generate a unique key for storing view counts in KV
 */
function generateViewsKey(id: string): string {
  return `${VIEWS_KEY_PREFIX}${id}`;
}

/**
 * Save a resurrection result to Vercel KV storage
 * 
 * @param result - The resurrection result to save (without id)
 * @returns Promise resolving to the unique ID of the saved result
 * @throws Error if save operation fails
 */
export async function saveResult(
  result: Omit<ResurrectionResult, 'id'>
): Promise<string> {
  try {
    // Generate unique ID for this result
    const id = randomUUID();
    
    // Create complete result with ID
    const completeResult: ResurrectionResult = {
      ...result,
      id,
    };
    
    // Store in Vercel KV with 30-day TTL
    const key = generateResultKey(id);
    await kv.set(key, completeResult, { ex: RESULT_TTL_SECONDS });
    
    return id;
  } catch (error) {
    console.error('Failed to save resurrection result:', error);
    throw new Error('Failed to preserve the resurrection for sharing');
  }
}

/**
 * Retrieve a resurrection result from Vercel KV storage
 * 
 * @param id - The unique ID of the result to retrieve
 * @returns Promise resolving to the result or null if not found/expired
 */
export async function getResult(id: string): Promise<ResurrectionResult | null> {
  try {
    const key = generateResultKey(id);
    const result = await kv.get<ResurrectionResult>(key);
    
    if (!result) {
      return null;
    }
    
    // Ensure timestamp is a Date object (KV stores as ISO string)
    if (typeof result.timestamp === 'string') {
      result.timestamp = new Date(result.timestamp);
    }
    
    return result;
  } catch (error) {
    console.error('Failed to retrieve resurrection result:', error);
    return null;
  }
}

/**
 * Generate a shareable URL for a resurrection result
 * 
 * @param id - The unique ID of the result
 * @returns The full shareable URL
 */
export function generateShareableLink(id: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/share/${id}`;
}

/**
 * Increment the view count for a shared result
 * 
 * @param id - The unique ID of the result
 * @returns Promise that resolves when the view count is incremented
 */
export async function incrementViews(id: string): Promise<void> {
  try {
    const key = generateViewsKey(id);
    await kv.incr(key);
    // Set TTL on first increment
    await kv.expire(key, RESULT_TTL_SECONDS);
  } catch (error) {
    console.error('Failed to increment view count:', error);
    // Don't throw - view tracking is non-critical
  }
}

/**
 * Get the view count for a shared result
 * 
 * @param id - The unique ID of the result
 * @returns Promise resolving to the view count (0 if not found)
 */
export async function getViews(id: string): Promise<number> {
  try {
    const key = generateViewsKey(id);
    const views = await kv.get<number>(key);
    return views || 0;
  } catch (error) {
    console.error('Failed to get view count:', error);
    return 0;
  }
}

/**
 * Default export of storage service
 */
const storageService: StorageService = {
  saveResult,
  getResult,
  generateShareableLink,
  incrementViews,
  getViews,
};

export default storageService;

// Named export for convenience
export { storageService };
