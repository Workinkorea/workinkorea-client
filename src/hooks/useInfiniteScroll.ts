import { useEffect, useRef, useCallback } from 'react';

/**
 * useInfiniteScroll Hook
 *
 * Implements infinite scroll using Intersection Observer API.
 * Automatically loads more content when user scrolls to bottom.
 *
 * Architecture: Uses Intersection Observer (better than scroll events)
 * - Only fires when element enters viewport
 * - Built-in browser optimization
 * - Better battery life on mobile
 */

export interface UseInfiniteScrollOptions {
  /** Callback to load more items */
  onLoadMore: () => void;

  /** Loading state (prevents duplicate calls) */
  isLoading: boolean;

  /** Has more items to load */
  hasMore: boolean;

  /** Threshold (0-1) for triggering load (default: 1.0) */
  threshold?: number;

  /** Root margin (e.g., '100px' to trigger earlier) */
  rootMargin?: string;

  /** Enable/disable infinite scroll */
  enabled?: boolean;
}

export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>(
  options: UseInfiniteScrollOptions
): React.RefObject<T | null> {
  const {
    onLoadMore,
    isLoading,
    hasMore,
    threshold = 1.0,
    rootMargin = '0px',
    enabled = true,
  } = options;

  const observerRef = useRef<T | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting && !isLoading && hasMore && enabled) {
        onLoadMore();
      }
    },
    [onLoadMore, isLoading, hasMore, enabled]
  );

  useEffect(() => {
    const element = observerRef.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin,
      threshold,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, rootMargin, threshold, enabled]);

  return observerRef;
}

/**
 * useInfiniteScrollWithReactQuery
 *
 * Convenience hook for React Query's useInfiniteQuery
 */
export function useInfiniteScrollWithReactQuery<T extends HTMLElement = HTMLDivElement>(options: {
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  enabled?: boolean;
  threshold?: number;
  rootMargin?: string;
}): React.RefObject<T | null> {
  const {
    fetchNextPage,
    hasNextPage = false,
    isFetchingNextPage,
    enabled = true,
    threshold,
    rootMargin,
  } = options;

  return useInfiniteScroll<T>({
    onLoadMore: fetchNextPage,
    isLoading: isFetchingNextPage,
    hasMore: hasNextPage,
    enabled,
    threshold,
    rootMargin,
  });
}
