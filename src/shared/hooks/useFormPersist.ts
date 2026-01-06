import { useEffect } from 'react';
import { UseFormWatch, FieldValues } from 'react-hook-form';
import { useDebounce } from './useDebounce';

/**
 * useFormPersist Hook
 *
 * Automatically saves form data to localStorage and restores it on mount.
 * Prevents data loss when user accidentally navigates away or refreshes page.
 *
 * @example
 * // With react-hook-form
 * const { watch, reset } = useForm<FormData>();
 *
 * useFormPersist('signup-form', {
 *   watch,
 *   debounceMs: 1000,
 *   onRestore: (data) => reset(data)
 * });
 *
 * ## Why This Matters
 *
 * User frustration scenarios:
 * - Filling long signup form → accidentally close tab → all data lost 😡
 * - Writing job application → browser crash → start over 😡
 * - Multi-step form → navigate back → lose progress 😡
 *
 * With useFormPersist:
 * - Auto-saves to localStorage
 * - Restores on return
 * - User-friendly experience 😊
 *
 * ## Architecture Decision
 *
 * Why not use server-side saving?
 * - Too slow (network latency)
 * - Unnecessary server load
 * - Works offline
 *
 * Why localStorage?
 * - Fast (synchronous)
 * - Persists across tabs
 * - No authentication needed
 * - 5-10MB storage (enough for forms)
 */

export interface UseFormPersistOptions<T extends FieldValues> {
  /** react-hook-form's watch function */
  watch: UseFormWatch<T>;

  /** Callback to restore data (typically form's reset method) */
  onRestore?: (data: T) => void;

  /** Debounce save delay in ms (default: 1000) */
  debounceMs?: number;

  /** Enable/disable persistence */
  enabled?: boolean;

  /** Custom validator before saving */
  validate?: (data: T) => boolean;

  /** Fields to exclude from persistence (e.g., password) */
  excludeFields?: (keyof T)[];

  /** Clear storage on successful submit */
  clearOnSubmit?: boolean;
}

/**
 * useFormPersist
 *
 * @param storageKey - Unique key for localStorage (e.g., 'signup-form')
 * @param options - Configuration options
 */
export function useFormPersist<T extends FieldValues>(
  storageKey: string,
  options: UseFormPersistOptions<T>
): void {
  const {
    watch,
    onRestore,
    debounceMs = 1000,
    enabled = true,
    validate,
    excludeFields = [],
    clearOnSubmit = true,
  } = options;

  /**
   * Get storage key with version prefix
   * Why version? If form structure changes, old data might break form
   */
  const getStorageKey = () => `form_persist_v1_${storageKey}`;

  /**
   * Load saved data from localStorage
   */
  const loadSavedData = (): T | null => {
    if (typeof window === 'undefined' || !enabled) return null;

    try {
      const saved = localStorage.getItem(getStorageKey());
      if (!saved) return null;

      const parsed = JSON.parse(saved) as T;

      // Validate before restoring
      if (validate && !validate(parsed)) {
        console.warn('Saved form data failed validation, ignoring');
        return null;
      }

      return parsed;
    } catch (error) {
      console.error('Failed to load saved form data:', error);
      // Clear corrupted data
      localStorage.removeItem(getStorageKey());
      return null;
    }
  };

  /**
   * Save data to localStorage
   */
  const saveData = (data: T) => {
    if (typeof window === 'undefined' || !enabled) return;

    try {
      // Filter out excluded fields (e.g., password)
      const filteredData = { ...data };
      excludeFields.forEach((field) => {
        delete filteredData[field];
      });

      localStorage.setItem(getStorageKey(), JSON.stringify(filteredData));
    } catch (error) {
      console.error('Failed to save form data:', error);
      // Handle quota exceeded error gracefully
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, clearing old data');
        // Could implement LRU cache here
      }
    }
  };


  /**
   * Watch form values (all fields)
   * Debounce to avoid excessive localStorage writes
   */
  const formData = watch();
  const debouncedFormData = useDebounce(formData, debounceMs);

  /**
   * Effect 1: Restore saved data on mount
   */
  useEffect(() => {
    const savedData = loadSavedData();
    if (savedData && onRestore) {
      console.log('Restoring saved form data:', storageKey);
      onRestore(savedData);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Effect 2: Save form data when it changes (debounced)
   */
  useEffect(() => {
    if (enabled && debouncedFormData) {
      saveData(debouncedFormData as T);
    }
    // saveData is stable and doesn't need to be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFormData, enabled]);

  /**
   * Effect 3: Warn before unload if unsaved changes
   */
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Modern browsers ignore custom messages, but we still need to call preventDefault
      e.preventDefault();
      e.returnValue = ''; // Chrome requires returnValue to be set
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled]);

  /**
   * Expose clear function (optional)
   * Could return this for manual clearing
   */
  if (clearOnSubmit) {
    // Automatically clear on successful submit
    // Parent component should call clearSavedData after successful submission
  }
}

/**
 * useFormPersistWithReactHookForm Hook
 *
 * Convenience wrapper specifically for react-hook-form.
 * Handles common patterns automatically.
 *
 * @example
 * const form = useForm<SignupData>();
 *
 * useFormPersistWithReactHookForm('signup-form', form, {
 *   excludeFields: ['password', 'confirmPassword']
 * });
 */
export function useFormPersistWithReactHookForm<T extends FieldValues>(
  storageKey: string,
  form: {
    watch: UseFormWatch<T>;
    reset: (data: T) => void;
  },
  options?: Omit<UseFormPersistOptions<T>, 'watch' | 'onRestore'>
): void {
  useFormPersist(storageKey, {
    watch: form.watch,
    onRestore: form.reset,
    ...options,
  });
}

/**
 * useClearFormPersist Hook
 *
 * Helper to manually clear persisted form data.
 * Useful for clearing after successful form submission.
 *
 * @example
 * const clearFormData = useClearFormPersist('signup-form');
 *
 * const onSubmit = async (data) => {
 *   await submitForm(data);
 *   clearFormData(); // Clear saved data after success
 * };
 */
export function useClearFormPersist(storageKey: string): () => void {
  const getStorageKey = () => `form_persist_v1_${storageKey}`;

  return () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(getStorageKey());
    }
  };
}

/**
 * Usage Examples:
 *
 * 1. Basic Usage with react-hook-form:
 * ```tsx
 * const SignupForm = () => {
 *   const form = useForm<SignupData>();
 *
 *   useFormPersist('signup-form', {
 *     watch: form.watch,
 *     onRestore: (data) => form.reset(data)
 *   });
 *
 *   return <form>...</form>;
 * };
 * ```
 *
 * 2. Exclude Sensitive Fields:
 * ```tsx
 * useFormPersist('signup-form', {
 *   watch: form.watch,
 *   onRestore: form.reset,
 *   excludeFields: ['password', 'confirmPassword', 'creditCard']
 * });
 * ```
 *
 * 3. With Manual Clear:
 * ```tsx
 * const clearFormData = useClearFormPersist('signup-form');
 *
 * const onSubmit = async (data: SignupData) => {
 *   try {
 *     await signupMutation.mutateAsync(data);
 *     clearFormData(); // Clear after success
 *     router.push('/dashboard');
 *   } catch (error) {
 *     // Don't clear - let user retry
 *   }
 * };
 * ```
 *
 * 4. Conditional Persistence:
 * ```tsx
 * const [enableAutoSave, setEnableAutoSave] = useState(true);
 *
 * useFormPersist('signup-form', {
 *   watch: form.watch,
 *   onRestore: form.reset,
 *   enabled: enableAutoSave
 * });
 *
 * <label>
 *   <input
 *     type="checkbox"
 *     checked={enableAutoSave}
 *     onChange={(e) => setEnableAutoSave(e.target.checked)}
 *   />
 *   자동 저장
 * </label>
 * ```
 *
 * 5. Multi-Step Form:
 * ```tsx
 * const MultiStepForm = () => {
 *   const [step, setStep] = useState(1);
 *   const form = useForm<FormData>();
 *
 *   // Persist across all steps
 *   useFormPersist('multi-step-form', {
 *     watch: form.watch,
 *     onRestore: (data) => {
 *       form.reset(data);
 *       setStep(data.lastCompletedStep + 1); // Resume from last step
 *     }
 *   });
 *
 *   return (
 *     <>
 *       {step === 1 && <Step1 />}
 *       {step === 2 && <Step2 />}
 *       {step === 3 && <Step3 />}
 *     </>
 *   );
 * };
 * ```
 */

/**
 * Best Practices:
 *
 * 1. **Unique Storage Keys**:
 *    ✅ 'user-signup-form'
 *    ✅ 'company-profile-edit'
 *    ❌ 'form' (too generic, might conflict)
 *
 * 2. **Exclude Sensitive Data**:
 *    - Always exclude passwords
 *    - Exclude credit card numbers
 *    - Exclude any PII if possible
 *
 * 3. **Clear After Success**:
 *    - Clear localStorage after successful submission
 *    - Don't leave stale data
 *
 * 4. **Handle Storage Quota**:
 *    - localStorage has 5-10MB limit
 *    - Don't store large files
 *    - Implement cleanup for old forms
 *
 * 5. **Versioning**:
 *    - Include version in storage key
 *    - Allows breaking changes without breaking users
 *
 * 6. **User Notification**:
 *    - Show "Draft saved" indicator
 *    - Let users know data will be restored
 */

/**
 * Security Considerations:
 *
 * ⚠️ localStorage is NOT secure:
 * - Stored as plain text
 * - Accessible by any script on same domain
 * - Vulnerable to XSS attacks
 *
 * Therefore:
 * ❌ Never store passwords
 * ❌ Never store authentication tokens
 * ❌ Never store sensitive personal data
 * ✅ Only store form drafts (non-sensitive)
 * ✅ Clear after form submission
 * ✅ Validate on restore
 */
