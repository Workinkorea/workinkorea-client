/**
 * Shared Custom Hooks Index
 *
 * Central export point for all shared/generic custom hooks.
 * These hooks are domain-agnostic and can be used across features.
 *
 * @example
 * import { useDebounce, useMediaQuery, useFileUpload } from '@/shared/hooks';
 */

// Debouncing
export { useDebounce, useDebounceCallback } from './useDebounce';

// Responsive design
export { useMediaQuery, useBreakpoint, useIsMobile } from './useMediaQuery';

// File uploads
export { useFileUpload } from './useFileUpload';
export type { UseFileUploadOptions, UseFileUploadReturn } from './useFileUpload';

// Infinite scroll
export {
  useInfiniteScroll,
  useInfiniteScrollWithReactQuery,
} from './useInfiniteScroll';
export type { UseInfiniteScrollOptions } from './useInfiniteScroll';

// Form persistence
export {
  useFormPersist,
  useFormPersistWithReactHookForm,
  useClearFormPersist,
} from './useFormPersist';
export type { UseFormPersistOptions } from './useFormPersist';

// UI State
export { useModal } from './useModal';

// Mutations
export { useMutationWithToast } from './useMutationWithToast';

/**
 * Hook Categories:
 *
 * 🎯 Performance
 * - useDebounce: Reduce expensive operations
 * - useDebounceCallback: Debounce function calls
 *
 * 📱 Responsive
 * - useMediaQuery: CSS media queries in JS
 * - useBreakpoint: Current breakpoint name
 * - useIsMobile: Mobile device detection
 *
 * 📁 File Management
 * - useFileUpload: Complete file upload solution
 *
 * 📜 Pagination
 * - useInfiniteScroll: Infinite scroll implementation
 * - useInfiniteScrollWithReactQuery: React Query integration
 *
 * 💾 Data Persistence
 * - useFormPersist: Auto-save form drafts
 * - useClearFormPersist: Clear saved form data
 *
 * 🪟 UI State
 * - useModal: Modal state management
 *
 * 🔄 Mutations
 * - useMutationWithToast: Mutation with toast notifications
 */
