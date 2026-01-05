import { useEffect, useState } from 'react';

/**
 * useDebounce Hook
 *
 * Debounces a value by delaying updates until after a specified delay.
 * Useful for search inputs, API calls, and preventing excessive re-renders.
 *
 * @example
 * // Search input with debounced API call
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     searchAPI(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns The debounced value
 *
 * ## Why Use Debouncing?
 *
 * Without debouncing:
 * - User types "React" → 5 API calls (R, Re, Rea, Reac, React)
 * - Wastes bandwidth and server resources
 * - Poor UX with flickering results
 *
 * With debouncing:
 * - User types "React" → 1 API call (after 500ms of no typing)
 * - Better performance
 * - Cleaner UX
 *
 * ## Common Use Cases
 *
 * 1. **Search Input**:
 *    - Wait for user to stop typing before searching
 *    - Reduces API calls by 80-90%
 *
 * 2. **Auto-save**:
 *    - Save form data after user stops editing
 *    - Prevents save on every keystroke
 *
 * 3. **Resize/Scroll Handlers**:
 *    - Throttle expensive calculations
 *    - Improves performance on slow devices
 *
 * 4. **Live Validation**:
 *    - Validate email/username availability
 *    - Only check after user finishes typing
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout to update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: cancel timeout if value changes before delay expires
    // This is the key to debouncing - we cancel and restart the timer
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect when value or delay changes

  return debouncedValue;
}

/**
 * useDebounceCallback Hook
 *
 * Debounces a callback function instead of a value.
 * Useful when you want to debounce an action rather than state.
 *
 * @example
 * const handleSearch = useDebounceCallback((term: string) => {
 *   searchAPI(term);
 * }, 500);
 *
 * <input onChange={(e) => handleSearch(e.target.value)} />
 *
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced callback function
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  return (...args: Parameters<T>) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  };
}

/**
 * Performance Tips:
 *
 * 1. **Choose the right delay**:
 *    - Search: 300-500ms (user feels responsive)
 *    - Auto-save: 1000-2000ms (reduce save frequency)
 *    - Validation: 500-1000ms (balance between UX and server load)
 *
 * 2. **Cleanup on unmount**:
 *    - Hook automatically cleans up timeouts
 *    - No memory leaks
 *
 * 3. **Combine with useMemo**:
 *    - Debounce expensive computations
 *    - Better than debouncing re-renders
 */
