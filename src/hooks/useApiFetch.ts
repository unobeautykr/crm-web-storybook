import { useEffect, useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ApiException } from '~/api/apiClient';

function throwUnexpected(exception: Error | undefined) {
  if (!exception) return;

  if (exception instanceof ApiException) {
    throw new ApiException(exception.code, exception.name, exception.message);
  }

  throw exception;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useApiFetch = <F extends (...args: any[]) => any>(
  params: Parameters<F>,
  fetcher: F,
  {
    noCache = false,
    refreshInterval = undefined,
    throwError = true,
  }: {
    noCache?: boolean;
    refreshInterval?: number;
    throwError?: boolean;
  } = {}
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const random = useMemo(() => new Date(), params ? [...params] : []);

  const { cache } = useSWRConfig();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiKey = (
    fetcher as any as {
      apiKey: string;
    }
  ).apiKey;

  if (!apiKey)
    throw new Error('Invalid fetcher function passed. No api key defined.');

  const cacheBuster = noCache ? random : null;

  const swrKey = useMemo<any>(
    () => (params ? [apiKey, cacheBuster, ...params] : null),
    [apiKey, cacheBuster, params]
  );

  const { data, error, mutate } = useSWR<Awaited<ReturnType<F>>, ApiException>(
    params ? [apiKey, cacheBuster, ...params] : null,
    async (key: any, cacheBuster: any, ...args: any) => {
      return await fetcher(...args);
    },
    {
      revalidateOnMount: true,
      dedupingInterval: 2000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      refreshInterval: refreshInterval,
    }
  );

  useEffect(() => {
    if (noCache) {
      return () => {
        cache.delete(swrKey);
      };
    }
  }, [cache, noCache, swrKey]);

  if (throwError) {
    throwUnexpected(error);
  }

  return {
    data,
    loading: !data && !error,
    error,
    mutate,
  };
};
