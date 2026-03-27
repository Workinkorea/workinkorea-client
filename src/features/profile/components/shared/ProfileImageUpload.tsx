'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils/utils';

/**
 * ProfileImageUpload Component
 *
 * Specialized component for uploading and previewing profile images.
 * Shows a circular preview with camera button + drag-and-drop upload area.
 *
 * @example
 * <ProfileImageUpload
 *   currentImageUrl={profile.profile_image_url}
 *   userName={profile.name}
 *   onImageSelect={(file, preview) => {
 *     setSelectedFile(file);
 *     setImagePreview(preview);
 *   }}
 * />
 *
 * Architecture Decision:
 * - Composition over inheritance: Uses FileUploadButton internally
 * - Controlled component: Parent manages file state
 * - Preview state is internal (UI concern)
 */

export interface ProfileImageUploadProps {
  /** Current profile image URL from database */
  currentImageUrl?: string | null;

  /** User's name for fallback initials */
  userName?: string;

  /** Callback when image is selected */
  onImageSelect: (file: File, preview: string) => void;

  /** Optional: Custom size in pixels (default: 120) */
  size?: number;

  /** Optional: Max file size in MB (default: 5) */
  maxSizeMB?: number;
}

function ProfileImageUpload({
  currentImageUrl,
  userName = 'User',
  onImageSelect,
  size = 120,
  maxSizeMB = 5,
}: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Handle image selection with preview generation
   */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processImage(file);
  };

  /**
   * Process and validate image file
   */
  const processImage = (file: File) => {
    // File size validation
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`);
      return;
    }

    // File type validation
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // Generate preview using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      setImagePreview(preview);
      onImageSelect(file, preview);
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Drag and drop handlers
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImage(files[0]);
    }
  };

  /**
   * Get initials from user name for fallback avatar
   * Example: "John Doe" → "J", "김철수" → "김"
   */
  const getInitials = (name: string): string => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  // Determine which image to show: preview > current > fallback
  const displayImage = imagePreview || currentImageUrl;

  return (
    <div className="space-y-4">
      {/* Avatar Preview Section */}
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          {displayImage ? (
            // Image preview (circular)
            <div
              className="rounded-full bg-cover bg-center border-4 border-blue-100"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundImage: `url(${displayImage})`,
              }}
            />
          ) : (
            // Fallback: Initials avatar
            <div
              className="rounded-full bg-linear-to-br from-blue-100 to-blue-50 border-4 border-blue-100 flex items-center justify-center"
              style={{
                width: `${size}px`,
                height: `${size}px`,
              }}
            >
              <span className="text-title-2 font-semibold text-primary-600">
                {getInitials(userName)}
              </span>
            </div>
          )}

          {/* Camera button overlay (bottom-right) */}
          <button
            type="button"
            onClick={handleButtonClick}
            className="
              absolute -bottom-2 -right-2
              w-9 h-9 bg-primary-600 rounded-full
              flex items-center justify-center
              text-white hover:bg-primary-700
              transition-colors cursor-pointer
              shadow-md border-2 border-white
            "
            title="사진 변경"
          >
            <Camera size={18} />
          </button>
        </div>

        {/* Description text */}
        <div>
          <h3 className="text-body-2 font-semibold text-label-900">프로필 사진</h3>
          <p className="text-caption-3 text-label-500 mt-1">
            채용 담당자에게 보여질<br />
            전문적인 사진을 등록하세요
          </p>
          <p className="text-caption-3 text-label-400 mt-2">
            JPG, PNG • 최대 {maxSizeMB}MB
          </p>
        </div>
      </div>

      {/* Drag and Drop Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-line-400 hover:border-blue-400 hover:bg-primary-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <UploadCloud size={32} className="text-label-400 mx-auto mb-2" />
        <p className="text-caption-1 font-semibold text-label-800 mb-1">
          사진을 드래그하거나 클릭하여 업로드
        </p>
        <p className="text-caption-3 text-label-500">
          JPG, PNG • 최대 {maxSizeMB}MB
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}

export default ProfileImageUpload;
