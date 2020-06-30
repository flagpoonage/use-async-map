export type AsyncValidCycleStatus = {
  status: 'started' | 'inprogress' | 'complete';
  progress: number;
};

export type AsyncInvalidCycleStatus = {
  status: 'error';
  error: any;
};

export type AsyncCycleStatus = AsyncValidCycleStatus | AsyncInvalidCycleStatus;

export type AsyncMapResult<T> = [T[], AsyncCycleStatus];
