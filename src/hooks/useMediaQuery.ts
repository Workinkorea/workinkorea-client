import { useEffect, useState } from 'react';

/**
 * useMediaQuery Hook
 *
 * React hook for responsive design using CSS media queries.
 * Matches Tailwind CSS breakpoints for consistency.
 *
 * @example
 * // Basic usage
 * const isMobile = useMediaQuery('(max-width: 768px)');
 *
 * return (
 *   <div>
 *     {isMobile ? <MobileMenu /> : <DesktopMenu />}
 *   </div>
 * );
 *
 * @example
 * // Using predefined breakpoints (matches Tailwind)
 * const isMobile = useMediaQuery('mobile');   // < 640px
 * const isTablet = useMediaQuery('tablet');   // < 768px
 * const isDesktop = useMediaQuery('desktop'); // >= 1024px
 *
 * @param query - CSS media query string or predefined breakpoint
 * @returns Boolean indicating if the media query matches
 *
 * ## Why Use This Hook?
 *
 * 1. **Conditional Rendering**:
 *    - Show/hide components based on screen size
 *    - Better than CSS display:none (doesn't render at all)
 *
 * 2. **Performance**:
 *    - Don't render heavy components on mobile
 *    - Reduce bundle size on smaller devices
 *
 * 3. **Dynamic Behavior**:
 *    - Change component behavior based on screen size
 *    - Different interactions for touch vs mouse
 *
 * ## Tailwind Breakpoints
 *
 * - sm:  640px  (small phones → landscape)
 * - md:  768px  (tablets)
 * - lg:  1024px (laptops)
 * - xl:  1280px (desktops)
 * - 2xl: 1536px (large desktops)
 */

// Predefined breakpoints matching Tailwind CSS
const BREAKPOINTS = {
  mobile: '(max-width: 639px)',      // < sm
  tablet: '(max-width: 767px)',      // < md
  laptop: '(max-width: 1023px)',     // < lg
  desktop: '(min-width: 1024px)',    // >= lg
  sm: '(min-width: 640px)',          // Tailwind sm
  md: '(min-width: 768px)',          // Tailwind md
  lg: '(min-width: 1024px)',         // Tailwind lg
  xl: '(min-width: 1280px)',         // Tailwind xl
  '2xl': '(min-width: 1536px)',      // Tailwind 2xl
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;

export function useMediaQuery(query: string | BreakpointKey): boolean {
  // Resolve predefined breakpoint to actual media query
  const mediaQuery = query in BREAKPOINTS
    ? BREAKPOINTS[query as BreakpointKey]
    : query;

  /**
   * getMatches - Check if media query matches
   *
   * Why check typeof window?
   * - SSR (Server-Side Rendering): window is undefined on server
   * - Prevents errors during Next.js build
   * - Returns false as safe default
   */
  const getMatches = (query: string): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(mediaQuery));

  useEffect(() => {
    // Return early if window is not available (SSR)
    if (typeof window === 'undefined') {
      return;
    }

    const matchMedia = window.matchMedia(mediaQuery);

    /**
     * handleChange - Update matches state when media query changes
     *
     * Why use event listener?
     * - Automatically updates when user resizes window
     * - Rotates device (portrait ↔ landscape)
     * - Changes browser zoom level
     */
    const handleChange = () => {
      setMatches(matchMedia.matches);
    };

    // Set initial value
    handleChange();

    // Modern browsers: use addEventListener
    // Legacy browsers: use addListener (deprecated but still supported)
    if (matchMedia.addEventListener) {
      matchMedia.addEventListener('change', handleChange);
    } else {
      // @ts-ignore - Legacy API
      matchMedia.addListener(handleChange);
    }

    // Cleanup: remove event listener on unmount
    return () => {
      if (matchMedia.removeEventListener) {
        matchMedia.removeEventListener('change', handleChange);
      } else {
        // @ts-ignore - Legacy API
        matchMedia.removeListener(handleChange);
      }
    };
  }, [mediaQuery]);

  return matches;
}

/**
 * useBreakpoint Hook
 *
 * Convenience hook that returns current breakpoint name.
 * Useful for debugging or conditional logic based on breakpoint.
 *
 * @example
 * const breakpoint = useBreakpoint();
 * console.log('Current breakpoint:', breakpoint); // 'mobile' | 'tablet' | 'laptop' | 'desktop'
 *
 * @returns Current breakpoint name
 */
export function useBreakpoint(): 'mobile' | 'tablet' | 'laptop' | 'desktop' {
  const isMobile = useMediaQuery('mobile');
  const isTablet = useMediaQuery('tablet');
  const isLaptop = useMediaQuery('laptop');

  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  if (isLaptop) return 'laptop';
  return 'desktop';
}

/**
 * useIsMobile Hook
 *
 * Convenience hook for mobile detection.
 * Most common use case extracted for simplicity.
 *
 * @example
 * const isMobile = useIsMobile();
 *
 * return isMobile ? (
 *   <MobileLayout />
 * ) : (
 *   <DesktopLayout />
 * );
 */
export function useIsMobile(): boolean {
  return useMediaQuery('mobile');
}

/**
 * Best Practices:
 *
 * 1. **Prefer CSS for styling**:
 *    ❌ const isMobile = useMediaQuery('mobile');
 *       return <div className={isMobile ? 'text-sm' : 'text-lg'}>
 *
 *    ✅ return <div className="text-sm md:text-lg">
 *
 * 2. **Use for conditional rendering**:
 *    ✅ const isMobile = useMediaQuery('mobile');
 *       return isMobile ? <Drawer /> : <Sidebar />;
 *
 * 3. **Combine with lazy loading**:
 *    const isDesktop = useMediaQuery('desktop');
 *    const HeavyComponent = isDesktop ? lazy(() => import('./Heavy')) : null;
 *
 * 4. **SSR considerations**:
 *    - Hook returns false during SSR
 *    - May cause hydration mismatch
 *    - Use CSS media queries for critical styling
 */
