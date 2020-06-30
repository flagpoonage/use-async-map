import { AsyncMapResult } from './types';

/**
 * Generates a complete state for the async map function
 * @param data The complete results of the map function
 */
export function makeComplete<T>(data: T[]): AsyncMapResult<T> {
  return [data, { status: 'complete', progress: data.length }];
}

/**
 * Generates an in progress state for the async map function
 * @param values The current incomplete result set
 * @param current The index of progress through the current dataset
 */
export function makeProgress<T>(
  values: T[],
  current: number
): AsyncMapResult<T> {
  return [values, { status: 'inprogress', progress: current }];
}

/**
 * Generates a started state for the async map function
 */
export function makeStart(): AsyncMapResult<any> {
  return [[], { status: 'started', progress: 0 }];
}

/**
 * Generates an error state for the async map function
 * @param error The error that was thrown
 */
export function makeError(error: any): AsyncMapResult<any> {
  return [[], { status: 'error', error }];
}
