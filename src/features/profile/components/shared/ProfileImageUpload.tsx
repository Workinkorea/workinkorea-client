'use client';

import React, { useState } from 'react';
import { Camera } from 'lucide-react';

/**
 * ProfileImageUpload Component
 *
 * Specialized component for uploading and previewing profile images.
 * Shows a circular preview with an overlay camera button.
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

  /** Optional: Custom size in pixels (default: 80) */
  size?: number;

  /** Optional: Max file size in MB (default: 5) */
  maxSizeMB?: number;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImageUrl,
  userName = 'User',
  onImageSelect,
  size = 80,
  maxSizeMB = 5,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /**
   * Handle image selection with preview generation
   */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File size validation
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`);
      return;
    }

    // File type validation
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
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
    <div className="flex items-center gap-4">
      <div className="relative">
        {displayImage ? (
          // Image preview (circular)
          <div
            className="rounded-full bg-cover bg-center border-4 border-primary-100"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundImage: `url(${displayImage})`,
            }}
          />
        ) : (
          // Fallback: Initials avatar
          <div
            className="rounded-full bg-component-alternative border-4 border-primary-100 flex items-center justify-center"
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
          >
            <span className="text-2xl font-semibold text-label-500">
              {getInitials(userName)}
            </span>
          </div>
        )}

        {/* Camera button overlay (bottom-right) */}
        <button
          type="button"
          onClick={handleButtonClick}
          className="
            absolute -bottom-1 -right-1
            w-8 h-8 bg-primary-500 rounded-full
            flex items-center justify-center
            text-white hover:bg-primary-600
            transition-colors cursor-pointer
            shadow-md
          "
        >
          <Camera size={16} />
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Description text */}
      <div>
        <h3 className="text-body-2 font-semibold text-label-900">프로필 사진</h3>
        <p className="text-caption-2 text-label-500">
          JPG, PNG 파일만 업로드 가능 (최대 {maxSizeMB}MB)
        </p>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
