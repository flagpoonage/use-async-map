import * as React from 'react';
import { AsyncMapResult } from './types';
import { AsyncLoop } from './async-loop';
import { makeStart } from './async-result';

/**
 * Returns a tuple consisting of a partial or complete list of results from
 * the mapping function, and a state object containing meta information about
 * the current state of the async loop.
 * @param mapFunction The mapping function to call for each data item
 * @param data A set of data to map over
 */
export function useAsyncMap<T, U>(
  mapFunction: (item: T) => U,
  data: T[]
): AsyncMapResult<U> {
  const [asyncResult, setAsyncContext] = React.useState<AsyncMapResult<U>>([
    [],
    { status: 'started', progress: 0 },
  ]);
  const previousData = React.useRef<T[]>();
  const asyncContext = React.useRef<AsyncLoop<T, U> | null>(null);

  /**
   * To ensure we don't break the rule of hooks, creating a ref here
   * is effectively saying, the mapFunction is only provided once and
   * then it does not change. Much like the inbuilt react hooks.
   */
  const mapFunctionRef = React.useRef<(item: T) => U>(mapFunction);

  React.useEffect(() => {
    previousData.current = data;

    const ticker = (value: AsyncMapResult<U>) => setAsyncContext(value);

    asyncContext.current = new AsyncLoop(data, mapFunctionRef.current);
    asyncContext.current.onTick(ticker);

    return function () {
      if (!asyncContext.current) {
        return;
      }

      asyncContext.current.clear();
    };
  }, [data]);

  return previousData.current !== data ? makeStart() : asyncResult;
}
