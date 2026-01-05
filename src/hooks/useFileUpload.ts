import { useState } from 'react';
import { toast } from 'sonner';
import { uploadFileToMinio } from '@/lib/api/minio';

/**
 * useFileUpload Hook
 *
 * Comprehensive file upload hook with validation, preview, and MinIO integration.
 * Handles the entire file upload lifecycle from selection to server upload.
 *
 * @example
 * // Basic usage
 * const {
 *   file,
 *   preview,
 *   isUploading,
 *   progress,
 *   error,
 *   selectFile,
 *   uploadFile,
 *   reset
 * } = useFileUpload({
 *   maxSizeMB: 5,
 *   acceptedTypes: ['image/jpeg', 'image/png'],
 *   generatePreview: true
 * });
 *
 * <input type="file" onChange={selectFile} />
 * {preview && <img src={preview} />}
 * <button onClick={uploadFile}>Upload</button>
 *
 * @param options - Configuration options
 * @returns File upload state and methods
 *
 * ## Architecture Decision: Why a Hook?
 *
 * Previously, file upload logic was scattered across components:
 * - ProfileImageUpload: validation + preview
 * - FileUploadButton: validation
 * - ProfileEditContainer: MinIO upload
 *
 * This hook centralizes all file upload concerns:
 * ✅ Single source of truth
 * ✅ Reusable across components
 * ✅ Consistent validation
 * ✅ Built-in error handling
 */

export interface UseFileUploadOptions {
  /** Maximum file size in MB */
  maxSizeMB: number;

  /** Accepted MIME types (e.g., ['image/jpeg', 'application/pdf']) */
  acceptedTypes: string[];

  /** Generate image preview (only for image files) */
  generatePreview?: boolean;

  /** MinIO endpoint (default: '/minio/user/file') */
  endpoint?: string;

  /** File type for MinIO (e.g., 'profile_image', 'portfolio') */
  fileType?: string;

  /** Custom validation function */
  customValidation?: (file: File) => string | null; // return error message or null

  /** Callback when upload succeeds */
  onSuccess?: (url: string) => void;

  /** Callback when upload fails */
  onError?: (error: Error) => void;
}

export interface UseFileUploadReturn {
  /** Selected file */
  file: File | null;

  /** Image preview URL (only if generatePreview=true) */
  preview: string | null;

  /** Upload in progress */
  isUploading: boolean;

  /** Upload progress (0-100) */
  progress: number;

  /** Error message */
  error: string | null;

  /** Uploaded file URL from MinIO */
  uploadedUrl: string | null;

  /** Select and validate file */
  selectFile: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;

  /** Upload file to MinIO */
  uploadFile: () => Promise<string | null>;

  /** Reset all state */
  reset: () => void;
}

export function useFileUpload(options: UseFileUploadOptions): UseFileUploadReturn {
  const {
    maxSizeMB,
    acceptedTypes,
    generatePreview = false,
    endpoint = '/minio/user/file',
    fileType = 'document',
    customValidation,
    onSuccess,
    onError,
  } = options;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  /**
   * Validate file size
   */
  const validateSize = (file: File): string | null => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`;
    }
    return null;
  };

  /**
   * Validate file type
   * Supports wildcards (e.g., 'image/*')
   */
  const validateType = (file: File): string | null => {
    const isValid = acceptedTypes.some((acceptedType) => {
      if (acceptedType.endsWith('/*')) {
        const baseType = acceptedType.split('/')[0];
        return file.type.startsWith(baseType + '/');
      }
      return file.type === acceptedType;
    });

    if (!isValid) {
      return '지원하지 않는 파일 형식입니다.';
    }
    return null;
  };

  /**
   * Generate image preview using FileReader
   */
  const generateImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  /**
   * Select and validate file
   */
  const selectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Reset previous state
    setError(null);
    setUploadedUrl(null);
    setProgress(0);

    // Validation pipeline
    const sizeError = validateSize(selectedFile);
    if (sizeError) {
      setError(sizeError);
      toast.error(sizeError);
      return;
    }

    const typeError = validateType(selectedFile);
    if (typeError) {
      setError(typeError);
      toast.error(typeError);
      return;
    }

    // Custom validation
    if (customValidation) {
      const customError = customValidation(selectedFile);
      if (customError) {
        setError(customError);
        toast.error(customError);
        return;
      }
    }

    // Set file
    setFile(selectedFile);

    // Generate preview if needed
    if (generatePreview && selectedFile.type.startsWith('image/')) {
      try {
        const previewUrl = await generateImagePreview(selectedFile);
        setPreview(previewUrl);
      } catch (err) {
        console.error('Failed to generate preview:', err);
      }
    }
  };

  /**
   * Upload file to MinIO
   */
  const uploadFile = async (): Promise<string | null> => {
    if (!file) {
      const errorMsg = '업로드할 파일이 선택되지 않았습니다.';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      // TODO: Add progress tracking if MinIO API supports it
      // For now, simulate progress
      setProgress(30);

      const url = await uploadFileToMinio({
        file,
        file_type: fileType,
        endpoint,
      });

      setProgress(100);

      if (url) {
        setUploadedUrl(url);
        toast.success('파일 업로드 성공!');
        onSuccess?.(url);
        return url;
      } else {
        throw new Error('파일 URL을 받지 못했습니다.');
      }
    } catch (err) {
      const error = err as Error;
      const errorMsg = error.message || '파일 업로드에 실패했습니다.';
      setError(errorMsg);
      toast.error(errorMsg);
      onError?.(error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Reset all state
   */
  const reset = () => {
    setFile(null);
    setPreview(null);
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setUploadedUrl(null);
  };

  return {
    file,
    preview,
    isUploading,
    progress,
    error,
    uploadedUrl,
    selectFile,
    uploadFile,
    reset,
  };
}

/**
 * Usage Examples:
 *
 * 1. Profile Image Upload:
 * ```tsx
 * const { file, preview, selectFile, uploadFile, isUploading } = useFileUpload({
 *   maxSizeMB: 5,
 *   acceptedTypes: ['image/*'],
 *   generatePreview: true,
 *   fileType: 'profile_image',
 *   onSuccess: (url) => {
 *     updateProfile({ profile_image_url: url });
 *   }
 * });
 *
 * return (
 *   <>
 *     <input type="file" accept="image/*" onChange={selectFile} />
 *     {preview && <img src={preview} className="w-20 h-20 rounded-full" />}
 *     <button onClick={uploadFile} disabled={isUploading}>
 *       {isUploading ? 'Uploading...' : 'Upload'}
 *     </button>
 *   </>
 * );
 * ```
 *
 * 2. Document Upload with Custom Validation:
 * ```tsx
 * const { selectFile, uploadFile } = useFileUpload({
 *   maxSizeMB: 10,
 *   acceptedTypes: ['application/pdf', 'application/msword'],
 *   fileType: 'portfolio',
 *   customValidation: (file) => {
 *     if (file.name.includes('draft')) {
 *       return '드래프트 파일은 업로드할 수 없습니다.';
 *     }
 *     return null;
 *   }
 * });
 * ```
 *
 * 3. Auto-upload on Selection:
 * ```tsx
 * const { selectFile, uploadFile, uploadedUrl } = useFileUpload({...});
 *
 * const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *   await selectFile(e);
 *   await uploadFile(); // Auto-upload after selection
 * };
 *
 * useEffect(() => {
 *   if (uploadedUrl) {
 *     onComplete(uploadedUrl);
 *   }
 * }, [uploadedUrl]);
 * ```
 */

/**
 * Best Practices:
 *
 * 1. **Validation First**:
 *    - Always validate before upload
 *    - Show errors immediately
 *    - Don't waste bandwidth
 *
 * 2. **User Feedback**:
 *    - Show preview for images
 *    - Display progress bar
 *    - Toast notifications for success/error
 *
 * 3. **Error Handling**:
 *    - Catch all errors
 *    - Show user-friendly messages
 *    - Log technical details for debugging
 *
 * 4. **Cleanup**:
 *    - Reset state after navigation
 *    - Revoke preview URLs (URL.revokeObjectURL)
 *    - Cancel uploads on unmount
 */
