'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  AlertCircle
} from 'lucide-react';

interface ResumeUploadProps {
  onFileSelect?: (file: File) => void;
  isUploading?: boolean;
  error?: string;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onFileSelect,
  isUploading = false,
  error
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFileType(file)) {
        onFileSelect?.(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFileType(file)) {
        onFileSelect?.(file);
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return validTypes.includes(file.type);
  };


  return (
    <div className="space-y-6">
      {/* 파일 업로드 영역 */}
      <motion.div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-line-300 hover:border-primary-300 hover:bg-primary-25'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
            <div className="text-body-3 text-label-700">업로드 중...</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
              <Upload size={24} className="text-primary-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-body-2 font-semibold text-label-900">
                기존 이력서 파일 업로드
              </h3>
              <p className="text-body-3 text-label-600">
                이미 작성된 이력서 파일을 업로드하여 관리하세요
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer"
            >
              파일 선택
            </button>

            <div className="text-caption-2 text-label-500">
              지원 형식: PDF, DOC, DOCX (최대 10MB)
            </div>
          </div>
        )}
      </motion.div>


      {/* 에러 메시지 */}
      {error && (
        <motion.div
          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle size={16} className="text-red-600" />
          <span className="text-body-3 text-red-700">{error}</span>
        </motion.div>
      )}

    </div>
  );
};

export default ResumeUpload;