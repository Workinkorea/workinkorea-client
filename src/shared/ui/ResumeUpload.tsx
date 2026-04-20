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
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
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
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
            <div className="text-body-3 text-slate-700">업로드 중...</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Upload size={24} className="text-blue-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-caption-1 font-semibold text-slate-900">
                기존 이력서 파일 업로드
              </h3>
              <p className="text-body-3 text-slate-600">
                이미 작성된 이력서 파일을 업로드하여 관리하세요
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-caption-1 font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              파일 선택
            </button>

            <div className="text-caption-3 text-slate-500">
              지원 형식: PDF, DOC, DOCX (최대 10MB)
            </div>
          </div>
        )}
      </motion.div>


      {/* 에러 메시지 */}
      {error && (
        <motion.div
          className="flex items-center gap-2 p-3 bg-red-500-bg border border-red-500-bg rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle size={16} className="text-red-500" />
          <span className="text-body-3 text-red-500">{error}</span>
        </motion.div>
      )}

    </div>
  );
};

export default ResumeUpload;