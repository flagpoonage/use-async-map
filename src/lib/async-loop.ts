import { AsyncMapResult } from './types';
import { makeError, makeProgress, makeComplete } from './async-result';

/**
 * Amount of milliseconds allowed per tick.
 */
const MAX_TIME_ALLOTMENT = 5;

/**
 * A context manager for the async loop which stores progress
 * state and results, and manages the execution of the loop.
 */
export class AsyncLoop<T, U> {
  /**
   * The user provided dataset to operate on
   */
  private _dataset: T[];

  /**
   * The partial or complete set of results from the map function
   */
  private _results: U[];

  /**
   * The working index of the provided dataset
   */
  private _progress: number;

  /**
   * The handler function that will receive a result state at the end of each tick.
   */
  private _onTick: null | ((value: AsyncMapResult<U>) => void);

  /**
   * The user provided mapping function that will be run for each item in the dataset
   */
  private _mapFn: (item: T) => U;

  /**
   * A handle to the window interval, can be cleared on a completed or errored loop.
   */
  private _interval: number;

  constructor(data: T[], mapFn: (item: T) => U) {
    this._dataset = data;
    this._results = [];
    this._progress = 0;
    this._mapFn = mapFn;
    this._interval = window.setInterval(this._tick, 50);
    this._onTick = null;
    this._tick();
  }

  /**
   * The main tick function. This will loop through the data array, executing
   * the map function for as long as it can before it's allotted time runs out,
   * and will call the onTick handler when each run finishes.
   */
  private _tick = () => {
    const start = performance.now();

    /**
     * The remaining time available to run loop iterations.
     */
    let allottedTime = MAX_TIME_ALLOTMENT;

    let from = start;

    try {
      while (allottedTime > 0 && this._progress < this._dataset.length) {
        this._results.push(this._mapFn(this._dataset?.[this._progress]));
        this._progress += 1;
        const current = performance.now();

        allottedTime = allottedTime - (current - from);
        from = current;
      }
    } catch (exception) {
      this._onTick?.(makeError(exception));
      this.clear();
    }

    if (this._progress < this._dataset.length) {
      this._onTick?.(makeProgress(this._results, this._progress));
    } else {
      this._onTick?.(makeComplete(this._results));
      this.clear();
    }
  };

  /**
   * Assigns a handler that will be called on each completed tick
   * @param handler A function to call on each completed tick
   */
  onTick = (handler: (value: AsyncMapResult<U>) => void) => {
    this._onTick = handler;
  };

  /**
   * Resets the context manager and clears all data.
   */
  clear = () => {
    window.clearInterval(this._interval);
    this._onTick = null;
    this._dataset = [];
    this._progress = 0;
  };
}
