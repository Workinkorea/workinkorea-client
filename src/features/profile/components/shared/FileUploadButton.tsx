'use client';

import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

/**
 * FileUploadButton Component
 *
 * A reusable file upload button with validation and preview support.
 *
 * @example
 * <FileUploadButton
 *   fileType="image"
 *   maxSizeMB={5}
 *   acceptedTypes={['image/jpeg', 'image/png']}
 *   onFileSelect={(file, preview) => setFile(file)}
 * />
 *
 * Architecture Decision:
 * - Client component because it uses browser APIs (FileReader)
 * - Controlled component pattern: receives onChange callback
 * - Validation logic encapsulated here (not in parent)
 */

export interface FileUploadButtonProps {
  /** Type of file being uploaded (for error messages) */
  fileType: 'image' | 'document' | 'portfolio';

  /** Maximum file size in MB */
  maxSizeMB: number;

  /** Accepted MIME types (e.g., ['image/*', 'application/pdf']) */
  acceptedTypes: string[];

  /** Callback when file is selected and validated */
  onFileSelect: (file: File, preview?: string) => void;

  /** Optional: Custom button label */
  buttonLabel?: string;

  /** Optional: Show file type hint */
  hint?: string;

  /** Optional: Custom button styling */
  className?: string;

  /** Optional: Generate preview for images */
  generatePreview?: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  fileType,
  maxSizeMB,
  acceptedTypes,
  onFileSelect,
  buttonLabel = '파일 선택',
  hint,
  className = '',
  generatePreview = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Validate file size
   * Why separate function? Single Responsibility + easier to test
   */
  const validateFileSize = (file: File): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`);
      return false;
    }
    return true;
  };

  /**
   * Validate file type
   * Supports both exact MIME types and wildcards (e.g., 'image/*')
   */
  const validateFileType = (file: File): boolean => {
    const isValid = acceptedTypes.some(acceptedType => {
      if (acceptedType.endsWith('/*')) {
        const baseType = acceptedType.split('/')[0];
        return file.type.startsWith(baseType + '/');
      }
      return file.type === acceptedType;
    });

    if (!isValid) {
      const fileTypeLabels = {
        image: '이미지 파일',
        document: 'PDF, DOCX 파일',
        portfolio: 'PDF, DOCX, 이미지 파일',
      };
      toast.error(`${fileTypeLabels[fileType]}만 업로드 가능합니다.`);
    }
    return isValid;
  };

  /**
   * Generate image preview using FileReader
   * Why async? FileReader is asynchronous
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
   * Handle file selection with validation
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      // Validation pipeline
      if (!validateFileSize(file)) {
        return;
      }

      if (!validateFileType(file)) {
        return;
      }

      // Generate preview if needed (for images)
      let preview: string | undefined;
      if (generatePreview && file.type.startsWith('image/')) {
        preview = await generateImagePreview(file);
      }

      // Success: call parent callback
      onFileSelect(file, preview);

    } catch (error) {
      console.error('File upload error:', error);
      toast.error('파일 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isProcessing}
        className={`
          flex items-center gap-2 px-4 py-2
          border border-line-400 rounded-lg
          text-caption-2 text-label-700
          hover:bg-component-alternative
          transition-colors cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        <Camera size={16} />
        {isProcessing ? '처리 중...' : buttonLabel}
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
        disabled={isProcessing}
      />

      {/* Optional hint text */}
      {hint && (
        <p className="text-caption-2 text-label-500">{hint}</p>
      )}
    </div>
  );
};

export default FileUploadButton;
